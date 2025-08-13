'use client'

import { useState, useEffect } from 'react'
import InventoryTable from '@/components/InventoryTable'

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

export default function GeneratePage() {
  const [inventory, setInventory] = useState<PartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = () => {
    try {
      const data = localStorage.getItem('inventoryData')
      if (data) {
        const parsedData = JSON.parse(data)
        if (Array.isArray(parsedData)) {
          setInventory(parsedData)
        } else {
          setError('Invalid inventory data format')
        }
      } else {
        setError('No inventory data found')
      }
    } catch (err) {
      setError('Failed to load inventory data')
      console.error('Error loading inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    setLoading(true)
    setError('')
    loadInventoryData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Generate QR Codes
        </h1>
        <p className="text-gray-600">
          Create QR codes for your bus parts inventory
        </p>
      </div>

      {error ? (
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              No Inventory Data
            </h2>
            <p className="text-red-700 mb-6">
              {error}. Please upload a CSV file first to generate QR codes.
            </p>
            <div className="space-y-3">
              <a href="/upload" className="btn-primary block">
                📁 Upload CSV File
              </a>
              <button 
                onClick={refreshData}
                className="btn-secondary block w-full"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{inventory.length}</div>
              <div className="text-sm text-gray-600">Total Parts</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {inventory.filter(item => item.condition === 'brand new').length}
              </div>
              <div className="text-sm text-gray-600">Brand New</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {inventory.filter(item => item.condition === 'used').length}
              </div>
              <div className="text-sm text-gray-600">Used</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {inventory.filter(item => item.condition === 'repaired').length}
              </div>
              <div className="text-sm text-gray-600">Repaired</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={refreshData}
              className="btn-secondary"
            >
              🔄 Refresh Data
            </button>
            <a href="/upload" className="btn-secondary">
              📁 Upload New CSV
            </a>
            <button
              onClick={() => {
                // Generate all QR codes at once
                const event = new CustomEvent('generateAllQR')
                window.dispatchEvent(event)
              }}
              className="btn-primary"
            >
              📱 Generate All QR Codes
            </button>
          </div>

          {/* Inventory Table */}
          <InventoryTable 
            inventory={inventory}
            onDataChange={refreshData}
          />
        </>
      )}

      {/* Help Section */}
      <div className="mt-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            How to use QR codes
          </h3>
          <div className="text-red-700 mb-4 space-y-2">
            <p>1. Generate QR codes for your parts using the buttons in the table</p>
            <p>2. Download and print the QR code images</p>
            <p>3. Attach the printed QR codes to the physical parts</p>
            <p>4. Use the scanner to quickly access part information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="btn-secondary">
              📷 Go to Scanner
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
