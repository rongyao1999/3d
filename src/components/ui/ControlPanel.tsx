import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Sparkles, Eye, EyeOff, Palette, Zap, Rocket } from 'lucide-react'

export function ControlPanel() {
  const {
    showParticles,
    showPlanets,
    showSpacecrafts,
    isSpaceshipView,
    effectIntensity,
    colorScheme,
    toggleParticles,
    togglePlanets,
    toggleSpacecrafts,
    toggleSpaceshipView,
    setEffectIntensity,
    setColorScheme,
    triggerExplosion,
  } = useAppStore()
  
  const [isExpanded, setIsExpanded] = useState(true)
  
  const colorSchemes = [
    { id: 'cyber', name: '赛博', color: '#00ffff' },
    { id: 'neon', name: '霓虹', color: '#39ff14' },
    { id: 'aurora', name: '极光', color: '#00ff87' },
    { id: 'galaxy', name: '银河', color: '#0066cc' },
  ] as const
  
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className={`glass-panel p-4 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-auto'}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg hover:scale-110 transition-transform"
        >
          {isExpanded ? '−' : '+'}
        </button>
        
        {isExpanded && (
          <div className="space-y-4">
            <h3 className="font-display text-sm text-cyan-400 tracking-wider">控制面板</h3>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={toggleParticles}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  showParticles 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}
              >
                <Sparkles size={14} />
                星云
              </button>
              
              <button
                onClick={togglePlanets}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  showPlanets 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}
              >
                {showPlanets ? <Eye size={14} /> : <EyeOff size={14} />}
                行星
              </button>
              
              <button
                onClick={toggleSpacecrafts}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  showSpacecrafts 
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' 
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}
              >
                <Rocket size={14} />
                飞船
              </button>
              
              <button
                onClick={toggleSpaceshipView}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSpaceshipView 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}
              >
                <Rocket size={14} />
                飞船视角
              </button>
            </div>
            
            <div>
              <label className="text-xs text-gray-400 mb-2 block flex items-center gap-2">
                <Zap size={12} />
                效果强度: {effectIntensity.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={effectIntensity}
                onChange={(e) => setEffectIntensity(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400 mb-2 block flex items-center gap-2">
                <Palette size={12} />
                配色方案
              </label>
              <div className="flex gap-1 flex-wrap">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => setColorScheme(scheme.id)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      colorScheme === scheme.id
                        ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0f] opacity-100'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ 
                      backgroundColor: `${scheme.color}20`,
                      color: scheme.color,
                      boxShadow: colorScheme === scheme.id ? `0 0 10px ${scheme.color}50` : 'none',
                    }}
                  >
                    {scheme.name}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => {
                triggerExplosion()
                setTimeout(() => useAppStore.setState({ isExploding: false }), 2000)
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 text-xs font-medium border border-pink-500/30 hover:border-pink-500/60 transition-all hover:shadow-lg hover:shadow-pink-500/20"
            >
              <Sparkles size={14} />
              触发爆炸
            </button>
          </div>
        )}
        
        {!isExpanded && (
          <div className="flex items-center justify-center">
            <Sparkles className="text-cyan-400" size={20} />
          </div>
        )}
      </div>
    </div>
  )
}
