'use client'

import { useEffect, useRef, useState } from 'react'

interface QRScannerProps {
  onScanResult: (result: string) => void
  onError: (error: string) => void
}

export default function QRScanner({ onScanResult, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [hasFlash, setHasFlash] = useState(false)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsScanning(true)

        // Check for flash capability
        const track = mediaStream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        setHasFlash('torch' in capabilities)

        // Start scanning when video is ready
        videoRef.current.onloadedmetadata = () => {
          startScanning()
        }
      }
    } catch (err) {
      console.error('Camera access error:', err)
      onError('Camera access denied. Please allow camera permissions and try again.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsScanning(false)
  }

  const toggleFlash = async () => {
    if (!stream || !hasFlash) return

    try {
      const track = stream.getVideoTracks()[0]
      await track.applyConstraints({
        advanced: [{ torch: !flashEnabled } as any]
      })
      setFlashEnabled(!flashEnabled)
    } catch (err) {
      console.error('Flash toggle error:', err)
      onError('Unable to control flash. Feature may not be supported.')
    }
  }

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return

    // Import QR scanner dynamically to avoid SSR issues
    import('qr-scanner').then((QrScanner) => {
      const qrScanner = new QrScanner.default(
        videoRef.current!,
        (result) => {
          onScanResult(result.data)
          stopCamera()
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      )

      qrScanner.start().catch((err) => {
        console.error('QR Scanner start error:', err)
        onError('Failed to start QR scanner. Please check camera permissions.')
      })

      // Cleanup function
      return () => {
        qrScanner.stop()
        qrScanner.destroy()
      }
    }).catch((err) => {
      console.error('QR Scanner import error:', err)
      onError('QR Scanner failed to load. Please refresh the page.')
    })
  }

  return (
    <div className="scanner-container">
      <div className="relative">
        <video
          ref={videoRef}
          className="scanner-video"
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ display: 'none' }}
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-red-500 rounded-lg relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500 rounded-br-lg"></div>
            
            {/* Scanning line animation */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <div className="w-full h-0.5 bg-red-500 animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="scanner-controls">
        {hasFlash && (
          <button
            onClick={toggleFlash}
            className={`btn-secondary ${flashEnabled ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : ''}`}
          >
            {flashEnabled ? '🔦 Flash On' : '💡 Flash Off'}
          </button>
        )}
        
        <button
          onClick={() => {
            stopCamera()
            setTimeout(startCamera, 100)
          }}
          className="btn-secondary"
        >
          🔄 Restart Camera
        </button>
      </div>

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {isScanning ? 'Scanning for QR codes...' : 'Camera not active'}
          </span>
        </div>
      </div>
    </div>
  )
}
