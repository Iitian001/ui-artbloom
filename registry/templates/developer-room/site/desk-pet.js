import * as THREE from './assets/three.module.js';

/**
 * A small desk robot: a rounded body with a screen face, two eyes on the screen,
 * an antenna with a glowing tip, and two stubby wheels. It idles with a gentle
 * sway, blinks, and does a happy hop with a spinning antenna when clicked.
 *
 * Same interface as any pet the room accepts: { root, hit, react(), update() }.
 * Swap it for your own character by returning that shape.
 */
export function createDeskPet() {
  const root = new THREE.Group(), body = new THREE.Group();
  root.add(body); body.position.y = .17;

  const shell = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: .38, metalness: .15 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x5b6878, roughness: .5, metalness: .4 });
  const screen = new THREE.MeshStandardMaterial({ color: 0x0c1a22, roughness: .25, metalness: .1 });
  const glow = new THREE.MeshStandardMaterial({ color: 0x7ff0e6, emissive: 0x3fd8cc, emissiveIntensity: 1.4, roughness: .3 });

  // Body: a capsule lying on its side reads as a friendly rounded box.
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.11, .14, 8, 20), shell);
  torso.rotation.z = Math.PI / 2; body.add(torso);

  const face = new THREE.Mesh(new THREE.PlaneGeometry(.22, .13), screen);
  face.position.set(0, .01, .112); body.add(face);

  const eyes = [-.05, .05].map(x => {
    const eye = new THREE.Mesh(new THREE.CircleGeometry(.018, 20), glow);
    eye.position.set(x, .018, .114); body.add(eye); return eye;
  });

  const antenna = new THREE.Group(); antenna.position.set(0, .11, 0); body.add(antenna);
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .07, 8), trim);
  stalk.position.y = .035; antenna.add(stalk);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(.018, 16, 12), glow);
  tip.position.y = .075; antenna.add(tip);

  const wheels = [-.11, .11].map(x => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .03, 20), trim);
    wheel.rotation.z = Math.PI / 2; wheel.position.set(x, .045, 0); root.add(wheel); return wheel;
  });

  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = 128; shadowCanvas.height = 128;
  const c = shadowCanvas.getContext('2d'), gradient = c.createRadialGradient(64, 64, 8, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(0,0,0,.45)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = gradient; c.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(.5, .3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = .002; root.add(shadow);

  // Invisible, stable click target: the visible parts move.
  const hit = new THREE.Mesh(new THREE.BoxGeometry(.4, .4, .26), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.y = .18; root.add(hit);

  let reactionUntil = 0, lastTime = 0;
  return {
    root, hit,
    react() { reactionUntil = lastTime + 2.3; },
    update(time, motion, hovered) {
      lastTime = time; const happy = motion && time < reactionUntil;
      const phase = time * 7, hop = happy ? Math.abs(Math.sin(phase)) * .05 : 0;
      body.position.y = .17 + hop + (motion ? Math.sin(time * 2) * .003 : 0);
      body.rotation.z = motion ? Math.sin(time * (happy ? 7 : 1.2)) * (happy ? .1 : .015) : 0;
      body.rotation.y = hovered ? .15 : (motion ? Math.sin(time * .6) * .08 : 0);
      antenna.rotation.y = happy ? time * 9 : 0;
      tip.material.emissiveIntensity = 1.1 + (motion ? Math.sin(time * 3) * .4 : 0);
      const blink = motion && (time % 5.2 > 5.04); eyes.forEach(eye => eye.scale.y = blink ? .15 : 1);
      wheels.forEach(w => w.rotation.x = happy ? time * 8 : 0);
      shadow.material.opacity = 1 - hop * 7;
    }
  };
}
