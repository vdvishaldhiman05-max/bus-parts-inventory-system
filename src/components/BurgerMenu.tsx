'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Burger Menu Button */}
      <button
        className={`burger-menu ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu */}
      <nav className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        <div className="pt-4">
          <Link 
            href="/upload" 
            className="menu-item"
            onClick={closeMenu}
          >
            📁 Upload CSV
          </Link>
          <Link 
            href="/generate" 
            className="menu-item"
            onClick={closeMenu}
          >
            📱 Generate QR Codes
          </Link>
          <Link 
            href="/" 
            className="menu-item"
            onClick={closeMenu}
          >
            📷 Scan QR Code
          </Link>
          <div className="px-6 py-4 border-t border-gray-200 mt-4">
            <p className="text-sm text-gray-600 mb-2">RTA Dubai</p>
            <p className="text-xs text-gray-500">Bus Parts Inventory System</p>
          </div>
        </div>
      </nav>
    </>
  )
}
