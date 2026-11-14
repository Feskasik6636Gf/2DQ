// "Blobhead": round white head, big drawn face, thin black stick limbs, cloth body in a faction colour (the user's
// reference style, built from scratch from primitives). Heights are metres, character ~1.9 m tall at s=1.
import React from "react";
import * as THREE from "three";
import { boxG, canvasTex, coneG, cylG, M, sphG } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";

export type BlobFace = { eyes?: "open" | "wide" | "half" | "squint" | "closed" | "angry"; brows?: "neutral" | "angry" | "worried" | "raised" | "smug"; mouth?: "flat" | "smile" | "grin" | "open" | "yell" | "o" | "smirk"; look?: number; sweat?: boolean; mustache?: boolean; beard?: boolean; goatee?: boolean };
export type BlobHat = "none" | "crown" | "helmet" | "strawhat" | "tophat" | "kepi" | "pickel" | "bicorne";
export type BlobSpec = {
  body: string; // cloth colour
  trim?: string; // belt / hem colour
  cape?: string; // cape colour (kings, officers)
  apron?: string;
  hat?: BlobHat;
  hatColor?: string;
  skin?: string;
  beardColor?: string;
  fat?: number; // body width multiplier
};
export type BlobPose = { armL?: [number, number]; armR?: [number, number]; fwdL?: number; fwdR?: number; lean?: number; walk?: number; headTilt?: number };

const SKIN = "#f6f0e4";
const INK = "#16121a";
const D2R = Math.PI / 180;
const faceTex = (f: BlobFace, beardColor: string) => {
  const key = `bf|${f.eyes}|${f.brows}|${f.mouth}|${f.sweat}|${f.mustache}|${f.beard}|${f.goatee}|${beardColor}`;
  return canvasTex(key, 512, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.lineCap = "round";
    g.lineJoin = "round";
    const ex = w * 0.27, ey = h * 0.44, er = w * 0.085;
    const eyes = f.eyes ?? "open";
    const drawEye = (cx: number, dir: number) => {
      if (eyes === "closed") { g.strokeStyle = INK; g.lineWidth = w * 0.03; g.beginPath(); g.arc(cx, ey, er, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); return; }
      if (eyes === "squint") { g.strokeStyle = INK; g.lineWidth = w * 0.035; g.beginPath(); g.moveTo(cx - er, ey); g.lineTo(cx + er, ey + dir * er * 0.15); g.stroke(); return; }
      const rh = eyes === "wide" ? er * 1.35 : eyes === "half" ? er * 0.65 : er;
      g.fillStyle = "#ffffff"; g.strokeStyle = INK; g.lineWidth = w * 0.022;
      g.beginPath(); g.ellipse(cx, ey, er * (eyes === "wide" ? 1.2 : 1), rh, 0, 0, 7); g.fill(); g.stroke();
      g.fillStyle = INK; g.beginPath(); g.arc(cx + (f.look ?? 0) * er * 0.4, ey + (eyes === "half" ? er * 0.2 : 0), er * (eyes === "wide" ? 0.3 : 0.42), 0, 7); g.fill();
      if (eyes === "half") { g.strokeStyle = INK; g.lineWidth = w * 0.03; g.beginPath(); g.moveTo(cx - er, ey - rh * 0.1); g.lineTo(cx + er, ey - rh * 0.1); g.stroke(); }
    };
    drawEye(w / 2 - ex, 1); drawEye(w / 2 + ex, -1);
    // brows
    const br = f.brows ?? (eyes === "angry" ? "angry" : "neutral");
    g.strokeStyle = INK; g.lineWidth = w * 0.04;
    const by = ey - er * 1.9;
    const brow = (cx: number, side: number) => {
      const a = br === "angry" ? 0.7 : br === "worried" ? -0.6 : br === "raised" ? -0.15 : br === "smug" ? side * 0.35 : 0.05;
      const lift = br === "raised" ? er * 0.8 : 0;
      g.beginPath(); g.moveTo(cx - side * er * 1.3, by - lift + side * a * er); g.lineTo(cx + side * er * 1.3, by - lift - side * a * er); g.stroke();
    };
    brow(w / 2 - ex, -1); brow(w / 2 + ex, 1);
    // mouth
    const mx = w / 2, my = h * 0.74, mw = w * 0.14;
    g.lineWidth = w * 0.03; g.strokeStyle = INK;
    const m = f.mouth ?? "flat";
    g.beginPath();
    if (m === "flat") { g.moveTo(mx - mw * 0.7, my); g.lineTo(mx + mw * 0.7, my); g.stroke(); }
    else if (m === "smile") { g.arc(mx, my - mw * 0.5, mw, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
    else if (m === "smirk") { g.moveTo(mx - mw * 0.6, my + mw * 0.2); g.quadraticCurveTo(mx + mw * 0.3, my + mw * 0.3, mx + mw * 0.9, my - mw * 0.3); g.stroke(); }
    else if (m === "grin") { g.fillStyle = "#fff"; g.arc(mx, my - mw * 0.55, mw * 1.1, 0.05 * Math.PI, 0.95 * Math.PI); g.closePath(); g.fill(); g.stroke(); }
    else { const oh = m === "o" ? mw * 0.7 : mw * 1.1; g.fillStyle = "#3a1218"; g.ellipse(mx, my + oh * 0.15, m === "o" ? mw * 0.55 : mw * 1.0, oh, 0, 0, 7); g.fill(); g.stroke();
      if (m === "yell") { g.fillStyle = "#e8707a"; g.beginPath(); g.ellipse(mx, my + oh * 0.75, mw * 0.6, oh * 0.35, 0, 0, 7); g.fill(); } }
    if (f.mustache) { g.fillStyle = beardColor; g.beginPath(); g.moveTo(mx, my - mw * 0.7); g.bezierCurveTo(mx + mw * 2.1, my - mw * 1.5, mx + mw * 2.3, my + mw * 0.5, mx + mw * 0.2, my - mw * 0.15); g.bezierCurveTo(mx - mw * 0.2, my - mw * 0.15, mx - mw * 2.3, my + mw * 0.5, mx - mw * 2.1, my - mw * 1.5); g.bezierCurveTo(mx - mw * 1.0, my - mw * 1.5, mx, my - mw * 0.7, mx, my - mw * 0.7); g.fill(); g.lineWidth = w * 0.012; g.stroke(); }
    if (f.goatee || f.beard) { g.fillStyle = beardColor; g.beginPath(); g.moveTo(mx - mw * (f.beard ? 2.8 : 0.9), my + mw * 0.7); g.quadraticCurveTo(mx, my + mw * (f.beard ? 5.2 : 3.2), mx + mw * (f.beard ? 2.8 : 0.9), my + mw * 0.7); g.lineTo(mx + mw * 0.9, my + mw * 0.2); g.lineTo(mx - mw * 0.9, my + mw * 0.2); g.fill(); g.lineWidth = w * 0.012; g.stroke(); }
    if (f.sweat) { g.fillStyle = "#a8d8ff"; g.strokeStyle = INK; g.lineWidth = w * 0.012; g.beginPath(); g.moveTo(w * 0.86, h * 0.26); g.quadraticCurveTo(w * 0.93, h * 0.38, w * 0.86, h * 0.4); g.quadraticCurveTo(w * 0.79, h * 0.38, w * 0.86, h * 0.26); g.fill(); g.stroke(); }
  });
};
const faceMats = new Map<string, THREE.Material>();
const faceMat = (f: BlobFace, bc: string) => {
  const key = JSON.stringify([f, bc]);
  let m = faceMats.get(key);
  if (!m) {
    if (faceMats.size > 120) faceMats.clear();
    const t = faceTex(f, bc);
    t.generateMipmaps = false; t.minFilter = THREE.LinearFilter;
    m = new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.04, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, toneMapped: false });
    faceMats.set(key, m);
  }
  return m;
};
// a spherical patch facing +z that carries the face texture
const patchGeo = new THREE.SphereGeometry(1, 40, 40, Math.PI / 2 - 0.95, 1.9, Math.PI / 2 - 0.85, 1.7);

const Hat: React.FC<{ kind: BlobHat; color: string; r: number }> = ({ kind, color, r }) => {
  switch (kind) {
    case "crown":
      return (
        <group position={[0, r * 0.82, 0]}>
          <M g={cylG(r * 0.62, r * 0.7, r * 0.3, 20)} c="#e8b830" tex="metal" p={[0, 0, 0]} />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return <M key={i} g={coneG(r * 0.14, r * 0.38, 8)} c="#e8b830" tex="metal" p={[Math.sin(a) * r * 0.55, r * 0.3, Math.cos(a) * r * 0.55]} />;
          })}
          <M g={sphG(r * 0.1, 10)} c="#d83a4a" p={[0, r * 0.02, r * 0.69]} />
        </group>
      );
    case "helmet":
      return (
        <group position={[0, r * 0.62, 0]}>
          <M g={sphG(r * 1.04, 22)} c={color} tex="metal" p={[0, 0, 0]} s={[1, 0.62, 1]} />
          <M g={cylG(r * 1.06, r * 1.06, r * 0.12, 22)} c="#a8aab4" tex="metal" p={[0, -r * 0.16, 0]} />
        </group>
      );
    case "strawhat":
      return (
        <group position={[0, r * 0.78, 0]}>
          <M g={cylG(r * 1.9, r * 1.9, r * 0.06, 28)} c="#e8d08a" tex="fabric" p={[0, -r * 0.1, 0]} />
          <M g={cylG(r * 0.8, r * 0.95, r * 0.5, 22)} c="#e8d08a" tex="fabric" p={[0, r * 0.2, 0]} />
          <M g={cylG(r * 0.96, r * 0.96, r * 0.12, 22)} c="#b84a3a" p={[0, r * 0.0, 0]} />
        </group>
      );
    case "tophat":
      return (
        <group position={[0, r * 0.86, 0]}>
          <M g={cylG(r * 1.3, r * 1.3, r * 0.06, 24)} c="#1e1a22" p={[0, 0, 0]} />
          <M g={cylG(r * 0.8, r * 0.88, r * 1.3, 22)} c="#1e1a22" p={[0, r * 0.65, 0]} />
          <M g={cylG(r * 0.89, r * 0.89, r * 0.16, 22)} c={color} p={[0, r * 0.12, 0]} />
        </group>
      );
    case "kepi":
      return (
        <group position={[0, r * 0.8, 0]}>
          <M g={cylG(r * 0.88, r * 0.98, r * 0.5, 22)} c={color} tex="fabric" p={[0, r * 0.2, 0]} />
          <M g={boxG(r * 1.2, r * 0.06, r * 0.5)} c="#201a1e" p={[0, 0, r * 0.78]} />
        </group>
      );
    case "pickel":
      return (
        <group position={[0, r * 0.66, 0]}>
          <M g={sphG(r * 0.98, 22)} c="#2a2a32" tex="metal" p={[0, 0, 0]} s={[1, 0.8, 1]} />
          <M g={boxG(r * 1.2, r * 0.06, r * 0.5)} c="#201a1e" p={[0, -r * 0.34, r * 0.82]} />
          <M g={cylG(r * 0.06, r * 0.06, r * 0.3, 8)} c="#e8b830" p={[0, r * 0.82, 0]} />
          <M g={coneG(r * 0.06, r * 0.4, 8)} c="#e8b830" p={[0, r * 1.15, 0]} />
        </group>
      );
    case "bicorne":
      return (
        <group position={[0, r * 0.78, 0]}>
          <M g={boxG(r * 2.4, r * 0.5, r * 0.8)} c={color} tex="fabric" p={[0, r * 0.15, 0]} r={[0, 0, 0]} />
          <M g={coneG(r * 0.5, r * 0.5, 4)} c={color} p={[r * 1.3, r * 0.15, 0]} r={[0, 0, -Math.PI / 2]} />
          <M g={coneG(r * 0.5, r * 0.5, 4)} c={color} p={[-r * 1.3, r * 0.15, 0]} r={[0, 0, Math.PI / 2]} />
        </group>
      );
    default:
      return null;
  }
};

const Limb: React.FC<{ a: V3; b: V3; r?: number; c?: string }> = ({ a, b, r = 0.026, c = INK }) => {
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  const e = new THREE.Euler().setFromQuaternion(q);
  return <M g={cylG(r, r, len, 8)} c={c} p={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} r={[e.x, e.y, e.z]} />;
};

const SHOULDER = 1.28, HIP = 0.74, ARM = 0.4;
/** hand position in the character's local frame for an arm pose: [shoulder, elbow] degrees (0 = hanging) and fwd (turn toward +z) */
export const armLocal = (side: -1 | 1, ang: [number, number], fwd = 0): { S: V3; E: V3; H: V3 } => {
  const S: V3 = [side * 0.16, SHOULDER, 0];
  const out = new THREE.Vector3(side * Math.cos(fwd * D2R), 0, Math.sin(fwd * D2R));
  const up = new THREE.Vector3(0, -1, 0);
  const r1 = ang[0] * D2R, r2 = (ang[0] + ang[1]) * D2R;
  const E = new THREE.Vector3(...S).addScaledVector(out, ARM * Math.sin(r1)).addScaledVector(up, ARM * Math.cos(r1));
  const H = E.clone().addScaledVector(out, ARM * Math.sin(r2)).addScaledVector(up, ARM * Math.cos(r2));
  return { S, E: [E.x, E.y, E.z], H: [H.x, H.y, H.z] };
};
export const blobHead = (p: V3, s = 1): V3 => [p[0], p[1] + 1.74 * s, p[2]];

export const Blob: React.FC<{ spec: BlobSpec; p: V3; yaw?: number; s?: number; t?: number; face?: BlobFace; pose?: BlobPose; faceCamera?: V3; children?: React.ReactNode }> = ({ spec, p, yaw = 0, s = 1, t = 0, face = {}, pose = {}, faceCamera, children }) => {
  const R = 0.28; // head radius
  let Y = yaw;
  if (faceCamera) {
    const want = Math.atan2(faceCamera[0] - p[0], faceCamera[2] - p[2]);
    const d = Math.atan2(Math.sin(want - yaw), Math.cos(want - yaw));
    Y = yaw + Math.max(-0.5, Math.min(0.5, d * 0.45));
  }
  const bob = Math.sin(t * 2.2 + p[0]) * 0.012;
  const L = armLocal(-1, pose.armL ?? [6, 8], pose.fwdL ?? 8);
  const Rr = armLocal(1, pose.armR ?? [6, 8], pose.fwdR ?? 8);
  const fat = spec.fat ?? 1;
  const sk = spec.skin ?? SKIN;
  const walk = pose.walk ?? 0;
  const lg = Math.sin(walk) * 0.25;
  return (
    <group position={p} rotation={[0, Y, 0]} scale={s}>
      {/* legs: thin black sticks + small dark shoes */}
      {[-1, 1].map((x) => (
        <group key={x}>
          <Limb a={[x * 0.09, HIP, 0]} b={[x * 0.1, 0.04, x * lg * 0.6]} r={0.03} />
          <M g={sphG(0.075, 10)} c="#2a1e1c" p={[x * 0.1, 0.04, 0.04 + x * lg * 0.6]} s={[1, 0.6, 1.5]} />
        </group>
      ))}
      <group position={[0, bob, 0]} rotation={[((pose.lean ?? 0) * D2R), 0, 0]}>
        {/* body: tapered cloth */}
        <M g={cylG(0.17 * fat, 0.25 * fat, 0.62, 18)} c={spec.body} tex="fabric" p={[0, HIP + 0.3, 0]} />
        {spec.trim ? <M g={cylG(0.256 * fat, 0.256 * fat, 0.05, 18)} c={spec.trim} p={[0, HIP + 0.02, 0]} /> : null}
        {spec.apron ? <M g={boxG(0.3 * fat, 0.5, 0.03)} c={spec.apron} tex="fabric" p={[0, HIP + 0.24, 0.215 * fat]} /> : null}
        {spec.cape ? (
          <>
            <M g={cylG(0.2, 0.34, 0.95, 16, true, Math.PI * 0.85, Math.PI * 1.3)} c={spec.cape} tex="fabric" p={[0, HIP + 0.1, -0.02]} r={[0, Math.PI, 0]} side={THREE.DoubleSide} />
            <M g={sphG(0.075, 10)} c="#e8b830" tex="metal" p={[0, SHOULDER + 0.1, 0.15]} />
          </>
        ) : null}
        {/* neck + head */}
        <Limb a={[0, SHOULDER + 0.02, 0]} b={[0, SHOULDER + 0.2, 0]} r={0.025} />
        <group position={[0, SHOULDER + 0.2 + R * 0.92, 0]} rotation={[0, 0, (pose.headTilt ?? 0) * D2R]}>
          <M g={sphG(R, 36)} c={sk} p={[0, 0, 0]} s={[1, 1.04, 1]} />
          <mesh geometry={patchGeo} material={faceMat(face, spec.beardColor ?? "#e9e4dc")} scale={R * 1.012} userData={{ outline: false }} />
          <Hat kind={spec.hat ?? "none"} color={spec.hatColor ?? "#3a4a8a"} r={R} />
        </group>
        {/* arms: black sticks, small white hands */}
        {[{ A: L }, { A: Rr }].map(({ A }, i) => (
          <group key={i}>
            <Limb a={A.S} b={A.E} />
            <Limb a={A.E} b={A.H} />
            <M g={sphG(0.045, 10)} c={sk} p={A.H} />
          </group>
        ))}
        {children}
      </group>
    </group>
  );
};

const solveCache = new Map<string, { a: [number, number]; f: number; err: number }>();
/** arm angles that put the hand at a LOCAL target (character frame, h=1) */
export const solveBlobArm = (side: -1 | 1, target: V3): { a: [number, number]; f: number; err: number } => {
  const key = side + target.map((v) => v.toFixed(2)).join(",");
  const hit = solveCache.get(key);
  if (hit) return hit;
  let best = { a: [20, 20] as [number, number], f: 20, err: 9 };
  for (let a = 0; a <= 170; a += 10) for (let b = 0; b <= 140; b += 10) for (let f = -40; f <= 170; f += 10) {
    const H = armLocal(side, [a, b], f).H;
    const e = Math.hypot(H[0] - target[0], H[1] - target[1], H[2] - target[2]);
    if (e < best.err) best = { a: [a, b], f, err: e };
  }
  if (solveCache.size > 3000) solveCache.clear();
  solveCache.set(key, best);
  return best;
};
/** local -> world for a character at p with yaw and scale s */
export const toWorld = (p: V3, yaw: number, s: number, l: V3): V3 => [p[0] + (l[0] * Math.cos(yaw) + l[2] * Math.sin(yaw)) * s, p[1] + l[1] * s, p[2] + (-l[0] * Math.sin(yaw) + l[2] * Math.cos(yaw)) * s];
