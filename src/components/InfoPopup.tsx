import info_bg from "../assets/img/info_background.png"
import bubble_icon from "../assets/img/bubble_icon.svg"

import "./styles.css"

export default function InfoPopup() {
  return (
    <div
      className="flex flex-column items-center bg-cover bg-center p-4 rounded-lg shadow-md info_background_image"
      style={{
        backgroundImage: `url(${info_bg})`,
        position: "absolute",
        left: "6rem",
        top: "3rem",
        display: "flex",
      }}
    >
      {/* Icon */}
      <div className="mr-4 flex items-center justify-center">
        <img src={bubble_icon} alt="icon" className="h-8 w-8" />
      </div>

      {/* Text */}
      <p className="text-white font-medium" style={{ color: "white" }}>
        Pop the relevant bubbles with the correct statements and leave the
        bubbles that have irrelevant statements.
      </p>
    </div>
  )
}
