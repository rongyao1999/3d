import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { ParticleSystem } from './ParticleSystem'
import { SolarSystem } from './SolarSystem'
import { SpaceObjects } from './SpaceObjects'
import { LightingSystem } from './LightingSystem'
import { Effects } from './Effects'
import { CameraController } from './CameraController'

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#00ffff" wireframe />
    </mesh>
  )
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 30, 50], fov: 60 }}
      gl={{ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#0a0a0f']} />
      
      <Suspense fallback={<LoadingFallback />}>
        <ParticleSystem />
        <SolarSystem />
        <SpaceObjects />
        <LightingSystem />
        <Effects />
        <CameraController />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
