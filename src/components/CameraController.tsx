import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'

export function CameraController() {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const { mousePosition, isExploding, isSpaceshipView } = useAppStore()
  
  useEffect(() => {
    camera.position.set(0, 0, 20)
  }, [camera])
  
  useFrame((state) => {
    if (isExploding && controlsRef.current) {
      const targetDistance = 35
      const currentDistance = camera.position.length()
      if (currentDistance < targetDistance) {
        camera.position.multiplyScalar(1.02)
      }
    }
    
    if (isSpaceshipView) {
      if (controlsRef.current) {
        controlsRef.current.enabled = false
      }
      
      const time = state.clock.elapsedTime
      const cycleTime = 20
      const t = (time % cycleTime) / cycleTime
      
      const startPos = new THREE.Vector3(-50, 5, -30)
      const midPos = new THREE.Vector3(0, 0, 0)
      const endPos = new THREE.Vector3(50, -5, 30)
      
      let currentPos: THREE.Vector3
      if (t < 0.5) {
        const tHalf = t * 2
        currentPos = startPos.clone().lerp(midPos, tHalf)
      } else {
        const tHalf = (t - 0.5) * 2
        currentPos = midPos.clone().lerp(endPos, tHalf)
      }
      
      camera.position.copy(currentPos)
      
      const lookAtPos = new THREE.Vector3(0, 0, 0)
      if (t < 0.5) {
        const tHalf = t * 2
        const lookAtMid = startPos.clone().lerp(midPos, tHalf + 0.05)
        camera.lookAt(lookAtMid)
      } else {
        const tHalf = (t - 0.5) * 2
        const lookAtMid = midPos.clone().lerp(endPos, tHalf + 0.05)
        camera.lookAt(lookAtMid)
      }
      
      camera.rotation.x += Math.sin(time * 0.5) * 0.01
      camera.rotation.y += Math.cos(time * 0.3) * 0.01
    } else if (controlsRef.current) {
      controlsRef.current.enabled = true
    }
  })
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={5}
      maxDistance={50}
      enablePan={false}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
    />
  )
}
