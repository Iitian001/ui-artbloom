import * as THREE from './assets/three.module.js';
import {addRoomObjects} from './room-objects.js';

// A Cycles-rendered spherical interior preserves the Substance materials and
// indirect lighting on mobile as well as desktop. The editable source is Blender.
export function createRoomViewer({canvas,stage,stations,projects,certificates,shelf,onProject,onSkill,onCertificate,onContact,onMessage,onLoad,onError,onProgress,onTerminal,onBooks,onNotes,onNightMode,onMusicState,onTourState}) {
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.NoToneMapping;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(64,1,.1,20);
  const initial={yaw:-.19,pitch:innerWidth<600?-.10:-.04};
  let yaw=initial.yaw,pitch=initial.pitch,targetYaw=yaw,targetPitch=pitch;
  let fov=innerWidth<600?56:62,targetFov=fov,drag=null,ready=false,active=true,frameId=null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let panoramaReady=false,assetsReady=false,completed=false,tour=null;
  const manager=new THREE.LoadingManager();
  function complete(){if(!completed&&panoramaReady&&assetsReady){completed=true;ready=true;stage.classList.add('loaded');onLoad();}}
  manager.onProgress=(url,loaded,total)=>onProgress?.(loaded,total);
  manager.onLoad=()=>{assetsReady=true;complete();};
  const useHighResolution=innerWidth>=900&&renderer.capabilities.maxTextureSize>=8192;
  const texture=new THREE.TextureLoader(manager).load('./assets/room-working-4k.jpg',()=>{
    const envCanvas=document.createElement('canvas');envCanvas.width=1024;envCanvas.height=512;envCanvas.getContext('2d').drawImage(texture.image,0,0,1024,512);
    const environment=new THREE.CanvasTexture(envCanvas);environment.colorSpace=THREE.SRGBColorSpace;environment.mapping=THREE.EquirectangularReflectionMapping;
    const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromEquirectangular(environment).texture;scene.environmentIntensity=.6;environment.dispose();pmrem.dispose();
    panoramaReady=true;complete();
    if(useHighResolution)new THREE.TextureLoader().load('./assets/room-working-8k.jpg',high=>{high.colorSpace=THREE.SRGBColorSpace;material.uniforms.panorama.value=high;texture.dispose();},undefined,()=>{});
  },undefined,onError);
  texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.ShaderMaterial({
    uniforms:{panorama:{value:texture}},side:THREE.BackSide,depthWrite:false,depthTest:false,
    vertexShader:`varying vec3 roomDirection;
      void main(){roomDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`uniform sampler2D panorama;varying vec3 roomDirection;
      void main(){vec3 d=normalize(roomDirection);
      vec2 uv=vec2(0.5+atan(d.x,-d.z)/6.28318530718,0.5+asin(clamp(d.y,-1.0,1.0))/3.14159265359);
      gl_FragColor=texture2D(panorama,uv);
      #include <colorspace_fragment>
      }`
  });
  const panorama=new THREE.Mesh(new THREE.SphereGeometry(10,64,32),material);panorama.renderOrder=-100;scene.add(panorama);
  const objects=addRoomObjects(scene,{projects,certificates,shelf,onProject,onSkill,onCertificate,onContact,onMessage,onTerminal,onBooks,onNotes,onNightMode,onMusicState,manager,anisotropy:renderer.capabilities.getMaxAnisotropy()});
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function pick(e){const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(objects.picks,false)[0]?.object;}
  function fit(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  new ResizeObserver(fit).observe(stage);fit();
  function stopTour(){if(tour){tour=null;onTourState?.(false);}}
  canvas.addEventListener('pointerdown',e=>{stopTour();drag={x:e.clientX,y:e.clientY,distance:0};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag){const hit=pick(e);objects.hover(hit);canvas.style.cursor=hit?'pointer':'grab';return;}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.distance+=Math.abs(dx)+Math.abs(dy);targetYaw-=dx*.003;targetPitch=Math.max(-.65,Math.min(.55,targetPitch+dy*.003));drag.x=e.clientX;drag.y=e.clientY;canvas.classList.add('dragging');});
  canvas.addEventListener('pointerup',e=>{if(drag&&drag.distance<8)pick(e)?.userData.action?.();drag=null;canvas.classList.remove('dragging');});
  canvas.addEventListener('pointercancel',()=>{drag=null;canvas.classList.remove('dragging');});
  canvas.addEventListener('pointerleave',()=>{objects.hover(null);});
  canvas.addEventListener('wheel',e=>{stopTour();e.preventDefault();targetFov=Math.max(14,Math.min(innerWidth<600?105:80,targetFov+e.deltaY*.035));},{passive:false});
  canvas.tabIndex=0;
  canvas.addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')){stopTour();e.preventDefault();}if(e.key==='ArrowLeft')targetYaw-=.12;if(e.key==='ArrowRight')targetYaw+=.12;if(e.key==='ArrowUp')targetPitch+=.08;if(e.key==='ArrowDown')targetPitch-=.08;targetPitch=Math.max(-.65,Math.min(.55,targetPitch));});
  function goFocus(key){const v=new THREE.Vector3(...stations[key].spot).normalize(),angle=Math.atan2(v.x,-v.z)+(innerWidth>=900?.14:0);targetYaw=yaw+Math.atan2(Math.sin(angle-yaw),Math.cos(angle-yaw));targetPitch=Math.asin(v.y)-(innerWidth<600?.22:0);targetFov=({skills:innerWidth<600?70:38,work:innerWidth<600?60:29,credentials:innerWidth<600?39:19})[key]||(innerWidth<600?58:53);}
  const forward=new THREE.Vector3(),tourStops=['about','skills','work','credentials','contact'];
  function frame(time=0){frameId=null;if(!active||document.hidden)return;frameId=requestAnimationFrame(frame);if(tour&&time>=tour.next){tour.index++;if(tour.index>=tourStops.length)stopTour();else{goFocus(tourStops[tour.index]);tour.next=time+4300;}}objects.update(time/1000);const speed=reduced?1:.075;yaw+=(targetYaw-yaw)*speed;pitch+=(targetPitch-pitch)*speed;fov+=(targetFov-fov)*speed;
    camera.fov=fov;camera.updateProjectionMatrix();forward.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));camera.lookAt(forward);camera.updateMatrixWorld();
    renderer.render(scene,camera);
  }
  function setActive(value){if(!value)stopTour();active=value;if(frameId!==null){cancelAnimationFrame(frameId);frameId=null;}objects.setActive(active&&!document.hidden);if(active&&!document.hidden){fit();frame();}}
  document.addEventListener('visibilitychange',()=>setActive(active));
  frame();
  return {
    setActive,
    focus(key){stopTour();goFocus(key);},
    reset(){stopTour();targetYaw=initial.yaw;targetPitch=initial.pitch;targetFov=innerWidth<600?56:62;},
    tour(){if(tour){stopTour();return false;}tour={index:0,next:performance.now()+4300};goFocus(tourStops[0]);onTourState?.(true);return true;},
    toggleVideos:objects.toggleVideos,
    toggleMotion:objects.toggleMotion
    ,toggleMusic:objects.toggleMusic
  };
}
