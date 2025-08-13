# RTA Dubai Bus Parts Inventory - Server Deployment Script
# Server: test.gestureresearch.com (143.110.191.88)

Write-Host "========================================" -ForegroundColor Green
Write-Host "RTA Dubai Bus Parts Inventory Deployment" -ForegroundColor Green
Write-Host "Server: test.gestureresearch.com" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$serverIP = "143.110.191.88"
$username = "root"
$password = "Golu2025!Ndia"

Write-Host "`nStep 1: Testing server connection..." -ForegroundColor Yellow

# Test connection
$testConnection = Test-NetConnection -ComputerName $serverIP -Port 22
if (-not $testConnection.TcpTestSucceeded) {
    Write-Host "❌ Cannot connect to server on port 22" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Server is reachable on port 22" -ForegroundColor Green

Write-Host "`nStep 2: Preparing deployment commands..." -ForegroundColor Yellow

# Create deployment commands
$commands = @(
    "echo '🚀 Starting RTA Dubai Bus Parts Inventory deployment...'",
    "apt update && apt upgrade -y",
    "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -",
    "apt-get install -y nodejs",
    "npm install -g pm2",
    "apt install nginx git -y",
    "systemctl start nginx",
    "systemctl enable nginx",
    "cd /var/www",
    "rm -rf bus-parts-inventory-system",
    "git clone https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system.git",
    "cd bus-parts-inventory-system",
    "git checkout blackboxai/rta-ui-improvements",
    "npm install",
    "npm run build",
    "pm2 start ecosystem.config.js",
    "pm2 save",
    "pm2 startup",
    "rm -f /etc/nginx/sites-enabled/default"
)

Write-Host "`nStep 3: Creating Nginx configuration..." -ForegroundColor Yellow

$nginxConfig = @"
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
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        proxy_cache_bypass `$http_upgrade;
        
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
    location ~* \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)`$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
"@

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "MANUAL DEPLOYMENT INSTRUCTIONS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n1. Open a new terminal/command prompt" -ForegroundColor Cyan
Write-Host "2. Run the following command to connect to your server:" -ForegroundColor Cyan
Write-Host "   ssh root@143.110.191.88" -ForegroundColor White
Write-Host "3. Enter password when prompted: Golu2025!Ndia" -ForegroundColor White

Write-Host "`n4. Once connected, run these commands one by one:" -ForegroundColor Cyan

$commandNumber = 1
foreach ($command in $commands) {
    Write-Host "   $commandNumber. $command" -ForegroundColor White
    $commandNumber++
}

Write-Host "`n5. Create Nginx configuration:" -ForegroundColor Cyan
Write-Host "   cat > /etc/nginx/sites-available/rta-bus-parts << 'EOF'" -ForegroundColor White
Write-Host $nginxConfig -ForegroundColor Gray
Write-Host "   EOF" -ForegroundColor White

Write-Host "`n6. Enable the site and restart services:" -ForegroundColor Cyan
Write-Host "   ln -s /etc/nginx/sites-available/rta-bus-parts /etc/nginx/sites-enabled/" -ForegroundColor White
Write-Host "   nginx -t" -ForegroundColor White
Write-Host "   systemctl restart nginx" -ForegroundColor White

Write-Host "`n7. Configure firewall:" -ForegroundColor Cyan
Write-Host "   ufw allow ssh" -ForegroundColor White
Write-Host "   ufw allow 'Nginx Full'" -ForegroundColor White
Write-Host "   ufw --force enable" -ForegroundColor White

Write-Host "`n8. Check application status:" -ForegroundColor Cyan
Write-Host "   pm2 status" -ForegroundColor White
Write-Host "   pm2 logs rta-bus-parts" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "After deployment, your app will be live at:" -ForegroundColor Green
Write-Host "🌐 http://test.gestureresearch.com" -ForegroundColor Yellow
Write-Host "🌐 http://143.110.191.88" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
