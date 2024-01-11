import { Text } from "@react-three/drei"
import {
  RigidBody,
  RapierRigidBody,
  BallCollider,
  vec3,
  Vector3Object,
} from "@react-three/rapier"
import { useRef, useEffect, useState, useCallback } from "react"
import { useSpring, animated } from "@react-spring/three"

export default function Bubble({
  density = 0.000001,
  radius = 1,
  text = "hi",
  position,
  id,
  answer,
  clickHandler,
}: {
  density?: number
  text?: string
  radius?: number
  position: Vector3Object
  id: number
  answer:boolean,
  clickHandler: (id: number, position:Vector3Object, radius:number, answer:boolean) => void
}) {
  const rB = useRef<RapierRigidBody>(null)
  const [hovered, setHovered] = useState<boolean>(false)

  const [{ scale }, api] = useSpring(
    () => ({
      scale: 1,
      config: {
        mass: 1,
        tension: 270,
        friction: 1,
        clamp: true,
      },
    }),
    []
  )

  useEffect(() => {
    if (rB.current) {
      rB.current.setEnabledTranslations(true, true, false, false)
      rB.current.lockRotations(true, false)
      rB.current.setTranslation(vec3(position), false)
      rB.current.setLinvel(
        {
          x: Math.random() < 0.5 ? -1.2 : 1.2,
          y: Math.random() < 0.5 ? -1.2 : 1.2,
          z: 0,
        },
        true
      )
    }
  }, [position])

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "default"
  }, [hovered])

  const handleForce = useCallback(
    ({ totalForceMagnitude }: { totalForceMagnitude: number }) => {
      api.start({
        scale: 0.96 - totalForceMagnitude * 0.001,
        onRest: (_res, cntr) => cntr.start({ scale: 1 }),
      })
    },
    [api]
  )

  const handleClick = useCallback(() => {
    api.start({
      to: [{ scale: 0.5 }, { scale: 1.1 }],
      onRest: () => clickHandler(id, rB.current!.translation(), radius, answer),
      config: { friction: 10, mass: 0.5, tension: 500 },
    })
  }, [api, clickHandler, id, radius, answer])

  return (
    <>
      <RigidBody
        ref={rB}
        linearDamping={0.2}
        position={[-100,0,-1]}
        onSleep={() =>
          rB.current?.setLinvel(
            {
              x: Math.random() < 0.5 ? -1.2 : 1.2,
              y: Math.random() < 0.5 ? -1.2 : 1.2,
              z: 0,
            },
            true
          )
        }
        // onCollisionEnter={() => setBumped(true)}
        // onCollisionExit={() => setBumped(false)}
        onContactForce={handleForce}
      >
        <BallCollider args={[radius]} restitution={1} density={density}>
          <animated.mesh
            scale={scale.to((x) => [x, x, 0.25])}
            onPointerOver={() => setHovered(true)}
            onPointerLeave={() => {
              setHovered(false)
            }}
            onPointerOut={() => {
              setHovered(false)
            }}
            onClick={handleClick}
          >
            <sphereGeometry args={[radius, 64, 32]} />
            <meshPhysicalMaterial
              transparent
              color="white"
              depthWrite={false}
              transmission={1}
              thickness={0.001}
              roughness={0.15}
              metalness={0}
              ior={1.5}
              specularColor="white"
              specularIntensity={1}
              reflectivity={1}
            />
          </animated.mesh>
          <Text
            maxWidth={radius}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            whiteSpace="overflowWrap"
            overflowWrap="normal"
            fontSize={0.25}
            color="black"
          >
            {text}
          </Text>
        </BallCollider>
      </RigidBody>
    </>
  )
}
