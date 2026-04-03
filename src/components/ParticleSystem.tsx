import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'

const colorSchemes = {
  cyber: [new THREE.Color('#00ffff'), new THREE.Color('#8b5cf6'), new THREE.Color('#ff006e')],
  neon: [new THREE.Color('#39ff14'), new THREE.Color('#ff6ec7'), new THREE.Color('#ffff00')],
  aurora: [new THREE.Color('#00ff87'), new THREE.Color('#60efff'), new THREE.Color('#ff00ff')],
  galaxy: [
    new THREE.Color('#003366'), 
    new THREE.Color('#0066cc'), 
    new THREE.Color('#0099ff'), 
    new THREE.Color('#66ccff'),
    new THREE.Color('#ffffff'),
    new THREE.Color('#ffcc99'),
  ],
}

export function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null)
  const { particleCount, showParticles, colorScheme, mousePosition, isExploding } = useAppStore()
  
  const { positions, colors, sizes, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    
    const scheme = colorScheme === 'galaxy' ? colorSchemes.galaxy : colorSchemes[colorScheme]
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      const radius = 60
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = radius * Math.cbrt(Math.random())
      
      const clusterBias = Math.random()
      let finalX, finalY, finalZ
      
      if (clusterBias < 0.3) {
        const clusterRadius = 15
        finalX = (Math.random() - 0.5) * clusterRadius
        finalY = (Math.random() - 0.5) * clusterRadius
        finalZ = (Math.random() - 0.5) * clusterRadius
      } else if (clusterBias < 0.6) {
        const armAngle = (i % 4) * (Math.PI / 2) + Math.random() * 0.5
        const armRadius = 10 + Math.random() * 30
        finalX = Math.cos(armAngle) * armRadius + (Math.random() - 0.5) * 5
        finalY = (Math.random() - 0.5) * 3
        finalZ = Math.sin(armAngle) * armRadius + (Math.random() - 0.5) * 5
      } else {
        finalX = r * Math.sin(phi) * Math.cos(theta)
        finalY = r * Math.sin(phi) * Math.sin(theta)
        finalZ = r * Math.cos(phi)
      }
      
      positions[i3] = finalX
      positions[i3 + 1] = finalY
      positions[i3 + 2] = finalZ
      
      const color = scheme[Math.floor(Math.random() * scheme.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      
      const size = 0.2 + Math.random() * 0.8 + (1 - r / radius) * 0.5
      sizes[i] = size
      
      const speed = 0.0005 + Math.random() * 0.001
      velocities[i3] = (Math.random() - 0.5) * speed
      velocities[i3 + 1] = (Math.random() - 0.5) * speed * 0.5
      velocities[i3 + 2] = (Math.random() - 0.5) * speed
    }
    
    return { positions, colors, sizes, velocities }
  }, [particleCount, colorScheme])
  
  const velocitiesRef = useRef(velocities)
  
  useFrame((state, delta) => {
    if (!pointsRef.current || !showParticles) return
    
    const geometry = pointsRef.current.geometry
    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute
    const positions = positionAttribute.array as Float32Array
    
    const time = state.clock.elapsedTime
    const mouse = mousePosition
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      let x = positions[i3]
      let y = positions[i3 + 1]
      let z = positions[i3 + 2]
      
      if (isExploding) {
        const dir = new THREE.Vector3(x, y, z).normalize()
        positions[i3] += dir.x * 1.0
        positions[i3 + 1] += dir.y * 1.0
        positions[i3 + 2] += dir.z * 1.0
      } else {
        positions[i3] += velocitiesRef.current[i3]
        positions[i3 + 1] += velocitiesRef.current[i3 + 1]
        positions[i3 + 2] += velocitiesRef.current[i3 + 2]
        
        const dist = Math.sqrt(x * x + y * y + z * z)
        if (dist > 70) {
          const scale = 0.85
          positions[i3] *= scale
          positions[i3 + 1] *= scale
          positions[i3 + 2] *= scale
        }
        
        const mouseInfluence = 0.0004
        positions[i3] += (mouse.x * 20 - x) * mouseInfluence
        positions[i3 + 1] += (mouse.y * 20 - y) * mouseInfluence * 0.5
        positions[i3 + 2] += -x * 0.00003
      }
    }
    
    positionAttribute.needsUpdate = true
  })
  
  if (!showParticles) return null
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={1.0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
