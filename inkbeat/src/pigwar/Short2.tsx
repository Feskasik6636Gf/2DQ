// The Pig War, "Blobhead" look (white round heads, stick limbs, cloth bodies, layered painted sets, red vs teal factions).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Captions, makeChunks } from "../inkbeat/core/captions";
import type { Word } from "../inkbeat/core/captions";
import { CastLight } from "../inkbeat/core/castLight";
import { subFrame, useFonts } from "../inkbeat/core/frame";
import { boxG, canvasTex, coneG, cylG, Label, M, sphG } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import type { MoodPreset } from "../inkbeat/core/moods";
import { aim, poseAt, withShake } from "../inkbeat/core/rig";
import type { Beat, Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { Boat, Cannon, Farmhouse, Island, Pig, PotatoField, Ship, Tent, Tree } from "./assets";
import { Blob, blobHead, solveBlobArm, toWorld } from "./Blob";
import type { BlobFace, BlobSpec } from "./Blob";
import { END, WORDS } from "./words";

const G = 0.15;
const RED = "#d8453c", TEAL = "#2a9aa6";
// ---- richer light: darker, more saturated, stronger shadows (measured against the reference: L 0.50, sat 0.45)
const richCache = new Map<string, MoodPreset>();
const rich = (id: string): MoodPreset => {
  let m = richCache.get(id);
  if (!m) {
    m = structuredClone(moodOf(id));
    m.post.grade.exposure -= 0.24;
    m.post.grade.contrast *= 1.1;
    m.post.grade.saturation *= 1.3;
    m.lights.hemi.intensity *= 0.78;
    m.post.vignette.amount = 0.3;
    richCache.set(id, m);
  }
  return m;
};

// ---- cast
const FARMER: BlobSpec = { body: "#b8782e", apron: "#7a4e1e", hat: "strawhat", beardColor: "#4a3020" };
const CLERK: BlobSpec = { body: "#8a2a30", trim: "#e8b830", hat: "tophat", hatColor: "#e8b830", beardColor: "#6a4a2a" };
const UK_CMD: BlobSpec = { body: RED, trim: "#e8b830", cape: "#a8282c", hat: "bicorne", hatColor: "#26222a", beardColor: "#3a2a20" };
const US_CMD: BlobSpec = { body: TEAL, trim: "#e8b830", cape: "#1f7a86", hat: "kepi", hatColor: "#1e5a66", beardColor: "#3a2a20" };
const EMPEROR: BlobSpec = { body: "#3c4252", trim: "#e8b830", cape: "#7a2a2a", hat: "pickel", beardColor: "#ece8e0" };
const SOLD = (team: "us" | "uk"): BlobSpec => (team === "us" ? { body: TEAL, hat: "helmet", hatColor: "#b8bcc8" } : { body: RED, hat: "kepi", hatColor: "#26222a" });

const SoldierB: React.FC<{ p: V3; yaw?: number; team: "us" | "uk"; s?: number; t?: number; walk?: number; face?: BlobFace }> = ({ p, yaw = 0, team, s = 0.55, t = 0, walk, face }) => (
  <Blob spec={SOLD(team)} p={p} yaw={yaw} s={s} t={t} face={face ?? { eyes: "open", brows: "neutral", mouth: "flat" }} pose={{ walk, armL: [10, 12], armR: [10, 12] }} />
);
const Rank: React.FC<{ n: number; p: V3; dx: number; dz: number; team: "us" | "uk"; yaw: number; t: number; rows?: number; rowStep?: V3 }> = ({ n, p, dx, dz, team, yaw, t, rows = 1, rowStep = [0, 0, 1.0] }) => (
  <>
    {Array.from({ length: n * rows }, (_, i) => {
      const r = Math.floor(i / n), c = i % n;
      return <SoldierB key={i} p={[p[0] + c * dx + r * rowStep[0], p[1], p[2] + c * dz + r * rowStep[2]]} yaw={yaw} team={team} t={t + c * 0.3} s={0.5 + ((c * 7 + r * 3) % 4) * 0.02} />;
    })}
  </>
);

// ---- painted backdrop ring (layered hills, haze, far sea details)
const Backdrop: React.FC = () => {
  const tex = canvasTex("pw-backdrop", 4096, 512, (g, w, h) => {
    const base = h * 0.85;
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, "rgba(0,0,0,0)"); grd.addColorStop(1, "rgba(0,0,0,0)");
    g.clearRect(0, 0, w, h);
    const layer = (col: string, amp: number, cyc: number, ph: number, y0: number, snow = false) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(0, h);
      for (let x = 0; x <= w; x += 8) {
        const u = (x / w) * Math.PI * 2;
        const y = y0 - amp * (0.55 + 0.3 * Math.sin(u * cyc + ph) + 0.15 * Math.sin(u * cyc * 2.7 + ph * 2) + 0.08 * Math.sin(u * cyc * 6.1 + ph));
        g.lineTo(x, y);
      }
      g.lineTo(w, h); g.closePath(); g.fill();
      if (snow) {
        g.fillStyle = "rgba(255,255,255,0.9)";
        for (let x = 0; x <= w; x += 8) {
          const u = (x / w) * Math.PI * 2;
          const y = y0 - amp * (0.55 + 0.3 * Math.sin(u * cyc + ph) + 0.15 * Math.sin(u * cyc * 2.7 + ph * 2) + 0.08 * Math.sin(u * cyc * 6.1 + ph));
          if (y < y0 - amp * 0.82) g.fillRect(x, y, 8, 16);
        }
      }
    };
    layer("#9fb6e6", 190, 5, 0.5, base - 40, true);
    layer("#86aedd", 120, 7, 1.7, base - 10);
    layer("#6fae9a", 80, 9, 0.2, base + 8);
    layer("#58a26a", 46, 13, 2.4, base + 24);
    // tiny trees on the near layer
    for (let i = 0; i < 260; i++) {
      const x = (i * 157) % w, y = base + 18 + ((i * 37) % 22);
      g.fillStyle = i % 3 ? "#3f8a4a" : "#4c9a52"; g.beginPath(); g.arc(x, y, 7 + (i % 4), 0, 7); g.fill();
    }
    // haze at the horizon
    const hz = g.createLinearGradient(0, base - 60, 0, h);
    hz.addColorStop(0, "rgba(220,236,255,0)"); hz.addColorStop(1, "rgba(220,236,255,0.55)");
    g.fillStyle = hz; g.fillRect(0, base - 60, w, h - base + 60);
  });
  tex.wrapS = THREE.RepeatWrapping;
  return (
    <mesh position={[0, 12, 0]} renderOrder={-5} userData={{ outline: false }}>
      <cylinderGeometry args={[140, 140, 40, 64, 1, true]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
};

// ---- tall swallow-tail banner
const bannerMats = new Map<string, THREE.Material>();
const Banner: React.FC<{ p: V3; team: "us" | "uk"; t: number; h?: number; w?: number; yaw?: number }> = ({ p, team, t, h = 6, w = 1.5, yaw = 0 }) => {
  let m = bannerMats.get(team);
  if (!m) {
    const tex = canvasTex("banner" + team, 256, 512, (g, W, H) => {
      g.fillStyle = team === "us" ? TEAL : RED;
      g.beginPath(); g.moveTo(0, 0); g.lineTo(W, 0); g.lineTo(W, H); g.lineTo(W / 2, H * 0.84); g.lineTo(0, H); g.closePath(); g.fill();
      g.strokeStyle = "#16121a"; g.lineWidth = 8; g.stroke();
      g.fillStyle = "#e6e8f0"; g.strokeStyle = "#16121a"; g.lineWidth = 6;
      if (team === "us") { g.beginPath(); g.arc(W / 2, H * 0.3, W * 0.2, 0, 7); g.fill(); g.stroke(); g.fillStyle = TEAL; g.beginPath(); g.arc(W / 2, H * 0.3, W * 0.09, 0, 7); g.fill(); }
      else { g.fillRect(W * 0.43, H * 0.14, W * 0.14, H * 0.3); g.fillRect(W * 0.28, H * 0.22, W * 0.44, H * 0.1); }
    });
    m = new THREE.MeshToonMaterial({ map: tex, side: THREE.DoubleSide });
    bannerMats.set(team, m);
  }
  const segs = 5, sh = h * 0.4;
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <M g={cylG(0.05, 0.065, h, 10)} c="#3a2a22" tex="wood" p={[0, h / 2, 0]} />
      <M g={boxG(w + 0.2, 0.08, 0.08)} c="#3a2a22" p={[w / 2 + 0.05, h - 0.1, 0]} />
      {Array.from({ length: segs }, (_, i) => {
        return (
          <mesh key={i} position={[w / 2 + 0.05 + Math.sin(t * 2.6 + i * 0.8) * 0.05, h - 0.14 - sh / 2, Math.sin(t * 2.2 + i) * 0.05]} material={m}>
            <planeGeometry args={[w, sh]} />
          </mesh>
        );
      }).slice(0, 1)}
    </group>
  );
};

const World: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Backdrop />
    <Island t={t} />
    <PotatoField p={[0, G, 0]} w={14} d={14} rows={7} />
    {/* dirt road across the island */}
    <M g={boxG(2.2, 0.03, 70)} c="#b89868" tex="sand" p={[0, G + 0.02, 0]} cast={false} />
    <Farmhouse p={[-12, G, 2]} yaw={0.9} />
    <Tree p={[-17, G, 4]} s={1.3} /><Tree p={[-15, G, 10]} s={1.0} c="#4a9a50" /><Tree p={[15, G, -9]} s={1.2} /><Tree p={[17, G, 7]} s={1.4} c="#4a9a50" /><Tree p={[-18, G, -8]} s={1.6} />
    <Banner p={[2.4, G, 13]} team="us" t={t} /><Banner p={[-2.4, G, -13]} team="uk" t={t} />
    <Tent p={[-6, G, 16]} s={1.1} yaw={0.2} color="#9fd6dc" /><Tent p={[6, G, 17]} s={1.2} yaw={-0.3} color="#c8e6ea" />
    <Tent p={[-6, G, -16]} s={1.2} yaw={-0.2} color="#f0b8a8" /><Tent p={[6, G, -17]} s={1.1} yaw={0.3} color="#e89a8a" />
  </group>
);

const Rifle: React.FC<{ p: V3; s?: number; flash?: boolean }> = ({ p, s = 1.4, flash }) => (
  <group position={p} scale={s}>
    <M g={boxG(0.1, 0.14, 0.5)} c="#8a5a32" tex="wood" p={[0, 0, 0.1]} />
    <M g={cylG(0.035, 0.035, 1.1, 10)} c="#3a3e48" tex="metal" p={[0, 0.03, 0.8]} r={[Math.PI / 2, 0, 0]} />
    {flash ? <mesh position={[0, 0.03, 1.45]}><sphereGeometry args={[0.16, 12, 12]} /><meshBasicMaterial color="#ffd26a" toneMapped={false} /></mesh> : null}
  </group>
);
const SignPost: React.FC<{ p: V3; text: string; yaw?: number; w?: number }> = ({ p, text, yaw = 0, w = 1.6 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={cylG(0.07, 0.08, 2.0, 10)} c="#5a3a24" tex="wood" p={[0, 1.0, 0]} />
    <M g={boxG(w, 0.8, 0.09)} c="#d8b070" tex="planks" p={[0, 1.7, 0]} />
    <Label text={text} p={[0, 1.7, 0.05]} w={w * 0.9} h={0.6} fg="#2a1a14" bg="none" font={0.8} />
  </group>
);
const Bird: React.FC<{ t: number }> = ({ t }) => (
  <group rotation={[0, 2.2, 0]}>
    <M g={sphG(0.12, 14)} c="#3a8ad8" p={[0, 0.12, 0]} s={[0.9, 0.85, 1.2]} />
    <M g={sphG(0.075, 12)} c="#3a8ad8" p={[0, 0.24, 0.1]} />
    <M g={coneG(0.025, 0.07, 8)} c="#f0a030" p={[0, 0.235, 0.18]} r={[Math.PI / 2, 0, 0]} />
    <M g={coneG(0.05, 0.16, 8)} c="#2a6ab8" p={[0, 0.1, -0.15]} r={[-1.9 + Math.sin(t * 5) * 0.05, 0, 0]} />
  </group>
);

// ---- scenes
type Setup = { cam: Cam; focus?: V3; blur?: number; nodes: React.ReactNode; cast?: V3 };
type Scene = { look?: number; id: string; a: number; b: number; mood: string | ((t: number) => string); moves: string[]; prms?: (object | undefined)[]; make: (t: number, cam: Cam) => Setup; base: () => Cam };
const list: Scene[] = [];
const add = (s: Scene) => list.push(s);
/** camera at azimuth az (0 = south, looking north) at `dist`, lens height ly, aimed at the head */
const hero = (feet: V3, s: number, az: number, dist: number, ly: number, fov = 50, face = 0.4): Cam => aim([feet[0] + Math.sin(az) * dist, feet[1] + ly, feet[2] + Math.cos(az) * dist], blobHead(feet, s), fov, face);

const FB: V3 = [-3, G, 10];
const SF = 0.95;
add({
  id: "S01", a: 0, b: 6.2, look: 1.0, mood: "golden", moves: ["SLOWPUSH", "PULL", "CRANE_UP", "ORBIT_R", "PUSH"],
  prms: [undefined, { to: aim([48, 11, 2], [0, 3, 0], 58, 0.45), dur: 1.1 }],
  base: () => aim([3.2, G + 1.05, 10.6], [2.3, G + 0.78, 6.9], 44, 0.42),
  make: (t) => ({ cam: aim([3.2, G + 1.05, 10.6], [2.3, G + 0.78, 6.9], 44, 0.42), focus: [2.3, G + 0.78, 6.9], blur: 2.2, nodes: (<><World t={t} /><Pig p={[2.0, G, 6.0]} yaw={0.32} s={1.2} t={t} eat /><SignPost p={[5.4, G, 7.0]} text="1859" yaw={-0.5} /></>) }),
});
add({
  id: "S02", a: 6.2, b: 10.3, mood: "day", moves: ["CRANE_DOWN", "ORBIT_L", "PUSH", "ORBIT_R"], prms: [{ up: 3 }],
  base: () => aim([36, 11, 30], [0, 2, 2], 56, 0.46),
  make: (t) => ({ cam: aim([36, 11, 30], [0, 2, 2], 56, 0.46), focus: [0, 2, 2], blur: 0.5, nodes: <World t={t} /> }),
});
add({
  id: "S03", a: 10.3, b: 16.4, mood: "golden", moves: ["PUSH", "ORBIT_R", "CRANE_UP", "ORBIT_L", "PUSH", "ORBIT_R"],
  base: () => hero(FB, SF, 0.1, 4.3, 0.9, 50, 0.42),
  make: (t, cam) => {
    const scared = t > 13.2;
    return { cam, focus: blobHead(FB, SF), blur: 2.0, cast: blobHead(FB, SF), nodes: (<><World t={t} /><Pig p={[0.9, G, 6.6]} yaw={2.6} s={1.2} t={t} eat />
      <Blob spec={FARMER} p={FB} yaw={0.1} s={SF} t={t} faceCamera={cam.pos} face={scared ? { eyes: "wide", brows: "worried", mouth: "o", sweat: true, mustache: true } : { eyes: "half", brows: "neutral", mouth: "flat", mustache: true }} pose={{ armL: [10, 12], armR: [14, 16] }} /></>) };
  },
});
// S04: farmer in profile, rifle shouldered, flash
const Y4 = -Math.PI / 2;
add({
  id: "S04", a: 16.4, b: 17.6, look: 16.95, mood: "day", moves: ["PUSH", "SHAKE"],
  base: () => aim([FB[0] + 1.0, G + 1.5, FB[2] + 4.2], [FB[0] - 0.6, G + 1.5, FB[2]], 46, 0.42),
  make: (t, cam) => {
    const R = solveBlobArm(1, [0.12, 1.22, 0.28]);
    const L = solveBlobArm(-1, [-0.06, 1.22, 0.8]);
    const fired = t > 16.7;
    const head = blobHead(FB, SF);
    return { cam, focus: head, blur: 1.6, cast: head, nodes: (<><World t={t} />
      <Blob spec={FARMER} p={FB} yaw={Y4} s={SF} t={t} face={{ eyes: "squint", brows: "angry", mouth: "grin", mustache: true }} pose={{ armR: R.a, fwdR: R.f, armL: L.a, fwdL: L.f }}>
        <Rifle p={[0.08, 1.28, 0.02]} flash={fired && t < 16.85} />
      </Blob>
      {fired ? (<group position={toWorld(FB, Y4, SF, [0.08, 1.3, 1.6])}>{[0, 1, 2, 3].map((i) => { const u = Math.min(1, (t - 16.7) / 0.9); return <M key={i} g={sphG(0.16, 14)} c="#d8ced4" p={[-(0.15 + i * 0.22) * (0.4 + u), 0.1 * i + u * 0.3, i % 2 ? 0.1 : -0.1]} s={0.7 + u * 1.2 + i * 0.25} cast={false} op={0.85 - u * 0.5} />; })}</group>) : null}</>) };
  },
});
const CLp: V3 = [FB[0] + 0.7, G, FB[2]];
const OFp: V3 = [FB[0] - 1.0, G, FB[2] - 0.9];
add({
  id: "S05", a: 17.6, b: 22.4, mood: "day", moves: ["PUSH", "ORBIT_L", "CRANE_UP", "ORBIT_R", "PUSH"],
  base: () => hero(CLp, 0.92, 0.35, 4.6, 1.2, 50, 0.5),
  make: (t, cam) => ({ cam, focus: blobHead(CLp, 0.92), blur: 1.8, cast: blobHead(CLp, 0.92), nodes: (<><World t={t} />
    <Blob spec={CLERK} p={CLp} yaw={-0.4} s={0.92} t={t} faceCamera={cam.pos} face={{ eyes: "angry", brows: "angry", mouth: "yell", mustache: true }} pose={{ armR: [86, 8], fwdR: 75, armL: [10, 12] }} />
    <Blob spec={UK_CMD} p={OFp} yaw={-0.2} s={0.95} t={t} faceCamera={cam.pos} face={{ eyes: "squint", brows: "smug", mouth: "smirk", goatee: true }} pose={{ armL: [25, 45], armR: [10, 10] }} /></>) }),
});
add({
  id: "S06", a: 22.4, b: 23.6, mood: "day", moves: ["PUSH"],
  base: () => hero(FB, SF, 0.35, 3.1, 1.3, 46, 0.42),
  make: (t, cam) => ({ cam, focus: blobHead(FB, SF), blur: 2.6, cast: blobHead(FB, SF), nodes: (<><World t={t} />
    <Blob spec={FARMER} p={FB} yaw={0.2} s={SF} t={t} faceCamera={cam.pos} face={{ eyes: "squint", brows: "angry", mouth: "flat", mustache: true }} pose={{ armL: [60, 125], fwdL: 70, armR: [60, 125], fwdR: 70 }} /></>) }),
});
add({
  id: "S07", a: 23.6, b: 27.3, mood: "day", moves: ["DOLLY_L", "PUSH", "ORBIT_R", "CRANE_UP"],
  base: () => aim([38, 2.2, 8], [52, 1.4, 4], 55, 0.45),
  make: (t, cam) => ({ cam, focus: [52, 1.4, 4], blur: 1.2, nodes: (<><World t={t} />
    {[0, 1, 2].map((i) => <Boat key={i} p={[56 - i * 0.5 + Math.max(0, 3 - (t - 23.6)) * 1.3, -0.7, -4 + i * 5.5]} yaw={Math.PI / 2 + (i - 1) * 0.12} coat={TEAL} t={t} n={0} />)}
    {[0, 1, 2].map((i) => [0, 1].map((k) => <SoldierB key={i + "-" + k} p={[56 - i * 0.5 + Math.max(0, 3 - (t - 23.6)) * 1.3 + (k ? 0.35 : -0.35), -0.4, -4 + i * 5.5 + k * 0.9]} yaw={Math.PI / 2} team="us" s={0.5} t={t} />))}
    <Rank n={8} p={[44.8, G, -8]} dx={0} dz={2.1} team="us" yaw={-Math.PI / 2} t={t} rows={2} rowStep={[1.4, 0, 0]} />
    <Cannon p={[47, G, 1]} yaw={-Math.PI / 2} />
    <Banner p={[46.5, G, 5]} team="us" t={t} h={4.5} /></>) }),
});
add({
  id: "S08", a: 27.3, b: 31.4, mood: "day", moves: ["ORBIT_L", "PUSH", "DOLLY_R", "CRANE_DOWN"],
  base: () => aim([-38, 3.2, 12], [-62, 4, -2], 56, 0.45),
  make: (t, cam) => ({ cam, focus: [-62, 4, -2], blur: 1.0, nodes: (<><World t={t} />
    {[0, 1, 2, 3, 4].map((i) => <Ship key={i} p={[-56 - (i % 2) * 8, -0.3, -16 + i * 7]} yaw={Math.PI / 2 - 0.08 + i * 0.03} s={1.1} t={t} flag="uk"
      sailTag={i === 2 ? <Label text="5 SHIPS" p={[0, 3.4, 2.95]} w={2.5} h={0.9} fg="#1a1424" bg="none" font={0.7} /> : undefined} />)}</>) }),
});
add({
  id: "S09", a: 31.4, b: 34.7, mood: "cold", moves: ["DOLLY_L", "PUSH", "ORBIT_R"],
  base: () => aim([0.3, 0.9, 1.2], [0.3, 1.0, -8], 56, 0.5),
  make: (t, cam) => ({ cam, focus: [0.3, 1.0, -8], blur: 1.4, nodes: (<><World t={t} />
    {[-3.2, 0, 3.2].map((x) => <Cannon key={"u" + x} p={[x, G, 8]} yaw={Math.PI} tint="#2a6a74" />)}
    {[-3.2, 0, 3.2].map((x) => <Cannon key={"k" + x} p={[x, G, -8]} yaw={0} tint="#6a2a2a" />)}
    <Rank n={7} p={[-4.5, G, 10.5]} dx={1.5} dz={0} team="us" yaw={Math.PI} t={0} rows={2} rowStep={[0, 0, 1.3]} />
    <Rank n={7} p={[-4.5, G, -10.5]} dx={1.5} dz={0} team="uk" yaw={0} t={0} rows={2} rowStep={[0, 0, -1.3]} /></>) }),
});
const UCp: V3 = [-0.95, G, 10], KCp: V3 = [0.95, G, 10];
add({
  id: "S10", a: 34.7, b: 39.3, mood: "cold", moves: ["PUSH", "ORBIT_L", "PUSH", "ORBIT_R", "CRANE_UP"],
  base: () => aim([0, 1.5, 15.2], [0, 1.45, 10], 46, 0.4),
  make: (t, cam) => {
    const hand = solveBlobArm(1, [0.2, 1.0, 0.38]);
    return { cam, focus: [0, 1.5, 10], blur: 1.5, cast: [0, 1.6, 10], nodes: (<><World t={t} />
      <Blob spec={US_CMD} p={UCp} yaw={Math.PI / 2 - 0.35} s={0.95} t={t} faceCamera={cam.pos} face={{ eyes: "open", brows: "worried", mouth: "flat", goatee: true }} pose={{ armR: hand.a, fwdR: hand.f }}>
        <group position={[0.2, 1.08, 0.46]} rotation={[0, -(Math.PI / 2 - 0.35), 0]}>
          <M g={boxG(0.7, 0.5, 0.02)} c="#efe2bc" tex="paper" />
          <Label text="DO NOT FIRE FIRST" p={[0, 0, 0.012]} w={0.64} h={0.4} fg="#8a1a1a" bg="none" font={0.5} />
        </group>
      </Blob>
      <Blob spec={UK_CMD} p={KCp} yaw={-Math.PI / 2 + 0.35} s={0.95} t={t} faceCamera={cam.pos} face={{ eyes: "open", brows: "worried", mouth: "flat", goatee: true }} /></>) };
  },
});
add({
  id: "S11", a: 39.3, b: 40.7, mood: "cold", moves: ["SLOWPUSH"],
  base: () => aim([3.4, 1.7, 13.2], [0, 1.15, 8.1], 38, 0.42),
  make: (t) => ({ cam: aim([3.4, 1.7, 13.2], [0, 1.15, 8.1], 38, 0.42), focus: [0, 1.1, 8.1], blur: 2.0, nodes: (<><World t={t} /><Cannon p={[0, G, 8]} yaw={Math.PI} tint="#2a6a74" />
    <group position={[0.05, G + 1.15, 8.55]} scale={1.8}><Bird t={t} /></group>
    <Rank n={6} p={[-4, G, -6]} dx={1.6} dz={0} team="uk" yaw={0} t={0} /></>) }),
});
const CAMP: V3 = [9, G, 10];
add({
  id: "S12", a: 40.7, b: 44.6, look: 42.4, mood: (t) => (t < 41.7 ? "day" : t < 43.3 ? "night" : "golden"), moves: ["CRANE_UP", "ORBIT_R", "PUSH"],
  base: () => aim([CAMP[0] + 6, 2.8, CAMP[2] + 7], [CAMP[0], 1.1, CAMP[2]], 52, 0.45),
  make: (t) => ({ cam: aim([CAMP[0] + 6, 2.8, CAMP[2] + 7], [CAMP[0], 1.1, CAMP[2]], 52, 0.45), focus: [CAMP[0], 1.1, CAMP[2]], blur: 1.0, nodes: (<><World t={t} />
    <group position={CAMP}>
      <Tent p={[-3, 0, -2]} yaw={0.4} color="#9fd6dc" /><Tent p={[3, 0, -1.5]} yaw={-0.4} color="#f0b8a8" />
      <SoldierB p={[-1, 0, 1.2]} yaw={0.8} team="us" s={0.8} t={t} face={{ eyes: "open", mouth: "smile" }} /><SoldierB p={[1, 0, 1.0]} yaw={-0.8} team="uk" s={0.8} t={t} face={{ eyes: "open", mouth: "smile" }} />
      <SoldierB p={[0, 0, 2.4]} yaw={3.1} team="us" s={0.8} t={t} face={{ eyes: "closed", mouth: "grin" }} />
      <M g={cylG(0.5, 0.5, 0.06, 20)} c="#8a5a32" tex="wood" p={[0, 0.7, 1.5]} /><M g={cylG(0.05, 0.05, 0.7, 8)} c="#6a4a2e" p={[0, 0.35, 1.5]} />
      <SignPost p={[3.6, 0, 3.0]} text="12 YEARS" yaw={-0.7} w={2.0} />
      <pointLight position={[0, 1.2, 1.5]} color="#ffb060" intensity={4} distance={9} decay={2} />
    </group></>) }),
});
const EMp: V3 = [FB[0], G, FB[2]];
add({
  id: "S13", a: 44.6, b: 50.8, mood: "day", moves: ["PUSH", "ORBIT_R", "CRANE_UP", "ORBIT_L", "PUSH", "ORBIT_R"],
  base: () => hero(EMp, 0.95, 0.3, 4.2, 1.1, 50, 0.45),
  make: (t, cam) => {
    const hand = solveBlobArm(-1, [-0.2, 1.0, 0.38]);
    return { cam, focus: blobHead(EMp, 0.95), blur: 1.7, cast: blobHead(EMp, 0.95), nodes: (<><World t={t} />
      <Blob spec={EMPEROR} p={EMp} yaw={0.2} s={0.95} t={t} faceCamera={cam.pos} face={{ eyes: "open", brows: "raised", mouth: "smile", beard: true, mustache: true }} pose={{ armL: hand.a, fwdL: hand.f }}>
        <group position={[-0.2, 1.1, 0.5]} rotation={[-0.4, 0.2, 0]}><M g={boxG(0.7, 0.5, 0.02)} c="#e8d8a8" tex="paper" />
          <Label text="1872" p={[0, 0, 0.012]} w={0.5} h={0.3} fg="#5a2a14" bg="none" font={0.7} /></group>
      </Blob></>) };
  },
});
add({
  id: "S14", a: 50.8, b: 54.5, mood: "golden", moves: ["PUSH", "SLOWPUSH"],
  base: () => aim([3.4, G + 1.0, 11.4], [2.0, G + 0.72, 6.6], 40, 0.42),
  make: (t) => ({ cam: aim([3.4, G + 1.0, 11.4], [2.0, G + 0.72, 6.6], 40, 0.42), focus: [2.0, G + 0.75, 6.4], blur: 2.4, nodes: (<><World t={t} /><Pig p={[2.0, G, 6.4]} yaw={0.3} s={1.15} t={t} /></>) }),
});

// ---- beats from words
const wordsIn = (a: number, b: number) => WORDS.filter(([, t]) => t >= a && t < b);
const beatsOf = (s: Scene) => {
  const beats: Beat[] = []; const prms: (object | undefined)[] = [];
  let last = -9, k = 0;
  const cands: [string, number][] = [[WORDS.find(([, t]) => t >= s.a)?.[0] ?? "", s.a], ...wordsIn(s.a + 0.2, s.b - 0.5).map(([w, t]) => [w, t] as [string, number])];
  for (const [w, t] of cands) {
    if (t - last < 0.8) continue;
    beats.push({ t: Math.max(s.a, t - 0.2), move: s.moves[k % s.moves.length], dur: 0.63, word: w });
    prms.push(s.prms?.[k]);
    last = t; k++;
  }
  return { beats, prms };
};
const CHUNKS = makeChunks(WORDS as Word[], END);
const sceneAt = (t: number) => Math.max(0, list.findIndex((s) => t >= s.a && t < s.b));

const SceneView: React.FC<{ scene: Scene; t: number; opacity: number }> = ({ scene, t, opacity }) => {
  const { beats, prms } = beatsOf(scene);
  const p = poseAt(scene.base(), beats, scene.a, Math.max(t, scene.a), prms as never);
  const cam = withShake(p, p.shake);
  const S = scene.make(Math.max(t, scene.a), cam);
  const mood = rich(typeof scene.mood === "function" ? scene.mood(t) : scene.mood);
  return (
    <AbsoluteFill style={{ opacity }}>
      <View mood={mood} cam={S.cam} t={t} focus={S.focus} blur={S.blur ?? 1.4}>
        {S.nodes}
        <CastLight at={S.cast ?? [0, -50, 0]} cam={S.cam.pos} mood={mood} k={S.cast ? 1 : 0} />
      </View>
    </AbsoluteFill>
  );
};
const DISSOLVE = 0.16;
const Frame: React.FC<{ t: number; tc: number }> = ({ t, tc }) => {
  const i = sceneAt(t);
  const s = list[i];
  const nxt = list[i + 1];
  const u = nxt ? (t - (s.b - DISSOLVE)) / DISSOLVE : -1;
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <SceneView scene={s} t={t} opacity={1} />
      {nxt && u > 0 ? <SceneView scene={nxt} t={t} opacity={Math.min(1, u)} /> : null}
      <Captions chunks={CHUNKS} t={tc} accent={new Set()} />
    </AbsoluteFill>
  );
};
export const PigWar2: React.FC<{ sub?: boolean }> = ({ sub = false }) => {
  const ready = useFonts();
  const g = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const { n, fp } = sub ? subFrame(g) : { n: g, fp: g };
  return <Frame t={fp / 30} tc={n / 30} />;
};
export const PigLook2: React.FC<{ id?: string; at?: number }> = ({ id = "S01", at }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const s = list.find((x) => x.id === id) ?? list[0];
  const t = at ?? s.look ?? s.a + (s.b - s.a) * 0.55;
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <SceneView scene={s} t={t} opacity={1} />
      <Captions chunks={CHUNKS} t={t} accent={new Set()} />
    </AbsoluteFill>
  );
};
