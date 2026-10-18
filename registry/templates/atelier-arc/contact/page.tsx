import { studio } from "../data/content";
export default function AtelierContact() {return <section className="aaSection aaInner aaContact">
 <p className="aaKicker">[NEW BUSINESS / COLLABORATIONS]</p>
 <h1 className="aaInnerTitle">START<br/><em>SOMETHING</em><span>↗</span></h1>
 <p>Ideas are better when shared. Tell us what you’re making, where you’re headed, and what matters most. This demo uses an email link: replace the example address before publishing your own studio.</p>
 <a className="aaMailLink" href={"mailto:"+studio.email+"?subject=New%20project%20enquiry"}>{studio.email} ↗</a>
 <div className="aaContactDetails"><div><span>01 / THE PROCESS</span><strong>FIRST A CONVERSATION.<br/>THEN THE GOOD STUFF.</strong></div><div><span>02 / WHERE WE WORK</span><strong>COPENHAGEN<br/>AND EVERYWHERE.</strong></div></div>
</section>}