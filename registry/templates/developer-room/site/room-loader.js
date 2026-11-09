export function createLoadingScreen(){
  const screen=document.querySelector('#load-status'),bar=document.querySelector('#load-progress'),label=document.querySelector('#load-label'),amount=document.querySelector('#load-amount'),enter=document.querySelector('#enter-room'),retry=document.querySelector('#retry-room');
  const controls=[...document.querySelectorAll('.top-hud,.room-dock,.room-tools,#room-canvas')];
  controls.forEach(node=>node.inert=true);
  let complete=false,progress=0,visible=true,entered=false;
  retry.addEventListener('click',()=>location.reload());
  return {
    setVisible(value){visible=value;screen.hidden=!value||entered;screen.inert=!value||entered;controls.forEach(node=>node.inert=value&&!entered);},
    progress(loaded,total){if(complete)return;progress=Math.max(progress,total?Math.round(loaded/total*94):0);bar.value=progress;amount.textContent=progress+'%';label.textContent='Loading';},
    ready(){complete=true;bar.value=100;label.textContent='Ready';amount.textContent='100%';enter.disabled=false;enter.classList.add('ready');if(visible)enter.focus({preventScroll:true});
      // Framed (the ui.artbloom preview, or the Next.js page that hosts this room): go straight in once loaded.
      if(window.self!==window.top)queueMicrotask(()=>enter.click());},
    fail(){complete=true;label.textContent='The 3D room could not finish loading';amount.textContent='You can still browse the portfolio details.';retry.hidden=false;enter.disabled=false;enter.textContent='Browse portfolio';},
    enter(callback){enter.addEventListener('click',()=>{if(!complete)return;entered=true;screen.classList.add('done');screen.setAttribute('aria-hidden','true');screen.inert=true;controls.forEach(node=>node.inert=false);callback();});}
  };
}
