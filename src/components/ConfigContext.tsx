import React, { createContext, useState, useEffect } from "react"

interface BubbleConfig {
  bubbleText: string
  size: number
  points: number
}

export interface Config {
  backgroundImage: string
  popupBackgroundImage: string
  totalBubbles: number
  color: string
  fontColor: string
  fontWeight: number
  fontSize: number
  endAt: number
  bubbleImage: string
  bubbleIcon: string
  bubbles: BubbleConfig[]
  positionalGap: number
}

interface ConfigContextType {
  config: Config | null
  loading: boolean
}

export const ConfigContext = createContext<ConfigContextType>({
  config: null,
  loading: true,
})

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("./config.json")
        if (!response.ok) {
          throw new Error("Failed to fetch configuration")
        }
        const configData = await response.json()
        setConfig(configData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading configuration:", error)
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  )
}
