'use client'

import { useState, useEffect } from 'react'

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

interface QRCodeGeneratorProps {
  partId: string
  partData?: PartData
}

export default function QRCodeGenerator({ partId, partData }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    generateQRCode()
  }, [partId])

  const generateQRCode = async () => {
    setIsGenerating(true)
    setError('')

    try {
      // Dynamic import to avoid SSR issues
      const QRCode = await import('qrcode')
      
      // Generate QR code with the part ID
      const qrDataUrl = await QRCode.toDataURL(partId, {
        width: 200,
        margin: 2,
        color: {
          dark: '#E31E24', // RTA Red
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })

      setQrCodeUrl(qrDataUrl)
    } catch (err) {
      console.error('QR Code generation error:', err)
      setError('Failed to generate QR code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.download = `QR_${partId}.png`
    link.href = qrCodeUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const printQRCode = () => {
    if (!qrCodeUrl || !partData) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${partId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              border: 2px solid #E31E24;
              border-radius: 8px;
              padding: 20px;
              margin: 20px auto;
              max-width: 300px;
              background: white;
            }
            .qr-image {
              width: 200px;
              height: 200px;
              margin: 10px auto;
            }
            .part-info {
              margin-top: 15px;
              font-size: 12px;
              color: #333;
            }
            .part-id {
              font-size: 16px;
              font-weight: bold;
              color: #E31E24;
              margin-bottom: 10px;
            }
            .rta-logo {
              margin-top: 15px;
              font-size: 14px;
              color: #E31E24;
              font-weight: bold;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="rta-logo">RTA DUBAI</div>
            <img src="${qrCodeUrl}" alt="QR Code for ${partId}" class="qr-image" />
            <div class="part-id">${partId}</div>
            <div class="part-info">
              <div><strong>Manufacturer:</strong> ${partData.manufacturer}</div>
              <div><strong>Condition:</strong> ${partData.condition.toUpperCase()}</div>
              <div><strong>Mfg Date:</strong> ${partData.manufacturing_date}</div>
              ${partData.description ? `<div><strong>Description:</strong> ${partData.description}</div>` : ''}
            </div>
            <div style="margin-top: 15px; font-size: 10px; color: #666;">
              Bus Parts Inventory System
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  return (
    <div className="qr-code-container">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          QR Code for Part: <span className="text-red-600 font-mono">{partId}</span>
        </h3>
        {partData && (
          <p className="text-sm text-gray-600 mt-1">
            {partData.manufacturer} - {partData.condition.toUpperCase()}
          </p>
        )}
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center py-8">
          <div className="loading mb-4"></div>
          <p className="text-gray-600">Generating QR code...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={generateQRCode} className="btn-secondary">
            Try Again
          </button>
        </div>
      ) : qrCodeUrl ? (
        <div className="text-center">
          <div className="inline-block p-4 bg-white border-4 border-red-500 rounded-lg shadow-lg">
            <img 
              src={qrCodeUrl} 
              alt={`QR Code for ${partId}`}
              className="qr-code-image mx-auto"
            />
            <div className="mt-2 text-xs text-gray-600">
              Scan to view part details
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={downloadQRCode}
              className="btn-primary"
            >
              💾 Download PNG
            </button>
            {partData && (
              <button 
                onClick={printQRCode}
                className="btn-secondary"
              >
                🖨️ Print Label
              </button>
            )}
            <button 
              onClick={generateQRCode}
              className="btn-secondary"
            >
              🔄 Regenerate
            </button>
          </div>

          {partData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
              <h4 className="font-semibold text-gray-800 mb-2">Part Information:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div><strong>ID:</strong> {partData.id}</div>
                <div><strong>Manufacturer:</strong> {partData.manufacturer}</div>
                <div><strong>Condition:</strong> {partData.condition.toUpperCase()}</div>
                <div><strong>Mfg Date:</strong> {partData.manufacturing_date}</div>
                <div><strong>Transaction Date:</strong> {partData.transaction_date}</div>
                {partData.buy_date && <div><strong>Buy Date:</strong> {partData.buy_date}</div>}
                {partData.repair_date && <div><strong>Repair Date:</strong> {partData.repair_date}</div>}
                {partData.install_date && <div><strong>Install Date:</strong> {partData.install_date}</div>}
                {partData.description && (
                  <div className="sm:col-span-2"><strong>Description:</strong> {partData.description}</div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
