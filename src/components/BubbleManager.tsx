import Bubble from "./Bubble"
import { Pop, PopT } from "./Pop"
import { useState, useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { useGameData, bubbleT } from "../hooks/useGameData"
import type { Vector3Object } from "@react-three/rapier"
import { GameDataT } from "../App"

export default function BubbleManager({gameData, postScore, postEnd}:{gameData:GameDataT, postScore:(answer:boolean)=> void, postEnd:()=> void}) {

  const font = new URL('/Poppins-SemiBold.ttf', import.meta.url).href
  const get = useThree((state) => state.get)
  const { width, height } = get().viewport
  const amount = useGameData(width, height, gameData)

  const [pos, setPos] = useState<bubbleT[]>(amount)
  const [fx, setFx] = useState<boolean>(false)
  const [fxPos, setFxPos] = useState<PopT>()
  const [count, setCount] = useState<number>(0)

  const clickHandler = (
    id: number,
    position: Vector3Object,
    radius: number,
    color: string,
    answer: boolean
  ) => {
    document.body.style.cursor = "default"
    setCount((prev) => prev + 1)
    postScore(answer)
    setPos(pos.filter((a) => a.id !== id))
    setFxPos({ position: position, radius: radius, color: color })
    setFx(true)
  }

  useEffect(() => {
    if(count == 2){
      postEnd()
    }
  },[count, postEnd])

  // function handleClick(artworkId, nextSeen) {
  //   setMyList(myList.map(artwork => {
  //     if (artwork.id === artworkId) {
  //       // Create a *new* object with changes
  //       return { ...artwork, seen: nextSeen };
  //     } else {
  //       // No changes
  //       return artwork;
  //     }
  //   }));
  // }

  return (
    <>
      {pos.map((position) => (
        <Bubble
          key={position.id}
          radius={position.radius}
          id={position.id}
          answer={position.bubbleAnswer}
          density={0.001}
          text={position.textContent}
          position={position.position}
          clickHandler={clickHandler}
          fontColor={gameData.fontColor}
          fontSize={position.fontSize}
          font={font}
          color={position.color}
          img={position.img}
        />
      ))}
      {fx ? <Pop data={fxPos} disable={() => setFx(false)} /> : <></>}
    </>
  )
}
