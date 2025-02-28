// configContext.js
import React, { createContext, useState, useEffect } from "react"

interface ConfigContextValue {
  config: any
  loading: boolean
}

export const ConfigContext = createContext<ConfigContextValue>({
  config: null,
  loading: true,
})

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("./config.json")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading config:", err)
        setLoading(false)
      })
  }, [])

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigContext
