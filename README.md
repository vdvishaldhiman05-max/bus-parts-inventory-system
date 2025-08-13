# Bus Parts Inventory Management System

A modern mobile web application for managing bus parts inventory with QR code generation and scanning capabilities. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **CSV Upload**: Import inventory data from CSV files
- **QR Code Generation**: Create downloadable QR codes for each part
- **Mobile QR Scanning**: Scan QR codes with camera to view part details
- **Responsive Design**: Optimized for mobile and desktop devices
- **Real-time Search**: Filter and search through inventory items
- **Local Storage**: Data persistence in browser storage
- **Camera Permissions**: Automatic camera access with flash toggle support

## 📱 Mobile Features

- **Camera Access**: Uses device camera for QR code scanning
- **Flash Toggle**: Control camera flash for better scanning in low light
- **Touch-Friendly UI**: Optimized for mobile touch interactions
- **Responsive Layout**: Adapts to different screen sizes
- **File Upload**: Mobile-friendly CSV file selection

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **QR Code Generation**: `qrcode` library
- **QR Code Scanning**: `qr-scanner` library
- **CSV Parsing**: `papaparse` library
- **UI Components**: Custom components with Radix UI primitives
- **Development**: Turbopack for fast development builds

## 📋 CSV Format

Your CSV file should include the following columns:

### Required Columns:
- `id` - Unique identifier for each part
- `manufacturer` - Part manufacturer name
- `manufacturing_date` - Date when part was manufactured (YYYY-MM-DD)
- `condition` - Part condition (brand new, used, repaired)
- `transaction_date` - Date of last transaction (YYYY-MM-DD)

### Optional Columns:
- `buy_date` - Purchase date
- `repair_date` - Repair date (if applicable)
- `install_date` - Installation date
- `description` - Part description

### Sample CSV:
```csv
id,manufacturer,manufacturing_date,condition,transaction_date,buy_date,repair_date,install_date,description
BP001,Acme Corp,2020-01-01,brand new,2020-02-15,2020-02-15,,2020-02-20,Engine Oil Filter
BP002,Acme Corp,2019-12-15,used,2021-03-20,2019-12-20,,2021-03-25,Brake Pads Set
BP003,BestParts,2021-05-10,repaired,2022-01-10,2021-05-15,2022-01-05,2022-01-15,Transmission Belt
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bus-parts-inventory.git
cd bus-parts-inventory
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8000](http://localhost:8000) in your browser

### Production Build

```bash
npm run build
npm start
```

## 📖 How to Use

### 1. Upload Inventory Data
1. Navigate to the "Upload CSV" section
2. Download the sample CSV file or prepare your own
3. Select and upload your CSV file
4. Verify the upload was successful

### 2. Generate QR Codes
1. Go to "Generate QR Codes" section
2. Browse your uploaded inventory
3. Click "Generate QR" for any part
4. Download the QR code image
5. Print and attach to physical parts

### 3. Scan QR Codes
1. Open the "Scan QR Code" section on a mobile device
2. Allow camera permissions when prompted
3. Point camera at a QR code
4. View detailed part information instantly
5. Use flash toggle for better scanning in low light

## 📱 Mobile Testing

The application is optimized for mobile devices. To test:

1. **Local Testing**: Access `http://your-ip:8000` from mobile device on same network
2. **Production Testing**: Deploy to Vercel/Netlify and access via HTTPS (required for camera access)

### Camera Permissions
- HTTPS is required for camera access in production
- Allow camera permissions when prompted
- Flash toggle available on supported devices

## 🔧 Configuration

### Environment Variables
No environment variables required - the app works entirely client-side.

### Customization
- Modify `src/app/globals.css` for styling changes
- Update `src/components/` for UI modifications
- Adjust QR code settings in `src/components/QRCodeGenerator.tsx`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── upload/            # CSV upload page
│   ├── generate/          # QR generation page
│   └── scan/              # QR scanning page
├── components/            # React components
│   ├── CSVUpload.tsx      # CSV file upload component
│   ├── QRCodeGenerator.tsx # QR code generation component
│   ├── QRScanner.tsx      # QR code scanning component
│   ├── InventoryTable.tsx # Inventory display component
│   └── ui/                # UI components
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

### Manual Deployment
1. Run `npm run build`
2. Serve the generated files from any static hosting service

## 🔒 Security & Privacy

- All data is stored locally in browser storage
- No data is sent to external servers
- Camera access is only used for QR scanning
- CSV files are processed entirely client-side

## 🐛 Troubleshooting

### Camera Issues
- Ensure HTTPS is used in production
- Check browser permissions for camera access
- Try refreshing the page if camera doesn't start

### CSV Upload Issues
- Verify CSV format matches requirements
- Check for special characters in data
- Ensure file size is reasonable (< 10MB)

### QR Code Issues
- Ensure good lighting when scanning
- Hold camera steady and at appropriate distance
- Try using flash toggle in low light conditions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- QR code functionality powered by qrcode and qr-scanner libraries
- CSV parsing by papaparse
- UI components inspired by shadcn/ui
- Icons and styling with Tailwind CSS

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Note**: This application requires HTTPS for camera access in production environments. For local development, HTTP is sufficient.
