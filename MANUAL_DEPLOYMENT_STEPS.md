# 🚀 Manual Deployment Steps for RTA Dubai Bus Parts Inventory

## Server Details:
- **URL:** test.gestureresearch.com
- **IP:** 143.110.191.88
- **User:** root
- **Password:** Golu2025!Ndia

## Step-by-Step Deployment Instructions

### Step 1: Connect to Your Server
Open a new terminal/command prompt and run:
```bash
ssh root@143.110.191.88
```
**Enter password when prompted:** `Golu2025!Ndia`

### Step 2: Update System and Install Node.js
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install PM2 and Nginx
```bash
# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx and Git
apt install nginx git -y

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx
```

### Step 4: Clone and Setup Application
```bash
# Navigate to web directory
cd /var/www

# Remove any existing installation
rm -rf bus-parts-inventory-system

# Clone the repository
git clone https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system.git

# Navigate to project directory
cd bus-parts-inventory-system

# Switch to the correct branch
git checkout blackboxai/rta-ui-improvements
```

### Step 5: Install Dependencies and Build
```bash
# Install dependencies
npm install

# Build the application
npm run build
```

### Step 6: Start Application with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 7: Configure Nginx
```bash
# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Create Nginx configuration
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

    # Favicon and manifest
    location ~* \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
EOF
```

### Step 8: Enable Site and Restart Nginx
```bash
# Enable the site
ln -s /etc/nginx/sites-available/rta-bus-parts /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 9: Configure Firewall
```bash
# Allow SSH and HTTP/HTTPS
ufw allow ssh
ufw allow 'Nginx Full'

# Enable firewall
ufw --force enable
```

### Step 10: Verify Deployment
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs rta-bus-parts

# Check Nginx status
systemctl status nginx
```

## 🎉 Deployment Complete!

Your RTA Dubai Bus Parts Inventory System is now live at:
- **🌐 http://test.gestureresearch.com**
- **🌐 http://143.110.191.88**

## 🔧 Management Commands

### Check Application Status:
```bash
pm2 status
pm2 logs rta-bus-parts
pm2 monit
```

### Restart Application:
```bash
pm2 restart rta-bus-parts
```

### Update Application:
```bash
cd /var/www/bus-parts-inventory-system
git pull origin blackboxai/rta-ui-improvements
npm install
npm run build
pm2 restart rta-bus-parts
```

## 🛡️ Optional: Setup SSL Certificate

If you want HTTPS, run these commands:
```bash
# Install Certbot
apt install snapd -y
snap install core; snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
certbot --nginx -d test.gestureresearch.com
```

## 🆘 Troubleshooting

### If application doesn't start:
```bash
pm2 kill
cd /var/www/bus-parts-inventory-system
pm2 start ecosystem.config.js
```

### If Nginx shows 502 error:
```bash
pm2 status  # Check if app is running
systemctl restart nginx
```

### Check logs:
```bash
pm2 logs rta-bus-parts
tail -f /var/log/nginx/error.log
```

---

**Follow these steps in order, and your RTA Dubai Bus Parts Inventory System will be live!**
