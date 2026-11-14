// Pig War assets, all from primitives in the starter's toon materials. Everything is a pure function of its props.
import React from "react";
import * as THREE from "three";
import { boxG, coneG, coreMat, cylG, M, sphG, torG, canvasTex } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";

const cs = (n: number) => n; // keep numbers readable

/** a big black pig, 1 unit = 1 m, standing on y=0, facing +z */
export const Pig: React.FC<{ p: V3; yaw?: number; s?: number; t?: number; eat?: boolean; fat?: number }> = ({ p, yaw = 0, s = 1, t = 0, eat = false, fat = 1 }) => {
  const nod = eat ? Math.sin(t * 5) * 0.12 : Math.sin(t * 1.6) * 0.02;
  const body = "#383240";
  const skin = "#e89aa0";
  return (
    <group position={p} rotation={[0, yaw, 0]} scale={s}>
      <M g={sphG(0.5, 28)} c={body} p={[0, 0.62, 0]} s={[0.95 * fat, 0.82, 1.35]} />
      {/* head + snout */}
      <group position={[0, 0.62 - (eat ? 0.18 : 0), 0.68]} rotation={[nod + (eat ? 0.5 : 0), 0, 0]}>
        <M g={sphG(0.3, 24)} c={body} p={[0, 0.06, 0.06]} s={[1, 0.95, 1.05]} />
        <M g={cylG(0.14, 0.15, 0.16, 18)} c={skin} p={[0, -0.02, 0.35]} r={[Math.PI / 2, 0, 0]} />
        <mesh geometry={sphG(0.022, 10)} material={coreMat("#1a1014", 0.5)} position={[-0.05, -0.02, 0.43]} />
        <mesh geometry={sphG(0.022, 10)} material={coreMat("#1a1014", 0.5)} position={[0.05, -0.02, 0.43]} />
        {/* eyes: tiny, white with a pupil */}
        {[-1, 1].map((x) => (
          <group key={x}>
            <mesh geometry={sphG(0.05, 14)} material={coreMat("#f6f0e6", 0.9)} position={[x * 0.13, 0.14, 0.24]} />
            <mesh geometry={sphG(0.026, 12)} material={coreMat("#14101a", 0.5)} position={[x * 0.135, 0.14, 0.285]} />
          </group>
        ))}
        {/* ears */}
        {[-1, 1].map((x) => (
          <M key={x} g={coneG(0.12, 0.2, 14)} c={body} p={[x * 0.2, 0.3, 0.0]} r={[0.4, 0, x * -0.5]} />
        ))}
      </group>
      {/* legs */}
      {[[-0.22, 0.42], [0.22, 0.42], [-0.22, -0.42], [0.22, -0.42]].map(([x, z], i) => (
        <group key={i}>
          <M g={cylG(0.09, 0.08, 0.34, 12)} c={body} p={[x * fat, 0.17, z]} />
          <M g={cylG(0.085, 0.085, 0.05, 12)} c="#4a3a34" p={[x * fat, 0.025, z]} />
        </group>
      ))}
      {/* curly tail */}
      <M g={torG(0.07, 0.022, Math.PI * 1.6)} c={skin} p={[0, 0.78, -0.72]} r={[0, Math.PI / 2, Math.sin(t * 6) * 0.3]} />
    </group>
  );
};

/** a simple rifle along +z from its stock end at origin */
export const Rifle: React.FC<{ p: V3; r?: V3; s?: number; smoke?: boolean }> = ({ p, r, s = 1, smoke }) => (
  <group position={p} rotation={r} scale={s}>
    <M g={boxG(0.1, 0.14, 0.5)} c="#8a5a32" tex="wood" p={[0, 0, 0.1]} />
    <M g={cylG(0.04, 0.04, 1.1, 10)} c="#3a3e48" tex="metal" p={[0, 0.03, 0.8]} r={[Math.PI / 2, 0, 0]} />
    {smoke ? <mesh geometry={sphG(0.12, 12)} material={coreMat("#ffd26a", 1.0)} position={[0, 0.03, 1.28]} /> : null}
  </group>
);

export const Cannon: React.FC<{ p: V3; yaw?: number; s?: number; tint?: string; fire?: number }> = ({ p, yaw = 0, s = 1, tint = "#3a3a46" }) => (
  <group position={p} rotation={[0, yaw, 0]} scale={s}>
    <M g={boxG(0.9, 0.18, 1.2)} c="#8a5a32" tex="wood" p={[0, 0.5, 0]} />
    <M g={cylG(0.27, 0.34, 1.7, 22)} c={tint} tex="metal" p={[0, 0.78, 0.35]} r={[Math.PI / 2 - 0.08, 0, 0]} />
    <M g={sphG(0.26, 18)} c={tint} tex="metal" p={[0, 0.71, -0.55]} />
    <M g={cylG(0.325, 0.325, 0.08, 22)} c="#2a2a32" p={[0, 0.82, 1.1]} r={[Math.PI / 2 - 0.08, 0, 0]} />
    {[-1, 1].map((x) => (
      <M key={x} g={cylG(0.52, 0.52, 0.12, 24)} c="#7a4a28" tex="wood" p={[x * 0.52, 0.52, 0.0]} r={[0, 0, Math.PI / 2]} />
    ))}
    <M g={cylG(0.04, 0.04, 1.1, 10)} c="#2a2a32" p={[0, 0.52, 0]} r={[0, 0, Math.PI / 2]} />
    {/* a few cannonballs */}
    {[0, 1, 2].map((i) => (
      <M key={i} g={sphG(0.12, 14)} c="#2a2a32" tex="metal" p={[0.85 + (i % 2) * 0.22, 0.12, 0.5 + i * 0.12]} />
    ))}
  </group>
);

export const Tent: React.FC<{ p: V3; s?: number; yaw?: number; color?: string }> = ({ p, s = 1, yaw = 0, color = "#efe3c6" }) => (
  <group position={p} rotation={[0, yaw, 0]} scale={s}>
    <M g={coneG(1.5, 2.1, 4)} c={color} tex="fabric" p={[0, 1.05, 0]} r={[0, Math.PI / 4, 0]} />
    <M g={boxG(0.5, 1.1, 0.03)} c="#3a2a30" p={[0, 0.55, 1.06]} r={[0, 0, 0]} />
  </group>
);

const FLAGS: Record<string, (g: CanvasRenderingContext2D, w: number, h: number) => void> = {
  us: (g, w, h) => {
    for (let i = 0; i < 13; i++) {
      g.fillStyle = i % 2 ? "#f4f0e8" : "#c8323c";
      g.fillRect(0, (i * h) / 13, w, h / 13 + 1);
    }
    g.fillStyle = "#2a3c86";
    g.fillRect(0, 0, w * 0.42, (h * 7) / 13);
    g.fillStyle = "#f4f0e8";
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
      g.beginPath();
      g.arc(w * (0.05 + c * 0.075), h * (0.07 + r * 0.115), h * 0.028, 0, 7);
      g.fill();
    }
  },
  uk: (g, w, h) => {
    g.fillStyle = "#26357a";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "#f4f0e8";
    g.lineWidth = h * 0.22;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke();
    g.strokeStyle = "#c8323c";
    g.lineWidth = h * 0.09;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke();
    g.fillStyle = "#f4f0e8";
    g.fillRect(w * 0.4, 0, w * 0.2, h); g.fillRect(0, h * 0.34, w, h * 0.32);
    g.fillStyle = "#c8323c";
    g.fillRect(w * 0.45, 0, w * 0.1, h); g.fillRect(0, h * 0.42, w, h * 0.16);
  },
};
const flagMats = new Map<string, THREE.Material>();
/** a flag on a pole; waves with t */
export const Flag: React.FC<{ p: V3; kind: "us" | "uk"; t: number; h?: number; w?: number; yaw?: number }> = ({ p, kind, t, h = 5, w = 1.8, yaw = 0 }) => {
  let m = flagMats.get(kind);
  if (!m) {
    const tex = canvasTex(`flag${kind}`, 512, 320, FLAGS[kind]);
    m = new THREE.MeshToonMaterial({ map: tex, side: THREE.DoubleSide });
    flagMats.set(kind, m);
  }
  const segs = 6;
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <M g={cylG(0.045, 0.06, h, 10)} c="#e8e0d0" tex="wood" p={[0, h / 2, 0]} />
      <mesh geometry={sphG(0.09, 12)} material={coreMat("#f0c850", 0.95)} position={[0, h + 0.05, 0]} />
      {Array.from({ length: segs }, (_, i) => {
        const x = (i + 0.5) * (w / segs);
        const z = Math.sin(t * 3.2 - i * 0.7) * 0.07 * (i + 1) * 0.5;
        return (
          <mesh key={i} position={[x + 0.04, h - 0.6, z]} material={m}>
            <planeGeometry args={[w / segs + 0.01, w * 0.625]} />
          </mesh>
        );
      })}
    </group>
  );
};

/** a tall ship, bow toward +z */
export const Ship: React.FC<{ p: V3; yaw?: number; s?: number; t?: number; flag?: "us" | "uk"; sailTag?: React.ReactNode }> = ({ p, yaw = 0, s = 1, t = 0, flag = "uk", sailTag }) => {
  const bob = Math.sin(t * 1.3 + p[0]) * 0.06;
  return (
    <group position={[p[0], p[1] + bob, p[2]]} rotation={[Math.sin(t * 1.1 + p[2]) * 0.02, yaw, 0]} scale={s}>
      <M g={boxG(2.6, 1.0, 7.5)} c="#5a3a26" tex="planks" p={[0, 0.4, 0]} />
      <M g={boxG(2.7, 0.14, 7.6)} c="#e8d8a8" p={[0, 0.78, 0]} />
      <M g={boxG(2.0, 0.6, 2.0)} c="#6a4430" tex="planks" p={[0, 1.0, -2.6]} />
      <M g={coneG(1.1, 2.6, 4)} c="#5a3a26" tex="planks" p={[0, 0.4, 4.5]} r={[Math.PI / 2, 0, Math.PI / 4]} s={[1, 1, 0.5]} />
      {[-1.4, 0.6, 2.4].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          <M g={cylG(0.09, 0.12, 6.2 - i * 0.5, 10)} c="#4a3220" tex="wood" p={[0, 3.6 - i * 0.2, 0]} />
          <M g={boxG(3.0, 1.9, 0.07)} c="#f4ecd8" tex="fabric" p={[0, 3.4 - i * 0.2, 0.18 + Math.sin(t * 2 + i) * 0.04]} />
          <M g={boxG(3.2, 0.1, 0.1)} c="#4a3220" p={[0, 4.4 - i * 0.2, 0.18]} />
        </group>
      ))}
      {sailTag}
      <Flag p={[0, 6.4, -1.4]} kind={flag} t={t} h={0.1} w={1.1} />
    </group>
  );
};

/** a rowboat with a few soldiers seated (cheap figures) */
export const Soldier: React.FC<{ p: V3; yaw?: number; coat: string; hat?: string; s?: number; walk?: number }> = ({ p, yaw = 0, coat, hat = "#23262e", s = 1, walk = 0 }) => {
  const b = Math.abs(Math.sin(walk)) * 0.05;
  return (
    <group position={[p[0], p[1] + b, p[2]]} rotation={[0, yaw, 0]} scale={s}>
      <M g={cylG(0.12, 0.14, 0.62, 12)} c="#e8e4dc" p={[-0.07, 0.31, 0]} />
      <M g={cylG(0.12, 0.14, 0.62, 12)} c="#e8e4dc" p={[0.07, 0.31, 0]} s={[0.9, 1, 0.9]} />
      <M g={cylG(0.22, 0.25, 0.7, 14)} c={coat} tex="fabric" p={[0, 0.95, 0]} />
      <M g={sphG(0.21, 16)} c="#f0cba4" p={[0, 1.5, 0]} />
      <M g={cylG(0.17, 0.2, 0.34, 14)} c={hat} p={[0, 1.78, 0]} />
      <M g={boxG(0.05, 0.9, 0.05)} c="#6a4a2a" p={[0.3, 1.0, 0.1]} />
    </group>
  );
};

export const Boat: React.FC<{ p: V3; yaw?: number; coat: string; t?: number; n?: number }> = ({ p, yaw = 0, coat, t = 0, n = 3 }) => (
  <group position={[p[0], p[1] + Math.sin(t * 1.6 + p[0]) * 0.05, p[2]]} rotation={[0, yaw, Math.sin(t * 1.2 + p[2]) * 0.03]}>
    <M g={boxG(1.7, 0.5, 4.2)} c="#6a4430" tex="planks" p={[0, 0.2, 0]} />
    <M g={coneG(0.85, 1.4, 4)} c="#6a4430" tex="planks" p={[0, 0.2, 2.8]} r={[Math.PI / 2, 0, Math.PI / 4]} s={[1, 1, 0.55]} />
    {Array.from({ length: n }, (_, i) => (
      <Soldier key={i} p={[i % 2 ? 0.35 : -0.35, 0.3, -1.4 + i * 1.0]} coat={coat} s={0.8} />
    ))}
  </group>
);

/** the potato field: ridges with leafy plants */
export const PotatoField: React.FC<{ p: V3; w: number; d: number; rows?: number }> = ({ p, w, d, rows = 9 }) => (
  <group position={p}>
    <M g={boxG(w, 0.06, d)} c="#7a5a3a" tex="sand" ts={1.2} p={[0, 0.03, 0]} cast={false} />
    {Array.from({ length: rows }, (_, i) => {
      const x = -w / 2 + (i + 0.5) * (w / rows);
      return (
        <group key={i}>
          <M g={boxG(w / rows * 0.38, 0.26, d)} c="#6a4a2e" tex="sand" p={[x, 0.13, 0]} cast={false} />
          {Array.from({ length: Math.round(d / 1.1) }, (_, j) => (
            <M key={j} g={sphG(0.3, 10)} c={(i + j) % 3 ? "#5aa040" : "#4c9038"} p={[x + Math.sin(i * 3.1 + j) * 0.05, 0.42, -d / 2 + 0.5 + j * 1.1]} s={[1.15, 0.7, 1]} cast={false} />
          ))}
        </group>
      );
    })}
  </group>
);

export const Tree: React.FC<{ p: V3; s?: number; c?: string }> = ({ p, s = 1, c = "#4a9a4a" }) => (
  <group position={p} scale={s}>
    <M g={cylG(0.18, 0.26, 1.8, 10)} c="#6a4a32" tex="wood" p={[0, 0.9, 0]} />
    <M g={sphG(1.2, 14)} c={c} p={[0, 2.5, 0]} />
    <M g={sphG(0.85, 12)} c="#58a850" p={[0.7, 2.1, 0.3]} />
  </group>
);

export const Farmhouse: React.FC<{ p: V3; yaw?: number }> = ({ p, yaw = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(4.4, 2.4, 3.4)} c="#d8b88a" tex="planks" p={[0, 1.2, 0]} />
    {[-1, 1].map((s) => (
      <M key={s} g={boxG(5.0, 0.14, 2.3)} c="#8a4a3a" tex="roofTiles" p={[0, 2.95, s * 0.95]} r={[s * 0.7, 0, 0]} />
    ))}
    <M g={boxG(0.9, 1.7, 0.08)} c="#5a3a2a" tex="planks" p={[-1.0, 0.85, 1.72]} />
    <M g={boxG(0.8, 0.8, 0.06)} c="#8ab0d8" p={[1.1, 1.4, 1.72]} />
    <M g={boxG(0.12, 1.6, 0.06)} c="#e8dcc0" p={[1.1, 1.4, 1.75]} />
  </group>
);

/** water + island base + grass; the sea is a big flat toon plane */
export const Island: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <group>
    <M g={boxG(600, 0.2, 600)} c="#3f86c8" p={[0, -0.9, 0]} cast={false} />
    {[0, 1, 2, 3].map((i) => (
      <M key={i} g={boxG(40 + i * 5, 0.06, 0.18)} c="#bfe0ff" p={[Math.sin(t * 0.4 + i) * 6 + i * 9 - 14, -0.78, -34 - i * 4]} cast={false} />
    ))}
    <M g={cylG(52, 56, 1.2, 64)} c="#d8c48a" tex="sand" p={[0, -0.62, 0]} />
    <M g={cylG(49, 50, 0.3, 64)} c="#6cb050" tex="grass" ts={0.5} p={[0, -0.02, 0]} />
  </group>
);
void cs;
