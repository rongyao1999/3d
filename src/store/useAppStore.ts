import { create } from 'zustand'

interface AppState {
  particleCount: number
  showParticles: boolean
  showPlanets: boolean
  showSpacecrafts: boolean
  effectIntensity: number
  colorScheme: 'cyber' | 'neon' | 'aurora' | 'galaxy'
  isExploding: boolean
  isSpaceshipView: boolean
  mousePosition: { x: number; y: number }
  setParticleCount: (count: number) => void
  toggleParticles: () => void
  togglePlanets: () => void
  toggleSpacecrafts: () => void
  toggleSpaceshipView: () => void
  setEffectIntensity: (intensity: number) => void
  setColorScheme: (scheme: 'cyber' | 'neon' | 'aurora' | 'galaxy') => void
  triggerExplosion: () => void
  setMousePosition: (pos: { x: number; y: number }) => void
}

export const useAppStore = create<AppState>((set) => ({
  particleCount: 8000,
  showParticles: true,
  showPlanets: true,
  showSpacecrafts: true,
  effectIntensity: 1.0,
  colorScheme: 'galaxy',
  isExploding: false,
  isSpaceshipView: false,
  mousePosition: { x: 0, y: 0 },
  setParticleCount: (count) => set({ particleCount: count }),
  toggleParticles: () => set((state) => ({ showParticles: !state.showParticles })),
  togglePlanets: () => set((state) => ({ showPlanets: !state.showPlanets })),
  toggleSpacecrafts: () => set((state) => ({ showSpacecrafts: !state.showSpacecrafts })),
  toggleSpaceshipView: () => set((state) => ({ isSpaceshipView: !state.isSpaceshipView })),
  setEffectIntensity: (intensity) => set({ effectIntensity: intensity }),
  setColorScheme: (scheme) => set({ colorScheme: scheme }),
  triggerExplosion: () => set({ isExploding: true }),
  setMousePosition: (pos) => set({ mousePosition: pos }),
}))
