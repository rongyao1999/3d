import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cone, Cylinder, Sparkles, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'

function Spaceship({ index, delay }: { index: number; delay: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const [active, setActive] = useState(false)
  
  const seed = useMemo(() => {
    const rand1 = Math.random()
    const rand2 = Math.random()
    const rand3 = Math.random()
    const rand4 = Math.random()
    return { rand1, rand2, rand3, rand4 }
  }, [])
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime + delay
    
    if (!groupRef.current) return
    
    const cycleTime = 15 + seed.rand1 * 10
    const t = (time % cycleTime) / cycleTime
    
    if (t < 0.1 && !active) {
      setActive(true)
    } else if (t > 0.9) {
      setActive(false)
    }
    
    if (t > 0.1 && t < 0.9) {
      const movementT = (t - 0.1) / 0.8
      const startX = -40 + seed.rand2 * 20
      const endX = 40 - seed.rand2 * 20
      const startZ = -40 + seed.rand3 * 20
      const endZ = 40 - seed.rand3 * 20
      const startY = -10 + seed.rand4 * 20
      const endY = 10 - seed.rand4 * 20
      
      const x = THREE.MathUtils.lerp(startX, endX, movementT)
      const z = THREE.MathUtils.lerp(startZ, endZ, movementT)
      const y = THREE.MathUtils.lerp(startY, endY, movementT)
      
      const dir = new THREE.Vector3(endX - startX, endY - startY, endZ - startZ).normalize()
      const quat = new THREE.Quaternion()
      quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir)
      
      groupRef.current.position.set(x, y, z)
      groupRef.current.setRotationFromQuaternion(quat)
      
      const scale = active ? 1 : 0
      groupRef.current.scale.setScalar(scale)
    }
  })
  
  const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff6600']
  const color = colors[index % colors.length]
  
  return (
    <group ref={groupRef}>
      <group scale={[0.3, 0.3, 1]}>
        <Cone args={[0.5, 2, 16]} position={[0, 1, 0]}>
          <meshStandardMaterial 
            color={color}
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </Cone>
        
        <Cylinder args={[0.4, 0.5, 1.5, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#333333"
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>
        
        <Cone args={[0.3, 0.5, 8]} position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.8}
          />
        </Cone>
        
        <Cone args={[0.2, 0.8, 8]} position={[0, -1.4, 0]} rotation={[Math.PI, 0, 0]}>
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.6}
          />
        </Cone>
      </group>
      
      <Sparkles 
        count={20}
        scale={10}
        size={0.2}
        speed={0.4}
        color={color}
        opacity={0.5}
      />
    </group>
  )
}

function Meteor({ index }: { index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const [active, setActive] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  
  const seed = useMemo(() => {
    const rand1 = Math.random() * 20 + 5
    const rand2 = Math.random() * 10 - 5
    const rand3 = Math.random() * 30 + 20
    const rand4 = Math.random() * 60 + 30
    return { rand1, rand2, rand3, rand4 }
  }, [])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (!groupRef.current) return
    
    if (startTime === null) {
      const interval = 10 + index * 2
      if (time % interval < 0.1 && !active) {
        setActive(true)
        setStartTime(time)
      }
      return
    }
    
    const elapsed = time - startTime
    const duration = 2
    
    if (elapsed > duration) {
      setActive(false)
      setStartTime(null)
      return
    }
    
    const t = elapsed / duration
    const startX = seed.rand1
    const startY = seed.rand2 + 30
    const startZ = seed.rand3
    const endX = -seed.rand1 * 1.5
    const endY = -20
    const endZ = -seed.rand3 * 1.5
    
    const x = THREE.MathUtils.lerp(startX, endX, t)
    const y = THREE.MathUtils.lerp(startY, endY, t)
    const z = THREE.MathUtils.lerp(startZ, endZ, t)
    
    const scale = active ? 1 : 0
    groupRef.current.position.set(x, y, z)
    groupRef.current.scale.setScalar(scale)
    
    const dir = new THREE.Vector3(endX - startX, endY - startY, endZ - startZ).normalize()
    const quat = new THREE.Quaternion()
    quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir)
    groupRef.current.setRotationFromQuaternion(quat)
  })
  
  const colors = ['#ffffff', '#ffffaa', '#ffaa00', '#ff6600']
  const color = colors[index % colors.length]
  
  return (
    <group ref={groupRef}>
      <Cone args={[0.15, 0.8, 8]} position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.9}
        />
      </Cone>
      
      <Cone args={[0.1, 1.5, 8]} position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.4}
        />
      </Cone>
      
      <Sphere args={[0.12, 8, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={1}
        />
      </Sphere>
      
      <Sparkles 
        count={15}
        scale={5}
        size={0.15}
        speed={0.8}
        color={color}
        opacity={0.6}
      />
    </group>
  )
}

export function SpaceObjects() {
  const { showSpacecrafts } = useAppStore()
  
  if (!showSpacecrafts) return null
  
  const spaceships = useMemo(() => Array.from({ length: 5 }, (_, i) => i), [])
  const meteors = useMemo(() => Array.from({ length: 8 }, (_, i) => i), [])
  
  return (
    <group>
      {spaceships.map((i) => (
        <Spaceship key={`spaceship-${i}`} index={i} delay={i * 3} />
      ))}
      
      {meteors.map((i) => (
        <Meteor key={`meteor-${i}`} index={i} />
      ))}
    </group>
  )
}
