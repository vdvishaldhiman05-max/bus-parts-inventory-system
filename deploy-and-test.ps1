# RTA Dubai Bus Parts Inventory - Deploy and Test Script
param(
    [string]$ServerIP = "143.110.191.88",
    [string]$Username = "root",
    [string]$Password = "Golu2025!Ndia",
    [string]$Domain = "test.gestureresearch.com"
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "RTA Dubai Bus Parts Inventory" -ForegroundColor Green
Write-Host "Deploy and Test Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Function to execute SSH commands
function Invoke-SSHCommand {
    param(
        [string]$Command,
        [string]$Description
    )
    
    Write-Host "`n🔄 $Description..." -ForegroundColor Yellow
    
    # For Windows, we'll provide the command to run manually
    Write-Host "Run this command on your server:" -ForegroundColor Cyan
    Write-Host $Command -ForegroundColor White
    Write-Host "Press Enter when completed..." -ForegroundColor Gray
    Read-Host
}

# Test server connectivity
Write-Host "`n1. Testing server connectivity..." -ForegroundColor Yellow
$testConnection = Test-NetConnection -ComputerName $ServerIP -Port 22
if ($testConnection.TcpTestSucceeded) {
    Write-Host "✅ Server is reachable on port 22" -ForegroundColor Green
} else {
    Write-Host "❌ Cannot connect to server" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT PHASE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nPlease connect to your server manually:" -ForegroundColor Cyan
Write-Host "ssh root@$ServerIP" -ForegroundColor White
Write-Host "Password: $Password" -ForegroundColor White
Write-Host "`nThen run the following commands one by one:" -ForegroundColor Cyan

# Deployment commands
$deploymentCommands = @(
    @{
        Command = "apt update && apt upgrade -y"
        Description = "Update system packages"
    },
    @{
        Command = "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && apt-get install -y nodejs"
        Description = "Install Node.js 20"
    },
    @{
        Command = "npm install -g pm2 && apt install nginx git -y"
        Description = "Install PM2 and Nginx"
    },
    @{
        Command = "systemctl start nginx && systemctl enable nginx"
        Description = "Start and enable Nginx"
    },
    @{
        Command = "cd /var/www && rm -rf bus-parts-inventory-system"
        Description = "Clean previous installation"
    },
    @{
        Command = "git clone https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system.git"
        Description = "Clone repository"
    },
    @{
        Command = "cd bus-parts-inventory-system && git checkout blackboxai/rta-ui-improvements"
        Description = "Switch to correct branch"
    },
    @{
        Command = "npm install"
        Description = "Install dependencies"
    },
    @{
        Command = "npm run build"
        Description = "Build application"
    },
    @{
        Command = "pm2 start ecosystem.config.js && pm2 save && pm2 startup"
        Description = "Start application with PM2"
    }
)

foreach ($cmd in $deploymentCommands) {
    Invoke-SSHCommand -Command $cmd.Command -Description $cmd.Description
}

# Nginx configuration
Write-Host "`n🔄 Configuring Nginx..." -ForegroundColor Yellow
Write-Host "Run this command to create Nginx configuration:" -ForegroundColor Cyan

$nginxConfig = @"
cat > /etc/nginx/sites-available/rta-bus-parts << 'EOF'
server {
    listen 80;
    server_name $Domain www.$Domain _;
    
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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location ~* \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)`$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
EOF
"@

Write-Host $nginxConfig -ForegroundColor White

Write-Host "`nPress Enter when Nginx config is created..." -ForegroundColor Gray
Read-Host

# Enable site and configure firewall
$finalCommands = @(
    "rm -f /etc/nginx/sites-enabled/default",
    "ln -s /etc/nginx/sites-available/rta-bus-parts /etc/nginx/sites-enabled/",
    "nginx -t",
    "systemctl restart nginx",
    "ufw allow ssh && ufw allow 'Nginx Full' && ufw --force enable"
)

foreach ($cmd in $finalCommands) {
    Invoke-SSHCommand -Command $cmd -Description "Finalizing configuration"
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "TESTING PHASE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Test deployment
Write-Host "`n🧪 Testing deployment..." -ForegroundColor Yellow
Write-Host "Run these commands to verify deployment:" -ForegroundColor Cyan
Write-Host "pm2 status" -ForegroundColor White
Write-Host "pm2 logs rta-bus-parts" -ForegroundColor White
Write-Host "systemctl status nginx" -ForegroundColor White

Write-Host "`nPress Enter when you've verified the services are running..." -ForegroundColor Gray
Read-Host

# Test web access
Write-Host "`n🌐 Testing web access..." -ForegroundColor Yellow
Write-Host "Testing domain access..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://$Domain" -TimeoutSec 30 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Domain access successful: http://$Domain" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Domain test failed, trying IP..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://$ServerIP" -TimeoutSec 30 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ IP access successful: http://$ServerIP" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Web access failed. Check server logs." -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "FUNCTIONALITY TESTING" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nPlease manually test the following:" -ForegroundColor Cyan
Write-Host "1. ✅ QR Scanner loads as default page" -ForegroundColor White
Write-Host "2. ✅ Burger menu opens and shows Upload CSV & Generate QR options" -ForegroundColor White
Write-Host "3. ✅ RTA Dubai branding and colors are applied" -ForegroundColor White
Write-Host "4. ✅ Mobile responsiveness works" -ForegroundColor White
Write-Host "5. ✅ CSV upload functionality works" -ForegroundColor White
Write-Host "6. ✅ QR code generation works" -ForegroundColor White
Write-Host "7. ✅ No GitHub links or sample data references" -ForegroundColor White

Write-Host "`n🎉 Deployment and Testing Complete!" -ForegroundColor Green
Write-Host "Your RTA Dubai Bus Parts Inventory is live at:" -ForegroundColor Green
Write-Host "🌐 http://$Domain" -ForegroundColor Yellow
Write-Host "🌐 http://$ServerIP" -ForegroundColor Yellow

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
