'use client'

import { useState } from 'react'
import CSVUpload from '@/components/CSVUpload'

export default function UploadPage() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadMessage, setUploadMessage] = useState('')

  const handleUploadSuccess = (message: string) => {
    setUploadStatus('success')
    setUploadMessage(message)
  }

  const handleUploadError = (message: string) => {
    setUploadStatus('error')
    setUploadMessage(message)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Upload Inventory Data
        </h1>
        <p className="text-gray-600">
          Import your bus parts inventory from a CSV file
        </p>
      </div>

      {/* Upload Status */}
      {uploadStatus === 'success' && (
        <div className="success-message">
          <div className="flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <div>
              <h3 className="font-semibold">Upload Successful!</h3>
              <p>{uploadMessage}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a href="/generate" className="btn-primary">
              📱 Generate QR Codes
            </a>
            <a href="/" className="btn-secondary">
              📷 Start Scanning
            </a>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="error-message">
          <div className="flex items-center">
            <span className="text-2xl mr-3">❌</span>
            <div>
              <h3 className="font-semibold">Upload Failed</h3>
              <p>{uploadMessage}</p>
            </div>
          </div>
          <button 
            onClick={() => setUploadStatus('idle')}
            className="btn-secondary mt-3"
          >
            Try Again
          </button>
        </div>
      )}

      {/* CSV Upload Component */}
      <CSVUpload 
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />

      {/* Help Section */}
      <div className="mt-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Need Help?
          </h3>
          <p className="text-red-700 mb-4">
            Having trouble with your CSV file? Contact support for assistance.
          </p>
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
