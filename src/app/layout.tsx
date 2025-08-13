import type { Metadata, Viewport } from 'next'
import './globals.css'
import BurgerMenu from '@/components/BurgerMenu'
import RTALogo from '@/components/RTALogo'

export const metadata: Metadata = {
  title: 'RTA Bus Parts Inventory System',
  description: 'Mobile web application for managing bus parts inventory with QR code generation and scanning - RTA Dubai',
  keywords: ['RTA', 'Dubai', 'bus-parts', 'inventory', 'qr-code', 'mobile', 'transport'],
  authors: [{ name: 'RTA Dubai', url: 'https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system' }],
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E31E24',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RTA Bus Parts" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/rta-logo.png" />
        <link rel="icon" href="/rta-logo.png" />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="header">
            <nav className="nav-container">
              <div className="flex items-center">
                <RTALogo />
                <div className="ml-3 hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-800">Bus Parts Inventory</h1>
                  <p className="text-sm text-gray-600">Roads & Transport Authority</p>
                </div>
              </div>
              <BurgerMenu />
            </nav>
          </header>

          <main className="main-content flex-1">
            <div className="container">
              {children}
            </div>
          </main>

          <footer className="footer">
            <div className="container">
              <RTALogo className="footer-logo mx-auto" />
              <p className="text-sm mb-2">
                © 2024 Roads & Transport Authority - Dubai
              </p>
              <p className="text-xs opacity-75">
                Bus Parts Inventory Management System
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
