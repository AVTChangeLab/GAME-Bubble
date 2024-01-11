import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import ViewportCollider from "./components/ViewportCollider"
import BubbleManager from "./components/BubbleManager"
import "./App.css"

type bubbleDataT = {
  bubbleText: string
  bubbleAnswer: boolean
  fontSize: number
  radius: number
}

export type GameDataT = {
  totalBubbles: number
  bubbles: bubbleDataT[]
  color: string
}

type GameEventT = {
  type: string
  message: GameDataT
}

function App() {
  const portRef = useRef<MessagePort | null>(null)
  const [gameData, setGameData] = useState<GameDataT | null>(null)

  const onMessage = (e: MessageEvent<GameEventT>) => {
    if (
      Object.prototype.hasOwnProperty.call(e.data, "type") &&
      Object.prototype.hasOwnProperty.call(e.data, "message")
    ) {
      setGameData(e.data.message)
    }
  }

  const postScore = (answer: boolean) => {
    if (portRef.current) {
      portRef.current.postMessage({
        type: answer ? "add" : "minus",
        message: 100,
      })
    }
  }

  const postEnd = () => {
    if (portRef.current) {
      portRef.current.postMessage({ type: "finish", message: "now" })
    }
  }

  useEffect(() => {
    //I hate doing this but it's the only way to ensure the postMessage is sent after the storyline script has ran.. Must be a better way but storyline sucks
    const x = setInterval(() => {
      parent.postMessage({ type: "loaded", message: "hasLoaded" }, "*")
    }, 100)

    const initPort = (e: MessageEvent) => {
      if (e.data.source && e.data.source.includes("react-devtools")) {
        return
      } else if (e.data && e.data === "init") {
        clearInterval(x)
        portRef.current = e.ports[0]
        portRef.current.onmessage = onMessage
        portRef.current.postMessage({ type: "init", message: "ready" })
      }
    }

    window.addEventListener("message", initPort)

    return () => {
      window.removeEventListener("message", initPort)
      clearInterval(x)
    }
  }, [])

  return (
    <main>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 75 }}
        className="noSelect"
      >
        <ambientLight color="white" intensity={1} />
        <directionalLight intensity={5} color="white" position={[20, 20, 10]} />
        <directionalLight intensity={5} color="white" position={[-20, 5, 4]} />
        <pointLight
          intensity={200}
          color="white"
          decay={0.05}
          position={[0, 0, -5]}
        />
        <Suspense>
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
