import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useAppStore } from '@/store/useAppStore'
import { Vector2 } from 'three'

export function Effects() {
  const { effectIntensity, colorScheme } = useAppStore()
  
  const chromaticOffsets = {
    cyber: new Vector2(0.002 * effectIntensity, 0.002 * effectIntensity),
    neon: new Vector2(0.003 * effectIntensity, 0.003 * effectIntensity),
    aurora: new Vector2(0.0025 * effectIntensity, 0.0025 * effectIntensity),
    galaxy: new Vector2(0.0015 * effectIntensity, 0.0015 * effectIntensity),
  }
  
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5 * effectIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaticOffsets[colorScheme]}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette
        offset={0.3}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        opacity={0.02}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  )
}
