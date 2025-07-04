import React, { useState, useEffect, useCallback } from 'react'

interface LoadingProps {
  onComplete?: () => void
}

interface LoadingState {
  progress: number
  stage: 'initializing' | 'loading-assets' | 'preparing-scene' | 'complete'
  isVisible: boolean
}

function Loading({ onComplete }: LoadingProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    progress: 0,
    stage: 'initializing',
    isVisible: true
  })

  // Simulate realistic loading progression
  useEffect(() => {
    let animationFrame: number
    let timeoutId: NodeJS.Timeout
    
    const updateProgress = () => {
      setLoadingState(prev => {
        let newProgress = prev.progress
        let newStage = prev.stage
        
        // Progressive loading stages with different speeds
        if (prev.stage === 'initializing' && prev.progress < 25) {
          newProgress = Math.min(prev.progress + 0.8, 25)
          if (newProgress >= 25) {
            newStage = 'loading-assets'
          }
        } else if (prev.stage === 'loading-assets' && prev.progress < 75) {
          newProgress = Math.min(prev.progress + 0.6, 75)
          if (newProgress >= 75) {
            newStage = 'preparing-scene'
          }
        } else if (prev.stage === 'preparing-scene' && prev.progress < 100) {
          newProgress = Math.min(prev.progress + 1.2, 100)
          if (newProgress >= 100) {
            newStage = 'complete'
          }
        }
        
        return {
          ...prev,
          progress: newProgress,
          stage: newStage
        }
      })
    }

    // Start the loading animation
    const animate = () => {
      updateProgress()
      if (loadingState.progress < 100) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [loadingState.progress])

  // Handle completion and fade out
  useEffect(() => {
    if (loadingState.stage === 'complete' && loadingState.progress >= 100) {
      const fadeOutTimer = setTimeout(() => {
        setLoadingState(prev => ({ ...prev, isVisible: false }))
        
        // Call onComplete after fade animation
        const completeTimer = setTimeout(() => {
          onComplete?.()
        }, 800) // Match fade duration
        
        return () => clearTimeout(completeTimer)
      }, 500) // Brief pause before fade
      
      return () => clearTimeout(fadeOutTimer)
    }
  }, [loadingState.stage, loadingState.progress, onComplete])

  const getStageText = () => {
    switch (loadingState.stage) {
      case 'initializing':
        return 'Initializing...'
      case 'loading-assets':
        return 'Loading Assets...'
      case 'preparing-scene':
        return 'Preparing 3D Scene...'
      case 'complete':
        return 'Ready!'
      default:
        return 'Loading...'
    }
  }

  const progressPercentage = Math.round(loadingState.progress)

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        zIndex: 9999,
        opacity: loadingState.isVisible ? 1 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: loadingState.isVisible ? 'auto' : 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
        overflow: 'hidden'
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(100, 255, 218, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 235, 59, 0.1) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      {/* Main loading content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          zIndex: 1
        }}
      >
        {/* Logo/Icon area */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #64ffda, #ffeb3b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            animation: 'rotate 3s linear infinite'
          }}
        >
          {/* Inner circle */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#64ffda',
              fontWeight: 'bold'
            }}
          >
            3D
          </div>
          
          {/* Progress ring */}
          <svg
            style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              width: '140px',
              height: '140px',
              transform: 'rotate(-90deg)'
            }}
          >
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#64ffda"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - loadingState.progress / 100)}`}
              style={{
                transition: 'stroke-dashoffset 0.3s ease-out',
                filter: 'drop-shadow(0 0 8px #64ffda)'
              }}
            />
          </svg>
        </div>

        {/* Progress text */}
        <div
          style={{
            textAlign: 'center',
            color: 'white'
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '8px',
              background: 'linear-gradient(45deg, #64ffda, #ffeb3b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }}
          >
            {progressPercentage}%
          </div>
          
          <div
            style={{
              fontSize: '18px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.8)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            {getStageText()}
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '300px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: `${loadingState.progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #64ffda, #ffeb3b)',
              borderRadius: '2px',
              transition: 'width 0.3s ease-out',
              boxShadow: '0 0 12px rgba(100, 255, 218, 0.5)'
            }}
          />
        </div>

        {/* Loading dots animation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#64ffda',
                animation: `bounce 1.4s ease-in-out infinite both`,
                animationDelay: `${index * 0.16}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  )
}

export default Loading