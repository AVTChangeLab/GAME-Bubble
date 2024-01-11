import { useThree } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function ViewportCollider() {
  const {width, height} = useThree((state) => state.viewport);

  return (
    <group>
      <RigidBody
        type="fixed"
        includeInvisible
        colliders="cuboid"
        restitution={1}
        friction={0}
        density={1}
        position={[0 - width * 0.5 - 0.5, 0, -1]}
        scale={[1, height, 1]}
      >
        <Box visible={false}/>
      </RigidBody>
      <RigidBody
        type="fixed"
        includeInvisible
        colliders="cuboid"
        restitution={1}
        friction={0}
        density={1}
        position={[0 + width * 0.5 + 0.5, 0, -1]}
        scale={[1, height, 1]}
      >
        <Box visible={false}/>
      </RigidBody>
      <RigidBody
        type="fixed"
        includeInvisible
        colliders="cuboid"
        restitution={1}
        friction={0}
        density={1}
        position={[0, 0 - height * 0.5 - 0.5, -1]}
        scale={[width, 1, 1]}
      >
        <Box visible={false}/>
      </RigidBody>
      <RigidBody
        type="fixed"
        includeInvisible
        colliders="cuboid"
        restitution={1}
        friction={0}
        density={1}
        position={[0, 0 + height * 0.5 + 0.5, -1]}
        scale={[width, 1, 1]}
      >
        <Box visible={false}/>
      </RigidBody>
    </group>
  );
}
