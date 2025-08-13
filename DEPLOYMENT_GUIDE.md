# RTA Dubai Bus Parts Inventory - DigitalOcean Deployment Guide

## Prerequisites
- DigitalOcean Linux server (Ubuntu 20.04+ recommended)
- Domain name (optional but recommended)
- SSH access to your server

## Step 1: Server Setup

### 1.1 Connect to Your Server
```bash
ssh root@your_server_ip
```

### 1.2 Update System
```bash
apt update && apt upgrade -y
```

### 1.3 Install Node.js (v18+)
```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.4 Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 1.5 Install Nginx (Web Server)
```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### 1.6 Install Git
```bash
apt install git -y
```

## Step 2: Deploy Application

### 2.1 Clone Repository
```bash
cd /var/www
git clone https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system.git
cd bus-parts-inventory-system
```

### 2.2 Switch to Production Branch
```bash
git checkout blackboxai/rta-ui-improvements
```

### 2.3 Install Dependencies
```bash
npm install
```

### 2.4 Build Application
```bash
npm run build
```

### 2.5 Create PM2 Ecosystem File
```bash
cat > ecosystem.config.js << 'EOF'
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
    error_file: '/var/log/pm2/rta-bus-parts-error.log',
    out_file: '/var/log/pm2/rta-bus-parts-out.log',
    log_file: '/var/log/pm2/rta-bus-parts.log',
    time: true
  }]
}
EOF
```

### 2.6 Start Application with PM2
```bash
# Create log directory
mkdir -p /var/log/pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Step 3: Configure Nginx

### 3.1 Create Nginx Configuration
```bash
cat > /etc/nginx/sites-available/rta-bus-parts << 'EOF'
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;  # Replace with your domain
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Favicon and manifest
    location ~* \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
EOF
```

### 3.2 Enable Site
```bash
# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Enable your site
ln -s /etc/nginx/sites-available/rta-bus-parts /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

## Step 4: SSL Certificate (Optional but Recommended)

### 4.1 Install Certbot
```bash
apt install snapd -y
snap install core; snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
```

### 4.2 Get SSL Certificate
```bash
# Replace with your domain
certbot --nginx -d your_domain.com -d www.your_domain.com
```

## Step 5: Firewall Configuration

### 5.1 Configure UFW
```bash
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable
```

## Step 6: Monitoring and Maintenance

### 6.1 PM2 Monitoring
```bash
# View application status
pm2 status

# View logs
pm2 logs rta-bus-parts

# Restart application
pm2 restart rta-bus-parts

# Monitor in real-time
pm2 monit
```

### 6.2 Nginx Logs
```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

## Step 7: Auto-Deployment Script (Optional)

### 7.1 Create Deployment Script
```bash
cat > /var/www/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/bus-parts-inventory-system

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin blackboxai/rta-ui-improvements

# Install dependencies
npm install

# Build application
npm run build

# Restart PM2
pm2 restart rta-bus-parts

echo "✅ Deployment completed successfully!"
EOF

chmod +x /var/www/deploy.sh
```

## Troubleshooting

### Common Issues:

1. **Port 3000 already in use:**
   ```bash
   pm2 kill
   pm2 start ecosystem.config.js
   ```

2. **Nginx 502 Bad Gateway:**
   ```bash
   pm2 status  # Check if app is running
   systemctl restart nginx
   ```

3. **Permission issues:**
   ```bash
   chown -R www-data:www-data /var/www/bus-parts-inventory-system
   ```

4. **Build fails:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## Security Checklist

- [ ] Change default SSH port
- [ ] Disable root login
- [ ] Setup fail2ban
- [ ] Regular security updates
- [ ] Backup strategy
- [ ] Monitor logs regularly

## Performance Optimization

- [ ] Enable Nginx gzip compression
- [ ] Setup Redis for caching (if needed)
- [ ] Configure CDN (if needed)
- [ ] Monitor server resources

---

**Your RTA Dubai Bus Parts Inventory System will be accessible at:**
- HTTP: `http://your_server_ip` or `http://your_domain.com`
- HTTPS: `https://your_domain.com` (after SSL setup)
