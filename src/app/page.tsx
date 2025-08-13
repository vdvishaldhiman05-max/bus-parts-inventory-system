'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to scan page immediately as the app should start from scan
    router.replace('/scan')
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="loading mb-4"></div>
        <p className="text-gray-600">Loading RTA Bus Parts Scanner...</p>
      </div>
    </div>
  )
}
