#!/bin/bash
# RTA Dubai Bus Parts Inventory - One-Line Deployment Script
# Run this on your server after connecting via SSH

echo "🚀 Starting RTA Dubai Bus Parts Inventory deployment..." && \
apt update && apt upgrade -y && \
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && \
apt-get install -y nodejs && \
npm install -g pm2 && \
apt install nginx git -y && \
systemctl start nginx && \
systemctl enable nginx && \
cd /var/www && \
rm -rf bus-parts-inventory-system && \
git clone https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system.git && \
cd bus-parts-inventory-system && \
git checkout blackboxai/rta-ui-improvements && \
npm install && \
npm run build && \
pm2 start ecosystem.config.js && \
pm2 save && \
pm2 startup && \
rm -f /etc/nginx/sites-enabled/default && \
cat > /etc/nginx/sites-available/rta-bus-parts << 'EOF'
server {
    listen 80;
    server_name test.gestureresearch.com www.test.gestureresearch.com _;
    
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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location ~* \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
EOF
ln -s /etc/nginx/sites-available/rta-bus-parts /etc/nginx/sites-enabled/ && \
nginx -t && \
systemctl restart nginx && \
ufw allow ssh && \
ufw allow 'Nginx Full' && \
ufw --force enable && \
echo "✅ Deployment complete!" && \
echo "🌐 Your RTA Dubai Bus Parts Inventory is now live at:" && \
echo "   http://test.gestureresearch.com" && \
echo "   http://143.110.191.88" && \
pm2 status
