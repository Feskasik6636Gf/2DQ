import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { buildWorld, canvasTex, G, DESK, INT } from './world';
import { SHOTS } from './shots';
import { applyEnv, avalanche, easeFn, shotAt, updateFigures } from './anim';
import { WORDS } from './words';
import { Hud } from './Hud';
import { Captions } from './Captions';

const W = 1080, H = 1920;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const nz = (x: number) => Math.sin(x * 1.7) * 0.5 + Math.sin(x * 3.1 + 1.3) * 0.3 + Math.sin(x * 7.3 + 2.1) * 0.2;

const PUNCH_WORDS = ['ночь', 'страшнее', 'огонь', 'тела', 'травмами', 'почему', 'лавину', 'споры', 'никто', 'босиком', 'километра', 'минус', 'разрезают', 'выбегают', 'опытными', 'странного'];
const PUNCH_T: number[] = WORDS.filter(w => PUNCH_WORDS.includes(w[0].toLowerCase().replace(/[^а-яё]/g, ''))).map(w => w[1]);

let world: ReturnType<typeof buildWorld> | null = null;
let stampTex: THREE.Texture | null = null;

function makeDesk(w: NonNullable<typeof world>) {
  // papers with Titan One text
  const paper = (txt: string, x: number, z: number, rot: number, big = false) => {
    const tex = canvasTex(512, 640, c => {
      c.fillStyle = '#efe6cf'; c.fillRect(0, 0, 512, 640);
      c.fillStyle = '#3a342a';
      for (let i = 0; i < 16; i++) c.fillRect(40, 140 + i * 24, 300 + ((i * 53) % 130), 6);
      c.font = '56px "TitanOneX", "RubikBlack"'; c.fillText(txt, 40, 90);
      c.strokeStyle = '#7a6a4a'; c.strokeRect(10, 10, 492, 620);
    });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.0), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
    m.rotation.x = -Math.PI / 2; m.rotation.z = rot; m.position.set(x, 1.17 + Math.abs(rot) * 0.01, z);
    w.deskGroup.add(m);
  };
  paper('ДЕЛО', -1.8, 0.2, 0.25); paper('1959', -0.4, -0.4, -0.15); paper('2020', 1.2, 0.5, 0.1); paper('УРАЛ', 2.1, -0.6, -0.3);
  stampTex = canvasTex(512, 512, c => {
    c.translate(256, 256); c.rotate(-0.25);
    c.strokeStyle = '#d8281c'; c.fillStyle = '#d8281c'; c.lineWidth = 16; c.strokeRect(-230, -90, 460, 180);
    c.font = '110px "TitanOneX", "RubikBlack"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('ЛАВИНА', 0, 8);
  });
  (w.stamp.material as THREE.MeshBasicMaterial).map = stampTex; (w.stamp.material as THREE.MeshBasicMaterial).needsUpdate = true;
  (w.stamp.material as THREE.MeshBasicMaterial).depthWrite = false;
}

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('fonts+world'));
  const t = frame / fps;

  useEffect(() => {
    const st = document.createElement('style');
    st.textContent = `@font-face{font-family:"TitanOneX";src:url("${staticFile('fonts/TitanOne-Regular.ttf')}") format("truetype");font-weight:400;font-style:normal;}@font-face{font-family:"RubikBlack";src:url("${staticFile('fonts/Rubik-Black.ttf')}") format("truetype");font-weight:400;font-style:normal;}`;
    document.head.appendChild(st);
    Promise.all([(document as any).fonts.load('60px "TitanOneX"', '9'), (document as any).fonts.load('60px "RubikBlack"', 'АБВ')]).then((r: any) => { console.log('font loaded', r.length); }).catch((e: any) => console.log('font err', String(e))).then(() => {
      if (!world) { world = buildWorld(W, H); makeDesk(world); }
      if (host.current && !host.current.contains(world.renderer.domElement)) {
        const el = world.renderer.domElement; el.style.width = '100%'; el.style.height = '100%'; host.current.appendChild(el);
      }
      setReady(true); continueRender(handle);
    });
  }, [handle]);

  const { shot, idx } = shotAt(t, SHOTS);
  const dur = shot.b - shot.a;
  const lt = t - shot.a;
  const u = clamp(lt / dur);

  useLayoutEffect(() => {
    if (!ready || !world) return;
    const w = world; const cam = w.camera;
    applyEnv(w, shot.env, t, u);
    updateFigures(w as any, t);
    avalanche(w as any, t, shot.env === 'night' && t >= 81.5 && t < 90 || (shot.fx || []).includes('avalanche'));
    // stamp
    (w.stamp.material as THREE.MeshBasicMaterial).opacity = clamp((t - 80.35) * 12);
    w.stamp.scale.setScalar(1 + Math.max(0, 0.9 - (t - 80.35) * 6) * 1.6);
    // camera
    const e = easeFn(shot.ease, u);
    const lerp3 = (a: number[], b: number[], k: number) => new THREE.Vector3(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k);
    let pos: THREE.Vector3, look: THREE.Vector3;
    if (shot.orb) {
      const o = shot.orb; const ang = o.a0 + (o.a1 - o.a0) * e; const r = o.r0 + (o.r1 - o.r0) * e; const hh = o.h0 + (o.h1 - o.h0) * e;
      pos = new THREE.Vector3(o.c[0] + Math.sin(ang) * r, o.c[1] + hh, o.c[2] + Math.cos(ang) * r); look = new THREE.Vector3(...o.c);
    } else { pos = lerp3(shot.p0, shot.p1, e); look = lerp3(shot.l0, shot.l1, e); }
    // never below ground outdoors
    if (shot.env !== 'inside' && shot.env !== 'desk') pos.y = Math.max(pos.y, G(pos.x, pos.z) + 0.35);
    // handheld shake + permanent micro drift
    const sh = (shot.shake ?? 0.2) * (1 + (PUNCH_T.some(p => t >= p && t < p + 0.25) ? 1.2 : 0));
    const tt = t * 9;
    const dist = pos.distanceTo(look);
    const amp = 0.02 * sh * Math.max(1.5, Math.min(30, dist * 0.35));
    pos.x += nz(tt) * amp; pos.y += nz(tt + 11) * amp * 0.8; pos.z += nz(tt + 23) * amp;
    look.x += nz(tt + 31) * amp * 0.6; look.y += nz(tt + 41) * amp * 0.6;
    cam.position.copy(pos); cam.up.set(0, 1, 0); cam.lookAt(look);
    const rollDeg = (shot.roll ?? 0) + (shot.roll1 ?? shot.roll ?? 0 - 0) * 0 + nz(tt * 0.7 + 5) * sh * 1.6 + ((idx % 2 ? 1 : -1) * 2 * (1 - e));
    cam.rotateZ(rollDeg * Math.PI / 180);
    let fov = shot.f0 + (shot.f1 - shot.f0) * e;
    if ((shot.fx || []).includes('punch')) fov *= 1 + 0.2 * Math.exp(-lt * 7) * -1 + 0.0;
    for (const pt of PUNCH_T) if (t >= pt && t < pt + 0.5) fov *= 1 - 0.07 * Math.exp(-(t - pt) * 9);
    cam.fov = fov; cam.near = shot.env === 'inside' || shot.env === 'desk' ? 0.05 : 0.15; cam.updateProjectionMatrix();
    // snow
    const sm = w.snowMat.uniforms; const sI = shot.env === 'inside' || shot.env === 'desk' ? 0 : (shot.snow ?? (shot.env === 'storm' ? 1 : 0.35));
    sm.uT.value = t; sm.uCam.value.copy(cam.position); sm.uWind.value = 0.4 + sI * 1.6; sm.uFall.value = 2.5 + sI * 3; sm.uSize.value = 0.9 + sI; sm.uAlpha.value = 0.1 + sI * 0.75;
    sm.uBox.value = shot.env === 'storm' || shot.env === 'red' ? 28 : 55;
    w.renderer.render(w.scene, cam);
  });

  // 2D post effects ---------------------------------------------------------
  const fx = shot.fx || [];
  const nextShot = SHOTS[idx + 1];
  const f0 = Math.round(lt * fps);
  const toNext = Math.round((shot.b - t) * fps);
  let blur = 0, tx = 0;
  if (fx.includes('whip') && f0 < 5) { blur = 18 * (1 - f0 / 5); tx = (idx % 2 ? 1 : -1) * 90 * (1 - f0 / 5); }
  if (nextShot && (nextShot.fx || []).includes('whip') && toNext <= 3 && toNext > 0) { blur = 10 * (4 - toNext) / 3; tx = (idx % 2 ? -1 : 1) * 40; }
  // cut kick: slight scale-down punch on each cut
  let kick = 1 + 0.06 * Math.exp(-lt * 14);
  for (const pt of PUNCH_T) if (t >= pt && t < pt + 0.4) kick += 0.035 * Math.exp(-(t - pt) * 12);
  // slow continuous zoom drift so frames never freeze
  const drift = 1 + 0.015 * u;
  const flash = fx.includes('flash') ? Math.exp(-lt * 9) : 0;
  const redA = fx.includes('red') ? 0.28 + 0.12 * Math.sin(t * 9) : shot.env === 'red' ? 0.22 : 0;
  const darkA = fx.includes('dark') ? u * 0.9 : 0;
  const fadeIn = fx.includes('fadein') ? Math.max(0, 1 - lt / 0.5) : 0;
  const fadeOut = fx.includes('fadeout') ? clamp((t - (shot.b - 1.6)) / 1.5) : 0;
  const slashA = fx.includes('slash') ? lt : -1;

  return (
    <AbsoluteFill style={{ background: '#05070d' }}>
      <Audio src={staticFile('audio/mix.m4a')} />
      <AbsoluteFill style={{ transform: `translateX(${tx}px) scale(${kick * drift})`, filter: blur ? `blur(${blur}px)` : undefined }}>
        <div ref={host} style={{ position: 'absolute', inset: 0 }} />
      </AbsoluteFill>
      {/* vignette */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)' }} />
      {redA > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(255,30,20,${redA * 0.5}) 0%, rgba(160,0,0,${redA * 1.4}) 100%)`, mixBlendMode: 'multiply' }} />}
      {darkA > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${darkA * 0.5}) 0%, rgba(0,0,0,${darkA}) 85%)` }} />}
      {/* speed lines on punches */}
      <Hud t={t} shot={shot} lt={lt} />
      {slashA >= 0 && slashA < 0.5 && (
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <line x1={W * 0.1} y1={H * (0.2 + slashA * 0.9)} x2={W * (0.1 + slashA * 3.2)} y2={H * (0.2 + slashA * 0.3)} stroke="#fff" strokeWidth={14 * (1 - slashA * 1.6)} strokeLinecap="round" opacity={1 - slashA * 2} />
        </svg>
      )}
      {flash > 0.01 && <AbsoluteFill style={{ background: '#fff', opacity: flash * 0.85 }} />}
      {fadeIn > 0 && <AbsoluteFill style={{ background: '#000', opacity: fadeIn }} />}
      {fadeOut > 0 && <AbsoluteFill style={{ background: '#000', opacity: fadeOut }} />}
      <Captions t={t} fps={fps} />
    </AbsoluteFill>
  );
};
