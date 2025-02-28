import { Text, useTexture } from "@react-three/drei"
import {
  RigidBody,
  RapierRigidBody,
  BallCollider,
  vec3,
  Vector3Object,
} from "@react-three/rapier"
import { useRef, useEffect, useState, useCallback } from "react"
import { useSpring, animated } from "@react-spring/three"
import font from "../assets/font/Inter.ttf"
import { useContext } from "react"
import { ConfigContext } from "./ConfigContext"

export default function Bubble({
  density = 0.000001,
  size = 1,
  text = "hi",
  position,
  id,
  points,
  clickHandler,
  fontColor,
  fontSize,
  color,
  opacity,
  fontWeight,
}: {
  density?: number
  text?: string
  size?: number
  position: Vector3Object
  id: number
  points: number
  fontColor: string
  fontSize: number
  color: string
  opacity: number
  fontWeight: number
  clickHandler: (
    id: number,
    position: Vector3Object,
    size: number,
    color: string,
    points: number,
    text: string,
  ) => void
}) {
  const { config } = useContext(ConfigContext)

  const rB = useRef<RapierRigidBody>(null)
  const [hovered, setHovered] = useState<boolean>(false)

  const fontProp = { "material-toneMapped": false }

  const texture = useTexture(config?.bubbleImage ?? "")

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
    [],
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
        true,
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
    [api],
  )

  const handleClick = useCallback(() => {
    api.start({
      to: [{ scale: 0.8 }, { scale: 1.1 }],
      onRest: () =>
        clickHandler(id, rB.current!.translation(), size, color, points, text),
      config: { friction: 10, mass: 0.5, tension: 500 },
    })
  }, [api, clickHandler, id, size, color, points, text])

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
            true,
          )
        }
        onContactForce={handleForce}
      >
        {config && (
          <BallCollider args={[size]} restitution={1} density={density}>
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
              <circleGeometry args={[size, 64, 32]} />
              <meshStandardMaterial
                transparent
                color={color}
                depthWrite={false}
                roughness={0.15}
                metalness={0}
                map={texture ? texture : null}
                emissive={color}
                emissiveIntensity={0.5}
                emissiveMap={texture ? texture : null}
                opacity={opacity}
              />
            </animated.mesh>
            <Text
              font={font}
              maxWidth={size}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              whiteSpace="overflowWrap"
              overflowWrap="normal"
              fontSize={fontSize}
              fontWeight={fontWeight}
              color={fontColor}
              position={[0, 0, 0.1]}
              {...fontProp}
            >
              {text}
            </Text>
          </BallCollider>
        )}
      </RigidBody>
    </>
  )
}
