import { useContext } from "react"
import { ConfigContext } from "./ConfigContext"

import "./styles.css"

export default function InfoPopup() {
  const { config, loading } = useContext(ConfigContext)
  // Early return if the configuration is still loading or failed to load.
  if (loading) return <div>Loading configuration...</div>
  if (!config) return <div>Error loading configuration.</div>
  // Now it's safe to use config

  return (
    <div
      className="flex flex-column items-center bg-cover bg-center p-4 rounded-lg shadow-md popup_background_image"
      style={{
        backgroundImage: `url(${config.popupBackgroundImage})`,
        position: "absolute",
        left: "6rem",
        top: "3rem",
        display: "flex",
        opacity: "0.9",
      }}
    >
      {/* Icon */}
      <div className="mr-4 flex items-center justify-center">
        <img src={config.bubbleIcon} alt="icon" className="h-8 w-8" />
      </div>

      {/* Text */}
      <p className="text-white font-medium" style={{ color: "white" }}>
      Pick the 4 essentials strategic items that create an Omnichannel Strategy
      </p>
    </div>
  )
}
