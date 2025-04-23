import { LottieLoader } from "three/addons/loaders/LottieLoader.js"
import { useEffect, useState } from "react"
import { type CanvasTexture } from "three"
import { type Vector3Object } from "@react-three/rapier"

interface LottieLoaderProps {
  url: string
  quality: number
}

interface LottieProps {
  url: string
  position?: Vector3Object
  scale?: number
}

export const useLottieLoader = ({ url, quality }: LottieLoaderProps) => {
  const [texture, setTexture] = useState<CanvasTexture>()

  useEffect(() => {
    const loader = new LottieLoader()
    loader.setQuality(quality)
    loader.load(url, function (texture) {
      setTexture(texture)
    })
  }, [url, quality])

  return texture
}

export default function Lottie({
  url,
  position = { x: 0, y: 0, z: 0 },
  scale = 1,
}: LottieProps) {
  const texture = useLottieLoader({ url, quality: 1 })

  if (!texture) return null
  return (
    <mesh position={[position.x, position.y, 0]}>
      <planeGeometry args={[3 * scale, 3 * scale]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent />
    </mesh>
  )
}
