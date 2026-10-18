import { studio } from "../data/content";
export default function AtelierWork() { return <section className="aaSection aaInner">
  <p className="aaKicker">[THE PROJECT ARCHIVE / 2024—2026]</p>
  <h1 className="aaInnerTitle">SELECTED<br/><em>WORK</em><span>®</span></h1>
  <p className="aaInnerIntro">An ongoing collection of places, systems, and visual stories we’ve made for imagined clients. These examples are part of the template and ready to replace.</p>
  <div className="aaArchive">{studio.projects.map(p=><article id={"project-"+p.id} className="aaArchiveRow" key={p.id}>
    <div className="aaArchiveImg"><img src={p.image} alt={p.alt} loading="lazy"/></div>
    <div><p className="aaKicker">PROJECT {p.id} / {p.year}</p><h2>{p.name}</h2><span>{p.category}</span><p className="aaArchiveNote">Art direction, identity and digital storytelling. The work shown here is an original conceptual case study.</p></div>
  </article>)}</div>
</section>; }