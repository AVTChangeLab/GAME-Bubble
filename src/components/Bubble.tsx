import { Text, useTexture } from "@react-three/drei"
import {
  RigidBody,
  RapierRigidBody,
  BallCollider,
  vec3,
  Vector3Object,
} from "@react-three/rapier"
import { Vector2 } from "three"
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
  fontColor,
  fontSize,
  font,
  img,
  color,
}: {
  density?: number
  text?: string
  radius?: number
  position: Vector3Object
  id: number
  answer: boolean
  fontColor: string
  fontSize: number
  font: string
  img: string | null
  color: string
  clickHandler: (
    id: number,
    position: Vector3Object,
    radius: number,
    color: string,
    answer: boolean
  ) => void
}) {

  const rB = useRef<RapierRigidBody>(null)
  const [hovered, setHovered] = useState<boolean>(false)
  
  const url = img ? new URL(img, import.meta.url).href : new URL('/fallback.png', import.meta.url).href
  
  const texture = useTexture(url)
  texture.repeat = new Vector2(2.5,1.25)
  texture.center = new Vector2(0.06,0.5)

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
      to: [{ scale: 0.8 }, { scale: 1.1 }],
      onRest: () => clickHandler(id, rB.current!.translation(), radius, color, answer),
      config: { friction: 10, mass: 0.5, tension: 500 },
    })
  }, [api, clickHandler, id, radius, color, answer])

  return (
    <>
      <RigidBody
        ref={rB}
        linearDamping={0}
        position={[-100, 0, -1]}
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
              color={color}
              depthWrite={false}
              transmission={1}
              thickness={0.001}
              roughness={0.15}
              metalness={0}
              ior={1.5}
              specularColor="white"
              specularIntensity={1}
              reflectivity={1}
              map={texture ? texture : null}
            />
          </animated.mesh>
          <Text
            font={font}
            maxWidth={radius}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            whiteSpace="overflowWrap"
            overflowWrap="normal"
            fontSize={fontSize}
            color={fontColor}
          >
            {text}
          </Text>
        </BallCollider>
      </RigidBody>
    </>
  )
}
