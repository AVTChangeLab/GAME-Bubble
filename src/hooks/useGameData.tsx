import { Vector3Object } from "@react-three/rapier"

export type bubbleT = {
  position: Vector3Object
  id: number
  size: number
  textContent: string
  points: number
}

import { GameDataT } from "../App"

export function useGameData(
  width: number,
  height: number,
  gameData: GameDataT
) {
  let bubbles = gameData.totalBubbles
  const textContent = gameData.bubbles.map((val) =>
    val.bubbleText ? val.bubbleText : ""
  )
  const points = gameData.bubbles.map((val) =>
    val.points ? val.points : 0
  )
  const size = gameData.bubbles.map((val) => (val.size ? val.size : 1))

  const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max)
  }

  const createArray = (size: number): Vector3Object[] => {
    let result: Vector3Object[] = []
    const gap = 3.5 * size
    for (let x = -width / 2; x < width / 2; x += gap) {
      for (let y = -height / 2; y < height / 2; y += gap) {
        const clampedX = clamp(x, -width / 2 + size, width / 2 - size)
        const clampedY = clamp(y, -height / 2 + size, height / 2 - size)
        result = [...result, { x: clampedX, y: clampedY, z: -1 }]
      }
    }

    return result
  }

  const shuffleArray = (array: Vector3Object[]) => {
    const arrayCopy = [...array]
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = arrayCopy[i]
      arrayCopy[i] = arrayCopy[j]
      arrayCopy[j] = temp
    }
    return arrayCopy
  }

  const makeBubbles = (array: Vector3Object[]): bubbleT[] => {
    let result: bubbleT[] = []
    const arrayCopy = [...array]
    arrayCopy.forEach((pos, index) => {
      result = [
        ...result,
        {
          position: pos,
          id: index,
          size: size[index],
          points: points[index],
          textContent: textContent[index],
        },
      ]
    })
    return result
  }

  const assignPositions = () => {
    if (bubbles > width * height) {
      bubbles = Math.floor(width * height)
    }

    //const sizeArray = textContent.map(words => words.length < 30 ? findLongestWord(words) : clamp(words.length*0.35,8,12))
    const largestsize = size.reduce((a, b) => (a > b ? a : b))
    const positions = createArray(largestsize)
    const shuffledPositions = shuffleArray(positions)

    bubbles > shuffledPositions.length
      ? (bubbles = shuffledPositions.length)
      : (shuffledPositions.length = bubbles)

    const bubbleArray = makeBubbles(shuffledPositions)

    return bubbleArray

  }

  const bubbleArray = assignPositions()
  return bubbleArray
}
