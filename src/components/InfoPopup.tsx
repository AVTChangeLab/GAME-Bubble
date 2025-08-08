import { useContext, useState, useEffect } from "react"
import { ConfigContext } from "./ConfigContext"

import "./styles.css"

export default function InfoPopup() {
  const { config, loading } = useContext(ConfigContext)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showPopup, setShowPopup] = useState(false) // New state to manage popup visibility

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth) // Hide the popup if the window is resized to be larger than 1000px
      if (window.innerWidth >= 1000) {
        setShowPopup(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (loading) return <div>Loading configuration...</div>
  if (!config) return <div>Error loading configuration.</div>

  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  const fullPopup = (
    <div className="information flex flex-column items-center bg-cover bg-center p-4 rounded-lg shadow-md">
      {" "}
      {/* Icon */}
      <div className="mr-4 flex items-center justify-center popup-icon">
        <img src={config.bubbleIcon} alt="icon" className="h-8 w-8" />
      </div>
      <p className="text-white font-medium" style={{ color: "white" }}>
        Pick the 4 essentials strategic items that create an Omnichannel
        Strategy{" "}
      </p>{" "}
    </div>
  )

  const minimizedIcon = (
    <div
      className="flex items-center justify-center p-2 rounded-full shadow-md cursor-pointer"
      style={{
        position: "absolute",
        left: "1rem",
        top: "1rem",
        width: "5rem",
        height: "5rem",
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1001, // Icon should be above other elements
      }}
      onClick={togglePopup}
    >
      {/* Information icon SVG */}{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-48 w-38"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        strokeWidth={2}
      >
        {" "}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />{" "}
      </svg>{" "}
    </div>
  )

  return (
    <>
      {windowWidth >= 1000 ? fullPopup : minimizedIcon}{" "}
      {windowWidth < 1000 && showPopup && fullPopup}{" "}
    </>
  )
}
