'use client'

import { useState } from 'react'

interface RTALogoProps {
  className?: string
  alt?: string
}

export default function RTALogo({ className = "logo", alt = "RTA Dubai Logo" }: RTALogoProps) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  if (imageError) {
    // Fallback to text logo if image fails to load
    return (
      <div className={`${className} flex items-center justify-center`}>
        <span style={{ 
          color: '#E31E24', 
          fontWeight: 'bold', 
          fontSize: className?.includes('footer') ? '20px' : '24px',
          fontFamily: 'Arial, sans-serif'
        }}>
          RTA
        </span>
      </div>
    )
  }

  return (
    <img 
      src="https://animationvisarts.com/wp-content/uploads/2019/07/RTA-Dubai.jpg" 
      alt={alt}
      className={`${className} max-h-8 w-auto`}
      onError={handleImageError}
      style={{
        maxHeight: className?.includes('footer') ? '32px' : '40px',
        width: 'auto'
      }}
    />
  )
}
