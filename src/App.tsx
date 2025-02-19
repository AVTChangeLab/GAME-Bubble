import { Suspense, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { Preload } from "@react-three/drei"
import ViewportCollider from "./components/ViewportCollider"
import BubbleManager from "./components/BubbleManager"
import bg from "./assets/img/Background.jpg"
import config from "./assets/config/config.json"
import "./App.css"
import { Intro } from "./components/Intro"
import InfoPopup from "./components/InfoPopup"

type bubbleDataT = {
  bubbleText: string
  points: number
  size: number
}

export type GameDataT = {
  totalBubbles: number
  bubbles: bubbleDataT[]
  color: string
  fontColor: string
  endAt: number
  fontSize: number
  fontWeight: number
}

function App() {
  const [gameData, setGameData] = useState<GameDataT | null>(null)
  const [intro, setIntro] = useState<boolean>(false)

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

  useEffect(() => {
    setGameData(config)
  }, [])

  return (
    <main>
      <div
        style={{
          backgroundImage: `url('${bg}')`,
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
            ) : (
              <></>
            )}
          </Physics>
        </Suspense>
      </Canvas>
    </main>
  )
}

export default App
