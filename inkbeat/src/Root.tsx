import React from "react";
import { Composition } from "remotion";
import { PigWar, PigLook, TOTAL_FRAMES } from "./pigwar/Short";
import { BlobTest } from "./pigwar/BlobTest";
import { PigWar2, PigLook2 } from "./pigwar/Short2";
import { Demo, DEMO_MOODS } from "./demo/Demo";
import { DemoCast } from "./demo/DemoCast";
import { DemoMove, MOVE_FRAMES } from "./demo/DemoMove";
import { SUB } from "./inkbeat/core/frame";

// DemoHero: a low hero framing with foreground props. Demo: one still. Demo-<mood>: the same frame in each act light. DemoWide: the whole set.
// DemoCast: the three example characters in a row (a landscape family sheet).
// DemoMove: a 3 s beat-rig move (sharp). DemoMoveSub: the same at SUB × fps for motion blur (average with ffmpeg tmix).
export const Root: React.FC = () => (
  <>
    <Composition id="PigWar" component={PigWar} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ sub: false }} />
    <Composition id="PigWarSub" component={PigWar} durationInFrames={TOTAL_FRAMES * 4} fps={120} width={1080} height={1920} defaultProps={{ sub: true }} />
    <Composition id="PigLook" component={PigLook} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ id: "S01" }} />
    <Composition id="BlobTest" component={BlobTest} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="PigWar2" component={PigWar2} durationInFrames={1635} fps={30} width={1080} height={1920} defaultProps={{ sub: false }} />
    <Composition id="PigWar2Sub" component={PigWar2} durationInFrames={6540} fps={120} width={1080} height={1920} defaultProps={{ sub: true }} />
    <Composition id="PigLook2" component={PigLook2} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ id: "S01" }} />
    <Composition id="Demo" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "day", wide: false }} />
    <Composition id="DemoHero" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "dusk", wide: false, hero: true }} />
    <Composition id="DemoWide" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "day", wide: true }} />
    {DEMO_MOODS.map((m) => (
      <Composition key={m} id={`Demo-${m}`} component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: m, wide: false }} />
    ))}
    <Composition id="DemoCast" component={DemoCast} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ mood: "day" }} />
    <Composition id="DemoMove" component={DemoMove} durationInFrames={MOVE_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ sub: false }} />
    <Composition id="DemoMoveSub" component={DemoMove} durationInFrames={MOVE_FRAMES * SUB} fps={30 * SUB} width={1080} height={1920} defaultProps={{ sub: true }} />
  </>
);
