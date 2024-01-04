import { Sphere } from "@react-three/drei";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useRef, useEffect } from "react";

export default function Bubble({ density = 0.1 }: { density?: number }) {
  const rB = useRef<RapierRigidBody>(null);

  useEffect(() => {
    if (rB.current) {
      rB.current.setEnabledTranslations(true, true, false, true);
      rB.current.setTranslation(
        { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4, z: -1 },
        true
      );
      rB.current.applyImpulse(
        {
          x: (Math.random() + 0.1 - 0.5) * 5,
          y: (Math.random() + 0.1 - 0.5) * 5,
          z: 0,
        },
        true
      );
    }
  }, []);

  return (
    <>
      <RigidBody
        ref={rB}
        colliders="ball"
        density={density}
        lockRotations
        restitution={1}
        linearDamping={0}
      >
        <Sphere scale={[1, 1, 0.1]}>
          <meshStandardMaterial color="hotpink" />
        </Sphere>
      </RigidBody>
    </>
  );
}
