# Deployment Guide - Bus Parts Inventory Management System

This guide provides step-by-step instructions for deploying the Bus Parts Inventory Management System to various platforms.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bus-parts-inventory)

### Option 2: Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/bus-parts-inventory)

## 📋 Prerequisites

- Node.js 18 or higher
- Git
- GitHub account
- Vercel/Netlify account (for hosting)

## 🔧 Manual Deployment

### 1. Vercel Deployment

1. **Fork/Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/bus-parts-inventory.git
   cd bus-parts-inventory
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### 2. Netlify Deployment

1. **Build the Project**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=.next
   ```

### 3. GitHub Pages (Static Export)

1. **Configure Next.js for Static Export**
   Add to `next.config.ts`:
   ```typescript
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

2. **Build and Export**
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**
   - Push the `out` folder to `gh-pages` branch
   - Enable GitHub Pages in repository settings

## 🔒 Important Security Notes

### HTTPS Requirement
- **Camera access requires HTTPS in production**
- All major hosting platforms (Vercel, Netlify) provide HTTPS by default
- Local development works with HTTP

### Environment Configuration
- No environment variables required
- All functionality works client-side
- No server-side configuration needed

## 📱 Mobile Testing

### Local Network Testing
1. Start development server:
   ```bash
   npm run dev
   ```

2. Find your local IP address:
   ```bash
   # On macOS/Linux
   ifconfig | grep inet
   
   # On Windows
   ipconfig
   ```

3. Access from mobile device:
   ```
   http://YOUR_IP_ADDRESS:8000
   ```

### Production Testing
1. Deploy to any HTTPS-enabled platform
2. Access the URL from mobile device
3. Allow camera permissions when prompted
4. Test QR code scanning functionality

## 🛠️ Build Configuration

### Environment Variables (Optional)
Create `.env.local` for custom configuration:
```env
# Custom port for development
PORT=8000

# Custom build settings
NEXT_TELEMETRY_DISABLED=1
```

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📊 Performance Optimization

### Image Optimization
- QR codes are generated as optimized PNGs
- SVG icons used for better performance
- Responsive images for different screen sizes

### Bundle Size
- Tree-shaking enabled for smaller bundles
- Dynamic imports for code splitting
- Optimized dependencies

### Caching Strategy
- Static assets cached by CDN
- Service worker for offline functionality (optional)
- Local storage for data persistence

## 🔍 Troubleshooting

### Common Issues

1. **Camera not working**
   - Ensure HTTPS is enabled
   - Check browser permissions
   - Verify device camera access

2. **Build failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify all dependencies are installed

3. **Mobile responsiveness**
   - Test on actual devices
   - Use browser dev tools mobile emulation
   - Check viewport meta tag

### Debug Mode
Enable debug logging:
```bash
DEBUG=* npm run dev
```

## 📈 Monitoring & Analytics

### Performance Monitoring
- Use Vercel Analytics (if deployed on Vercel)
- Google Lighthouse for performance audits
- Web Vitals monitoring

### Error Tracking
- Browser console for client-side errors
- Network tab for API issues
- Local storage inspection for data issues

## 🔄 Updates & Maintenance

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package@latest
```

### Version Management
- Use semantic versioning
- Tag releases in Git
- Maintain changelog

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Note**: Always test the complete workflow (upload → generate → scan) after deployment to ensure all features work correctly in the production environment.
