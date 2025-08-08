import Bubble from "./Bubble"
import { Pop, PopT } from "./Pop"
import { useState, useEffect, useContext, Suspense } from "react"
import { useThree } from "@react-three/fiber"
import { useGameData, bubbleT } from "../hooks/useGameData"
import type { Vector3Object } from "@react-three/rapier"
import Lottie from "./Lottie"
import correct from "../assets/lotties/correct.json?url"
import halfRight from "../assets/lotties/halfRight.json?url"
import incorrect from "../assets/lotties/incorrect.json?url"
import asteroid from "../assets/lotties/asteroid.json?url"
import { ConfigContext } from "./ConfigContext"

// Add interface for gameData
interface GameData {
  endAt: number
  endAutomatically: boolean
  fontColor: string
  fontSize: number
  fontWeight: number
}

export default function BubbleManager({
  gameData,
  postScore,
  postEnd,
  onShowContinue,
}: {
  gameData: GameData
  postScore: (points: number, text: string) => void
  postEnd: (points: number) => void
  onShowContinue?: (score: number) => void
}) {
  const { config } = useContext(ConfigContext)
  const get = useThree((state) => state.get)
  const { width, height } = get().viewport
  const amount = useGameData(width, height)

  const [pos, setPos] = useState<bubbleT[]>(amount)
  const [fx, setFx] = useState<boolean>(false)
  const [fxPos, setFxPos] = useState<PopT>()
  const [count, setCount] = useState<number>(0)
  const [lottie, setLottie] = useState<string>(correct)
  // New state to signal the end of the game
  const [isGameEnding, setIsGameEnding] = useState<boolean>(false)
  const [totalPoints, setTotalPoints] = useState<number>(0)

  const clickHandler = (
    id: number,
    position: Vector3Object,
    size: number,
    color: string,
    points: number,
    text: string,
  ) => {
    // Disable click handler if the game is ending
    if (fx || isGameEnding) return
    document.body.style.cursor = "default"
    if (points === 20) setLottie(correct)
    if (points === 10) setLottie(halfRight)
    if (points === 0) setLottie(incorrect)
    setCount((prev) => prev + 1)
    postScore(points, text)
    setTotalPoints((prev) => prev + points)
    setPos(pos.filter((a) => a.id !== id))
    setFxPos({ position: position, radius: size, color: color })
    setFx(true)
  }

  useEffect(() => {
    // Trigger game ending sequence
    if (count === gameData.endAt && fx === false) {
      setIsGameEnding(true)
      if (gameData.endAutomatically) {
        postEnd(totalPoints)
      } else {
        if (onShowContinue) onShowContinue(totalPoints)
      }
    }
  }, [
    count,
    postEnd,
    gameData.endAt,
    gameData.endAutomatically,
    fx,
    onShowContinue,
  ])

  // New useEffect to handle simultaneous popping
  useEffect(() => {
    if (isGameEnding && pos.length > 0) {
      pos.forEach((bubble, index) => {
        setTimeout(() => {
          setFxPos({
            position: bubble.position,
            radius: bubble.size * (width * 0.05),
            color: "white",
          })
          setLottie(asteroid)
          setFx(true)
        }, index * 100) // Delay each pop slightly for a staggered effect
      })
      // Clear the remaining bubbles after they have all popped
      setTimeout(() => {
        setPos([])
      }, pos.length * 100)
    }
  }, [isGameEnding, pos, width])

  if (!config || !gameData) {
    return null
  }

  return (
    <>
      {pos.map((position) => (
        <Bubble
          key={position.id}
          size={position.size * (width * 0.05)}
          id={position.id}
          points={position.points}
          density={0.001 / width}
          text={position.textContent}
          position={position.position}
          clickHandler={clickHandler}
          fontColor={gameData.fontColor}
          fontSize={gameData.fontSize}
          color={"white"}
          opacity={1}
          fontWeight={gameData.fontWeight}
          isGameEnding={isGameEnding} // Pass the new prop
        />
      ))}
      {fx ? (
        <Suspense>
          <Pop data={fxPos} disable={() => setFx(false)} />
          <Lottie
            url={asteroid}
            position={fxPos?.position}
            scale={fxPos?.radius}
          />
          <Lottie url={lottie} position={fxPos?.position} />
        </Suspense>
      ) : null}
    </>
  )
}
