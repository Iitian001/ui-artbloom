import { siteOrigin } from "@/lib/brand"

/** Served so the `$schema` in every registry payload actually resolves. */
export const dynamic = "force-static"

const FILE_TYPES = [
  "registry:ui",
  "registry:component",
  "registry:block",
  "registry:hook",
  "registry:lib",
  "registry:page",
  "registry:style",
  "registry:file",
]

export function GET() {
  return Response.json({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${siteOrigin}/schema/registry-item.json`,
    title: "ui.artbloom registry item",
    description:
      "One installable template, animation, or component. A superset of the shadcn registry item shape: extra fields live under `meta` so shadcn-compatible tools can ignore them.",
    type: "object",
    required: ["name", "type", "files"],
    additionalProperties: true,
    properties: {
      $schema: { type: "string", format: "uri" },
      name: {
        type: "string",
        description: "Install name, as in `npx ui.artbloom add <name>`.",
        pattern: "^[a-z0-9]+(-[a-z0-9]+)*$",
      },
      type: { type: "string", enum: FILE_TYPES },
      title: { type: "string" },
      description: { type: "string" },
      author: { type: "string", description: "Handle, prefixed with @." },
      dependencies: {
        type: "array",
        items: { type: "string" },
        description: "npm packages the consumer must install.",
      },
      registryDependencies: {
        type: "array",
        items: { type: "string" },
        description: "Other registry items, by name. Already flattened into `files`.",
      },
      files: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["path", "content", "type", "target"],
          properties: {
            path: { type: "string" },
            target: { type: "string", description: "Where the file is written in the project." },
            content: { type: "string" },
            type: { type: "string", enum: FILE_TYPES },
          },
        },
      },
      assets: {
        type: "array",
        description:
          "Files delivered as bytes rather than inlined text. Read by this CLI only; shadcn writes the code and downloads none of the media.",
        items: {
          type: "object",
          required: ["url", "target", "bytes"],
          properties: {
            url: { type: "string", format: "uri" },
            target: { type: "string" },
            bytes: { type: "integer", minimum: 0 },
          },
        },
      },
      css: {
        $ref: "#/$defs/cssBlock",
        description:
          "Keyframes, custom properties and other global CSS to append to the project stylesheet. Keyed by at-rule or selector, values nest — the same shape shadcn declares, so `shadcn add` accepts it. There is no `cssVars`: variables go under `:root` or `@theme` here.",
      },
      meta: {
        type: "object",
        properties: {
          kind: { type: "string", enum: ["templates", "animations"] },
          categories: { type: "array", items: { type: "string" } },
          docs: { type: "string", format: "uri" },
        },
      },
    },
    $defs: {
      cssBlock: {
        type: "object",
        additionalProperties: { $ref: "#/$defs/cssValue" },
      },
      cssValue: {
        description: "A declaration value, or a nested block.",
        oneOf: [{ type: "string" }, { $ref: "#/$defs/cssBlock" }],
      },
    },
  })
}
