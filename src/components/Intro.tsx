import { AI } from "./AI"

export const Intro = ({
  show,
}: {
  show: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        display: "flex",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          margin: "0 auto",
          width: "100%",
          maxWidth: "550px",
          padding: "4rem 2rem",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <AI />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h1>
            That was great, well done!
          </h1>
          {/* <p>
            Ready for round 2?
          </p> */}
          <h3>Ready for round 2?</h3>
          {/* <ul>
            <li>Carefully assess all the talking points on the screen</li>
            <li>
              You only get 3 chances, so burst the ones you find the most
              appropriate
            </li>
          </ul> */}
        </div>
        <button
          style={{
            borderRadius: "50px",
            background: "linear-gradient(90deg, #0375BD 0%, #97C4E8 100%)",
            color: "white",
            width: "200px",
            padding: '8px 16px',
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => {
            show(false)
          }}
        >
          Let's go!
        </button>
      </div>
    </div>
  )
}
