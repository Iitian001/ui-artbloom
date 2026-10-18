import { BASE, studio } from "./data/content";
export default function AtelierArcHome() {
  return <>
    <section className="aaHero">
      <p className="aaEyebrow"><span className="aaDot"/> {studio.location}</p>
      <div className="aaHeroGrid">
        <div className="aaHeroCopy"><p className="aaIssue">VOL. 01 — A CREATIVE STUDIO</p>
          <h1>WE MAKE <em>IDENTITIES</em> WORTH FEELING<span className="aaHeroPeriod">.</span></h1>
          <div className="aaHeroBottom"><p>{studio.introduction}</p><a href={BASE+"/work"} className="aaRoundArrow" aria-label="Explore work">↘</a></div>
        </div>
        <div className="aaHeroArt"><img src="/atelier-arc/arc-hero.svg" alt="Graphic poster with orange paper sculptures and bold ATELIER typography" loading="eager" /><span className="aaArtNote">FORM FOLLOWS FEELING / EST. 2026</span></div>
      </div>
      <div className="aaTicker" aria-hidden="true"><span>INDEPENDENT BY DESIGN</span><span>✳</span><span>ALWAYS IN MOTION</span><span>✳</span><span>INDEPENDENT BY DESIGN</span><span>✳</span></div>
    </section>
    <section id="work" className="aaSection">
      <div className="aaSectionHead"><p className="aaKicker">[01 / SELECTED WORK]</p><h2>Made to be <em>remembered.</em></h2><a className="aaTextLink" href={BASE+"/work"}>ALL PROJECTS ↗</a></div>
      <div className="aaProjectGrid">
        {studio.projects.slice(0,2).map((project,index)=><a key={project.id} className={"aaProject "+(index?"aaOffset":"")} href={BASE+"/work#project-"+project.id}>
          <div className="aaProjectImage"><img src={project.image} alt={project.alt} loading="lazy" /><span className="aaProjectVisit">VIEW PROJECT ↗</span></div>
          <div className="aaProjectMeta"><strong>{project.name}</strong><span>{project.category} / {project.year}</span></div></a>)}
      </div>
    </section>
    <section id="studio" className="aaManifesto"><div className="aaManifestoHead"><p className="aaKicker">[02 / WHAT WE BELIEVE]</p><span>SMALL STUDIO.<br/>BIG THINKING.</span></div>
      <p>NOT MORE <em>NOISE.</em><br/>MORE <em>MEANING.</em></p>
      <div className="aaManifestoBottom"><p>We believe a memorable idea beats a thousand forgettable impressions. Our process is curious, collaborative and unreasonably attentive to details.</p><a href={BASE+"/contact"}>MEET YOUR NEW COLLABORATORS ↗</a></div>
    </section>
    <section className="aaSection aaServices">
      <div className="aaSectionHead"><p className="aaKicker">[03 / OUR PRACTICE]</p><h2>What we <em>do.</em></h2></div>
      <div className="aaServiceList">{studio.services.map(service=><div className="aaService" key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.detail}</p><span>↗</span></div>)}</div>
    </section>
    <section className="aaBigCta"><p>HAVE SOMETHING IN MIND?</p><a href={BASE+"/contact"}>LET’S MAKE <em>SOMETHING.</em> ↗</a></section>
  </>;
}