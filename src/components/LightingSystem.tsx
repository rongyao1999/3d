import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'

export function LightingSystem() {
  const light1Ref = useRef<THREE.PointLight>(null)
  const light2Ref = useRef<THREE.PointLight>(null)
  const light3Ref = useRef<THREE.PointLight>(null)
  const spotLightRef = useRef<THREE.SpotLight>(null)
  
  const { colorScheme, mousePosition, effectIntensity } = useAppStore()
  
  const colors = {
    cyber: {
      light1: '#00ffff',
      light2: '#8b5cf6',
      light3: '#ff006e',
    },
    neon: {
      light1: '#39ff14',
      light2: '#ff6ec7',
      light3: '#ffff00',
    },
    aurora: {
      light1: '#00ff87',
      light2: '#60efff',
      light3: '#ff00ff',
    },
    galaxy: {
      light1: '#003366',
      light2: '#0066cc',
      light3: '#66ccff',
    },
  }
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(time * 0.5) * 8
      light1Ref.current.position.z = Math.cos(time * 0.5) * 8
      light1Ref.current.position.y = Math.sin(time * 0.3) * 3
    }
    
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.sin(time * 0.7 + 2) * 10
      light2Ref.current.position.z = Math.cos(time * 0.7 + 2) * 10
      light2Ref.current.position.y = Math.cos(time * 0.4) * 4
    }
    
    if (light3Ref.current) {
      light3Ref.current.position.x = Math.sin(time * 0.3 + 4) * 6
      light3Ref.current.position.z = Math.cos(time * 0.3 + 4) * 6
      light3Ref.current.position.y = Math.sin(time * 0.5 + 1) * 2
    }
    
    if (spotLightRef.current) {
      spotLightRef.current.position.x = mousePosition.x * 15
      spotLightRef.current.position.y = mousePosition.y * 15 + 10
    }
  })
  
  const scheme = colors[colorScheme]
  const intensity = 2 * effectIntensity
  
  return (
    <>
      <ambientLight intensity={0.1} />
      
      <pointLight
        ref={light1Ref}
        color={scheme.light1}
        intensity={intensity}
        distance={30}
        decay={2}
      />
      
      <pointLight
        ref={light2Ref}
        color={scheme.light2}
        intensity={intensity}
        distance={35}
        decay={2}
      />
      
      <pointLight
        ref={light3Ref}
        color={scheme.light3}
        intensity={intensity * 0.8}
        distance={25}
        decay={2}
      />
      
      <spotLight
        ref={spotLightRef}
        color={colorScheme === 'galaxy' ? '#66ccff' : '#ffffff'}
        intensity={1.5 * effectIntensity}
        angle={0.3}
        penumbra={0.8}
        position={[0, 10, 10]}
        distance={50}
        decay={1}
      />
    </>
  )
}
