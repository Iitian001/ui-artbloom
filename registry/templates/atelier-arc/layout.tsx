import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BASE, studio } from "./data/content";
import "./atelier-arc.css";
export const metadata: Metadata = { title: "Atelier Arc — Independent Design Practice", description: studio.introduction };
export default function AtelierArcLayout({children}:{children:ReactNode}) {
  return <div className="aaSite" id="top">
    <header className="aaHeader"><a className="aaWordmark" href={BASE} aria-label="Atelier Arc home">ATELIER <span>✳</span> ARC</a>
      <nav aria-label="Main navigation"><a href={BASE+"/work"}>WORK <sup>03</sup></a><a href={BASE+"#studio"}>STUDIO</a><a href={BASE+"/contact"}>LET’S TALK ↗</a></nav>
    </header>
    <main>{children}</main>
    <footer className="aaFooter"><div className="aaFooterTop"><span>GOOD WORK, GOOD PEOPLE.</span><a href={BASE+"/contact"}>HAVE AN IDEA? <span>↗</span></a></div>
      <div className="aaFooterBase"><span>© 2026 ATELIER ARC — DEMO TEMPLATE</span><a href="#top">BACK TO TOP ↑</a><span>COPENHAGEN · EVERYWHERE</span></div>
    </footer>
  </div>;
}