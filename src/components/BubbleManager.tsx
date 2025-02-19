import Bubble from "./Bubble"
import { Pop, PopT } from "./Pop"
import { useState, useEffect, Suspense } from "react"
import { useThree } from "@react-three/fiber"
import { useGameData, bubbleT } from "../hooks/useGameData"
import type { Vector3Object } from "@react-three/rapier"
import { GameDataT } from "../App"
import Lottie from "./Lottie"
import correct from "../assets/lotties/correct.json?url"
import halfRight from "../assets/lotties/halfRight.json?url"
import incorrect from "../assets/lotties/incorrect.json?url"

export default function BubbleManager({
  gameData,
  postScore,
  postEnd,
}: {
  gameData: GameDataT
  postScore: (points: number, text: string) => void
  postEnd: () => void
}) {
  const get = useThree((state) => state.get)
  const { width, height } = get().viewport
  const amount = useGameData(width, height, gameData)

  const [pos, setPos] = useState<bubbleT[]>(amount)
  const [fx, setFx] = useState<boolean>(false)
  const [fxPos, setFxPos] = useState<PopT>()
  const [count, setCount] = useState<number>(0)
  const [lottie, setLottie] = useState<string>(correct)

  const clickHandler = (
    id: number,
    position: Vector3Object,
    size: number,
    color: string,
    points: number,
    text: string,
  ) => {
    if (fx) return
    document.body.style.cursor = "default"
    if (points === 20) setLottie(correct)
    if (points === 10) setLottie(halfRight)
    if (points === 0) setLottie(incorrect)
    setCount((prev) => prev + 1)
    postScore(points, text)
    setPos(pos.filter((a) => a.id !== id))
    setFxPos({ position: position, radius: size, color: color })
    setFx(true)
  }

  useEffect(() => {
    if (count == gameData.endAt && fx === false) {
      postEnd()
    }
  }, [count, postEnd, gameData.endAt, fx])

  return (
    <>
      {pos.map((position) => (
        <Bubble
          key={position.id}
          size={position.size}
          id={position.id}
          points={position.points}
          density={0.001}
          text={position.textContent}
          position={position.position}
          clickHandler={clickHandler}
          fontColor={gameData.fontColor}
          fontSize={gameData.fontSize}
          color={"white"}
          opacity={1}
          fontWeight={gameData.fontWeight}
        />
      ))}
      {fx ? (
        <Suspense>
          <Pop data={fxPos} disable={() => setFx(false)} />
          <Lottie url={lottie} position={fxPos?.position} />
        </Suspense>
      ) : (
        <></>
      )}
    </>
  )
}
