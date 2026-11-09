import type { Metadata } from "next"

import "./developer-room.css"

/**
 * A 3D developer studio you can look around: a Blender-rendered room with live
 * Three.js objects on its walls — skill sculptures, project cards, certificates,
 * desk monitors, a terminal and a small desk robot.
 *
 * The room is a buildless HTML/JS document in `public/developer-room/`, and this
 * route frames it, the same way Cinematic Supercar is framed. It runs its own
 * render loop, pointer handling and dialogs against its own document, so it is
 * kept out of React rather than re-rendered around.
 *
 * To make it yours, edit one file: `public/developer-room/config.js` (name, bio,
 * links, projects, skills, certificates). Put your images in
 * `public/developer-room/assets/placeholders/` and point the config at them.
 * Refresh to see changes; there is no build step.
 */
export const metadata: Metadata = {
  title: "Developer Room — 3D Portfolio",
  description: "A 3D developer studio portfolio: projects, skills, certificates and contact, inside a room you can look around.",
}

export default function DeveloperRoomPage() {
  return (
    <div className="developer-room-shell">
      <iframe
        className="developer-room-frame"
        src="/developer-room/index.html"
        title="3D developer studio portfolio"
        allow="autoplay; fullscreen; clipboard-write"
      />
    </div>
  )
}
