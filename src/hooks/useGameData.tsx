import { Vector3Object } from "@react-three/rapier"

export type bubbleT = {
  position: Vector3Object
  id: number
  radius: number
  textContent: string
  bubbleAnswer: boolean
  fontSize: number
  color: string
  img: string | null
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
  const bubbleAnswer = gameData.bubbles.map((val) =>
    val.bubbleAnswer ? val.bubbleAnswer : false
  )
  const fontSize = gameData.bubbles.map((val) =>
    val.fontSize ? val.fontSize : 0.25
  )
  const radius = gameData.bubbles.map((val) => (val.radius ? val.radius : 1))
  const color = gameData.bubbles.map((val) => (val.color ? val.color : "white"))
  const img = gameData.bubbles.map((val) => (val.img ? val.img : null))

  const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max)
  }

  // const findLongestWord = (str: string) => {
  //   const longestWord = str.split(' ').reduce(function(longest, currentWord) {
  //     return currentWord.length > longest.length ? currentWord : longest;
  //   }, "");
  //   return clamp(longestWord.length,3,10);
  // }

  const createArray = (radius: number): Vector3Object[] => {
    let result: Vector3Object[] = []
    const gap = 3.5 * radius
    for (let x = -width / 2; x < width / 2; x += gap) {
      for (let y = -height / 2; y < height / 2; y += gap) {
        const clampedX = clamp(x, -width / 2 + radius, width / 2 - radius)
        const clampedY = clamp(y, -height / 2 + radius, height / 2 - radius)
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
          radius: radius[index],
          bubbleAnswer: bubbleAnswer[index],
          textContent: textContent[index],
          fontSize: fontSize[index],
          color: color[index],
          img: img[index],
        },
      ]
    })
    return result
  }

  const assignPositions = () => {
    if (bubbles > width * height) {
      bubbles = Math.floor(width * height)
    }

    //const radiusArray = textContent.map(words => words.length < 30 ? findLongestWord(words) : clamp(words.length*0.35,8,12))
    const largestRadius = radius.reduce((a, b) => (a > b ? a : b))
    const positions = createArray(largestRadius)
    const shuffledPositions = shuffleArray(positions)

    bubbles > shuffledPositions.length
      ? (bubbles = shuffledPositions.length)
      : (shuffledPositions.length = bubbles)

    const bubbleArray = makeBubbles(shuffledPositions)

    return bubbleArray

    // for(let i=0; i<bubbles; i++){

    // }

    // const isValidPosition = (
    //   coords: [number, number],
    //   objectCoords: Vector3Object[]
    // ): boolean => {
    //   for (const { x, y } of objectCoords) {
    //     if (Math.abs(coords[0] - x) <= 1 && Math.abs(coords[1] - y) <= 1) {
    //       return false
    //     }
    //     console.log(coords[0],x,coords[1],y)
    //   }
    //   return true
    // }
    // const objectCoords: Vector3Object[] = []

    // for (let i = 0; i < bubbles; i++) {
    //   let x, y
    //   do {
    //     x = Math.floor((Math.random() * (width-1)) - halfWidth)+1
    //     y = Math.floor((Math.random() * (height-1)) - halfHeight)+1
    //   } while (!isValidPosition([x, y], objectCoords))

    //   objectCoords.push({ x: x, y: y, z: -1 })
    // }
    // return objectCoords
  }

  const bubbleArray = assignPositions()
  return bubbleArray
}
