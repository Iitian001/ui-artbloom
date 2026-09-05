import { ImageResponse } from "next/og"

import { loadMark } from "@/lib/og"

/**
 * The home-screen icon, rasterised from the same `app/icon.svg` the tab uses.
 *
 * Two things differ from the SVG, both because iOS masks this file itself: the
 * background runs the full square rather than a rounded one, so the corners are
 * dark instead of transparent once the system rounds them, and the mark is inset
 * to leave the margin the mask expects.
 */
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default async function AppleIcon() {
  const mark = await loadMark()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        {mark ? <img src={mark} width={132} height={132} alt="" /> : null}
      </div>
    ),
    { ...size },
  )
}
