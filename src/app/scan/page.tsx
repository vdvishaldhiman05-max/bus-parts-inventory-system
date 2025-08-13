'use client'

import { useState, useEffect } from 'react'
import QRScanner from '@/components/QRScanner'

interface PartData {
  id: string
  manufacturer: string
  manufacturing_date: string
  condition: string
  transaction_date: string
  buy_date?: string
  repair_date?: string
  install_date?: string
  description?: string
}

export default function ScanPage() {
  const [scannedData, setScannedData] = useState<PartData | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const [error, setError] = useState<string>('')

  const handleScanResult = (result: string) => {
    try {
      // Get inventory data from localStorage
      const inventoryData = localStorage.getItem('inventoryData')
      if (!inventoryData) {
        setError('No inventory data found. Please upload a CSV file first.')
        return
      }

      const inventory: PartData[] = JSON.parse(inventoryData)
      const part = inventory.find(item => item.id === result)

      if (part) {
        setScannedData(part)
        setIsScanning(false)
        setError('')
      } else {
        setError(`Part with ID "${result}" not found in inventory.`)
      }
    } catch (err) {
      setError('Error processing scan result. Please try again.')
      console.error('Scan processing error:', err)
    }
  }

  const handleScanError = (error: string) => {
    setError(error)
  }

  const resetScanner = () => {
    setScannedData(null)
    setIsScanning(true)
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          RTA Bus Parts Scanner
        </h1>
        <p className="text-gray-600">
          Scan QR codes to view detailed part information
        </p>
      </div>

      {isScanning && !scannedData ? (
        <div className="scanner-container">
          <QRScanner 
            onScanResult={handleScanResult}
            onError={handleScanError}
          />
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button 
                onClick={() => setError('')}
                className="btn-secondary mt-2"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Point your camera at a QR code</li>
              <li>Ensure good lighting for best results</li>
              <li>Use the flash toggle if needed</li>
              <li>Hold steady until the code is detected</li>
            </ul>
          </div>
        </div>
      ) : scannedData ? (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Part Found!</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Part ID
                </label>
                <p className="text-lg font-mono text-red-600">{scannedData.id}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Manufacturer
                </label>
                <p className="text-lg">{scannedData.manufacturer}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Condition
                </label>
                <p className={`text-lg font-semibold ${
                  scannedData.condition === 'brand new' ? 'text-green-600' :
                  scannedData.condition === 'used' ? 'text-yellow-600' :
                  'text-orange-600'
                }`}>
                  {scannedData.condition.toUpperCase()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Manufacturing Date
                </label>
                <p className="text-lg">{scannedData.manufacturing_date}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Transaction Date
                </label>
                <p className="text-lg">{scannedData.transaction_date}</p>
              </div>

              {scannedData.buy_date && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Purchase Date
                  </label>
                  <p className="text-lg">{scannedData.buy_date}</p>
                </div>
              )}

              {scannedData.repair_date && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Repair Date
                  </label>
                  <p className="text-lg">{scannedData.repair_date}</p>
                </div>
              )}

              {scannedData.install_date && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Installation Date
                  </label>
                  <p className="text-lg">{scannedData.install_date}</p>
                </div>
              )}
            </div>

            {scannedData.description && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Description
                </label>
                <p className="text-lg">{scannedData.description}</p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={resetScanner}
              className="btn-primary"
            >
              📷 Scan Another Code
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
