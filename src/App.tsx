import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import ViewportCollider from "./components/ViewportCollider";
import Bubble from "./components/Bubble";
import "./App.css";

function App() {
  return (
    <main>
      <Canvas orthographic camera={{ position: [0, 0, 0], zoom: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight color="white" position={[0, 0, 5]} />
        <Suspense>
          <Physics debug colliders={false} gravity={[0,0,0]}>
            <ViewportCollider />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
          </Physics>
        </Suspense>
      </Canvas>
    </main>
  );
}

export default App;
