import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Learn Farsi - Learn Persian Daily";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff0db",
          position: "relative",
        }}
      >
        {/* Top border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#cd7171",
            display: "flex",
          }}
        />

        {/* Bottom border accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#cd7171",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {/* Persian text */}
          <div
            style={{
              fontSize: 48,
              color: "#cd7171",
              opacity: 0.3,
              display: "flex",
            }}
          >
            فارسی بیاموزید
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#cd7171",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            Learn Farsi
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: "#8e3535",
              display: "flex",
            }}
          >
            Learn Persian vocabulary, grammar & alphabet
          </div>

          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "#cd7171",
                color: "white",
                padding: "8px 24px",
                borderRadius: "24px",
                fontSize: 24,
                fontWeight: 600,
                display: "flex",
              }}
            >
              Free Forever
            </div>
            <div
              style={{
                backgroundColor: "#f59e0b",
                color: "white",
                padding: "8px 24px",
                borderRadius: "24px",
                fontSize: 24,
                fontWeight: 600,
                display: "flex",
              }}
            >
              Spaced Repetition
            </div>
            <div
              style={{
                backgroundColor: "#4aa6a6",
                color: "white",
                padding: "8px 24px",
                borderRadius: "24px",
                fontSize: 24,
                fontWeight: 600,
                display: "flex",
              }}
            >
              Structured Lessons
            </div>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: 22,
            color: "#b85d5d",
            display: "flex",
          }}
        >
          learnfarsi.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
