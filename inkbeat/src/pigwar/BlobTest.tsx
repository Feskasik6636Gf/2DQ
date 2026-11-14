import React from "react";
import { AbsoluteFill } from "remotion";
import { useFonts } from "../inkbeat/core/frame";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import { CastLight } from "../inkbeat/core/castLight";
import { View } from "../inkbeat/core/View";
import { M, boxG } from "../inkbeat/core/kit";
import { Blob } from "./Blob";

export const BlobTest: React.FC = () => {
  const ready = useFonts();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const cam = aim([0, 1.5, 5.2], [0, 1.2, 0], 46, 0.42);
  const m = moodOf("day");
  return (
    <AbsoluteFill>
      <View mood={m} cam={cam} t={1} focus={[0, 1.4, 0]} blur={1.2}>
        <M g={boxG(40, 0.2, 40)} c="#d8c8a8" tex="stone" p={[0, -0.1, 0]} cast={false} />
        <Blob spec={{ body: "#d8453c", trim: "#e8b830", cape: "#b8302c", hat: "crown", beardColor: "#4a3020" }} p={[-1.3, 0, 0]} yaw={0.4} t={1} face={{ eyes: "open", brows: "smug", mouth: "smirk", goatee: true }} pose={{ armR: [40, 70], fwdR: 40 }} />
        <Blob spec={{ body: "#2a9aa6", trim: "#e8b830", cape: "#1f7a86", hat: "helmet", hatColor: "#c8ccd8" }} p={[0, 0, 0.2]} yaw={0} t={1} face={{ eyes: "wide", brows: "worried", mouth: "o", sweat: true }} />
        <Blob spec={{ body: "#b8782e", apron: "#8a5a22", hat: "strawhat", beardColor: "#3a2a1a" }} p={[1.3, 0, 0]} yaw={-0.4} t={1} face={{ eyes: "angry", brows: "angry", mouth: "yell", mustache: true }} />
        <CastLight at={[0, 1.7, 0]} cam={cam.pos} mood={m} />
      </View>
    </AbsoluteFill>
  );
};
