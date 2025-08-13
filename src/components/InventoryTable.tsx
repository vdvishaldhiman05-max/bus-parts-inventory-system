'use client'

import { useState } from 'react'
import QRCodeGenerator from '@/components/QRCodeGenerator'

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

interface InventoryTableProps {
  inventory: PartData[]
  onDataChange?: () => void
}

export default function InventoryTable({ inventory, onDataChange }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCondition, setFilterCondition] = useState('all')
  const [sortField, setSortField] = useState<keyof PartData>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set())
  const [showQRFor, setShowQRFor] = useState<string | null>(null)

  // Filter and sort inventory
  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = Object.values(item).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
      const matchesCondition = filterCondition === 'all' || item.condition === filterCondition
      return matchesSearch && matchesCondition
    })
    .sort((a, b) => {
      const aValue = a[sortField] || ''
      const bValue = b[sortField] || ''
      const comparison = aValue.toString().localeCompare(bValue.toString())
      return sortDirection === 'asc' ? comparison : -comparison
    })

  const handleSort = (field: keyof PartData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedParts.size === filteredInventory.length) {
      setSelectedParts(new Set())
    } else {
      setSelectedParts(new Set(filteredInventory.map(item => item.id)))
    }
  }

  const handleSelectPart = (partId: string) => {
    const newSelected = new Set(selectedParts)
    if (newSelected.has(partId)) {
      newSelected.delete(partId)
    } else {
      newSelected.add(partId)
    }
    setSelectedParts(newSelected)
  }

  const generateBulkQR = () => {
    if (selectedParts.size === 0) return
    
    // Create a zip file with all selected QR codes
    // This would require additional libraries in a real implementation
    alert(`Generating QR codes for ${selectedParts.size} selected parts...`)
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'brand new': return 'text-green-600 bg-green-50'
      case 'used': return 'text-yellow-600 bg-yellow-50'
      case 'repaired': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSortIcon = (field: keyof PartData) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Search and Filter Controls */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search parts by ID, manufacturer, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="form-input min-w-[150px]"
            >
              <option value="all">All Conditions</option>
              <option value="brand new">Brand New</option>
              <option value="used">Used</option>
              <option value="repaired">Repaired</option>
            </select>
            {selectedParts.size > 0 && (
              <button
                onClick={generateBulkQR}
                className="btn-primary whitespace-nowrap"
              >
                📱 Generate {selectedParts.size} QR Codes
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredInventory.length} of {inventory.length} parts
            {selectedParts.size > 0 && ` (${selectedParts.size} selected)`}
          </span>
          <button
            onClick={() => setShowQRFor(null)}
            className="text-red-600 hover:text-red-800"
          >
            Hide QR Codes
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="inventory-table">
          <thead>
            <tr>
              <th className="w-12">
                <input
                  type="checkbox"
                  checked={selectedParts.size === filteredInventory.length && filteredInventory.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th 
                className="cursor-pointer hover:bg-red-600"
                onClick={() => handleSort('id')}
              >
                Part ID {getSortIcon('id')}
              </th>
              <th 
                className="cursor-pointer hover:bg-red-600"
                onClick={() => handleSort('manufacturer')}
              >
                Manufacturer {getSortIcon('manufacturer')}
              </th>
              <th 
                className="cursor-pointer hover:bg-red-600"
                onClick={() => handleSort('condition')}
              >
                Condition {getSortIcon('condition')}
              </th>
              <th 
                className="cursor-pointer hover:bg-red-600"
                onClick={() => handleSort('manufacturing_date')}
              >
                Mfg Date {getSortIcon('manufacturing_date')}
              </th>
              <th 
                className="cursor-pointer hover:bg-red-600"
                onClick={() => handleSort('transaction_date')}
              >
                Transaction Date {getSortIcon('transaction_date')}
              </th>
              <th className="hidden md:table-cell">Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((part) => (
              <tr key={part.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedParts.has(part.id)}
                    onChange={() => handleSelectPart(part.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="font-mono font-semibold text-red-600">
                  {part.id}
                </td>
                <td>{part.manufacturer}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConditionColor(part.condition)}`}>
                    {part.condition.toUpperCase()}
                  </span>
                </td>
                <td>{part.manufacturing_date}</td>
                <td>{part.transaction_date}</td>
                <td className="hidden md:table-cell">
                  {part.description || '-'}
                </td>
                <td>
                  <button
                    onClick={() => setShowQRFor(showQRFor === part.id ? null : part.id)}
                    className={`btn-secondary text-xs ${showQRFor === part.id ? 'bg-red-100 border-red-500 text-red-700' : ''}`}
                  >
                    {showQRFor === part.id ? '📱 Hide QR' : '📱 Generate QR'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Code Display */}
      {showQRFor && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="max-w-md mx-auto">
            <QRCodeGenerator 
              partId={showQRFor}
              partData={inventory.find(p => p.id === showQRFor)}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No parts found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterCondition !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No inventory data available'
            }
          </p>
          {(searchTerm || filterCondition !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterCondition('all')
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
