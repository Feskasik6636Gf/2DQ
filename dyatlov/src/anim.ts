import * as THREE from 'three';
import { G, CEDAR, INT, Figure } from './world';
import type { World } from './world';
import type { Env, Shot } from './shots';

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ss = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const h1 = (n: number) => { const s = Math.sin(n * 91.3458) * 47453.5453; return s - Math.floor(s); };

type Mode = 'walk' | 'run' | 'stand' | 'hug' | 'lie' | 'sleep' | 'sit' | 'crawl';

function pose(f: Figure, mode: Mode, tt: number, spd = 1) {
  f.armL.rotation.set(0, 0, 0.1); f.armR.rotation.set(0, 0, -0.1);
  f.legL.rotation.set(0, 0, 0); f.legR.rotation.set(0, 0, 0);
  f.body.position.set(0, 0.95, 0); f.body.rotation.set(0, 0, 0);
  f.head.rotation.set(0, 0, 0); f.eyes.scale.set(1, 1, 1);
  if (mode === 'walk') {
    const w = tt * 7.5 * spd;
    f.legL.rotation.x = Math.sin(w) * 0.7; f.legR.rotation.x = -Math.sin(w) * 0.7;
    f.armL.rotation.x = -Math.sin(w) * 0.6; f.armR.rotation.x = Math.sin(w) * 0.6;
    f.body.position.y += Math.abs(Math.sin(w)) * 0.05; f.body.rotation.z = Math.sin(w) * 0.05; f.body.rotation.x = 0.08;
  } else if (mode === 'run') {
    const w = tt * 13;
    f.legL.rotation.x = Math.sin(w) * 1.0; f.legR.rotation.x = -Math.sin(w) * 1.0;
    f.armL.rotation.x = -Math.sin(w) * 1.1; f.armR.rotation.x = Math.sin(w) * 1.1;
    f.body.position.y += Math.abs(Math.sin(w)) * 0.1; f.body.rotation.x = 0.3; f.head.rotation.x = -0.2;
  } else if (mode === 'stand') {
    f.body.position.y += Math.sin(tt * 2.2) * 0.012;
    f.armL.rotation.z = 0.12 + Math.sin(tt * 1.6) * 0.03; f.armR.rotation.z = -0.12;
    f.head.rotation.y = Math.sin(tt * 0.8) * 0.25;
  } else if (mode === 'hug') {
    f.armL.rotation.set(-1.15, 0, 0.85); f.armR.rotation.set(-1.15, 0, -0.85);
    f.body.rotation.x = 0.18; f.head.rotation.x = 0.2;
    f.body.position.x = Math.sin(tt * 55) * 0.018; f.body.position.y -= 0.03;
  } else if (mode === 'sleep') {
    f.eyes.scale.set(1, 0.08, 1);
    f.body.position.y += Math.sin(tt * 1.8) * 0.012;
    f.armL.rotation.z = 0.1; f.armR.rotation.z = -0.1;
  } else if (mode === 'sit') {
    f.armL.rotation.x = -0.5; f.armR.rotation.x = -0.5; f.head.rotation.y = Math.sin(tt * 3) * 0.4;
  } else if (mode === 'lie') {
    f.eyes.scale.set(1, 0.08, 1);
    f.armL.rotation.set(-0.3, 0, 0.3); f.armR.rotation.set(-0.3, 0, -0.3);
  } else if (mode === 'crawl') {
    const w = tt * 3.2;
    f.armL.rotation.set(-2.7 + Math.sin(w) * 0.5, 0, 0.1); f.armR.rotation.set(-2.7 - Math.sin(w) * 0.5, 0, -0.1);
    f.legL.rotation.x = Math.sin(w + 1) * 0.35; f.legR.rotation.x = -Math.sin(w + 1) * 0.35;
    f.head.rotation.x = -0.9;
  }
}

function place(f: Figure, x: number, z: number, ry: number, mode: Mode, tt: number, o: { y?: number; rx?: number; spd?: number; barefoot?: boolean; ground?: boolean; px?: number } = {}) {
  const g = o.ground === false ? 0 : G(x, z);
  const lying = mode === 'lie' || mode === 'sleep' || mode === 'crawl';
  f.root.visible = true;
  f.root.position.set(x, (o.y ?? g) + (lying && o.ground !== false ? 0.3 : 0), z);
  f.root.rotation.set(o.rx ?? (mode === 'sleep' ? -Math.PI / 2 : mode === 'lie' ? Math.PI / 2 : mode === 'crawl' ? Math.PI / 2 - 0.15 : 0), ry, 0, 'YXZ');
  pose(f, mode, tt, o.spd ?? 1);
  const bf = !!o.barefoot;
  f.bootL.visible = f.bootR.visible = !bf; f.footL.visible = f.footR.visible = bf;
}

// tourists' fate (all positions deterministic from t)
export function updateFigures(w: World, t: number) {
  const figs = w.figs;
  for (let i = 0; i < 9; i++) {
    const f = figs[i];
    f.root.visible = false;
    f.root.parent !== w.scene && w.scene.add(f.root);
    const xf = -6 + 1.5 * i;
    if (t < 9.9) {
      // approach and stop in front of the tent
      const tArr = 6.3;
      const x = Math.min(xf, xf - 9 * (tArr - t));
      const walking = x < xf - 0.01;
      place(f, x, 5 + (i % 2) * 0.6, walking ? Math.PI / 2 : 0.15 * (i % 3 - 1), walking ? 'walk' : 'stand', t + i * 0.37, { spd: 1 });
    } else if (t < 29.6) {
      // sleeping inside the interior tent
      if (t < 29.6) {
        const awake = i === 3;
        const x = INT.x - 2.1 + i * 0.52;
        const sitU = awake ? ss(17.1, 18.2, t) : 0;
        const fam = f.root;
        w.scene.add(fam);
        f.root.visible = true;
        const mode: Mode = awake && sitU > 0.5 ? 'sit' : 'sleep';
        f.root.position.set(x, 0.66 + sitU * 0.22, INT.z + 1.55);
        f.root.rotation.set(-Math.PI / 2 + sitU * 1.45, 0, 0, 'YXZ');
        pose(f, mode, t + i, 1);
        if (awake) { f.eyes.scale.set(1, 1 - 0.92 * (1 - ss(16.9, 17.4, t)), 1); f.head.rotation.y = Math.sin(t * 2.6) * 0.5 * sitU; }
        f.bootL.visible = f.bootR.visible = true; f.footL.visible = f.footR.visible = false;
      }
    } else if (t < 30.7) {
      // slashing the tent: still inside, sitting up
      f.root.visible = false;
    } else if (t < 75.6) {
      const ts = t - 30.7;
      const lat = (i - 4) * 1.5 + Math.sin(i * 2.1 + ts * 0.6) * 0.8;
      const delay = i * 0.18;
      const run = Math.max(0, ts - delay);
      if (t < 41) {
        const z = 3.8 - run * 7.2;
        place(f, lat * (1 + run * 0.06) + 0.0, z, Math.PI, 'run', run, {});
      } else {
        // slowed, barefoot, hugging
        const z41 = 3.8 - (41 - 30.7 - delay) * 7.2;
        const sp = 3.4;
        const zStop = -(78 + (i % 3) * 7 + (i % 2) * 4);
        let z = z41 - (t - 41) * sp;
        z = Math.max(z, zStop);
        const moving = z > zStop;
        const bare = t >= 42.9;
        const x = lat * 1.6;
        if (t < 52.9) {
          place(f, x, z, moving ? Math.PI : Math.PI * 0.9 + (i % 3) * 0.1, moving ? 'walk' : 'hug', t + i, { spd: 0.55, barefoot: bare });
        } else if (i < 3) {
          // under the cedar
          if (t < 61.5) {
            const a = i * 2.1 + 0.6;
            place(f, CEDAR.x + 2.2 + Math.cos(a) * 2.2, CEDAR.z + 3 + Math.sin(a) * 2.2, a + Math.PI, i === 1 ? 'hug' : 'stand', t + i * 2, { barefoot: true });
            if (i !== 1) { pose(f, 'hug', t + i, 1); }
          } else {
            const a = i * 2.1 + 0.6;
            place(f, CEDAR.x + 2.2 + Math.cos(a) * 2.6, CEDAR.z + 3 + Math.sin(a) * 2.6, a, 'lie', t, { barefoot: true });
          }
        } else {
          // walking back toward the tent, never arriving
          const j = i - 3;
          const stopAt = 57.4 + j * 0.55;
          const zStart = zStop;
          const tw = Math.max(0, Math.min(t, stopAt) - 53.2 - j * 0.12);
          const zz = zStart + tw * 2.6;
          const mode: Mode = t < 54 ? 'hug' : t < stopAt ? 'crawl' : 'lie';
          const zLie = zStart + (stopAt - 53.2 - j * 0.12) * 2.6;
          const zNow = t < stopAt ? zz : zLie;
          const xx = ((j % 2) * 2.4 - 1.2) + x * 0.3;
          if (t >= 68.6 && t < 72.2) {
            // recollection: the nine standing in a line facing the viewer
            place(f, (i - 4) * 1.5, -48, 0, 'stand', t + i, { barefoot: false });
          } else {
            place(f, xx, t < 54 ? zStart : zNow, t < 54 ? Math.PI * 0.9 : 0, mode, t + i, { barefoot: true });
          }
        }
        if (t >= 68.6 && t < 72.2 && i < 3) place(f, (i - 4) * 1.5, -48, 0, 'stand', t + i, {});
      }
    } else if (t < 77.9) {
      // flashback: running out of the tent into the dark
      const ts = t - 75.6;
      const lat = (i - 4) * 1.4;
      const run = Math.max(0, ts - i * 0.12);
      place(f, lat * (1 + run * 0.1), 4.0 - run * 7.0, Math.PI, 'run', run, {});
    }
    // final scenes: nobody around
  }
}

export function applyEnv(w: World & { renderer: THREE.WebGLRenderer }, env: Env, t: number, u: number) {
  const sc = w.scene as THREE.Scene;
  const fog = sc.fog as THREE.Fog;
  const bg = sc.background as THREE.Color;
  const U = w.skyMat.uniforms;
  let top = 0x050a1f, mid = 0x1a2f66, hor = 0x4a6cb0, stars = 1, fogC = 0x1a2748, near = 60, far = 800, sunC = 0xbcd2ff, sunI = 2.0, hemiS = 0x7f9be0, hemiG = 0xdfe8ff, hemiI = 0.9, amb = 0.15, expo = 1.05;
  if (env === 'dusk') { top = 0x2b4a8c; mid = 0x8a6fa8; hor = 0xf6a870; stars = 0.0; fogC = 0xe0a890; near = 120; far = 1100; sunC = 0xffc890; sunI = 3.3; hemiS = 0xa0b8ff; hemiG = 0xffe0d0; hemiI = 1.0; }
  if (env === 'storm') { top = 0x28303e; mid = 0x3a4658; hor = 0x6a778c; stars = 0; fogC = 0x56637a; near = 6; far = 170; sunC = 0xa8bad8; sunI = 1.2; hemiS = 0x90a0c0; hemiG = 0xdfe8ff; hemiI = 1.15; expo = 1.1; }
  if (env === 'red') { top = 0x200608; mid = 0x4a1018; hor = 0x7a2a2a; stars = 0; fogC = 0x5a2226; near = 5; far = 160; sunC = 0xff6a5a; sunI = 1.6; hemiS = 0xff7a70; hemiG = 0xffc8c0; hemiI = 1.1; }
  if (env === 'dawn') { top = 0x3a5a9a; mid = 0xb08ab0; hor = 0xffc0a0; stars = 0; fogC = 0xc0c8dc; near = 40; far = 500; sunC = 0xffb8a0; sunI = 2.6; hemiS = 0xa8b8e8; hemiG = 0xfff0e8; hemiI = 1.0; }
  if (env === 'fire') { fogC = 0x1d2236; near = 20; far = 420; sunI = 1.4; hemiI = 0.8; }
  if (env === 'inside') { top = 0x080c18; mid = 0x080c18; hor = 0x080c18; stars = 0; fogC = 0x1a1008; near = 500; far = 900; sunI = 0.0; hemiI = 0.05; amb = 0.0; expo = 1.1; }
  if (env === 'desk') { top = 0x0a0e18; mid = 0x0a0e18; hor = 0x0a0e18; stars = 0; fogC = 0x0a0e18; near = 80; far = 200; sunI = 0.0; hemiI = 0.25; hemiS = 0x8090b0; hemiG = 0x201810; amb = 0.1; }
  U.top.value.set(top); U.mid.value.set(mid); U.hor.value.set(hor); U.stars.value = stars;
  bg.set(fogC); fog.color.set(fogC); fog.near = near; fog.far = far;
  w.sun.color.set(sunC); w.sun.intensity = sunI;
  w.hemi.color.set(hemiS); w.hemi.groundColor.set(hemiG); w.hemi.intensity = hemiI; w.amb.intensity = amb;
  w.renderer.toneMappingExposure = expo;
  w.intGroup.visible = env === 'inside';
  w.deskGroup.visible = env === 'desk';
  w.fire.visible = t >= 53 && env !== 'inside';
  w.fireLight.intensity = (w.fire.visible ? 1 : 0) * (260 + Math.sin(t * 31) * 40 + Math.sin(t * 17.3) * 30);
  w.fire.children.forEach((c, k) => { if ((c as any).isMesh) { c.scale.set(1 + Math.sin(t * 20 + k) * 0.18, 1 + Math.sin(t * 25 + k * 2) * 0.35, 1); } });
  w.lantern.intensity = 20 + Math.sin(t * 13) * 2 + (t > 24.4 && t < 26.8 ? Math.sin(t * 40) * 6 - (t - 24.4) * 6 : 0);
  // slit
  const sl = ss(29.5, 30.3, t) * (t < 70 ? 1 : 0) + (t >= 73.9 ? ss(73.9, 74.7, t) : 0) * (t < 76 ? 1 : 0);
  const slOn = (t >= 29.5 && t < 70) || (t >= 73.9);
  w.slit.scale.x = slOn ? 0.03 + 0.3 * (t >= 73.9 ? 1 : ss(29.5, 30.3, t)) : 0.001;
  w.slitI.scale.x = (t >= 29.5 && t < 32.5) || (t >= 73.9 && t < 77) ? 0.03 + 0.5 * (t >= 73.9 ? ss(73.9, 74.8, t) : ss(29.5, 30.3, t)) : 0.001;
  w.intItems.knife.visible = true;
  const left = t > 31;
  w.intItems.boots.visible = true;
  // outer lights for the rescue scene
  w.searchLights.visible = false;
}

export function avalanche(w: World, t: number, active: boolean) {
  const ch = w.chunks;
  ch.visible = active;
  if (!active) return;
  const d = new THREE.Object3D();
  const t0 = 81.5;
  for (let k = 0; k < 420; k++) {
    const side = h1(k) > 0.5 ? 1 : -1;
    const lx = side * (6 + h1(k + 5) * 55);
    const sp = 38 + h1(k + 9) * 30;
    const run = Math.max(0, (t - t0) - h1(k + 13) * 2.4);
    const decel = 1 - ss(84.0, 88.5, t) * 0.92;
    const s = run * sp * (0.4 + 0.6 * decel);
    const z = 160 - s - h1(k + 21) * 80;
    const x = lx + Math.sin(k + t * 1.4) * 2;
    const y = G(x, z) + 1.0 + Math.abs(Math.sin(run * 3 + k)) * 1.2 * decel;
    d.position.set(x, y, z);
    d.rotation.set(run * 4 + k, run * 3, run * 2);
    d.scale.setScalar(t < t0 ? 0.001 : 0.8 + h1(k + 3) * 2.2);
    d.updateMatrix();
    ch.setMatrixAt(k, d.matrix);
  }
  ch.instanceMatrix.needsUpdate = true;
}

export function shotAt(t: number, shots: Shot[]): { shot: Shot; idx: number } {
  for (let i = shots.length - 1; i >= 0; i--) if (t >= shots[i].a - 1e-6) return { shot: shots[i], idx: i };
  return { shot: shots[0], idx: 0 };
}

export function easeFn(kind: string | undefined, u: number) {
  u = clamp(u);
  if (kind === 'lin') return u;
  if (kind === 'in') return u * u * (1.2 - 0.2 * u);
  if (kind === 'out') return 1 - (1 - u) * (1 - u) * (1.2 - 0.2 * (1 - u));
  return u * u * (3 - 2 * u);
}
