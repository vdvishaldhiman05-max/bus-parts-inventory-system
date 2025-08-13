# 🔧 Troubleshooting and Fixing Deployment

## Issue Identified:
Your server is showing the default DigitalOcean droplet page instead of the RTA Dubai Bus Parts Inventory application. This means the deployment process wasn't completed.

## Quick Fix Steps:

### Step 1: Connect to Your Server
```bash
ssh root@143.110.191.88
# Password: Golu2025!Ndia
```

### Step 2: Check Current Status
```bash
# Check if PM2 is running
pm2 status

# Check if our app directory exists
ls -la /var/www/

# Check Nginx status
systemctl status nginx
```

### Step 3: Complete the Deployment
Run these commands one by one:

```bash
# 1. Update system and install Node.js
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# 2. Install PM2 and Nginx
npm install -g pm2
apt install nginx git -y

# 3. Clone and setup the application
cd /var/www
rm -rf bus-parts-inventory-system
git clone https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system.git
cd bus-parts-inventory-system
git checkout blackboxai/rta-ui-improvements

# 4. Install dependencies and build
npm install
npm run build

# 5. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 6. Configure Nginx
rm -f /etc/nginx/sites-enabled/default

cat > /etc/nginx/sites-available/rta-bus-parts << 'EOF'
server {
    listen 80;
    server_name test.gestureresearch.com www.test.gestureresearch.com _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; img-src 'self' data: https:; media-src 'self' data: https:;" always;

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

    # Assets
    location ~* \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
EOF

# 7. Enable the site
ln -s /etc/nginx/sites-available/rta-bus-parts /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 8. Configure firewall
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable
```

### Step 4: Verify Deployment
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs rta-bus-parts

# Check Nginx status
systemctl status nginx

# Test local connection
curl -I http://localhost:3000
```

## Alternative: One-Line Deployment Script

If you prefer, you can run this single command after connecting to your server:

```bash
curl -fsSL https://raw.githubusercontent.com/vdvishaldhiman05-max/bus-parts-inventory-system/blackboxai/rta-ui-improvements/deploy.sh | bash
```

## Expected Result:
After completing these steps, visiting http://test.gestureresearch.com should show:
- ✅ RTA Dubai Bus Parts Inventory System
- ✅ QR Scanner as the default page
- ✅ Red RTA Dubai color theme
- ✅ Burger menu with Upload CSV and Generate QR options

## If Still Not Working:
1. Check PM2 logs: `pm2 logs rta-bus-parts`
2. Check Nginx error logs: `tail -f /var/log/nginx/error.log`
3. Verify port 3000 is running: `netstat -tlnp | grep 3000`
4. Restart services: `pm2 restart rta-bus-parts && systemctl restart nginx`
