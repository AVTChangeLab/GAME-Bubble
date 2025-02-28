import React, { createContext, useState, useEffect } from "react"

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
        const response = await fetch("/config.json")
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
