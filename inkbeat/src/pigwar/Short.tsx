// The Pig War, a 54 s vertical Short. One island world, 14 scenes; each scene = a setup (camera, light, cast) and
// camera beats anchored on words of the voice-over. Everything is a pure function of t.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Character3D, headOf } from "../inkbeat/char/Character3D";
import type { CharacterSpec } from "../inkbeat/char/Character3D";
import { Captions, makeChunks } from "../inkbeat/core/captions";
import type { Word } from "../inkbeat/core/captions";
import { CastLight } from "../inkbeat/core/castLight";
import { boxG, coneG, coreMat, cylG, Label, M, sphG } from "../inkbeat/core/kit";
import { subFrame, useFonts } from "../inkbeat/core/frame";
import { solveArm } from "../inkbeat/core/ik";
import { moodOf } from "../inkbeat/core/moods";
import { aim, poseAt, withShake } from "../inkbeat/core/rig";
import type { Beat, Cam } from "../inkbeat/core/rig";
import { closeUp, heroLow, medium } from "../inkbeat/core/shots";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { Boat, Cannon, Farmhouse, Flag, Island, Pig, PotatoField, Rifle, Ship, Soldier, Tent, Tree } from "./assets";
import { END, WORDS } from "./words";

const G = 0.15; // ground height
const FARMER: CharacterSpec = {
  height: 1.74,
  build: { torso: "block", torsoWidth: 1.05 },
  look: { outfit: "vest", colors: { top: "#7a5232", inner: "#e8dcc0", bottom: "#5a4a3a", shoes: "#3a2a22", accent: "#c8a050" }, hair: "crop", hairColor: "#4a3020", hat: "sunhat", mustache: true, face: { nose: "hook", blush: 0.3 }, seed: 11 },
};
const mkOfficer = (top: string, bottom: string, hat: string, seed: number, extra: object = {}): CharacterSpec => ({
  height: 1.78,
  build: { torso: "block", torsoWidth: 1.02 },
  look: { outfit: "jacket", colors: { top, inner: "#f0e8d6", bottom, shoes: "#201a18", accent: "#d8b050" }, hair: "swoop", hairColor: "#2a2024", hat: "flat", hatColor: hat, face: { nose: "hook", blush: 0.2, brow: 1.2 }, seed, ...extra },
});
const US_CMD = mkOfficer("#2a3c86", "#d8d0c0", "#2a3050", 21);
const UK_CMD = mkOfficer("#b8323a", "#e8e0d0", "#2a2024", 22);
const UK_CLERK: CharacterSpec = { height: 1.7, build: { torso: "block", torsoWidth: 0.98 }, look: { outfit: "jacket", colors: { top: "#b8323a", inner: "#f0e8d6", bottom: "#2a2430", shoes: "#201a18", accent: "#d8b050" }, hair: "crop", hairColor: "#8a6a4a", mustache: true, face: { nose: "hook", blush: 0.3 }, seed: 23 } };
const EMPEROR: CharacterSpec = { height: 1.76, build: { torso: "block", torsoWidth: 1.08 }, look: { outfit: "jacket", colors: { top: "#38404e", inner: "#e8dcc0", bottom: "#2a2a34", shoes: "#201a18", accent: "#e0b848" }, hair: "none", mustache: "#e8e4dc", beard: "#e8e4dc", face: { nose: "hook", blush: 0.15, brow: 1.4 }, seed: 31 } };

const Ch: React.FC<{ spec: CharacterSpec; p: V3; yaw: number; t: number; cam: Cam; face?: object; pose?: object; hold?: boolean }> = ({ spec, p, yaw, t, cam, face, pose }) => (
  <Character3D {...spec} position={p} yaw={yaw} t={t} face={{ eyes: "open", mouth: "flat", brows: "neutral", ...(face ?? {}) }} pose={{ armL: [8, 8], armR: [8, 8], ...(pose ?? {}) }} faceCamera={cam.pos} />
);
const headTop = (p: V3, spec: CharacterSpec): V3 => {
  const h = headOf(p, spec.height, spec.build);
  return [h[0], h[1] + spec.height * 0.115, h[2]];
};
const TopHat: React.FC<{ p: V3; spec: CharacterSpec; color?: string }> = ({ p, spec, color = "#1e1a22" }) => {
  const h = headTop(p, spec);
  return (
    <group position={h}>
      <M g={cylG(0.2, 0.2, 0.05, 20)} c={color} p={[0, 0, 0]} />
      <M g={cylG(0.135, 0.15, 0.34, 20)} c={color} p={[0, 0.19, 0]} />
    </group>
  );
};
const Pickelhaube: React.FC<{ p: V3; spec: CharacterSpec }> = ({ p, spec }) => {
  const h = headTop(p, spec);
  return (
    <group position={[h[0], h[1] - 0.04, h[2]]}>
      <M g={cylG(0.19, 0.2, 0.1, 22)} c="#2a2a30" p={[0, 0, 0]} />
      <M g={sphG(0.19, 22)} c="#2a2a32" p={[0, 0.06, 0]} s={[1, 0.8, 1]} />
      <M g={cylG(0.02, 0.02, 0.14, 8)} c="#e0b848" p={[0, 0.27, 0]} />
      <M g={coneG(0.02, 0.1, 8)} c="#e0b848" p={[0, 0.38, 0]} />
    </group>
  );
};
const Bird: React.FC<{ p: V3; t: number }> = ({ p, t }) => (
  <group position={p} rotation={[0, 2.2, 0]}>
    <M g={sphG(0.12, 14)} c="#3a8ad8" p={[0, 0.12, 0]} s={[0.9, 0.85, 1.2]} />
    <M g={sphG(0.075, 12)} c="#3a8ad8" p={[0, 0.24, 0.1]} />
    <M g={coneG(0.025, 0.07, 8)} c="#f0a030" p={[0, 0.235, 0.18]} r={[Math.PI / 2, 0, 0]} />
    <M g={coneG(0.05, 0.16, 8)} c="#2a6ab8" p={[0, 0.1, -0.15]} r={[-1.9 + Math.sin(t * 5) * 0.05, 0, 0]} />
  </group>
);
/** a painted sign board on a post; the text is paint on the board */
const SignPost: React.FC<{ p: V3; text: string; yaw?: number; w?: number }> = ({ p, text, yaw = 0, w = 1.5 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={cylG(0.06, 0.07, 1.8, 10)} c="#6a4a2e" tex="wood" p={[0, 0.9, 0]} />
    <M g={boxG(w, 0.7, 0.07)} c="#d8b880" tex="planks" p={[0, 1.55, 0]} />
    <Label text={text} p={[0, 1.55, 0.04]} w={w * 0.9} h={0.5} fg="#2a1a14" bg="none" font={0.8} />
  </group>
);
const Scroll: React.FC<{ p: V3; yaw: number; text: string }> = ({ p, yaw, text }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(0.62, 0.42, 0.015)} c="#efe2bc" tex="paper" />
    <Label text={text} p={[0, 0, 0.012]} w={0.56} h={0.36} fg="#7a1a1a" bg="none" font={0.5} />
  </group>
);
const Crowd: React.FC<{ n: number; x0: number; z0: number; dx: number; dz: number; coat: string; yaw: number; t: number; hat?: string; rows?: number }> = ({ n, x0, z0, dx, dz, coat, yaw, t, hat, rows = 1 }) => (
  <>
    {Array.from({ length: n * rows }, (_, i) => {
      const r = Math.floor(i / n);
      const c = i % n;
      return <Soldier key={i} p={[x0 + c * dx + r * 0.0, G, z0 + c * dz + r * (dx === 0 ? 1.4 : 0) + (dz === 0 ? r * 1.4 * Math.sign(z0 || 1) : 0)]} yaw={yaw} coat={coat} hat={hat} s={0.92 + ((c * 7 + r * 3) % 5) * 0.03} walk={t * 4 + c} />;
    })}
  </>
);

// -------------------------------------------------------------------------------------------- the world
const World: React.FC<{ t: number; flags?: boolean; usFlag?: "us" | "uk"; pigAt?: V3 | null }> = ({ t, usFlag = "us" }) => (
  <group>
    <Island t={t} />
    <PotatoField p={[0, G, 0]} w={14} d={14} rows={7} />
    <Farmhouse p={[-12, G, 2]} yaw={0.9} />
    <Tree p={[-17, G, 4]} s={1.3} />
    <Tree p={[-15, G, 10]} s={1.0} c="#5aa858" />
    <Tree p={[15, G, -9]} s={1.2} c="#58a050" />
    <Tree p={[17, G, 7]} s={1.4} />
    {/* US camp (south, +z) and British camp (north, -z) */}
    <Flag p={[0, G, 13]} kind={usFlag} t={t} h={6} w={2.2} />
    <Flag p={[0, G, -13]} kind="uk" t={t} h={6} w={2.2} />
    <Tent p={[-4, G, 15]} s={1} yaw={0.2} />
    <Tent p={[4, G, 16]} s={1.1} yaw={-0.3} color="#e8dcc0" />
    <Tent p={[-4, G, -15]} s={1.1} yaw={-0.2} color="#f0e0d0" />
    <Tent p={[4, G, -16]} s={1} yaw={0.3} />
  </group>
);

// -------------------------------------------------------------------------------------------- scenes
type Setup = { cam: Cam; focus?: V3; blur?: number; light?: string; nodes: React.ReactNode; cast?: { at: V3 } };
type Scene = { look?: number; id: string; a: number; b: number; mood: string | ((t: number) => string); moves: string[]; prms?: (object | undefined)[]; make: (t: number, cam: Cam) => Setup; base: (t: number) => Cam };

const FB: V3 = [-3, G, 10]; // farmer feet (grass, south of the field)
const sceneList: Scene[] = [];
const add = (s: Scene) => sceneList.push(s);

// S01 hook: huge pig close-up, then pull out to the two flags
add({
  id: "S01", a: 0, b: 6.2, look: 1.0, mood: "golden", moves: ["SLOWPUSH", "PULL", "CRANE_UP", "ORBIT_R", "PUSH"],
  prms: [undefined, { to: aim([48, 11, 2], [0, 3, 0], 58, 0.45), dur: 1.1 }],
  base: () => aim([3.2, G + 1.05, 10.6], [2.3, G + 0.78, 6.9], 44, 0.42),
  make: (t, cam) => ({
    cam, focus: [2.2, G + 0.8, 5.4], blur: 2.2,
    nodes: (
      <>
        <World t={t} />
        <Pig p={[2.0, G, 6.0]} yaw={0.32} s={1.2} t={t} eat />
        <SignPost p={[5.4, G, 7.0]} text="1859" yaw={-0.5} />
      </>
    ),
  }),
});
// S02 the tiny island
add({
  id: "S02", a: 6.2, b: 10.3, mood: "day", moves: ["CRANE_DOWN", "ORBIT_L", "PUSH", "ORBIT_R"], prms: [{ up: 3 }],
  base: () => aim([36, 11, 30], [0, 2, 2], 56, 0.46),
  make: (t, cam) => ({ cam, focus: [0, 0, 0], blur: 0.5, nodes: <World t={t} /> }),
});
// S03 the farmer wakes and sees the pig eating
add({
  id: "S03", a: 10.3, b: 16.4, mood: "golden", moves: ["PUSH", "ORBIT_R", "CRANE_UP", "ORBIT_L", "PUSH", "ORBIT_R"],
  base: () => heroLow({ feet: FB, height: 1.74, facing: 0.3, side: -24, fill: 0.46 }).cam,
  make: (t, cam) => {
    const surprised = t > 13.2;
    return {
      cam, focus: headOf(FB, 1.74, FARMER.build), blur: 2.0, cast: { at: headOf(FB, 1.74, FARMER.build) },
      nodes: (
        <>
          <World t={t} />
          <Pig p={[0.9, G, 6.6]} yaw={2.6} s={1.2} t={t} eat />
          <Ch spec={FARMER} p={FB} yaw={0.3} t={t} cam={cam} face={surprised ? { eyes: "wide", mouth: "o", brows: "raised", sweat: true } : { eyes: "half", mouth: "flat" }} pose={{ armL: [10, 10], armR: [14, 12], headTilt: -3 }} />
        </>
      ),
    };
  },
});
// S04 He shot her (the pig is never shown shot): the farmer in profile, rifle out to the left of the frame
const Y4 = -Math.PI / 2;
add({
  id: "S04", a: 16.4, b: 17.6, look: 16.95, mood: "day", moves: ["PUSH", "SHAKE"],
  base: () => aim([FB[0] + 0.9, G + 1.45, FB[2] + 3.6], [FB[0] - 0.55, G + 1.3, FB[2]], 46, 0.4),
  make: (t, cam) => {
    const f = Math.sin(Y4), c = Math.cos(Y4);
    const sh: V3 = [FB[0] + f * 0.05 + 0.12, G + 1.3, FB[2] + c * 0.05];
    const R = solveArm({ position: FB, yaw: Y4, side: "R", target: [FB[0] + f * 0.45, G + 1.2, FB[2] + c * 0.45 + 0.05], height: 1.74, build: FARMER.build });
    const L = solveArm({ position: FB, yaw: Y4, side: "L", target: [FB[0] + f * 0.95, G + 1.28, FB[2] + c * 0.95 - 0.05], height: 1.74, build: FARMER.build });
    const fired = t > 16.7;
    const head = headOf(FB, 1.74, FARMER.build);
    return {
      cam, focus: head, blur: 1.6, cast: { at: head },
      nodes: (
        <>
          <World t={t} />
          <Ch spec={FARMER} p={FB} yaw={Y4} t={t} cam={cam} face={{ eyes: "squint", mouth: "grin", brows: "angry" }} pose={{ armR: R.arm, armRFwd: R.fwd, armL: L.arm, armLFwd: L.fwd }} />
          <Rifle p={sh} r={[0, Y4, 0]} smoke={fired && t < 16.85} />
          {fired ? (
            <group position={[sh[0] + f * 1.5, sh[1] + 0.05, sh[2] + c * 1.5]}>
              {[0, 1, 2, 3].map((i) => {
                const u = Math.min(1, (t - 16.7) / 0.9);
                return <M key={i} g={sphG(0.16, 14)} c="#d8ced4" p={[f * (0.15 + i * 0.22) * (0.4 + u), 0.1 * i + u * 0.3, (i % 2 ? 0.1 : -0.1)]} s={0.7 + u * 1.2 + i * 0.25} cast={false} op={0.85 - u * 0.5} />;
              })}
            </group>
          ) : null}
        </>
      ),
    };
  },
});
// S05 the British company demands an arrest
const CL: V3 = [FB[0] + 0.6, G, FB[2]];
const OF: V3 = [FB[0] - 0.9, G, FB[2] - 0.9];
add({
  id: "S05", a: 17.6, b: 22.4, mood: "day", moves: ["PUSH", "ORBIT_L", "CRANE_UP", "ORBIT_R", "PUSH"],
  base: () => {
    const sh = medium({ feet: CL, height: 1.7, facing: -0.5, side: 30 });
    return aim(sh.cam.pos, headOf(CL, 1.7, UK_CLERK.build), sh.cam.fov, 0.56);
  },
  make: (t, cam) => {
    const P = solveArm({ position: CL, yaw: -0.5, side: "R", target: [CL[0] - 1.0, G + 1.45, CL[2] + 0.55], height: 1.7, build: UK_CLERK.build });
    return {
      cam, focus: headOf(CL, 1.7, UK_CLERK.build), blur: 1.8, cast: { at: headOf(CL, 1.7, UK_CLERK.build) },
      nodes: (
        <>
          <World t={t} />
          <Ch spec={UK_CLERK} p={CL} yaw={-0.5} t={t} cam={cam} face={{ eyes: "angry", mouth: "yell", brows: "angry" }} pose={{ armR: P.arm, armRFwd: P.fwd, armL: [10, 10] }} />
          <TopHat p={CL} spec={UK_CLERK} />
          <Ch spec={UK_CMD} p={OF} yaw={-0.3} t={t} cam={cam} face={{ eyes: "squint", mouth: "smirk", brows: "angry" }} pose={{ armL: [20, 40], armR: [10, 10] }} />
        </>
      ),
    };
  },
});
// S06 he refused
add({
  id: "S06", a: 22.4, b: 23.6, mood: "day", moves: ["PUSH"],
  base: () => closeUp({ feet: FB, height: 1.74, facing: 0.3, side: -22 }).cam,
  make: (t, cam) => ({
    cam, focus: headOf(FB, 1.74, FARMER.build), blur: 2.6, cast: { at: headOf(FB, 1.74, FARMER.build) },
    nodes: (
      <>
        <World t={t} />
        <Ch spec={FARMER} p={FB} yaw={0.3} t={t} cam={cam} face={{ eyes: "squint", mouth: "flat", brows: "angry" }} pose={{ armL: [60, 120], armLFwd: 60, armR: [60, 120], armRFwd: 60, headTilt: 5 }} />
      </>
    ),
  }),
});
// S07 American soldiers land
add({
  id: "S07", a: 23.6, b: 27.3, mood: "day", moves: ["DOLLY_L", "PUSH", "ORBIT_R", "CRANE_UP"],
  base: () => aim([38, 2.2, 8], [52, 1.4, 4], 55, 0.45),
  make: (t, cam) => ({
    cam, focus: [52, 1.4, 4], blur: 1.2,
    nodes: (
      <>
        <World t={t} />
        {[0, 1, 2].map((i) => (
          <Boat key={i} p={[56 - i * 0.5 + Math.max(0, 3 - (t - 23.6)) * 1.3, -0.7, -4 + i * 5.5]} yaw={Math.PI / 2 + (i - 1) * 0.12} coat="#2a3c86" t={t} n={3} />
        ))}
        <Crowd n={8} x0={44.8} z0={-8} dx={0} dz={2.1} coat="#2a3c86" yaw={-Math.PI / 2} t={t} rows={2} />
        <Cannon p={[47, G, 1]} yaw={-Math.PI / 2} s={1.0} />
        <Flag p={[46.5, G, 5]} kind="us" t={t} h={4.5} w={1.6} />
      </>
    ),
  }),
});
// S08 five ships
add({
  id: "S08", a: 27.3, b: 31.4, mood: "day", moves: ["ORBIT_L", "PUSH", "DOLLY_R", "CRANE_DOWN"],
  base: () => aim([-38, 3.2, 12], [-62, 4, -2], 56, 0.45),
  make: (t, cam) => ({
    cam, focus: [-62, 4, -2], blur: 1.0,
    nodes: (
      <>
        <World t={t} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Ship key={i} p={[-56 - (i % 2) * 8, -0.3, -16 + i * 7]} yaw={Math.PI / 2 - 0.08 + i * 0.03} s={1.1} t={t} flag="uk"
            sailTag={i === 2 ? <Label text="5 SHIPS" p={[0, 3.4, 2.95]} w={2.5} h={0.9} fg="#1a1424" bg="none" font={0.7} /> : undefined} />
        ))}
      </>
    ),
  }),
});
// S09 the cannons stare at each other across the potato field
add({
  id: "S09", a: 31.4, b: 34.7, mood: "cold", moves: ["DOLLY_L", "PUSH", "ORBIT_R"],
  base: () => aim([0.3, 0.9, 1.2], [0.3, 1.0, -8], 56, 0.5),
  make: (t, cam) => ({
    cam, focus: [0.3, 1.0, -8], blur: 1.4,
    nodes: (
      <>
        <World t={t} />
        {[-3.2, 0, 3.2].map((x) => <Cannon key={"u" + x} p={[x, G, 8]} yaw={Math.PI} tint="#3a3a46" />)}
        {[-3.2, 0, 3.2].map((x) => <Cannon key={"k" + x} p={[x, G, -8]} yaw={0} />)}
        <Crowd n={7} x0={-4.5} z0={10.5} dx={1.5} dz={0} coat="#2a3c86" yaw={Math.PI} t={0} rows={2} />
        <Crowd n={7} x0={-4.5} z0={-10.5} dx={1.5} dz={0} coat="#b8323a" yaw={0} t={0} rows={2} />
      </>
    ),
  }),
});
// S10 two commanders, one order
const UC: V3 = [-0.85, G, 10];
const KC: V3 = [0.85, G, 10];
add({
  id: "S10", a: 34.7, b: 39.3, mood: "cold", moves: ["PUSH", "ORBIT_L", "PUSH", "ORBIT_R", "CRANE_UP"],
  base: () => aim([0, 1.5, 15.6], [0, 1.4, 10], 46, 0.4),
  make: (t, cam) => {
    const hand: V3 = [UC[0] + 0.45, G + 1.0, UC[2] + 0.3];
    const A = solveArm({ position: UC, yaw: Math.PI / 2, side: "R", target: hand, height: 1.78, build: US_CMD.build });
    return {
      cam, focus: [0, 1.5, 10], blur: 1.5, cast: { at: [0, 1.5, 10] },
      nodes: (
        <>
          <World t={t} />
          <Ch spec={US_CMD} p={UC} yaw={Math.PI / 2 - 0.35} t={t} cam={cam} face={{ eyes: "open", mouth: "flat", brows: "worried" }} pose={{ armR: A.arm, armRFwd: A.fwd }} />
          <Ch spec={UK_CMD} p={KC} yaw={-Math.PI / 2 + 0.35} t={t} cam={cam} face={{ eyes: "open", mouth: "flat", brows: "worried" }} />
          <Scroll p={[hand[0] + 0.02, hand[1] + 0.12, hand[2] + 0.1]} yaw={0.0} text="DO NOT FIRE FIRST" />
        </>
      ),
    };
  },
});
// S11 nobody shot: a bird on the cannon
add({
  id: "S11", a: 39.3, b: 40.7, mood: "cold", moves: ["SLOWPUSH"],
  base: () => aim([3.4, 1.7, 13.2], [0, 1.15, 8.1], 38, 0.42),
  make: (t, cam) => ({
    cam, focus: [0, 1.1, 8.1], blur: 2.0,
    nodes: (
      <>
        <World t={t} />
        <Cannon p={[0, G, 8]} yaw={Math.PI} />
        <group position={[0.05, G + 1.15, 8.55]} scale={1.8}>
          <Bird p={[0, 0, 0]} t={t} />
        </group>
        <Crowd n={6} x0={-4} z0={-6} dx={1.6} dz={0} coat="#b8323a" yaw={0} t={0} />
      </>
    ),
  }),
});
// S12 twelve years: time-lapse day-night-day, a shared camp on the grass
const CAMP: V3 = [9, G, 10];
add({
  id: "S12", a: 40.7, b: 44.6, look: 42.4, mood: (t) => (t < 41.7 ? "day" : t < 43.3 ? "night" : "golden"), moves: ["CRANE_UP", "ORBIT_R", "PUSH"],
  base: () => aim([CAMP[0] + 6, 2.8, CAMP[2] + 7], [CAMP[0], 1.1, CAMP[2]], 52, 0.45),
  make: (t, cam) => ({
    cam, focus: [CAMP[0], 1.1, CAMP[2]], blur: 1.0,
    nodes: (
      <>
        <World t={t} />
        <group position={CAMP}>
          <Tent p={[-3, 0, -2]} yaw={0.4} />
          <Tent p={[3, 0, -1.5]} yaw={-0.4} color="#f0e0d0" />
          <Soldier p={[-1, 0, 1.2]} coat="#2a3c86" yaw={0.8} walk={t * 3} />
          <Soldier p={[1, 0, 1.0]} coat="#b8323a" yaw={-0.8} walk={t * 3 + 1} />
          <Soldier p={[0, 0, 2.2]} coat="#2a3c86" yaw={3.1} />
          <M g={cylG(0.5, 0.5, 0.06, 20)} c="#8a5a32" tex="wood" p={[0, 0.7, 1.5]} />
          <M g={cylG(0.05, 0.05, 0.7, 8)} c="#6a4a2e" p={[0, 0.35, 1.5]} />
          <SignPost p={[3.6, 0, 3.0]} text="12 YEARS" yaw={-0.7} w={2.0} />
          <pointLight position={[0, 1.2, 1.5]} color="#ffb060" intensity={4} distance={9} decay={2} />
        </group>
      </>
    ),
  }),
});
// S13 the German emperor settles it
const EM: V3 = [FB[0], G, FB[2]];
add({
  id: "S13", a: 44.6, b: 50.8, mood: "day", moves: ["PUSH", "ORBIT_R", "CRANE_UP", "ORBIT_L", "PUSH", "ORBIT_R"],
  base: () => {
    const sh = medium({ feet: EM, height: 1.76, facing: 0.2, side: 26 });
    return aim(sh.cam.pos, headOf(EM, 1.76, EMPEROR.build), sh.cam.fov, 0.5);
  },
  make: (t, cam) => {
    const hand: V3 = [EM[0] - 0.35, G + 1.05, EM[2] + 0.45];
    const A = solveArm({ position: EM, yaw: 0.2, side: "R", target: hand, height: 1.76, build: EMPEROR.build });
    return {
      cam, focus: headOf(EM, 1.76, EMPEROR.build), blur: 1.7, cast: { at: headOf(EM, 1.76, EMPEROR.build) },
      nodes: (
        <>
          <World t={t} usFlag="us" />
          <Ch spec={EMPEROR} p={EM} yaw={0.2} t={t} cam={cam} face={{ eyes: "open", mouth: "smile", brows: "raised" }} pose={{ armR: A.arm, armRFwd: A.fwd }} />
          <Pickelhaube p={EM} spec={EMPEROR} />
          <group position={[hand[0], hand[1] + 0.05, hand[2] + 0.12]} rotation={[-0.5, 0.2, 0]}>
            <M g={boxG(0.7, 0.5, 0.02)} c="#e8d8a8" tex="paper" />
            <Label text="1872" p={[0, 0, 0.012]} w={0.5} h={0.3} fg="#5a2a14" bg="none" font={0.7} />
          </group>
        </>
      ),
    };
  },
});
// S14 payoff: one pig
add({
  id: "S14", a: 50.8, b: 54.5, mood: "golden", moves: ["PUSH", "SLOWPUSH"],
  base: () => aim([3.4, G + 1.0, 11.4], [2.0, G + 0.72, 6.6], 40, 0.42),
  make: (t, cam) => ({
    cam, focus: [2.0, G + 0.75, 6.4], blur: 2.4,
    nodes: (
      <>
        <World t={t} />
        <Pig p={[2.0, G, 6.4]} yaw={0.3} s={1.15} t={t} />
      </>
    ),
  }),
});

// -------------------------------------------------------------------------------------------- beats from words
const wordsIn = (a: number, b: number) => WORDS.filter(([, t]) => t >= a && t < b);
export const beatsOf = (s: Scene): { beats: Beat[]; prms: (object | undefined)[] } => {
  const beats: Beat[] = [];
  const prms: (object | undefined)[] = [];
  let last = -9;
  let k = 0;
  const cands: [string, number][] = [[WORDS.find(([, t]) => t >= s.a)?.[0] ?? "", s.a], ...wordsIn(s.a + 0.2, s.b - 0.5).map(([w, t]) => [w, t] as [string, number])];
  for (const [w, t] of cands) {
    if (t - last < 0.95) continue;
    const mv = s.moves[k % s.moves.length];
    beats.push({ t: Math.max(s.a, t - 0.2), move: mv, dur: 0.63, word: w });
    prms.push(s.prms?.[k]);
    last = t;
    k++;
  }
  return { beats, prms };
};
const CHUNKS = makeChunks(WORDS as Word[], END);
const ACCENT = new Set<string>();

export const sceneAt = (t: number) => sceneList.find((s) => t >= s.a && t < s.b) ?? sceneList[sceneList.length - 1];
export const SCENE_IDS = sceneList.map((s) => s.id);

const Frame: React.FC<{ t: number; tc: number; scene: Scene }> = ({ t, tc, scene }) => {
  const { beats, prms } = beatsOf(scene);
  const p = poseAt(scene.base(t), beats, scene.a, t, prms as never);
  const cam = withShake(p, p.shake);
  const S = scene.make(t, cam);
  const mood = moodOf(typeof scene.mood === "function" ? scene.mood(t) : scene.mood);
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={mood} cam={S.cam} t={t} focus={S.focus} blur={S.blur ?? 1.4}>
        {S.nodes}
        <CastLight at={S.cast?.at ?? [0, -50, 0]} cam={S.cam.pos} mood={mood} k={S.cast ? 1 : 0} />
      </View>
      <Captions chunks={CHUNKS} t={tc} accent={ACCENT} />
    </AbsoluteFill>
  );
};

/** the full Short; sub = render at 4x fps for motion blur */
export const PigWar: React.FC<{ sub?: boolean }> = ({ sub = false }) => {
  const ready = useFonts();
  const g = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const { n, fp } = sub ? subFrame(g) : { n: g, fp: g };
  const t = fp / 30;
  return <Frame t={t} tc={n / 30} scene={sceneAt(n / 30)} />;
};
/** look-dev: one scene at its middle (or at `at`) */
export const PigLook: React.FC<{ id?: string; at?: number }> = ({ id = "S01", at }) => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const s = sceneList.find((x) => x.id === id) ?? sceneList[0];
  const t = at ?? s.look ?? s.a + (s.b - s.a) * 0.55;
  return <Frame t={t} tc={t} scene={s} />;
};
export const TOTAL_FRAMES = Math.ceil(END * 30);
void coreMat;
