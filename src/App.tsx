import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Mesh } from 'three'
import MobileUI from './components/MobileUI'
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
        
        <Environment preset="studio" background={false} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={3 * Math.PI / 4}
        />
      </Canvas>
      
      {/* Mobile UI Overlay */}
      <MobileUI />
    </div>
  )
}

export default App