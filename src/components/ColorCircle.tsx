import React from 'react'

interface ColorCircleProps {
  color: string
  size?: number
  className?: string
}

function ColorCircle({ color, size = 20, className = '' }: ColorCircleProps) {
  return (
    <div
      className={`color-circle ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: `0 0 8px ${color}40, inset 0 1px 2px rgba(255, 255, 255, 0.2)`,
        flexShrink: 0,
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        background: 'white' // Base white background
      }}
    >
      {/* Left half with the color */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          backgroundColor: color,
          borderRadius: `${size/2}px 0 0 ${size/2}px`
        }}
      />
      {/* Right half is white (from the parent background) */}
    </div>
  )
}

export default ColorCircle