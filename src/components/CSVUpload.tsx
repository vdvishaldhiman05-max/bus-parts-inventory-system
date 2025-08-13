'use client'

import { useState, useRef, useEffect } from 'react'

interface CSVUploadProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

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

export default function CSVUpload({ onSuccess, onError }: CSVUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateCSVData = (data: any[]): PartData[] => {
    if (!data || data.length === 0) {
      throw new Error('CSV file is empty')
    }

    const requiredFields = ['id', 'manufacturer', 'manufacturing_date', 'condition', 'transaction_date']
    const firstRow = data[0]
    
    // Check if all required fields are present
    for (const field of requiredFields) {
      if (!(field in firstRow)) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Validate each row
    const validatedData: PartData[] = data.map((row, index) => {
      // Check required fields
      for (const field of requiredFields) {
        if (!row[field] || row[field].toString().trim() === '') {
          throw new Error(`Row ${index + 1}: Missing value for required field '${field}'`)
        }
      }

      // Validate condition values
      const validConditions = ['brand new', 'used', 'repaired']
      if (!validConditions.includes(row.condition.toLowerCase())) {
        throw new Error(`Row ${index + 1}: Invalid condition '${row.condition}'. Must be one of: ${validConditions.join(', ')}`)
      }

      // Validate date formats (basic check)
      const dateFields = ['manufacturing_date', 'transaction_date', 'buy_date', 'repair_date', 'install_date']
      for (const dateField of dateFields) {
        if (row[dateField] && row[dateField].toString().trim() !== '') {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/
          if (!dateRegex.test(row[dateField])) {
            throw new Error(`Row ${index + 1}: Invalid date format for '${dateField}'. Use YYYY-MM-DD format`)
          }
        }
      }

      return {
        id: row.id.toString().trim(),
        manufacturer: row.manufacturer.toString().trim(),
        manufacturing_date: row.manufacturing_date.toString().trim(),
        condition: row.condition.toString().toLowerCase().trim(),
        transaction_date: row.transaction_date.toString().trim(),
        buy_date: row.buy_date ? row.buy_date.toString().trim() : undefined,
        repair_date: row.repair_date ? row.repair_date.toString().trim() : undefined,
        install_date: row.install_date ? row.install_date.toString().trim() : undefined,
        description: row.description ? row.description.toString().trim() : undefined,
      }
    })

    // Check for duplicate IDs
    const ids = validatedData.map(item => item.id)
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
    if (duplicateIds.length > 0) {
      throw new Error(`Duplicate part IDs found: ${duplicateIds.join(', ')}`)
    }

    return validatedData
  }

  const processCSVFile = async (file: File) => {
    setIsUploading(true)

    try {
      // Dynamic import to avoid SSR issues
      const Papa = await import('papaparse')
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            if (results.errors && results.errors.length > 0) {
              throw new Error(`CSV parsing error: ${results.errors[0].message}`)
            }

            const validatedData = validateCSVData(results.data)
            
            // Save to localStorage
            localStorage.setItem('inventoryData', JSON.stringify(validatedData))
            
            setIsUploading(false)
            onSuccess(`Successfully uploaded ${validatedData.length} parts to inventory`)
          } catch (error) {
            setIsUploading(false)
            onError(error instanceof Error ? error.message : 'Unknown error occurred')
          }
        },
        error: (error) => {
          setIsUploading(false)
          onError(`Failed to parse CSV file: ${error.message}`)
        }
      })
    } catch (error) {
      setIsUploading(false)
      onError('Failed to load CSV parser. Please refresh the page and try again.')
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file) return

    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      onError('Please select a valid CSV file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      onError('File size too large. Please select a file smaller than 10MB')
      return
    }

    processCSVFile(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* File Upload Area */}
      <div
        className={`file-input ${dragActive ? 'border-red-500 bg-red-50' : ''} ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="text-center">
          {isUploading ? (
            <div className="space-y-4">
              <div className="loading mx-auto"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Processing CSV File...</h3>
                <p className="text-gray-500">Please wait while we validate and import your data</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl text-red-500 mb-4">📁</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {dragActive ? 'Drop your CSV file here' : 'Upload CSV File'}
                </h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <button className="btn-primary">
                  Choose File
                </button>
              </div>
              <div className="text-xs text-gray-400">
                Supported format: CSV files up to 10MB
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Inventory Status */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Current Inventory Status</h3>
        <InventoryStatus />
      </div>
    </div>
  )
}

function InventoryStatus() {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    try {
      const data = localStorage.getItem('inventoryData')
      if (data) {
        const inventory = JSON.parse(data)
        setItemCount(Array.isArray(inventory) ? inventory.length : 0)
      }
    } catch (error) {
      console.error('Error reading inventory data:', error)
    }
  }, [])

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${itemCount > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className="text-sm text-gray-600">
          {itemCount > 0 ? `${itemCount} parts in inventory` : 'No inventory data'}
        </span>
      </div>
      {itemCount > 0 && (
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all inventory data?')) {
              localStorage.removeItem('inventoryData')
              setItemCount(0)
            }
          }}
          className="text-xs text-red-600 hover:text-red-800 underline"
        >
          Clear Data
        </button>
      )}
    </div>
  )
}
