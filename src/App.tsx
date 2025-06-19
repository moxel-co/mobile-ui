import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Mesh } from 'three'
import MobileMenu from './components/MobileMenu'
import FloatingUI from './components/FloatingUI'
import { useStore } from './store/useStore'

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
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  // Set up activity listeners for the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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

    // Add event listeners to canvas
    events.forEach(event => {
      canvas.addEventListener(event, resetActivityTimer, { passive: true })
    })

    // Start initial timer
    resetActivityTimer()

    // Cleanup
    return () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current)
      }
      events.forEach(event => {
        canvas.removeEventListener(event, resetActivityTimer)
      })
    }
  }, [])

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

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      background: '#1a1a1a',
      overflow: 'hidden'
    }}>
      {/* 3D Scene Background */}
      <Canvas
        ref={canvasRef}
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a1a1a', 1)
        }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
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
      
      {/* Floating UI with conditional visibility */}
      <FloatingUI 
        visible={showFloatingUI}
        onResetView={handleResetView}
        onShowcaseView={handleShowcaseView}
        onShareSocial={handleShareSocial}
      />
      
      {/* Mobile Menu with UI Overlay */}
      <MobileMenu />
    </div>
  )
}

export default App