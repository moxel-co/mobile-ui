import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Mesh } from 'three'
import MobileMenu from './components/MobileMenu'
import DesktopMenu from './components/DesktopMenu'
import FloatingUI from './components/FloatingUI'
import { useStore } from './store/useStore'
import { useDeviceDetection } from './hooks/useDeviceDetection'

function RotatingCube() {
  const meshRef = useRef<Mesh>(null!)
  const cubeColor = useStore((state) => state.cubeColor)

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5
    meshRef.current.rotation.y += delta * 0.3
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={cubeColor} roughness={0.3} metalness={0.7} />
    </mesh>
  )
}

function AnimatedEnvironment({ preset }: { preset: string }) {
  const [intensity, setIntensity] = useState(0)
  const animationStartedRef = useRef(false)

  useEffect(() => {
    console.log('AnimatedEnvironment mounted, preset:', preset)
    
    // Only animate on first load
    if (!animationStartedRef.current) {
      console.log('Starting environment intensity animation...')
      animationStartedRef.current = true
      
      let startTime: number | null = null
      const duration = 5000 // Increased from 2000ms to 5000ms (5 seconds)
      
      const animate = (currentTime: number) => {
        if (startTime === null) {
          startTime = currentTime
          console.log('Animation started at:', startTime)
        }
        
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Smooth easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        
        console.log(`Animation progress: ${(progress * 100).toFixed(1)}%, intensity: ${easedProgress.toFixed(3)}`)
        
        setIntensity(easedProgress)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          console.log('Environment intensity animation complete!')
        }
      }
      
      // Start animation after a brief delay
      console.log('Starting animation in 1 second...')
      setTimeout(() => {
        console.log('Initiating animation frame...')
        requestAnimationFrame(animate)
      }, 1000) // Increased delay from 500ms to 1000ms
    } else {
      console.log('Animation already started, skipping...')
    }
  }, [preset])

  // Log intensity changes
  useEffect(() => {
    console.log('Environment intensity updated to:', intensity)
  }, [intensity])

  return (
    <Environment 
      preset={preset as any} 
      background={true} 
      environmentIntensity={0.1}
    />
  )
}

function App() {
  const environmentPreset = useStore((state) => state.environmentPreset)
  const orbitControlsRef = useRef<any>(null)
  const [showFloatingUI, setShowFloatingUI] = useState(true)
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [splitPosition, setSplitPosition] = useState(66.666) // Default 2/3 split
  const [isDragging, setIsDragging] = useState(false)
  
  // Device detection with immediate initialization
  const { isMobile, isTablet, isDesktop } = useDeviceDetection()

  // Additional safety check - use window size directly as fallback
  const [isClientMobile, setIsClientMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    return true // Default to mobile for safety
  })

  useEffect(() => {
    // Update client-side mobile detection
    const updateMobileState = () => {
      const width = window.innerWidth
      const userAgent = navigator.userAgent
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isMobileScreen = width <= 768
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      setIsClientMobile(isMobileUA || isMobileScreen || (hasTouchScreen && width <= 1024))
    }

    updateMobileState()
    window.addEventListener('resize', updateMobileState)
    
    return () => window.removeEventListener('resize', updateMobileState)
  }, [])

  // Use the most restrictive mobile detection
  const shouldShowMobileLayout = isMobile || isTablet || isClientMobile

  // Reset activity timer
  const resetActivityTimer = () => {
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current)
    }
    
    // Show FloatingUI if it was hidden
    setShowFloatingUI(true)
    
    // Set new timeout to hide after 4 seconds
    activityTimeoutRef.current = setTimeout(() => {
      setShowFloatingUI(false)
    }, 4000)
  }

  // Set up activity listeners for the canvas container
  useEffect(() => {
    const canvasContainer = canvasContainerRef.current
    if (!canvasContainer) return

    const events = [
      'mousedown',
      'mousemove',
      'mouseup',
      'wheel',
      'touchstart',
      'touchmove',
      'touchend',
      'pointerdown',
      'pointermove',
      'pointerup'
    ]

    // Add event listeners to canvas container
    events.forEach(event => {
      canvasContainer.addEventListener(event, resetActivityTimer, { passive: true })
    })

    // Start initial timer
    resetActivityTimer()

    // Cleanup
    return () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current)
      }
      events.forEach(event => {
        canvasContainer.removeEventListener(event, resetActivityTimer)
      })
    }
  }, [])

  // Handle split resizing - only for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (shouldShowMobileLayout) return
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || shouldShowMobileLayout) return
    
    const newSplitPosition = (e.clientX / window.innerWidth) * 100
    // Constrain between 30% and 80%
    const constrainedPosition = Math.min(Math.max(newSplitPosition, 30), 80)
    setSplitPosition(constrainedPosition)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging && !shouldShowMobileLayout) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, shouldShowMobileLayout])

  const handleResetView = () => {
    if (orbitControlsRef.current) {
      // Reset camera position and rotation
      orbitControlsRef.current.reset()
    }
    console.log('Reset view triggered')
    resetActivityTimer() // Reset timer on interaction
  }

  const handleShowcaseView = () => {
    if (orbitControlsRef.current) {
      // Set a nice showcase angle
      orbitControlsRef.current.setAzimuthalAngle(Math.PI / 4)
      orbitControlsRef.current.setPolarAngle(Math.PI / 3)
      orbitControlsRef.current.update()
    }
    console.log('Showcase view triggered')
    resetActivityTimer() // Reset timer on interaction
  }

  const handleShareSocial = () => {
    // Share functionality - could capture canvas as image and share
    if (navigator.share) {
      navigator.share({
        title: '3D Mobile App',
        text: 'Check out this cool 3D app!',
        url: window.location.href,
      }).catch(console.error)
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!')
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.')
      })
    }
    console.log('Share social triggered')
    resetActivityTimer() // Reset timer on interaction
  }

  // Early return for mobile/tablet - prevent any desktop components from rendering
  if (shouldShowMobileLayout) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative',
        background: '#1a1a1a',
        overflow: 'hidden'
      }}>
        {/* 3D Scene Background */}
        <div 
          ref={canvasContainerRef}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        >
          <Canvas
            camera={{ position: [5, 5, 5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => {
              gl.setClearColor('#1a1a1a', 1)
            }}
            style={{ 
              width: '100%',
              height: '100%'
            }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />
            
            <RotatingCube />
            
            <AnimatedEnvironment preset={environmentPreset} />
            
            <OrbitControls
              ref={orbitControlsRef}
              enablePan={false}
              enableZoom={false}
              enableRotate={true}
              autoRotate={true}
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={3 * Math.PI / 4}
            />
          </Canvas>
        </div>
        
        {/* Floating UI with conditional visibility */}
        <FloatingUI 
          visible={showFloatingUI}
          onResetView={handleResetView}
          onShowcaseView={handleShowcaseView}
          onShareSocial={handleShareSocial}
          canvasWidth={100} // Full width on mobile
        />
        
        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    )
  }

  // Desktop layout with adjustable split - only renders on desktop
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex',
      background: '#1a1a1a',
      overflow: 'hidden'
    }}>
      {/* 3D Scene - Adjustable width */}
      <div 
        ref={canvasContainerRef}
        style={{ 
          width: `${splitPosition}%`, 
          height: '100%', 
          position: 'relative' 
        }}
      >
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor('#1a1a1a', 1)
          }}
          style={{ 
            width: '100%',
            height: '100%'
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />
          
          <RotatingCube />
          
          <AnimatedEnvironment preset={environmentPreset} />
          
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={3 * Math.PI / 4}
          />
        </Canvas>
        
        {/* Floating UI positioned within canvas bounds */}
        <FloatingUI 
          visible={showFloatingUI}
          onResetView={handleResetView}
          onShowcaseView={handleShowcaseView}
          onShareSocial={handleShareSocial}
          canvasWidth={splitPosition}
        />
      </div>
      
      {/* Resize handle - Made smaller */}
      <div
        style={{
          width: '2px', // Reduced from 4px to 2px
          height: '100%',
          background: isDragging ? '#ffeb3b' : '#333',
          cursor: 'col-resize',
          transition: isDragging ? 'none' : 'background-color 0.2s ease',
          position: 'relative',
          zIndex: 1000
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator - Made smaller */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '12px', // Reduced from 20px to 12px
            height: '24px', // Reduced from 40px to 24px
            background: isDragging ? '#ffeb3b' : '#555',
            borderRadius: '6px', // Reduced from 10px to 6px
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: isDragging ? 'none' : 'background-color 0.2s ease',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)', // Reduced shadow
            gap: '1px' // Reduced gap between lines
          }}
        >
          <div style={{
            width: '1px', // Reduced from 2px to 1px
            height: '12px', // Reduced from 20px to 12px
            background: isDragging ? '#000' : '#888',
            borderRadius: '0.5px'
          }} />
          <div style={{
            width: '1px', // Reduced from 2px to 1px
            height: '12px', // Reduced from 20px to 12px
            background: isDragging ? '#000' : '#888',
            borderRadius: '0.5px'
          }} />
        </div>
      </div>
      
      {/* Desktop Menu - Remaining width */}
      <div style={{ 
        width: `${100 - splitPosition}%`, 
        height: '100%' 
      }}>
        <DesktopMenu />
      </div>
    </div>
  )
}

export default App