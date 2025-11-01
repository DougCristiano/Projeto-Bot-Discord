module.exports = {
  apps: [
    {
      name: 'inbot',
      script: './src/index.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      },
      // Configurações de restart
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      // Logs
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Graceful shutdown
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    }
  ],
  // Configurações globais
  monitor: true,
  force: true,
};
