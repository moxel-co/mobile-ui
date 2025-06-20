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

function App() {
  const environmentPreset = useStore((state) => state.environmentPreset)
  const orbitControlsRef = useRef<any>(null)
  const [showFloatingUI, setShowFloatingUI] = useState(true)
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [splitPosition, setSplitPosition] = useState(66.666) // Default 2/3 split
  const [isDragging, setIsDragging] = useState(false)
  
  // Device detection
  const { isMobile, isTablet, isDesktop } = useDeviceDetection()

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

  // Handle split resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const newSplitPosition = (e.clientX / window.innerWidth) * 100
    // Constrain between 30% and 80%
    const constrainedPosition = Math.min(Math.max(newSplitPosition, 30), 80)
    setSplitPosition(constrainedPosition)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging])

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

  // Desktop layout with adjustable split
  if (isDesktop) {
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
            
            <Environment preset={environmentPreset as any} background={true} />
            
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

  // Mobile/Tablet layout (full screen with overlay menus)
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
          
          <Environment preset={environmentPreset as any} background={true} />
          
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
      
      {/* Mobile Menu - only show on mobile/tablet */}
      {(isMobile || isTablet) && <MobileMenu />}
    </div>
  )
}

export default App