import path from "node:path"

/**
 * Extension → content type, for the routes that serve registry bytes.
 *
 * Deliberately a fixed table rather than a lookup library: the registry only ever
 * serves what an item declares, so an unknown extension means either a typo or a
 * file kind we have not thought about, and `application/octet-stream` is the right
 * answer to both — the browser will not try to interpret it.
 */
const TYPES: Record<string, string> = {
  ".bin": "application/octet-stream",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".ktx2": "image/ktx2",
  ".hdr": "image/vnd.radiance",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
}

export function contentTypeOf(filePath: string): string {
  return TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream"
}
