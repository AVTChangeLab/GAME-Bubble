import { Vector3, Euler } from "three"
import type { Group } from "three"
import { Instance, Instances } from "@react-three/drei"
import { useRef, useContext, memo } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated } from "@react-spring/three"
import { Vector3Object } from "@react-three/rapier"
import { ConfigContext } from "./ConfigContext"

export type PopT = {
  position: Vector3Object
  radius: number
  color: string
}

export const Pop = memo(function ({
  data = { position: { x: 0, y: 0, z: -1 }, radius: 1, color: "white" },
  disable,
}: {
  data?: PopT
  disable: () => void
}) {
  const { opacity } = useSpring({
    from: { opacity: 0.8 },
    to: { opacity: 0 },
    delay: 300,
    config: {
      mass: 20,
      tension: 300,
      friction: 1,
      clamp: true,
    },
    onRest: () => disable(),
  })

  const particles = Array.from({ length: 20 }, (_v, k) => {
    const angle = ((k / 20) * 360 * Math.PI) / 180
    const radius = data.radius
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return {
      position: new Vector3(x, y, -1),
      scale: Math.random() * 0.2 + 0.01,
      rotation: new Euler(0, 0, angle),
    }
  })

  return (
    <Instances position={[data.position.x, data.position.y, -1]}>
      <circleGeometry args={[1, 16, 8]} />
      <animated.meshStandardMaterial
        transparent
        color={data.color}
        depthWrite={false}
        roughness={0.15}
        metalness={0}
        opacity={opacity}
        emissive={data.color}
        emissiveIntensity={0.5}
      />
      {particles.map((data, i) => (
        <InstancedPops key={i} {...data} />
      ))}
    </Instances>
  )
})

function InstancedPops({
  position,
  scale,
  rotation,
}: {
  position: Vector3
  scale: number
  rotation: Euler
}) {
  const ref = useRef<Group>(null)
  const rand = (Math.random() + 1) * 0.5
  let count = 0
  let t = 1

  const { config } = useContext(ConfigContext)

  useFrame((_state, delta) => {
    if (count < 8) {
      t = delta * rand * 1.5
    } else {
      t = delta * 0.9
    }
    if (ref.current) {
      ref.current.translateX(t)
    }
    count++
  })

  return (
    <group>
      {config ? (
        <Instance
          ref={ref}
          position={position}
          scale={scale}
          rotation={rotation}
        />
      ) : null}
    </group>
  )
}
