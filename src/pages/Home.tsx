import { useEffect, useCallback } from 'react'
import { Scene } from '@/components/Scene'
import { ControlPanel } from '@/components/ui/ControlPanel'
import { Overlay } from '@/components/ui/Overlay'
import { useAppStore } from '@/store/useAppStore'

export default function Home() {
  const setMousePosition = useAppStore((state) => state.setMousePosition)
  
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    setMousePosition({ x, y })
  }, [setMousePosition])
  
  const handleClick = useCallback(() => {
    const store = useAppStore.getState()
    store.triggerExplosion()
    setTimeout(() => {
      useAppStore.setState({ isExploding: false })
    }, 2000)
  }, [])
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [handleMouseMove, handleClick])
  
  return (
    <main className="w-full h-full relative">
      <Scene />
      <Overlay />
      <ControlPanel />
    </main>
  )
}
