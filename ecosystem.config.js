module.exports = {
  apps: [{
    name: 'rta-bus-parts',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/bus-parts-inventory-system',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/rta-bus-parts-error.log',
    out_file: '/var/log/pm2/rta-bus-parts-out.log',
    log_file: '/var/log/pm2/rta-bus-parts.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
}
