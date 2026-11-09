import {createLoadingScreen} from './room-loader.js';
import {profile,projects,featuredIds,skillGroups,shelf,certificates} from './config.js';
// Relative, so the room works wherever its folder is served from.
const ASSETS='./assets/';

const stations={
 about:{label:'About me',spot:[-1.55,-.4,-7.68]},
 work:{label:'Projects',spot:[2.425,-.36,-3.5]},
 skills:{label:'Skills',spot:[2.55,.73,-3.5]},
 credentials:{label:'Certificates',spot:[-2.27,.95,-8.525]},
 contact:{label:'Say hello',spot:[-.75,-.76,-7.2]}
};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stage=$('#stage'),canvas=$('#room-canvas'),panel=$('#info-panel'),panelContent=$('#panel-content');
const preference={get(key){try{return localStorage.getItem(key)}catch{return null}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};
let activeRoom='about',activeProject=null,threeReady=false,viewer,viewerLoading=false,returnFocus=null;
let simpleView=new URLSearchParams(location.search).get('view')==='simple'||(!new URLSearchParams(location.search).has('view')&&preference.get('studio-view')==='simple');
const roomLoading=createLoadingScreen();
roomLoading.enter(()=>{if(threeReady){canvas.focus({preventScroll:true});}else setView(true);});

const linkMarkup=cls=>profile.links.map(l=>`<a class="${cls}" href="${esc(l.url)}" target="_blank" rel="noreferrer">${esc(l.label)}</a>`).join('');
function aboutMarkup(){return `<h2 class="panel-title">About</h2><div class="about-card"><img src="${ASSETS+profile.avatar}" alt="Portrait of ${esc(profile.name)}" loading="lazy"><p>${esc(profile.bio)}</p></div><div class="panel-links">${linkMarkup('panel-link')}</div>`}
function projectEntry(p,featured=false){return `<button class="project-entry ${featured?'featured-project':''}" type="button" data-project="${p.id}"><img src="${ASSETS+p.image}" alt="" loading="lazy"><span><strong>${esc(p.title)}</strong><small>${esc(p.kind)}</small></span></button>`}
function workMarkup(){return `<h2 class="panel-title">Projects</h2><div class="project-list featured-list">${featuredIds.map(id=>projectEntry(projects.find(p=>p.id===id),true)).join('')}</div><div class="project-list other-projects">${projects.filter(p=>!featuredIds.includes(p.id)).map(p=>projectEntry(p)).join('')}</div>`}
function projectMarkup(p){return `<article class="project-detail"><button class="back-button" type="button" data-back>All projects</button><img class="project-hero" src="${ASSETS+p.image}" alt="${esc(p.title)} preview"><h2 class="panel-title">${esc(p.title)}</h2><p>${esc(p.description)}</p><a class="primary-button project-visit" href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.action)}</a><div class="stack-list">${p.stack.map(x=>`<span>${esc(x)}</span>`).join('')}</div><ul>${p.highlights.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`}
function skillsMarkup(){return `<h2 class="panel-title">Skills</h2>${skillGroups.map(g=>`<div class="skill-category"><h3>${esc(g.title)}</h3><div class="fact-pills">${g.skills.map(s=>`<span>${esc(s)}</span>`).join('')}</div></div>`).join('')}`}
function certificatesMarkup(){return `<h2 class="panel-title">Certificates</h2><div class="certificate-list">${certificates.map((c,i)=>`<div class="certificate-entry"><img src="${ASSETS+c.image}" alt="" loading="lazy"><span><strong>${esc(c.title)}</strong><small>${esc(c.issuer)}</small></span>${c.verify?`<a class="panel-link" href="${esc(c.verify)}" target="_blank" rel="noreferrer" aria-label="Verify ${esc(c.title)}">Verify </a>`:''}<button type="button" data-cert="${i}" aria-label="View ${esc(c.title)} certificate">View</button></div>`).join('')}</div>`}
function contactMarkup(){return `<h2 class="panel-title">Contact</h2><div class="contact-block"><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a><p>${esc(profile.location)} · ${esc(profile.availability)}</p></div><div class="contact-socials">${linkMarkup('')}<button type="button" data-copy-email>Copy email</button></div>`}
const sections={about:aboutMarkup,work:workMarkup,skills:skillsMarkup,credentials:certificatesMarkup,contact:contactMarkup};
function updateNavigation(){document.querySelectorAll('.dock-item').forEach(b=>{const active=b.dataset.room===activeRoom;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')})}
function renderPanel(){panelContent.innerHTML=activeProject?projectMarkup(activeProject):sections[activeRoom]();panelContent.scrollTop=0;updateNavigation()}
function openPanel(){if(!panel.contains(document.activeElement))returnFocus=document.activeElement;panel.classList.remove('minimized');syncPanelState();panelContent.focus({preventScroll:true});$('#room-tools')?.removeAttribute('open')}
function closePanel(restore=true){panel.classList.add('minimized');syncPanelState();if(restore){const target=returnFocus?.isConnected&&!returnFocus.closest('[hidden]')?returnFocus:$('#room-dock [aria-current]')||$('#view-toggle');target?.focus({preventScroll:true})}}
function selectRoom(key){if(!sections[key])return;activeRoom=key;activeProject=null;renderPanel();if(simpleView){closePanel(false);$('#simple-'+key).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});$('#simple-'+key).focus({preventScroll:true});return}openPanel();if(threeReady)viewer.focus(key)}
function showProject(id){const p=projects.find(x=>x.id===id);if(!p)return;activeRoom='work';activeProject=p;renderPanel();openPanel();if(threeReady&&!simpleView)viewer.focus('work')}
function showSkill(name){activeRoom='skills';activeProject=null;const group=skillGroups.find(g=>g.skills.some(s=>s.toLowerCase().includes(name.toLowerCase())));panelContent.innerHTML=`<h2 class="panel-title">${esc(name)}</h2><p class="eyebrow">${esc(group?.title||'DEVELOPMENT & AI')}</p><div class="fact-pills">${(group?.skills||[name]).map(s=>`<span>${esc(s)}</span>`).join('')}</div><button class="text-button" type="button" data-room="skills">All skills </button>`;panelContent.scrollTop=0;updateNavigation();openPanel()}
function showCertificate(index){const c=certificates[index=((index%certificates.length)+certificates.length)%certificates.length];$('#viewer-image').src=ASSETS+c.image;$('#viewer-image').alt=`${c.title} certificate issued by ${c.issuer}`;$('#viewer-caption').textContent=`${c.title} · ${c.issuer} · ${String(index+1).padStart(2,'0')} / ${String(certificates.length).padStart(2,'0')}`;if(!$('#certificate-viewer').open)$('#certificate-viewer').showModal();$('#viewer-image').dataset.index=String(index)}
function syncPanelState(){const closed=panel.classList.contains('minimized');panel.inert=closed;panel.setAttribute('aria-hidden',String(closed));document.body.classList.toggle('panel-open',!closed)}
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

// Shared content keeps the room and the simple, scrollable portfolio in sync.
$('#simple-portfolio').innerHTML=`<div class="simple-intro"><h1>${esc(profile.name)}</h1><p>${esc(profile.role)} · ${esc(profile.location)}</p></div>${['work','about','skills','credentials','contact'].map(key=>`<section class="simple-section" id="simple-${key}" tabindex="-1">${sections[key]()}</section>`).join('')}<footer class="simple-footer"><button class="text-button" type="button" data-enter-room>Room view</button></footer>`;
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.room){selectRoom(b.dataset.room);return}if(b.dataset.project){showProject(b.dataset.project);return}if(b.hasAttribute('data-back')){activeProject=null;renderPanel();panelContent.focus();return}if(b.dataset.cert){showCertificate(Number(b.dataset.cert));return}if(b.hasAttribute('data-copy-email')){try{await navigator.clipboard.writeText(profile.email);toast('Email copied')}catch{toast('Email: '+profile.email)}}if(b.hasAttribute('data-enter-room'))setView(false)});
$('.identity').addEventListener('click',e=>{e.preventDefault();closePanel(false);if(simpleView){$('#simple-portfolio').scrollTop=0;return}viewer?.reset()});
$('#panel-close').addEventListener('click',()=>closePanel());
$('#viewer-close').addEventListener('click',()=>$('#certificate-viewer').close());
$('#viewer-prev').addEventListener('click',()=>showCertificate(Number($('#viewer-image').dataset.index)-1));
$('#viewer-next').addEventListener('click',()=>showCertificate(Number($('#viewer-image').dataset.index)+1));
$('#certificate-viewer').addEventListener('click',e=>{if(e.target.id==='certificate-viewer')e.currentTarget.close()});
document.addEventListener('keydown',e=>{if($('#certificate-viewer').open||$('#room-terminal').open)return;if(e.key==='Escape'){if(!panel.classList.contains('minimized'))closePanel();return}if(e.altKey||e.ctrlKey||e.metaKey||e.target.matches('input,textarea,select,[contenteditable]'))return;const key=({'1':'about','2':'work','3':'skills','4':'credentials','5':'contact'})[e.key];if(key)selectRoom(key)});

function roomUnavailable(error){console.warn('Room unavailable',error);roomLoading.fail();toast('Your portfolio is available in Simple view.');}
async function startViewer(){if(viewer||viewerLoading)return;viewerLoading=true;try{const {createRoomViewer}=await import('./room-view.js');viewer=createRoomViewer({canvas,stage,stations,projects,certificates,shelf,onProject:showProject,onSkill:showSkill,onCertificate:showCertificate,onContact:()=>selectRoom('contact'),onNotes:()=>showCollection('work'),onMessage:toast,onTerminal:openTerminal,onBooks:()=>showCollection('skills'),onNightMode:toggleNightMode,onMusicState:syncMusic,onTourState:active=>$('#tour-toggle').textContent=active?'Stop tour':'Tour the room',onProgress:(loaded,total)=>roomLoading.progress(loaded,total),onLoad(){threeReady=true;roomLoading.ready();if(!panel.classList.contains('minimized'))viewer?.focus(activeRoom)},onError:roomUnavailable});viewer.setActive(!simpleView)}catch(error){roomUnavailable(error)}finally{viewerLoading=false}}
function setView(simple,initial=false){simpleView=simple;roomLoading.setVisible(!simple);document.body.classList.toggle('simple-view',simple);$('#simple-portfolio').hidden=!simple;stage.inert=simple;$('#view-toggle').textContent=simple?'Room view':'Simple view';$('#view-toggle').setAttribute('aria-pressed',String(simple));closePanel(false);viewer?.setActive(!simple);if(!simple)startViewer();if(!initial){preference.set('studio-view',simple?'simple':'room');const url=new URL(location.href);url.searchParams.set('view',simple?'simple':'room');history.replaceState(null,'',url);$('#view-toggle').focus()}}
$('#view-toggle').addEventListener('click',()=>setView(!simpleView));
$('#spin-toggle').addEventListener('click',()=>{viewer?.reset();closePanel(false);$('#room-tools').open=false});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#dance-toggle').textContent=reducedMotion?'Resume pet':'Pause pet';
$('#video-toggle').textContent=reducedMotion?'Play screens':'Pause screens';
$('#video-toggle').addEventListener('click',e=>{if(viewer)e.currentTarget.textContent=viewer.toggleVideos()?'Pause screens':'Play screens'});
$('#dance-toggle').addEventListener('click',e=>{if(viewer)e.currentTarget.textContent=viewer.toggleMotion()?'Pause pet':'Resume pet'});
$('#music-toggle').addEventListener('click',e=>{if(!viewer)return;const audible=viewer.toggleMusic();e.currentTarget.textContent=audible?'Sound on':'Sound off';e.currentTarget.setAttribute('aria-pressed',String(audible))});
function syncMusic(active){$('#music-toggle').textContent=active?'Sound on':'Sound off';$('#music-toggle').setAttribute('aria-pressed',String(active));}
let nightMode=false;
function toggleNightMode(){nightMode=!nightMode;stage.classList.toggle('room-dimmed',nightMode);$('#ambience-toggle').textContent=nightMode?'Restore lighting':'Night mode';$('#ambience-toggle').setAttribute('aria-pressed',String(nightMode));return nightMode;}
$('#ambience-toggle').addEventListener('click',toggleNightMode);
$('#tour-toggle').addEventListener('click',()=>{closePanel(false);viewer?.tour();document.querySelector('.room-tools').open=false;});
function showCollection(key){activeRoom=key;activeProject=null;renderPanel();openPanel();}
const terminal=$('#room-terminal'),terminalOutput=$('#terminal-output'),terminalInput=$('#terminal-input');
function terminalLine(text){const p=document.createElement('p');p.textContent=text;terminalOutput.append(p);terminalOutput.scrollTop=terminalOutput.scrollHeight;}
function openTerminal(){$('#room-tools').open=false;if(!terminalOutput.children.length){terminalLine('about · projects · skills · certificates · contact · clear');}if(!terminal.open)terminal.showModal();terminalInput.focus();}
$('#terminal-toggle').addEventListener('click',openTerminal);$('#terminal-close').addEventListener('click',()=>terminal.close());
terminal.addEventListener('click',e=>{if(e.target===terminal)terminal.close();});
$('#terminal-form').addEventListener('submit',e=>{e.preventDefault();const raw=terminalInput.value.trim(),command=raw.toLowerCase();terminalInput.value='';if(!command)return;terminalLine('$ '+raw);
  if(command==='clear'){terminalOutput.replaceChildren();return;}
  if(command==='help'){terminalLine('about · projects · skills · certificates · contact · clear');return;}
  if(command==='about'){terminalLine(`${profile.name} — ${profile.role}, ${profile.location}. ${profile.bio}`);return;}
  if(command==='projects'){projects.forEach(p=>{const b=document.createElement('button');b.textContent=p.title;b.addEventListener('click',()=>{terminal.close();showProject(p.id);});terminalOutput.append(b);});return;}
  if(command==='skills'){skillGroups.forEach(g=>terminalLine(g.title+': '+g.skills.join(', ')));return;}
  if(command==='certificates'){certificates.forEach((c,i)=>{const b=document.createElement('button');b.textContent=c.title;b.addEventListener('click',()=>{terminal.close();showCertificate(i);});terminalOutput.append(b);});return;}
  if(command==='contact'){const a=document.createElement('a');a.href='mailto:'+profile.email;a.textContent=profile.email;terminalOutput.append(a);return;}
  terminalLine('Unknown command. Type help for the list.');
});

// Identity text in the static HTML comes from config, so index.html stays generic.
document.title=`${profile.name} — Developer Studio`;
document.querySelector('meta[name=description]')?.setAttribute('content',`${profile.name} — ${profile.role}.`);
$('.identity b').textContent=profile.name;$('.identity small').textContent=profile.role;$('.identity').setAttribute('aria-label',`${profile.name}, home`);
$('.loader-name').textContent=profile.name;
$('#main').setAttribute('aria-label',`${profile.name}’s 3D developer portfolio`);
$('#room-terminal header span').textContent=profile.terminalUser;

renderPanel();setView(simpleView,true);
