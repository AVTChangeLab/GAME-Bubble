import { useThree } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function ViewportCollider() {
  const viewport = useThree((state) => state.viewport);

  return (
    <group>
      <RigidBody
        type="fixed"
        includeInvisible
        colliders="cuboid"
        restitution={1}
        friction={0}
        position={[0 - viewport.width * 0.5 - 0.4, 0, -1]}
        scale={[1, viewport.height, 1]}
      >
        <Box />
      </RigidBody>
      <RigidBody
        type="fixed"
        includeInvisible
        colliders="cuboid"
        restitution={1}
        friction={0}
        position={[0 + viewport.width * 0.5 + 0.4, 0, -1]}
        scale={[1, viewport.height, 1]}
      >
        <Box />
      </RigidBody>
      <RigidBody
        type="fixed"
        includeInvisible
        colliders="cuboid"
        restitution={1}
        friction={0}
        position={[0, 0 - viewport.height * 0.5 - 0.4, -1]}
        scale={[viewport.width, 1, 1]}
      >
        <Box />
      </RigidBody>
      <RigidBody
        type="fixed"
        includeInvisible
        colliders="cuboid"
        restitution={1}
        friction={0}
        position={[0, 0 + viewport.height * 0.5 + 0.4, -1]}
        scale={[viewport.width, 1, 1]}
      >
        <Box />
      </RigidBody>
    </group>
  );
}
