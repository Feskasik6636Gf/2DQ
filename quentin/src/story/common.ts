import type {Pose} from '../engine/Stickman';
import {run, walk, SIT} from '../kit/actions';
import type {ActorSpec} from './dsl';

export const hero = (x: number, o: Partial<ActorSpec> = {}): ActorSpec => ({cast: 'hero', x, s: 0.98, face: 1, ...o});
export const P = (cast: string, x: number, o: Partial<ActorSpec> = {}): ActorSpec => ({cast, x, s: 1, face: 1, ...o});
/* frozen mid-action poses */
export const FZ: Record<string, Pose> = {
	run: run(0.9),
	step: walk(1.3),
	jump: {lean: 6, head: -4, armF: [150, 20], armB: [-140, 20], legF: [40, 50], legB: [-20, 60]},
	laugh: {lean: -14, head: -12, armF: [20, 60], armB: [-10, 40], legF: [4, 2], legB: [-3, 2]},
	cheer: {lean: -4, head: -6, armF: [165, 10], armB: [-150, 10], legF: [8, 2], legB: [-8, 2]},
	reach: {lean: 8, head: -4, armF: [95, 5], armB: [-8, 16], legF: [14, 4], legB: [-6, 2]},
	panic: {lean: 10, head: 6, armF: [140, 30], armB: [-130, 30], legF: [20, 20], legB: [-18, 20]},
	sit: SIT,
	cover: {lean: 14, head: 16, armF: [140, 120], armB: [-10, 40], legF: [20, 30], legB: [-10, 20]},
	pray: {lean: 6, head: 18, armF: [40, 100], armB: [30, 110], legF: [4, 2], legB: [-3, 2]},
};
