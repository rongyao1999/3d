import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cone, Cylinder, Sparkles, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'

interface PlanetProps {
  name: string
  radius: number
  distance: number
  color: string
  orbitSpeed: number
  rotationSpeed: number
  hasRing?: boolean
  ringColor?: string
  emissive?: string
  emissiveIntensity?: number
  glowIntensity?: number
}

function Planet({ 
  name, 
  radius, 
  distance, 
  color, 
  orbitSpeed, 
  rotationSpeed,
  hasRing = false,
  ringColor = '#a08060',
  emissive,
  emissiveIntensity = 0.3,
  glowIntensity = 1.0
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    
    if (!groupRef.current) return
    
    groupRef.current.rotation.y = time * orbitSpeed * 0.5
    
    if (planetRef.current) {
      planetRef.current.rotation.y = time * rotationSpeed * 0.5
    }
  })
  
  return (
    <group ref={groupRef}>
      <group position={[distance, 0, 0]}>
        <Sphere ref={planetRef} args={[radius, 32, 32]}>
          <meshStandardMaterial 
            color={color}
            emissive={emissive || color}
            emissiveIntensity={emissiveIntensity * glowIntensity}
            metalness={0.3}
            roughness={0.7}
          />
        </Sphere>
        
        <Sphere args={[radius * 1.1, 16, 16]}>
          <meshBasicMaterial 
            color={emissive || color}
            transparent 
            opacity={0.3 * glowIntensity}
            side={THREE.BackSide}
          />
        </Sphere>
        
        <Sphere args={[radius * 1.3, 16, 16]}>
          <meshBasicMaterial 
            color={emissive || color}
            transparent 
            opacity={0.15 * glowIntensity}
            side={THREE.BackSide}
          />
        </Sphere>
        
        {hasRing && (
          <Cone args={[radius * 1.4, radius * 2.2, 64]} rotation={[Math.PI / 2.5, 0, 0]}>
            <meshStandardMaterial 
              color={ringColor}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              metalness={0.1}
              roughness={0.9}
            />
          </Cone>
        )}
      </group>
    </group>
  )
}

function Sun() {
  const sunRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <group>
      <Sphere ref={sunRef} args={[2, 64, 64]}>
        <meshBasicMaterial color="#ffaa00" />
      </Sphere>
      
      <pointLight color="#ffaa00" intensity={50} distance={100} decay={2} />
      <pointLight color="#ff6600" intensity={30} distance={80} decay={2} />
      
      <Sphere args={[2.3, 32, 32]}>
        <meshBasicMaterial 
          color="#ff6600" 
          transparent 
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>
      <Sphere args={[2.6, 32, 32]}>
        <meshBasicMaterial 
          color="#ff4400" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  )
}

function Earth() {
  const groupRef = useRef<THREE.Group>(null)
  const earthRef = useRef<THREE.Mesh>(null)
  const moonRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.25
    }
    
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 1
    }
    
    if (moonRef.current) {
      moonRef.current.rotation.y = time * 1
    }
  })
  
  return (
    <group ref={groupRef}>
      <group position={[10, 0, 0]}>
        <Sphere ref={earthRef} args={[0.4, 32, 32]}>
          <meshStandardMaterial 
            color="#4488ff"
            emissive="#112244"
            emissiveIntensity={0.5}
            metalness={0.1}
            roughness={0.8}
          />
        </Sphere>
        
        <Sphere args={[0.44, 16, 16]}>
          <meshBasicMaterial 
            color="#4488ff"
            transparent 
            opacity={0.3}
            side={THREE.BackSide}
          />
        </Sphere>
        
        <Sphere args={[0.52, 16, 16]}>
          <meshBasicMaterial 
            color="#4488ff"
            transparent 
            opacity={0.15}
            side={THREE.BackSide}
          />
        </Sphere>
        
        <group ref={moonRef}>
          <Sphere args={[0.1, 16, 16]} position={[0.8, 0, 0]}>
            <meshStandardMaterial 
              color="#aaaaaa"
              emissive="#888888"
              emissiveIntensity={0.3}
              metalness={0.1}
              roughness={0.9}
            />
            
            <Sphere args={[0.11, 8, 8]}>
              <meshBasicMaterial 
                color="#aaaaaa"
                transparent 
                opacity={0.2}
                side={THREE.BackSide}
              />
            </Sphere>
          </Sphere>
        </group>
      </group>
    </group>
  )
}

export function SolarSystem() {
  const { showPlanets } = useAppStore()
  
  if (!showPlanets) return null
  
  return (
    <group>
      <Sun />
      
      <Planet 
        name="Mercury" 
        radius={0.15} 
        distance={4} 
        color="#b5b5b5" 
        orbitSpeed={1.6} 
        rotationSpeed={0.5}
        emissive="#b5b5b5"
        glowIntensity={0.8}
      />
      
      <Planet 
        name="Venus" 
        radius={0.35} 
        distance={6} 
        color="#e6c87a" 
        orbitSpeed={1.2} 
        rotationSpeed={0.3}
        emissive="#e6c87a"
        glowIntensity={1.0}
      />
      
      <Earth />
      
      <Planet 
        name="Mars" 
        radius={0.25} 
        distance={13} 
        color="#c1440e" 
        orbitSpeed={0.4} 
        rotationSpeed={0.9}
        emissive="#c1440e"
        glowIntensity={1.2}
      />
      
      <Planet 
        name="Jupiter" 
        radius={1.2} 
        distance={18} 
        color="#d4a574" 
        orbitSpeed={0.2} 
        rotationSpeed={3}
        emissive="#d4a574"
        glowIntensity={1.5}
      />
      
      <Planet 
        name="Saturn" 
        radius={1} 
        distance={24} 
        color="#c9b896" 
        orbitSpeed={0.15} 
        rotationSpeed={2.5}
        hasRing={true}
        ringColor="#a09080"
        emissive="#c9b896"
        glowIntensity={1.3}
      />
      
      <Planet 
        name="Uranus" 
        radius={0.6} 
        distance={30} 
        color="#b5e3e3" 
        orbitSpeed={0.1} 
        rotationSpeed={1.5}
        emissive="#b5e3e3"
        glowIntensity={1.1}
      />
      
      <Planet 
        name="Neptune" 
        radius={0.55} 
        distance={36} 
        color="#4b70dd" 
        orbitSpeed={0.08} 
        rotationSpeed={1.3}
        emissive="#4b70dd"
        glowIntensity={1.4}
      />
    </group>
  )
}
