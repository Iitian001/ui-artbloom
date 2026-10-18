"use client";
import {useState} from "react";
import {product} from "../data/content";
const views={
 Overview:{label:"TOTAL REVENUE",value:"$128,430",growth:"+18.6%",bars:[31,45,36,59,55,68,65,75,62,90,80,100]},
 Revenue:{label:"RECURRING REVENUE",value:"$86,240",growth:"+12.2%",bars:[25,32,42,38,61,56,76,69,85,80,88,96]},
 Audience:{label:"ACTIVE PEOPLE",value:"48,291",growth:"+24.1%",bars:[18,28,41,32,46,55,62,79,73,81,93,100]}
};
type View=keyof typeof views;
export function Metrics(){const [view,setView]=useState<View>("Overview");const data=views[view];
return <div className="osBoard"><div className="osBoardTop"><span className="osLogoSmall">✳</span><div><strong>Workspace</strong><small>ACME / DEMO ANALYTICS</small></div><span className="osAvatar">JD</span></div>
<div className="osBoardBody"><small>OVERVIEW / PERFORMANCE</small><h3>Good morning, Alex <span>↗</span></h3><div className="osTabs" role="tablist" aria-label="Metric">
{(Object.keys(views) as View[]).map(k=><button role="tab" aria-selected={view===k} key={k} onClick={()=>setView(k)}>{k}</button>)}</div>
<div className="osGraph"><div className="osGraphHead"><span>{data.label}</span><span>LAST 12 MONTHS ⌄</span></div><div className="osNumber"><strong>{data.value}</strong><span>{data.growth} ↗</span></div>
<div className="osBars">{data.bars.map((v,i)=><span key={i} style={{height:String(v)+"%"}}><i/></span>)}</div><div className="osMonths"><span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>DEC</span></div></div>
<div className="osStats">{[["24.8k","Visitors"],["3.42%","Conversion"],["1,284","New accounts"]].map(a=><div key={a[1]}><small>{a[1]}</small><strong>{a[0]}</strong><span>↗ TRENDING</span></div>)}</div><p className="osDisclosure">ILLUSTRATIVE DATA · SWITCH THE TABS ABOVE</p></div></div>}
export function Billing(){const [yearly,setYearly]=useState(true);
return <><div className="osCycle"><button onClick={()=>setYearly(false)} aria-pressed={!yearly}>Monthly</button><button onClick={()=>setYearly(true)} aria-pressed={yearly}>Yearly <b>SAVE 20%</b></button></div>
<div className="osPlans">{product.plans.map((p,i)=><article className={i===1?"osPlan popular":"osPlan"} key={p.name}><small>{i===1?"MOST POPULAR":"PLAN 0"+(i+1)}</small><h2>{p.name}</h2><p>{p.desc}</p><div className="osPrice"><strong>{"$"+(yearly?p.yearly:p.monthly)}</strong><span>/ MONTH<br/>{yearly?"BILLED ANNUALLY":"BILLED MONTHLY"}</span></div><a href={"mailto:"+product.email+"?subject=Vector%20"+p.name+"%20enquiry"}>Enquire about {p.name} ↗</a><ul>{p.perks.map(perk=><li key={perk}>✓ &nbsp; {perk}</li>)}</ul></article>)}</div></>}
