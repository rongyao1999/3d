import { useState, useEffect } from 'react'
import { MousePointer2, Move, ZoomIn } from 'lucide-react'

export function Overlay() {
  const [showTitle, setShowTitle] = useState(true)
  const [showHints, setShowHints] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false)
    }, 4000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0f] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </div>
      
      <div 
        className={`fixed inset-0 flex items-center justify-center z-30 pointer-events-none transition-all duration-1000 ${
          showTitle ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center animate-float">
          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-wider mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-400 bg-clip-text text-transparent">
              SOLAR SYSTEM
            </span>
          </h1>
          <p className="text-gray-400 text-lg tracking-widest">
            探索太阳系的奥秘
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-cyan-400/60 text-sm">
            <span className="animate-pulse">●</span>
            <span>正在加载...</span>
          </div>
        </div>
      </div>
      
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          showHints ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="glass-panel p-4 space-y-3">
          <h4 className="text-xs text-gray-400 font-medium tracking-wider">交互提示</h4>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 text-gray-300">
              <MousePointer2 size={14} className="text-cyan-400" />
              <span>移动鼠标影响星云</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Move size={14} className="text-purple-400" />
              <span>拖拽旋转视角</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <ZoomIn size={14} className="text-pink-400" />
              <span>滚轮缩放场景</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowHints(false)}
            className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            隐藏提示
          </button>
        </div>
      </div>
      
      <div className="fixed top-6 right-6 z-50">
        <div className="glass-panel px-4 py-2">
          <span className="text-xs text-gray-400 tracking-wider">
            THREE.JS <span className="text-yellow-400">☀</span> SOLAR SYSTEM
          </span>
        </div>
      </div>
    </>
  )
}
