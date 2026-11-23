import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
export const FPS = 30;
export const DURATION = Math.ceil(95.05 * FPS);
export const Root: React.FC = () => (
  <Composition id="Dyatlov" component={Video} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
