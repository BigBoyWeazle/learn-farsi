import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const logoData = await readFile(
    join(process.cwd(), "public", "LogoDesert2.png")
  );
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff0db",
          position: "relative",
        }}
      >
        {/* Top decorative border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(90deg, #cd7171, #f59e0b, #cd7171)",
            display: "flex",
          }}
        />

        {/* Bottom decorative border */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(90deg, #cd7171, #f59e0b, #cd7171)",
            display: "flex",
          }}
        />

        {/* Logo */}
        <img
          src={logoBase64}
          width={180}
          height={180}
          style={{ objectFit: "contain" }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontSize: "72px",
                fontWeight: 700,
                color: "#cd7171",
                lineHeight: 1.1,
              }}
            >
              Learn Farsi
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "white",
                backgroundColor: "#f59e0b",
                padding: "6px 16px",
                borderRadius: "10px",
              }}
            >
              BETA
            </span>
          </div>

          {/* Persian text */}
          <span
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "#995555",
              marginTop: "4px",
              lineHeight: 1.2,
            }}
          >
            فارسی بیاموزید
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "26px",
            color: "#7a4444",
            marginTop: "20px",
            fontWeight: 500,
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Learn new Farsi words every day with smart spaced repetition — free
          forever.
        </p>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {["Free Forever", "Structured Lessons", "Spaced Repetition"].map(
            (label) => (
              <span
                key={label}
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#cd7171",
                  backgroundColor: "white",
                  border: "2px solid #cd7171",
                  padding: "8px 20px",
                  borderRadius: "30px",
                }}
              >
                {label}
              </span>
            )
          )}
        </div>

        {/* Domain */}
        <span
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: "20px",
            fontWeight: 600,
            color: "#cd7171",
            opacity: 0.7,
          }}
        >
          learnfarsi.app
        </span>
      </div>
    ),
    { ...size }
  );
}
