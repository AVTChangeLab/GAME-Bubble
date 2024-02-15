import { Vector3, Euler } from "three"
import type { Group } from "three"
import { Instance, Instances } from "@react-three/drei"
import { useRef, memo } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated } from "@react-spring/three"
import { Vector3Object } from "@react-three/rapier"

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
  //   const instancedMeshRef = useRef<InstancedMesh | null>(null)
  //   useEffect(() => {
  //     // Set positions
  //     if (instancedMeshRef.current) {
  //       for (let i = 0; i < count; i++) {
  //         const angle = (i/count * 360) * Math.PI/180
  //         const radius = 1
  //         const x = Math.cos(angle) * radius
  //         const y = Math.sin(angle) * radius
  //         temp.position.set(x, y, -1)
  //         temp.scale.set(0.1,0.1,1)
  //         temp.updateMatrix()
  //         instancedMeshRef.current.setMatrixAt(i, temp.matrix)
  //       }
  //       // Update the instance
  //       instancedMeshRef.current.instanceMatrix.needsUpdate = true
  //     }
  //   }, [count, temp])
  //   return <instancedMesh ref={instancedMeshRef} args={[box, pbr, count]} />
  // const popDataRef = useRef(null)
  // useEffect(() => {

  // },[])

  const { opacity } = useSpring({
    from: { opacity: 0.5 },
    to: { opacity: 0 },
    delay: 300,
    config: {
      mass: 20,
      tension: 120,
      friction: 10,
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

  useFrame((_state, delta) => {

    if (count < 8) {
        t = delta * rand * 1.5
    }
    else{
        t = delta * 0.9
    }
      if (ref.current) {
        ref.current.translateX(t)
      }
      count++
  })

  return (
    <group>
      <Instance
        ref={ref}
        position={position}
        scale={scale}
        rotation={rotation}
      />
    </group>
  )
}
