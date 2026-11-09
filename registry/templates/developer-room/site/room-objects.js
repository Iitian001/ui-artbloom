import * as THREE from './assets/three.module.js';
import {SVGLoader} from './assets/SVGLoader.js';
import {FontLoader} from './assets/FontLoader.js';
import {createDeskPet} from './desk-pet.js';

const EYE=new THREE.Vector3(1.15,-5.2,1.7);
export const roomPoint=(x,y,z)=>new THREE.Vector3(x-EYE.x,z-EYE.z,-(y-EYE.y));

// The shelf's 24 slots are filled from config.js (`shelf`).

export function addRoomObjects(scene,{projects,certificates,shelf,onProject,onSkill,onCertificate,onContact,onMessage,onTerminal,onBooks,onNotes,onNightMode,onMusicState,manager,anisotropy=8}) {
  const technologies=shelf.slice(0,24);
  const picks=[],videos=[],sculptures=[],loader=new SVGLoader(manager);
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mediaActive=true,resumeVideos=[];
  const group=new THREE.Group();scene.add(group);
  const fontPromise=new Promise(resolve=>new FontLoader(manager).load('./assets/helvetiker-bold.json',resolve));
  const metal=new THREE.MeshStandardMaterial({color:0x111820,metalness:.65,roughness:.34});
  const rim=new THREE.MeshStandardMaterial({color:0x29313d,metalness:.7,roughness:.28});
  scene.add(new THREE.HemisphereLight(0xd9e8ff,0x262038,2.0));
  const key=new THREE.DirectionalLight(0xffead4,2.5);key.position.set(-2,3,3);scene.add(key);
  const fill=new THREE.DirectionalLight(0x7a8dff,.9);fill.position.set(3,.5,-2);scene.add(fill);
  function box(w,h,d,material=metal){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);}
  function roundedBox(w,h,d,material=metal,r=.015){
    const s=new THREE.Shape(),x=-w/2,y=-h/2;
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
    const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelThickness:.002,bevelSize:.002,bevelSegments:3,curveSegments:12});g.translate(0,0,-d/2);return new THREE.Mesh(g,material);
  }
  function canvasTexture(draw,w=512,h=256){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
  function plate(text,w,h,color='#d9e1ed',background='#111820'){
    const t=canvasTexture((c,cw,ch)=>{c.fillStyle=background;c.fillRect(0,0,cw,ch);c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';c.font=`600 ${text.length>15?68:90}px Arial`;c.fillText(text,cw/2,ch/2,cw-32);},1024,160);t.anisotropy=anisotropy;
    return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));
  }
  function interactive(root,label,action){root.traverse(o=>{if(o.isMesh){o.userData={label,action};picks.push(o);}});}
  function framedImage(path,w,h){
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({toneMapped:false}));
    const texture=new THREE.TextureLoader(manager).load('./assets/'+path,t=>{const ratio=t.image.width/t.image.height,target=w/h;mesh.scale.set(Math.min(1,ratio/target),Math.min(1,target/ratio),1);});
    texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=anisotropy;mesh.material.map=texture;return mesh;
  }
  function logo(slug,color,size){
    const root=new THREE.Group();
    loader.load(`./assets/logos/${slug}.svg`,data=>{
      const m=new THREE.MeshPhysicalMaterial({color,metalness:.5,roughness:.22,clearcoat:1,clearcoatRoughness:.16,envMapIntensity:1.4,emissive:color,emissiveIntensity:.025,side:THREE.DoubleSide});
      const side=new THREE.MeshStandardMaterial({color:new THREE.Color(color).multiplyScalar(.45),metalness:.8,roughness:.25,side:THREE.DoubleSide});
      for(const path of data.paths)for(const shape of SVGLoader.createShapes(path)){
        const geometry=new THREE.ExtrudeGeometry(shape,{depth:5.8,bevelEnabled:true,bevelThickness:.38,bevelSize:.30,bevelSegments:4,curveSegments:24,steps:1});
        geometry.translate(-12,-12,-2.9);geometry.scale(size/24,-size/24,-size/24);
        const front=slug==='python'&&root.children.length===0?m.clone():m;if(slug==='python'&&root.children.length===0)front.color.set('#4288b8');
        root.add(new THREE.Mesh(geometry,[front,side]));
      }
    });return root;
  }
  function monogram(text,color){
    const root=new THREE.Group();
    const m=new THREE.MeshPhysicalMaterial({color,metalness:.58,roughness:.22,clearcoat:1,envMapIntensity:1.3});
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.116,.006,10,64),new THREE.MeshStandardMaterial({color,metalness:.8,roughness:.28}));ring.position.z=-.035;root.add(ring);
    fontPromise.then(font=>{const shapes=font.generateShapes(text,1);const g=new THREE.ExtrudeGeometry(shapes,{depth:.30,bevelEnabled:true,bevelThickness:.018,bevelSize:.014,bevelSegments:3,curveSegments:16});g.computeBoundingBox();const b=g.boundingBox,scale=Math.min(.218/(b.max.x-b.min.x),.135/(b.max.y-b.min.y));g.translate(-(b.max.x+b.min.x)/2,-(b.max.y+b.min.y)/2,-.15);g.scale(scale,scale,scale);root.add(new THREE.Mesh(g,m));});return root;
  }
  technologies.forEach(([name,slug,color,abbreviation,shelfLabel],i)=>{
    const row=Math.floor(i/8),column=i%8,z=1.85+row*.4;
    const stand=new THREE.Group();stand.position.copy(roomPoint(3.70,-2.95+column*.357,z+.033));stand.rotation.y=-Math.PI/2;
    const base=roundedBox(.30,.032,.23);base.position.y=.016;stand.add(base);
    const sculpture=slug?logo(slug,color,.245):monogram(abbreviation||name.slice(0,3).toUpperCase(),color);sculpture.position.set(0,.175,.015);sculpture.rotation.y=.5;
    stand.add(sculpture);
    const shortName=shelfLabel||name;
    const label=plate(shortName,.30,.054,'#e5eef7');label.position.set(0,.043,.116);stand.add(label);
    const hit=box(.32,.33,.25,new THREE.MeshBasicMaterial({visible:false}));hit.position.y=.17;stand.add(hit);
    interactive(stand,name,()=>onSkill(name));
    // The invisible hit box is stable while the SVG geometry loads asynchronously.
    sculptures.push({root:sculpture,stand,index:i,baseY:.175});group.add(stand);
  });
  const shelfTitle=plate('Skills',1.2,.075,'#a6e8ee','#10151b');
  shelfTitle.position.copy(roomPoint(3.58,-1.70,3.04));shelfTitle.rotation.y=-Math.PI/2;group.add(shelfTitle);

  const board=new THREE.Group();board.position.copy(roomPoint(3.575,-1.70,1.34));board.rotation.y=-Math.PI/2;group.add(board);
  const title=plate('Projects',1.3,.09,'#8fe7ed');title.position.set(0,.24,.006);board.add(title);
  projects.slice(0,5).forEach((project,i)=>{
    const card=new THREE.Group();card.position.set((i-2)*.55,0,.018);
    const foot=box(.30,.025,.16);foot.position.set(0,-.235,-.01);card.add(foot);
    const post=box(.025,.14,.025);post.position.set(0,-.17,-.01);card.add(post);
    card.add(box(.51,.285,.026,rim));
    const image=framedImage(project.image,.476,.205);image.position.set(0,.025,.015);card.add(image);
    const label=plate(project.title,.476,.055,'#edf5ff');label.position.set(0,-.104,.016);card.add(label);
    board.add(card);interactive(card,project.title,()=>onProject(project.id));
  });


  certificates.slice(0,5).forEach((certificate,i)=>{
    const frame=new THREE.Group();frame.position.copy(roomPoint(-2.10+(i%3)*.98+(i>2?.49:0),3.325,2.71-Math.floor(i/3)*.61));
    frame.add(roundedBox(.85,.50,.035,rim,.01));
    const face=framedImage(certificate.image,.80,.45);face.position.z=.021;frame.add(face);group.add(frame);
    interactive(frame,certificate.title,()=>onCertificate(i));
  });

  function videoScreen(file,position,w,h){
    const video=document.createElement('video');video.src='./assets/videos/'+file+'.mp4';video.muted=true;video.loop=true;video.playsInline=true;video.preload='auto';video.setAttribute('aria-hidden','true');
    const texture=new THREE.VideoTexture(video);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=anisotropy;
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));screen.position.copy(roomPoint(position[0],position[1]+.93,position[2]));group.add(screen);videos.push(video);
    video.addEventListener('loadedmetadata',()=>{const ratio=video.videoWidth/video.videoHeight,target=w/h;screen.scale.set(Math.min(1,ratio/target),Math.min(1,target/ratio),1);});
    interactive(screen,file==='nightshift-music'?'Laptop · music':'Open the project on this monitor',()=>{if(file==='nightshift-music')toggleMusic();else{const count=file==='ai-showcase'?2:projects.length;onProject(projects[Math.floor(video.currentTime/4)%count].id);}});
    if(!reducedMotion)video.play().catch(()=>{});return video;
  }
  const slides=[],imageLoader=new THREE.ImageLoader(manager);
  const projectImages=projects.map(p=>{const entry={image:null};imageLoader.load('./assets/'+p.image,img=>{entry.image=img;slides.forEach(s=>s.dirty=true);});return entry;});
  let screensPlaying=!reducedMotion;
  function slideScreen(position,w,h,offset){
    const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=anisotropy;
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));screen.position.copy(roomPoint(position[0],position[1]+.93,position[2]));group.add(screen);
    const slide={index:offset%Math.max(1,projects.length),dirty:true,next:0,draw(){
      const g=c.getContext('2d'),p=projects[slide.index],img=projectImages[slide.index]?.image;
      g.fillStyle='#0b0f15';g.fillRect(0,0,c.width,c.height);
      if(img){const bar=Math.round(c.height*.14),ih=c.height-bar,scale=Math.min(c.width/img.width,ih/img.height),dw=img.width*scale,dh=img.height*scale;g.drawImage(img,(c.width-dw)/2,(ih-dh)/2,dw,dh);
        g.fillStyle='#111820';g.fillRect(0,ih,c.width,bar);g.fillStyle='#e5eef7';g.font=`600 ${Math.round(bar*.42)}px Arial`;g.textBaseline='middle';g.fillText(p?.title||'',24,ih+bar/2,c.width-48);}
      texture.needsUpdate=true;slide.dirty=false;}};
    slides.push(slide);
    interactive(screen,'Open the project on this monitor',()=>{const p=projects[slide.index];if(p)onProject(p.id);});
  }
  slideScreen([-.83,1.761,1.40],1.425,.646,0);
  slideScreen([.44,1.761,1.43],.815,.736,1);
  const musicVideo=videoScreen('nightshift-music',[-1.73,1.531,1.14],.536,.316);
  function toggleMusic(){musicVideo.muted=!musicVideo.muted;if(!musicVideo.muted){musicVideo.volume=.4;musicVideo.play().catch(()=>{});}onMusicState?.(!musicVideo.muted);return !musicVideo.muted;}
  function hitBox(label,position,size,action){const hit=box(...size,new THREE.MeshBasicMaterial({visible:false}));hit.position.copy(roomPoint(...position));group.add(hit);interactive(hit,label,action);return hit;}
  hitBox('Keyboard · open terminal',[-.67,2.22,.97],[.58,.11,.24],onTerminal);
  hitBox('Notes · projects',[.02,2.09,.93],[.56,.06,.18],onNotes);
  hitBox('Bookcase · toolkit',[-3.59,2.69,1.91],[.35,1.70,1.25],onBooks);
  hitBox('Headphones · music',[-1.32,2.16,.98],[.38,.12,.26],()=>{const playing=toggleMusic();onMessage?.(playing?'Music on':'Music off');});
  hitBox('Lamp · change the mood',[3.35,.87,2.10],[.43,.32,.43],onNightMode);
  let steamUntil=0,clockTime=0;
  hitBox('Coffee', [.94,2.61,1.01],[.19,.21,.20],()=>{steamUntil=clockTime+8;});
  const steamTexture=canvasTexture((c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'rgba(255,248,235,.35)');g.addColorStop(1,'rgba(255,248,235,0)');c.fillStyle=g;c.fillRect(0,0,w,h);},64,64);
  const steam=Array.from({length:6},()=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:steamTexture,transparent:true,opacity:0,depthWrite:false}));group.add(s);return s;});
  let fanMotion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rotors=[.33,.50,.67].map(z=>{const rotor=new THREE.Group();rotor.position.copy(roomPoint(3.18,2.335,z));for(let i=0;i<5;i++){const blade=box(.026,.063,.004,new THREE.MeshStandardMaterial({color:0x303947,roughness:.48,metalness:.55}));const angle=i*Math.PI*2/5;blade.position.set(Math.sin(angle)*.036,Math.cos(angle)*.036,0);blade.rotation.z=-angle+.35;rotor.add(blade);}group.add(rotor);return rotor;});
  hitBox('PC · pause or resume cooling fans',[3.18,2.34,.51],[.42,.63,.12],()=>{fanMotion=!fanMotion;onMessage?.(fanMotion?'Cooling fans running':'Cooling fans paused');});

  // Depth-only chair silhouette keeps video behind the real chair in the panorama.
  const depthMaterial=new THREE.MeshBasicMaterial({colorWrite:false});
  const headrest=roundedBox(.40,.20,.15,depthMaterial,.065);headrest.position.copy(roomPoint(-.42,.77,1.43));headrest.renderOrder=-1;scene.add(headrest);
  function depthThread(points,r){const curve=new THREE.CatmullRomCurve3(points.map(p=>roomPoint(p[0],p[1]+.93,p[2])));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,12,r,5,false),depthMaterial);mesh.renderOrder=-1;scene.add(mesh);}
  for(let i=0;i<65;i++){const z=.67+i*.0098;depthThread([[-.70,-.17,z],[-.42,-.11,z],[-.14,-.17,z]],.0012);}
  for(let i=0;i<49;i++){const x=-.696+i*.0115;depthThread([[x,-.14,.67],[x,-.11,.99],[x,-.18,1.29]],.0012);}
  depthThread([[-.71,-.13,.64],[-.74,-.16,.75],[-.72,-.19,1.25],[-.63,-.19,1.32],[-.21,-.19,1.32],[-.12,-.19,1.25],[-.10,-.16,.75],[-.13,-.13,.64]],.019);

  // A small, real notebook makes the studio notes discoverable in the scene.
  const notebook=new THREE.Group();notebook.position.copy(roomPoint(-2.30,2.0,.94));notebook.rotation.y=-.15;
  const pages=box(.37,.035,.27,new THREE.MeshStandardMaterial({color:0xe7ddc7,roughness:.9}));notebook.add(pages);
  const cover=box(.40,.012,.30,new THREE.MeshStandardMaterial({color:0x95674d,roughness:.7}));cover.position.y=.025;notebook.add(cover);
  const noteTitle=plate('PROJECTS',.30,.10,'#f4e8d5','#95674d');noteTitle.rotation.x=-Math.PI/2;noteTitle.position.set(0,.032,0);notebook.add(noteTitle);
  const noteHit=box(.45,.13,.36,new THREE.MeshBasicMaterial({visible:false}));notebook.add(noteHit);group.add(notebook);interactive(notebook,'Projects',onNotes);
  const letter=plate('CONTACT',.36,.18,'#29313d','#e7ddc7');letter.rotation.x=-Math.PI/2;letter.position.copy(roomPoint(.40,2.0,.94));group.add(letter);interactive(letter,'Say hello',onContact);

  const pet=createDeskPet();pet.root.position.copy(roomPoint(1.20,2.33,.911));pet.root.scale.setScalar(1.15);group.add(pet.root);
  let motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  interactive(pet.hit,'Desk bot',()=>pet.react());
  let hovered=null;
  return {
    picks,
    setActive(active){if(active===mediaActive)return;mediaActive=active;if(!active){resumeVideos=videos.filter(v=>!v.paused);videos.forEach(v=>v.pause());}else{resumeVideos.forEach(v=>v.play().catch(()=>{}));resumeVideos=[];}},
    hover(mesh){hovered=mesh?.userData?.label;},
    update(time){
      clockTime=time;
      steam.forEach((s,i)=>{const t=(time*.22+i/6)%1;s.position.copy(roomPoint(.94+Math.sin(time+i)*.018,2.61,1.07+t*.24));s.scale.setScalar(.035+t*.055);s.material.opacity=time<steamUntil?(1-t)*.45:0;});
      if(fanMotion)rotors.forEach((r,i)=>r.rotation.z=time*(11+i));
      sculptures.forEach(s=>{const active=hovered===technologies[s.index][0];s.root.rotation.y=.5+(active?Math.sin(time*1.8)*.28:0);s.root.position.y=s.baseY+(active?.018:0);});
      pet.update(time,motion,hovered==='Desk bot');
      slides.forEach(s=>{if(screensPlaying&&projects.length>1&&time>=s.next){if(s.next)s.index=(s.index+1)%projects.length;s.next=time+4;s.dirty=true;}if(s.dirty)s.draw();});
    },
    toggleVideos(){const play=!screensPlaying;screensPlaying=play;return play;},
    toggleMotion(){motion=!motion;return motion;},
    toggleMusic,
    dispose(){videos.forEach(v=>{v.pause();v.removeAttribute('src');v.load();});}
  };
}
