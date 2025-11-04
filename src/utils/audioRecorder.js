/**
 * Módulo para gravar áudio de canais de voz do Discord.
 * Converte os streams recebidos (PCM 16-bit 48kHz) em MP3 usando ffmpeg.
 */

const { EndBehaviorType } = require('@discordjs/voice')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs').promises
const prism = require('prism-media')

class AudioRecorder {
	constructor(voiceConnection, outputPath) {
		this.voiceConnection = voiceConnection
		this.outputPath = outputPath
		this.receiver = voiceConnection.receiver
		this.audioStreams = new Map() // userId -> { opusStream, decoder }
		this.ffmpegProcess = null
		this.ffmpegClosePromise = null
		this.ffmpegCloseResolver = null
		this.isRecording = false

		this.onSpeakingStart = this.onSpeakingStart.bind(this)
		this.onSpeakingEnd = this.onSpeakingEnd.bind(this)

		this.ready = this.initialize()
	}

	async initialize() {
		try {
			await this.ensureOutputDirectory()
			await this.startFFmpegProcess()
			this.receiver.speaking.on('start', this.onSpeakingStart)
			this.receiver.speaking.on('end', this.onSpeakingEnd)
			this.isRecording = true
			console.log('✅ Gravador de áudio configurado')
		} catch (error) {
			console.error('❌ Falha ao inicializar gravador de áudio:', error)
			throw error
		}
	}

	async ensureOutputDirectory() {
		const dir = path.dirname(this.outputPath)
		await fs.mkdir(dir, { recursive: true })
	}

	async startFFmpegProcess() {
		this.ffmpegClosePromise = new Promise((resolve) => {
			this.ffmpegCloseResolver = resolve
		})

		const args = [
			'-f',
			's16le',
			'-ar',
			'48000',
			'-ac',
			'2',
			'-i',
			'pipe:0',
			'-acodec',
			'libmp3lame',
			'-b:a',
			'128k',
			'-y',
			this.outputPath,
		]

		this.ffmpegProcess = spawn('ffmpeg', args, {
			stdio: ['pipe', 'ignore', 'inherit'],
		})

		await new Promise((resolve, reject) => {
			this.ffmpegProcess.once('spawn', resolve)
			this.ffmpegProcess.once('error', reject)
		})

		this.ffmpegProcess.once('close', (code) => {
			if (code === 0) {
				console.log(`✅ Arquivo MP3 salvo: ${this.outputPath}`)
			} else {
				console.error(`❌ FFmpeg finalizado com código ${code}`)
			}
			this.ffmpegProcess = null
			if (this.ffmpegCloseResolver) {
				this.ffmpegCloseResolver(code)
			}
		})

		console.log('✅ Processo FFmpeg iniciado para captura em tempo real')
	}

	async onSpeakingStart(userId) {
		try {
			await this.ready

			if (!this.ffmpegProcess || this.audioStreams.has(userId)) {
				return
			}

			const opusStream = this.receiver.subscribe(userId, {
				end: {
					behavior: EndBehaviorType.AfterSilence,
					duration: 100,
				},
			})

			const decoder = new prism.opus.Decoder({ frameSize: 960, channels: 2, rate: 48000 })

			const cleanup = () => {
				opusStream.removeAllListeners()
				decoder.removeAllListeners()
				try {
					opusStream.destroy()
				} catch {
					// Ignora erros
				}
				try {
					decoder.destroy()
				} catch {
					// Ignora erros
				}
				this.audioStreams.delete(userId)
			}

			decoder.on('data', (chunk) => {
				if (!this.ffmpegProcess || this.ffmpegProcess.killed) return
				try {
					this.ffmpegProcess.stdin.write(chunk)
				} catch (error) {
					console.error('❌ Erro ao enviar áudio para ffmpeg:', error)
				}
			})

			opusStream.once('end', cleanup)
			opusStream.once('close', cleanup)
			opusStream.once('error', (error) => {
				console.error(`❌ Erro no stream Opus do usuário ${userId}:`, error)
				cleanup()
			})

			decoder.once('error', (error) => {
				console.error(`❌ Erro no decoder Opus do usuário ${userId}:`, error)
				cleanup()
			})

			opusStream.pipe(decoder)
			this.audioStreams.set(userId, { opusStream, decoder, cleanup })

			console.log(`🎙️ Gravando áudio do usuário ${userId}`)
		} catch (error) {
			console.error(`❌ Erro ao iniciar captura do usuário ${userId}:`, error)
		}
	}

	onSpeakingEnd(userId) {
		const streamData = this.audioStreams.get(userId)
		if (streamData && typeof streamData.cleanup === 'function') {
			streamData.cleanup()
			console.log(`🔇 Usuário ${userId} saiu da gravação`)
		}
	}

	async stopRecording() {
		try {
			await this.ready
		} catch (error) {
			console.error('❌ Gravador não inicializado corretamente:', error)
			return null
		}

		if (!this.isRecording) {
			return this.outputPath
		}

		this.isRecording = false
		this.receiver.speaking.off('start', this.onSpeakingStart)
		this.receiver.speaking.off('end', this.onSpeakingEnd)

		// Encerra todos os streams ativos
		this.audioStreams.forEach(({ cleanup }) => {
			if (typeof cleanup === 'function') {
				cleanup()
			}
		})
		this.audioStreams.clear()

		if (!this.ffmpegProcess) {
			return null
		}

		return new Promise((resolve) => {
			let settled = false
			const finish = (value) => {
				if (settled) return
				settled = true
				resolve(value)
			}

			const closePromise = this.ffmpegClosePromise || Promise.resolve(-1)
			closePromise
				.then((code) => {
					finish(code === 0 ? this.outputPath : null)
				})
				.catch(() => finish(null))

			try {
				this.ffmpegProcess.stdin.end()
			} catch (error) {
				console.error('❌ Erro ao finalizar stdin do ffmpeg:', error)
				finish(null)
			}
		})
	}

	async cleanup() {
		await this.stopRecording()
	}
}

module.exports = AudioRecorder
