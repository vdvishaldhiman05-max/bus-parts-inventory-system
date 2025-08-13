#!/bin/bash

# RTA Dubai Bus Parts Inventory - Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting RTA Dubai Bus Parts Inventory deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/bus-parts-inventory-system"
APP_NAME="rta-bus-parts"
BRANCH="blackboxai/rta-ui-improvements"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Navigate to app directory
if [ ! -d "$APP_DIR" ]; then
    print_error "Application directory not found: $APP_DIR"
    exit 1
fi

cd $APP_DIR
print_status "Changed to application directory"

# Backup current version
BACKUP_DIR="/var/backups/rta-bus-parts-$(date +%Y%m%d-%H%M%S)"
mkdir -p /var/backups
cp -r $APP_DIR $BACKUP_DIR
print_status "Created backup at $BACKUP_DIR"

# Pull latest changes
print_status "Pulling latest changes from GitHub..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH
print_status "Code updated successfully"

# Install/update dependencies
print_status "Installing dependencies..."
npm ci --production=false
print_status "Dependencies installed"

# Build application
print_status "Building application..."
npm run build
print_status "Application built successfully"

# Restart PM2 application
if pm2 describe $APP_NAME > /dev/null 2>&1; then
    print_status "Restarting PM2 application..."
    pm2 restart $APP_NAME
    pm2 save
else
    print_warning "PM2 application not found, starting new instance..."
    pm2 start ecosystem.config.js
    pm2 save
fi

# Check application status
sleep 5
if pm2 describe $APP_NAME | grep -q "online"; then
    print_status "Application is running successfully"
else
    print_error "Application failed to start"
    print_warning "Check logs with: pm2 logs $APP_NAME"
    exit 1
fi

# Test Nginx configuration
print_status "Testing Nginx configuration..."
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    print_status "Nginx configuration reloaded"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Display status
echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Application Status:"
pm2 status $APP_NAME
echo ""
echo "🌐 Your RTA Dubai Bus Parts Inventory is now live!"
echo "📱 Access your application at: http://$(curl -s ifconfig.me)"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: pm2 logs $APP_NAME"
echo "  - Monitor: pm2 monit"
echo "  - Restart: pm2 restart $APP_NAME"
echo ""
