import { templatePublicSpace } from "@/lib/registry/template-public";
export const dynamic = "force-static";
export const dynamicParams = false;
const space = templatePublicSpace("atelier-arc");
export function generateStaticParams(){ return space.params(); }
export async function GET(_req:Request,{params}:{params:Promise<{path:string[]}>}){ return space.get((await params).path); }
