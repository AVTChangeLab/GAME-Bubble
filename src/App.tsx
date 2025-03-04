import { Suspense, useEffect, useState, useContext } from "react"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { Preload } from "@react-three/drei"
import ViewportCollider from "./components/ViewportCollider"
import BubbleManager from "./components/BubbleManager"
import "./App.css"
import { Intro } from "./components/Intro"
import InfoPopup from "./components/InfoPopup"
import {
  ConfigProvider,
  ConfigContext,
  Config,
} from "./components/ConfigContext"

// Move the main App logic to a separate component
function GameApp({ config }: { config: Config }) {
  // Changed from 'never' to 'Config'
  const [gameData, setGameData] = useState<Config | null>(null) // Changed from 'null' to 'Config | null'
  const [intro, setIntro] = useState<boolean>(false)

  useEffect(() => {
    setGameData(config)
  }, [config])

  const postScore = (points: number, text: string) => {
    if (window.parent) {
      window.parent.postMessage(
        {
          message: "updateScore",
          value: points,
          choice: text,
        },
        "*",
      )
    }
  }

  const postEnd = () => {
    window.parent.postMessage({ message: "nextSlide", value: "nextSlide" }, "*")
  }

  return (
    <main>
      <div
        style={{
          backgroundImage: `url('${config.backgroundImage}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      {intro ? <Intro show={setIntro} /> : null}
      <InfoPopup />
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 75 }}
        className="noSelect"
        style={{ visibility: intro ? "hidden" : "visible" }}
      >
        <ambientLight color="white" intensity={0.5} />
        <directionalLight intensity={5} color="white" position={[20, 20, 10]} />
        <Suspense>
          <Preload all />
          <Physics colliders={false} gravity={[0, 0, 0]}>
            <ViewportCollider />
            {gameData ? (
              <BubbleManager
                gameData={gameData}
                postScore={postScore}
                postEnd={postEnd}
              />
            ) : null}
          </Physics>
        </Suspense>
      </Canvas>
    </main>
  )
}

// Create a wrapper component that handles config loading
function App() {
  const { config, loading } = useContext(ConfigContext)

  if (loading || !config) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Loading game configuration...</div>
        {/* Add error display */}
        <div style={{ color: "red", marginTop: "1rem" }}>
          {!config && !loading ? "Failed to load configuration" : ""}
        </div>
      </div>
    )
  }

  return <GameApp config={config} />
}
// Export the wrapped app with provider
export default function AppWithConfig() {
  return (
    <ConfigProvider>
      <App />
    </ConfigProvider>
  )
}
