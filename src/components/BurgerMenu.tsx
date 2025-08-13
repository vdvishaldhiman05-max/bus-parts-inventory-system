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
        className={`relative z-[1002] flex flex-col cursor-pointer p-2 bg-transparent border-none ${isOpen ? 'burger-active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <div className={`w-6 h-0.5 bg-red-600 my-1 transition-all duration-300 ${isOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-red-600 my-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-red-600 my-1 transition-all duration-300 ${isOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[999] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu */}
      <nav className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-[1000] transition-transform duration-300 ${isOpen ? 'transform translate-x-0' : 'transform translate-x-full'}`}>
        <div className="pt-20">
          <Link 
            href="/upload" 
            className="block px-6 py-4 text-gray-800 text-lg font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-red-600 hover:pl-8 transition-all duration-300"
            onClick={closeMenu}
          >
            📁 Upload CSV
          </Link>
          <Link 
            href="/generate" 
            className="block px-6 py-4 text-gray-800 text-lg font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-red-600 hover:pl-8 transition-all duration-300"
            onClick={closeMenu}
          >
            📱 Generate QR Codes
          </Link>
          <Link 
            href="/scan" 
            className="block px-6 py-4 text-gray-800 text-lg font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-red-600 hover:pl-8 transition-all duration-300"
            onClick={closeMenu}
          >
            📷 Scan QR Code
          </Link>
          <div className="px-6 py-4 border-t border-gray-200 mt-4">
            <p className="text-sm text-gray-600 mb-2 font-semibold">RTA Dubai</p>
            <p className="text-xs text-gray-500">Bus Parts Inventory System</p>
            <p className="text-xs text-gray-400 mt-2">
              <a 
                href="https://github.com/vdvishaldhiman05-max/bus-parts-inventory-system" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-red-600 transition-colors"
              >
                GitHub Repository
              </a>
            </p>
          </div>
        </div>
      </nav>
    </>
  )
}
