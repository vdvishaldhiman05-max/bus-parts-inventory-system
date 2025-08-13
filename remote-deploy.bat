@echo off
echo ========================================
echo RTA Dubai Bus Parts Inventory Deployment
echo Server: test.gestureresearch.com
echo ========================================

echo.
echo Step 1: Connecting to server and updating system...
echo Please enter the password when prompted: Golu2025!Ndia

ssh root@143.110.191.88 "apt update && apt upgrade -y"

echo.
echo Step 2: Installing Node.js 20...
ssh root@143.110.191.88 "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && apt-get install -y nodejs"

echo.
echo Step 3: Installing PM2 and Nginx...
ssh root@143.110.191.88 "npm install -g pm2 && apt install nginx git -y"

echo.
echo Step 4: Cloning repository...
ssh root@143.110.191.88 "cd /var/www && git clone https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system.git"

echo.
echo Step 5: Setting up application...
ssh root@143.110.191.88 "cd /var/www/bus-parts-inventory-system && git checkout blackboxai/rta-ui-improvements && npm install && npm run build"

echo.
echo Step 6: Starting application with PM2...
ssh root@143.110.191.88 "cd /var/www/bus-parts-inventory-system && pm2 start ecosystem.config.js && pm2 save && pm2 startup"

echo.
echo Step 7: Configuring Nginx...
ssh root@143.110.191.88 "rm -f /etc/nginx/sites-enabled/default"

echo.
echo Step 8: Creating Nginx configuration...
ssh root@143.110.191.88 "cat > /etc/nginx/sites-available/rta-bus-parts << 'EOF'
server {
    listen 80;
    server_name test.gestureresearch.com www.test.gestureresearch.com _;
    
    # Security headers
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header Referrer-Policy \"no-referrer-when-downgrade\" always;
    add_header Content-Security-Policy \"default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; img-src 'self' data: https:; media-src 'self' data: https:;\" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control \"public, max-age=31536000, immutable\";
    }

    # Favicon and manifest
    location ~* \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control \"public, max-age=86400\";
    }
}
EOF"

echo.
echo Step 9: Enabling site and restarting Nginx...
ssh root@143.110.191.88 "ln -s /etc/nginx/sites-available/rta-bus-parts /etc/nginx/sites-enabled/ && nginx -t && systemctl restart nginx"

echo.
echo Step 10: Configuring firewall...
ssh root@143.110.191.88 "ufw allow ssh && ufw allow 'Nginx Full' && ufw --force enable"

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo Your RTA Dubai Bus Parts Inventory is now live at:
echo http://test.gestureresearch.com
echo http://143.110.191.88
echo ========================================

pause
