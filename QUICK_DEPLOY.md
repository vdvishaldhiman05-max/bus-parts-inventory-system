# 🚀 Quick DigitalOcean Deployment Guide

## Option 1: Traditional PM2 Deployment (Recommended)

### Step 1: Connect to Your DigitalOcean Server
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: One-Command Setup
```bash
curl -fsSL https://raw.githubusercontent.com/vdvishaldhiman05-max/bus-parts-inventory-system/blackboxai/rta-ui-improvements/deploy.sh | bash
```

### Step 3: Manual Setup (if curl fails)
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 and Nginx
npm install -g pm2
apt install nginx git -y

# Clone and setup
cd /var/www
git clone https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system.git
cd bus-parts-inventory-system
git checkout blackboxai/rta-ui-improvements

# Install and build
npm install
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
rm /etc/nginx/sites-enabled/default
cat > /etc/nginx/sites-available/rta-bus-parts << 'EOF'
server {
    listen 80;
    server_name _;
    
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
    }
}
EOF

ln -s /etc/nginx/sites-available/rta-bus-parts /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Setup firewall
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable
```

## Option 2: Docker Deployment

### Prerequisites
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Deploy with Docker
```bash
# Clone repository
git clone https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system.git
cd bus-parts-inventory-system
git checkout blackboxai/rta-ui-improvements

# Build and run
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

## 🌐 Access Your Application

After deployment, your RTA Dubai Bus Parts Inventory will be available at:
- **HTTP:** `http://YOUR_SERVER_IP`
- **With Domain:** `http://yourdomain.com`

## 🔧 Management Commands

### PM2 Commands
```bash
pm2 status                    # Check status
pm2 logs rta-bus-parts       # View logs
pm2 restart rta-bus-parts    # Restart app
pm2 monit                    # Monitor resources
```

### Docker Commands
```bash
docker-compose ps            # Check containers
docker-compose logs -f       # View logs
docker-compose restart       # Restart services
docker-compose down          # Stop services
```

### Update Deployment
```bash
# For PM2
cd /var/www/bus-parts-inventory-system
./deploy.sh

# For Docker
docker-compose down
git pull origin blackboxai/rta-ui-improvements
docker-compose up -d --build
```

## 🔒 SSL Certificate (Optional)

### Install Certbot
```bash
apt install snapd -y
snap install core; snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
```

### Get SSL Certificate
```bash
certbot --nginx -d yourdomain.com
```

## 🚨 Troubleshooting

### Common Issues:
1. **Port 3000 in use:** `pm2 kill && pm2 start ecosystem.config.js`
2. **Nginx 502 Error:** `pm2 status` and `systemctl restart nginx`
3. **Build fails:** `rm -rf node_modules && npm install && npm run build`
4. **Permission denied:** `chown -R www-data:www-data /var/www/bus-parts-inventory-system`

### Check Logs:
```bash
# Application logs
pm2 logs rta-bus-parts

# Nginx logs
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

## 📱 Features Deployed:
- ✅ QR Scanner as landing page
- ✅ Responsive burger menu
- ✅ Upload CSV functionality
- ✅ Generate QR Codes
- ✅ RTA Dubai branding
- ✅ Mobile-responsive design
- ✅ Production optimizations

Your RTA Dubai Bus Parts Inventory System is now live! 🎉
