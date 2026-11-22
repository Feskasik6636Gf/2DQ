import React from 'react';

/* Hand-drawn animals in the same flat-ink language as the people. Origin = ground point
   under the animal's centre, facing right (face=-1 flips). Everything breathes and wags. */
const INK = '#1d1626';
const S = {stroke: INK, strokeWidth: 3.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

export type AnimalKind = 'bulldog' | 'beagle' | 'retriever' | 'shepherd' | 'greyhound' | 'spaniel' | 'cat' | 'crow' | 'canary' | 'pigeon' | 'gull' | 'raccoon' | 'elephant' | 'bee';
export type AnimalPose = 'stand' | 'sit' | 'lie' | 'walk' | 'run';

export type AnimalProps = {
	kind: AnimalKind;
	x: number;
	y: number; // ground y
	s?: number;
	face?: 1 | -1;
	pose?: AnimalPose;
	talk?: number; // 0..1 mouth
	t: number; // frame (global) for idle motion
	wag?: number; // tail speed multiplier
	flap?: number; // 0..1 wing flapping (birds)
	tilt?: number; // head tilt deg
	rot?: number; // whole body rotation (dives)
	id?: string;
	sad?: number;
	collar?: string;
};

type Dog = {body: string; belly: string; ear: string; earKind: 'flop' | 'point' | 'long'; snout: number; bulk: number; legH: number; tail: 'long' | 'stub' | 'curl'; patch?: string; sz: number; collar?: string; muzzle?: string; neck?: number};
const DOGS: Record<string, Dog> = {
	bulldog: {body: '#d8a36a', belly: '#f0d2a8', ear: '#a9753f', earKind: 'flop', snout: 0.55, bulk: 1.28, legH: 0.7, tail: 'stub', patch: '#fff4e2', sz: 1.05, collar: '#2f7de1', muzzle: '#7a5030'},
	beagle: {body: '#e7b86a', belly: '#fff4e2', ear: '#8a5430', earKind: 'long', snout: 0.8, bulk: 0.9, legH: 0.85, tail: 'curl', patch: '#7a4a2a', sz: 0.95, collar: '#e05a5a'},
	retriever: {body: '#e8b44c', belly: '#f6d98a', ear: '#cf9430', earKind: 'flop', snout: 1, bulk: 1.15, legH: 1, tail: 'long', sz: 1.25, collar: '#3aa37a'},
	shepherd: {body: '#2c2a32', belly: '#8a6a3a', ear: '#2c2a32', earKind: 'point', snout: 1, bulk: 1.08, legH: 1.08, tail: 'long', patch: '#b9833c', sz: 1.25, collar: '#c9cfdd', muzzle: '#17151b'},
	greyhound: {body: '#a9adb8', belly: '#d8dae2', ear: '#7d808c', earKind: 'long', snout: 1.25, bulk: 0.72, legH: 1.3, tail: 'long', sz: 1.2, collar: '#e0b040', neck: 1.3},
	spaniel: {body: '#f3e5d0', belly: '#fff', ear: '#9a5a30', earKind: 'long', snout: 0.85, bulk: 0.95, legH: 0.8, tail: 'long', patch: '#9a5a30', sz: 0.95, collar: '#7a5cc4'},
};

const Eye: React.FC<{x: number; y: number; r?: number; blink?: boolean; sad?: number}> = ({x, y, r = 5.5, blink, sad = 0}) =>
	blink ? (
		<path d={`M${x - r},${y} Q${x},${y + 3} ${x + r},${y}`} fill="none" {...S} strokeWidth={2.6} />
	) : (
		<g>
			<circle cx={x} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth={2.4} />
			<circle cx={x + 1.6} cy={y + 0.6} r={r * 0.55} fill={INK} />
			<circle cx={x + 3} cy={y - 1.4} r={r * 0.22} fill="#fff" />
			{sad > 0 ? <path d={`M${x - r - 2},${y - r - 1} L${x + r},${y - r - 5 - sad * 3}`} stroke={INK} strokeWidth={3} strokeLinecap="round" /> : null}
		</g>
	);

const DogA: React.FC<AnimalProps & {d: Dog}> = ({d, x, y, s = 1, face = 1, pose = 'stand', talk = 0, t, wag = 1, tilt = 0, sad = 0, collar}) => {
	const sc = s * d.sz;
	const walking = pose === 'walk' || pose === 'run';
	const ph = t * (pose === 'run' ? 0.55 : 0.36);
	const bob = walking ? Math.abs(Math.sin(ph)) * (pose === 'run' ? 7 : 4) : Math.sin(t / 26) * 1.6;
	const lieK = pose === 'lie' ? 1 : 0;
	const sitK = pose === 'sit' ? 1 : 0;
	const bw = 62 * d.bulk;
	const bh = 34 * d.bulk;
	const legTop = 60 * d.legH;
	const bodyY = -(legTop + 4) * (1 - lieK * 0.62) + bob * -1;
	const wg = Math.sin(t * 0.55 * wag) * (22 + talk * 6) * (sad > 0 ? 0.25 : 1);
	const col = collar ?? d.collar ?? '#e04a4a';
	const mouth = Math.max(0, Math.min(1, talk * 1.25));
	const blink = t % 110 < 4;
	const headX = 64 + (d.snout - 1) * 4;
	const headY = bodyY - 26 * (d.neck ?? 1) + (sitK ? -26 : 0) + (lieK ? 12 : 0) + tilt * 0.4;
	const leg = (lx: number, a: number, front: boolean) => {
		if (lieK) return null;
		const sw = walking ? Math.sin(ph + a) * (pose === 'run' ? 30 : 20) : 0;
		const top = bodyY + 12;
		const len = Math.max(20, -top - 2);
		if (sitK && !front) return null;
		return (
			<g transform={`translate(${lx},${top}) rotate(${sw})`}>
				<path d={`M-8,0 L-6,${len} Q-9,${len + 8} 2,${len + 8} Q10,${len + 8} 7,${len} L8,0 Z`} fill={d.body} {...S} />
				<path d={`M-7,${len - 6} L7,${len - 6}`} stroke={d.belly} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
			</g>
		);
	};
	return (
		<g transform={`translate(${x},${y}) scale(${face * sc},${sc}) ${sitK ? '' : ''}`}>
			<ellipse cx={0} cy={2} rx={bw * 1.05} ry={9} fill="#000" opacity={0.2} style={{filter: 'blur(4px)'}} />
			{/* tail */}
			<g transform={`translate(${-bw + 6},${bodyY - 6}) rotate(${-30 + wg})`}>
				{d.tail === 'stub' ? <ellipse cx={-6} cy={0} rx={8} ry={6} fill={d.body} {...S} /> : d.tail === 'curl' ? <path d="M0,0 Q-30,-16 -26,-46 Q-24,-56 -14,-50" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" /> : <path d="M0,0 Q-44,2 -56,-26" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />}
				{d.tail === 'curl' ? <path d="M0,0 Q-30,-16 -26,-46 Q-24,-56 -14,-50" fill="none" stroke={d.body} strokeWidth={8} strokeLinecap="round" /> : d.tail === 'long' ? <path d="M0,0 Q-44,2 -56,-26" fill="none" stroke={d.body} strokeWidth={8} strokeLinecap="round" /> : null}
				{d.tail === 'curl' ? <circle cx={-14} cy={-50} r={5} fill="#fff" /> : null}
			</g>
			{leg(-bw * 0.55, 0, false)}
			{leg(-bw * 0.2, Math.PI, false)}
			{/* body */}
			<g transform={`translate(0,${bodyY}) ${sitK ? 'rotate(-28)' : ''}`}>
				<ellipse cx={0} cy={0} rx={bw} ry={bh} fill={d.body} {...S} />
				<ellipse cx={4} cy={bh * 0.45} rx={bw * 0.72} ry={bh * 0.5} fill={d.belly} opacity={0.9} />
				{d.patch && d.patch !== '#fff4e2' ? <ellipse cx={-12} cy={-bh * 0.35} rx={bw * 0.42} ry={bh * 0.42} fill={d.patch} opacity={0.9} /> : null}
				{d.patch === '#fff4e2' ? <path d={`M${bw * 0.55},-10 Q${bw * 0.9},0 ${bw * 0.6},${bh * 0.7} Z`} fill={d.patch} /> : null}
				<path d={`M${-bw * 0.6},${-bh * 0.9} Q0,${-bh * 1.15} ${bw * 0.6},${-bh * 0.9}`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.28} strokeLinecap="round" />
			</g>
			{leg(bw * 0.5, Math.PI, true)}
			{leg(bw * 0.72, 0, true)}
			{/* neck + head */}
			<g transform={`translate(${headX},${headY}) rotate(${tilt})`}>
				<ellipse cx={-10} cy={22} rx={22} ry={26} fill={d.body} {...S} stroke="none" />
				<path d={`M-26,${6} L-26,${34} Q0,${44} 18,${30} L16,${10} Z`} fill={col} {...S} strokeWidth={2.6} opacity={0.0} />
				{/* ear behind */}
				{d.earKind === 'point' ? <path d="M-14,-18 L-24,-58 L8,-30 Z" fill={d.ear} {...S} /> : null}
				<circle cx={0} cy={0} r={29} fill={d.body} {...S} />
				{d.muzzle ? <ellipse cx={26} cy={9} rx={d.snout * 26} ry={15} fill={d.muzzle} opacity={0.55} /> : null}
				{/* snout */}
				<ellipse cx={22 + d.snout * 10} cy={8} rx={14 + d.snout * 12} ry={13 + (d.bulk > 1.2 ? 3 : 0)} fill={d.muzzle ?? d.belly} {...S} />
				{mouth > 0.08 ? (
					<g>
						<path d={`M${14 + d.snout * 6},${16} Q${30 + d.snout * 12},${20 + mouth * 18} ${40 + d.snout * 22},${14}`} fill="#7a1f2e" {...S} strokeWidth={3} />
						<ellipse cx={30 + d.snout * 14} cy={22 + mouth * 12} rx={8} ry={4 + mouth * 3} fill="#ff7a90" />
					</g>
				) : (
					<path d={`M${12 + d.snout * 4},${17} Q${28 + d.snout * 12},${22} ${40 + d.snout * 20},${14}`} fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
				)}
				<ellipse cx={34 + d.snout * 22} cy={0 + (d.bulk > 1.2 ? 3 : 0)} rx={8} ry={6} fill={INK} />
				<circle cx={32 + d.snout * 22} cy={-2} r={2} fill="#fff" opacity={0.7} />
				{d.bulk > 1.2 ? <path d={`M10,-6 Q26,2 40,-4`} fill="none" stroke={INK} strokeWidth={2.4} opacity={0.5} /> : null}
				<Eye x={14} y={-8} blink={blink} sad={sad} />
				<path d={`M6,-22 L22,-${20 + (talk > 0.2 ? 4 : 0)}`} stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
				{/* ear front */}
				{d.earKind === 'flop' ? <path d="M-6,-20 Q-40,-14 -30,26 Q-12,28 -4,2 Z" fill={d.ear} {...S} /> : null}
				{d.earKind === 'long' ? <path d="M-4,-20 Q-44,-10 -38,44 Q-14,50 -6,6 Z" fill={d.ear} {...S} /> : null}
				{d.earKind === 'point' ? <path d="M-2,-26 L-8,-64 L22,-34 Z" fill={d.ear} {...S} /> : null}
				{/* collar */}
				<path d="M-22,24 Q0,36 20,22" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
				<path d="M-22,24 Q0,36 20,22" fill="none" stroke={col} strokeWidth={7.5} strokeLinecap="round" />
				<circle cx={0} cy={36} r={4.5} fill="#ffd84a" stroke={INK} strokeWidth={2} />
			</g>
		</g>
	);
};

const CatA: React.FC<AnimalProps> = ({x, y, s = 1, face = 1, pose = 'sit', talk = 0, t, wag = 1, tilt = 0}) => {
	const sit = pose !== 'stand' && pose !== 'walk' && pose !== 'run';
	const walking = pose === 'walk' || pose === 'run';
	const ph = t * 0.4;
	const body = '#c9854a';
	const tailW = Math.sin(t * 0.18 * wag) * 18;
	const mouth = Math.min(1, talk * 1.3);
	const blink = t % 130 < 4;
	return (
		<g transform={`translate(${x},${y}) scale(${face * s},${s})`}>
			<ellipse cx={0} cy={2} rx={46} ry={8} fill="#000" opacity={0.2} style={{filter: 'blur(4px)'}} />
			<g transform={`translate(${-34},${-18}) rotate(${tailW})`}>
				<path d="M0,0 Q-48,-6 -42,-60 Q-40,-86 -22,-82" fill="none" stroke={INK} strokeWidth={15} strokeLinecap="round" />
				<path d="M0,0 Q-48,-6 -42,-60 Q-40,-86 -22,-82" fill="none" stroke={body} strokeWidth={9.5} strokeLinecap="round" />
				<path d="M-40,-30 l8,0 M-42,-50 l9,0" stroke={'#8a5424'} strokeWidth={4} />
			</g>
			{walking ? (
				<>
					{[-30, -10, 22, 40].map((lx, i) => (
						<path key={i} d={`M${lx},-30 L${lx + Math.sin(ph + i * 1.6) * 12},0`} stroke={INK} strokeWidth={15} strokeLinecap="round" />
					))}
					{[-30, -10, 22, 40].map((lx, i) => (
						<path key={'b' + i} d={`M${lx},-30 L${lx + Math.sin(ph + i * 1.6) * 12},0`} stroke={body} strokeWidth={9.5} strokeLinecap="round" />
					))}
				</>
			) : null}
			<ellipse cx={0} cy={sit ? -34 : -42} rx={sit ? 34 : 50} ry={sit ? 36 : 26} fill={body} {...S} />
			<path d={`M-18,${sit ? -56 : -58} q6,10 0,22 M2,${sit ? -64 : -64} q6,10 0,22`} stroke="#8a5424" strokeWidth={4.5} fill="none" strokeLinecap="round" />
			<ellipse cx={sit ? 8 : 6} cy={sit ? -18 : -24} rx={sit ? 20 : 34} ry={sit ? 16 : 14} fill="#f3dcc0" opacity={0.9} />
			{sit ? (
				<>
					<ellipse cx={20} cy={-3} rx={14} ry={7} fill={body} {...S} />
					<ellipse cx={-8} cy={-3} rx={14} ry={7} fill={body} {...S} />
				</>
			) : null}
			<g transform={`translate(${sit ? 14 : 48},${sit ? -76 : -66}) rotate(${tilt})`}>
				<path d="M-22,-16 L-20,-46 L-4,-24 Z" fill={body} {...S} />
				<path d="M6,-24 L22,-46 L26,-12 Z" fill={body} {...S} />
				<path d="M-17,-22 L-17,-38 L-9,-26 Z" fill="#ffb0b8" />
				<circle cx={0} cy={0} r={27} fill={body} {...S} />
				<path d="M-8,-22 l0,10 M2,-24 l0,10 M12,-22 l0,10" stroke="#8a5424" strokeWidth={4} strokeLinecap="round" />
				<ellipse cx={8} cy={10} rx={14} ry={11} fill="#f3dcc0" />
				<Eye x={-5} y={-3} r={6} blink={blink} />
				<Eye x={15} y={-3} r={6} blink={blink} />
				<path d="M6,6 l4,0 l-2,4 Z" fill="#ff8aa0" stroke={INK} strokeWidth={1.8} />
				{mouth > 0.1 ? <ellipse cx={8} cy={16 + mouth * 2} rx={5} ry={2 + mouth * 5} fill="#7a1f2e" stroke={INK} strokeWidth={2} /> : <path d="M8,10 Q4,18 -2,16 M8,10 Q12,18 18,16" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />}
				<path d="M20,6 l30,-6 M20,10 l30,4 M-6,6 l-28,-6 M-6,10 l-28,4" stroke={INK} strokeWidth={1.8} opacity={0.7} />
			</g>
		</g>
	);
};

const BIRDS: Record<string, {body: string; belly: string; wing: string; beak: string; sz: number; leg: string; neck?: string; tailL: number; head?: string}> = {
	crow: {body: '#2b2a36', belly: '#3a3946', wing: '#1c1b25', beak: '#4a4a55', sz: 1.5, leg: '#2b2a36', tailL: 30},
	canary: {body: '#ffd84a', belly: '#fff0a0', wing: '#f2b920', beak: '#ff9a3a', sz: 0.75, leg: '#ff9a3a', tailL: 16},
	pigeon: {body: '#9aa0b4', belly: '#b9bdce', wing: '#6e748c', beak: '#e8c8b0', sz: 0.95, leg: '#d07a8a', neck: '#6ec8b0', tailL: 20},
	gull: {body: '#f2f4f8', belly: '#ffffff', wing: '#9aa4b8', beak: '#ffb02e', sz: 1.35, leg: '#ffb02e', tailL: 24},
};
const BirdA: React.FC<AnimalProps> = ({kind, x, y, s = 1, face = 1, talk = 0, t, flap = 0, pose = 'stand', rot = 0, tilt = 0}) => {
	const b = BIRDS[kind === 'crow' ? 'crow' : kind === 'canary' ? 'canary' : kind === 'gull' ? 'gull' : 'pigeon'];
	const sc = s * b.sz;
	const hop = pose === 'walk' || pose === 'run' ? Math.abs(Math.sin(t * 0.5)) * 8 : Math.sin(t / 18) * 1.2;
	const wing = flap > 0 ? Math.sin(t * 1.3) * 48 * flap - 12 * flap : Math.sin(t / 30) * 2;
	const mouth = Math.min(1, talk * 1.3);
	const blink = t % 100 < 4;
	const peck = pose === 'walk' ? Math.max(0, Math.sin(t * 0.25)) * 18 : 0;
	return (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${face * sc},${sc})`}>
			<ellipse cx={0} cy={2} rx={26} ry={5} fill="#000" opacity={0.18} style={{filter: 'blur(3px)'}} />
			{flap > 0 ? null : (
				<g stroke={b.leg} strokeWidth={4} strokeLinecap="round">
					<path d={`M-4,${-30 - hop} L-4,0 M-4,0 l-7,0 M-4,0 l7,-1`} fill="none" />
					<path d={`M8,${-30 - hop} L8,0 M8,0 l-7,0 M8,0 l7,-1`} fill="none" />
				</g>
			)}
			<g transform={`translate(0,${-48 - hop - (flap > 0 ? 18 : 0)})`}>
				<path d={`M-24,6 L${-24 - b.tailL},${14} L${-24 - b.tailL * 0.9},${-4} L-22,-8 Z`} fill={b.wing} {...S} strokeWidth={3} />
				<ellipse cx={0} cy={0} rx={30} ry={22} fill={b.body} {...S} />
				<ellipse cx={4} cy={9} rx={20} ry={11} fill={b.belly} opacity={0.85} />
				{b.neck ? <path d="M12,-12 Q22,-6 20,6 Q10,0 4,-12 Z" fill={b.neck} opacity={0.8} /> : null}
				<g transform={`translate(-6,-2) rotate(${wing})`}>
					<path d="M0,-2 Q-36,-12 -34,16 Q-10,26 14,6 Q8,-2 0,-2 Z" fill={b.wing} {...S} strokeWidth={3} />
					<path d="M-24,6 q10,4 20,-2" stroke="#000" strokeOpacity={0.18} strokeWidth={3} fill="none" />
				</g>
				<g transform={`translate(24,${-14 + peck}) rotate(${tilt + peck * 0.8})`}>
					<circle cx={0} cy={-6} r={15} fill={kind === 'crow' ? b.body : b.body} {...S} />
					{kind === 'canary' ? <ellipse cx={-4} cy={-18} rx={6} ry={3} fill={b.wing} /> : null}
					<path d={mouth > 0.1 ? `M12,-8 L${28 + mouth * 3},${-12 - mouth * 3} L12,-3 Z` : `M12,-9 L${27},-5 L12,-2 Z`} fill={b.beak} {...S} strokeWidth={3} />
					{mouth > 0.1 ? <path d={`M12,-3 L${27 + mouth * 2},${3 + mouth * 6} L12,2 Z`} fill={b.beak} {...S} strokeWidth={3} /> : null}
					<Eye x={5} y={-10} r={4.6} blink={blink} />
				</g>
			</g>
		</g>
	);
};

const RaccoonA: React.FC<AnimalProps> = ({x, y, s = 1, face = 1, pose = 'stand', talk = 0, t}) => {
	const mouth = Math.min(1, talk * 1.3);
	const walking = pose === 'walk';
	const ph = t * 0.4;
	const sc = s * 1.0;
	return (
		<g transform={`translate(${x},${y}) scale(${face * sc},${sc})`}>
			<ellipse cx={0} cy={2} rx={50} ry={9} fill="#000" opacity={0.2} style={{filter: 'blur(4px)'}} />
			<g transform={`translate(-44,-34) rotate(${Math.sin(t * 0.2) * 10 - 20})`}>
				<path d="M0,0 Q-54,-8 -62,-44" fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
				<path d="M0,0 Q-54,-8 -62,-44" fill="none" stroke="#9aa0ac" strokeWidth={20} strokeLinecap="round" />
				{[-22, -38, -52].map((k, i) => (
					<path key={i} d={`M${k},${-6 - i * 6} l0,-14`} stroke="#2b2a36" strokeWidth={8} opacity={0.9} />
				))}
			</g>
			{[-24, -6, 26, 44].map((lx, i) => (
				<g key={i}>
					<path d={`M${lx},-36 L${lx + (walking ? Math.sin(ph + i * 1.6) * 12 : 0)},0`} stroke={INK} strokeWidth={17} strokeLinecap="round" />
					<path d={`M${lx},-36 L${lx + (walking ? Math.sin(ph + i * 1.6) * 12 : 0)},0`} stroke="#6e7280" strokeWidth={11} strokeLinecap="round" />
				</g>
			))}
			<ellipse cx={0} cy={-52} rx={54} ry={34} fill="#9aa0ac" {...S} />
			<ellipse cx={6} cy={-40} rx={36} ry={18} fill="#c9ced8" opacity={0.8} />
			<g transform={`translate(52,-70)`}>
				<path d="M-24,-20 L-20,-44 L-2,-26 Z" fill="#9aa0ac" {...S} />
				<path d="M10,-26 L24,-44 L28,-14 Z" fill="#9aa0ac" {...S} />
				<circle cx={0} cy={0} r={28} fill="#c9ced8" {...S} />
				<path d="M-26,-8 Q0,-22 28,-8 L26,6 Q0,0 -24,8 Z" fill="#2b2a36" />
				<circle cx={-8} cy={-3} r={6.2} fill="#fff" />
				<circle cx={13} cy={-3} r={6.2} fill="#fff" />
				<circle cx={-6} cy={-2} r={3.4} fill={INK} />
				<circle cx={15} cy={-2} r={3.4} fill={INK} />
				<ellipse cx={9} cy={13} rx={13} ry={10} fill="#e8eaf0" {...S} strokeWidth={2.8} />
				<ellipse cx={14} cy={9} rx={5} ry={4} fill={INK} />
				{mouth > 0.1 ? <ellipse cx={9} cy={19} rx={6} ry={2 + mouth * 6} fill="#7a1f2e" stroke={INK} strokeWidth={2} /> : <path d="M2,18 Q9,22 16,18" fill="none" stroke={INK} strokeWidth={2.4} />}
			</g>
		</g>
	);
};

const ElephantA: React.FC<AnimalProps> = ({x, y, s = 1, face = 1, talk = 0, t, pose = 'stand', sad = 0}) => {
	const sw = Math.sin(t / 34) * 9;
	const ear = Math.sin(t / 16) * 7;
	const c = '#9aa4b5';
	const d = '#7d879b';
	const walking = pose === 'walk';
	const ph = t * 0.16;
	return (
		<g transform={`translate(${x},${y}) scale(${face * s},${s})`}>
			<ellipse cx={0} cy={4} rx={190} ry={18} fill="#000" opacity={0.22} style={{filter: 'blur(6px)'}} />
			{[-110, -62, 70, 120].map((lx, i) => {
				const sh = walking ? Math.sin(ph + i * 1.6) * 16 : 0;
				return <path key={i} d={`M${lx - 26},-130 L${lx - 28 + sh},-6 Q${lx - 28 + sh},8 ${lx + sh},8 Q${lx + 28 + sh},8 ${lx + 26 + sh},-6 L${lx + 26},-130 Z`} fill={i % 2 ? d : c} {...S} />;
			})}
			<ellipse cx={0} cy={-190} rx={178} ry={118} fill={c} {...S} />
			<ellipse cx={0} cy={-150} rx={140} ry={58} fill="#b9c2d0" opacity={0.6} />
			<path d="M-170,-210 Q-196,-190 -180,-160" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
			<g transform={`translate(150,-250)`}>
				<path d={`M-4,-10 Q-84,${-70 + ear} -92,${40 + ear * 2} Q-60,${96 + ear} -8,${40}  Z`} fill={d} {...S} />
				<circle cx={0} cy={0} r={74} fill={c} {...S} />
				<path d={`M26,38 Q${72 + sw},${96} ${52 + sw * 2},${190 + sw} Q${46 + sw * 2},${236} ${84 + sw},${226}`} fill="none" stroke={INK} strokeWidth={64} strokeLinecap="round" />
				<path d={`M26,38 Q${72 + sw},${96} ${52 + sw * 2},${190 + sw} Q${46 + sw * 2},${236} ${84 + sw},${226}`} fill="none" stroke={c} strokeWidth={56} strokeLinecap="round" />
				<path d={`M30,44 Q${70 + sw},${100} ${56 + sw * 2},${190 + sw}`} fill="none" stroke="#fff" strokeOpacity={0.18} strokeWidth={10} strokeLinecap="round" />
				<path d="M44,40 Q80,60 70,96" fill="none" stroke="#fff6dc" strokeWidth={14} strokeLinecap="round" />
				<g>
					<circle cx={28} cy={-12} r={9} fill="#fff" stroke={INK} strokeWidth={3} />
					<circle cx={31} cy={-11} r={5} fill={INK} />
					<path d={`M10,-30 L44,${-34 - sad * 6}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
				</g>
				{talk > 0.15 ? <ellipse cx={52} cy={56} rx={10} ry={5 + talk * 7} fill="#7a1f2e" opacity={0.0} /> : null}
			</g>
		</g>
	);
};

const BeeA: React.FC<AnimalProps> = ({x, y, s = 1, face = 1, t, rot = 0}) => {
	const w = Math.sin(t * 1.9) * 22;
	return (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${face * s},${s})`}>
			<ellipse cx={-4} cy={-14} rx={14} ry={22} fill="#fff" opacity={0.7} stroke={INK} strokeWidth={2} transform={`rotate(${-20 + w} -4 -2)`} />
			<ellipse cx={8} cy={-14} rx={12} ry={20} fill="#fff" opacity={0.7} stroke={INK} strokeWidth={2} transform={`rotate(${20 - w} 8 -2)`} />
			<ellipse cx={0} cy={0} rx={22} ry={15} fill="#ffcc2e" {...S} strokeWidth={3} />
			<path d="M-8,-13 q-4,13 0,26 M4,-14 q-4,14 0,28" stroke={INK} strokeWidth={6} fill="none" />
			<circle cx={22} cy={-2} r={9} fill="#2b2a36" {...S} strokeWidth={2.6} />
			<circle cx={25} cy={-4} r={2.6} fill="#fff" />
			<path d="M-22,0 l-10,2" stroke={INK} strokeWidth={3} strokeLinecap="round" />
		</g>
	);
};

export const Animal: React.FC<AnimalProps> = (p) => {
	switch (p.kind) {
		case 'cat':
			return <CatA {...p} />;
		case 'crow':
		case 'canary':
		case 'pigeon':
		case 'gull':
			return <BirdA {...p} />;
		case 'raccoon':
			return <RaccoonA {...p} />;
		case 'elephant':
			return <ElephantA {...p} />;
		case 'bee':
			return <BeeA {...p} />;
		default:
			return <DogA {...p} d={DOGS[p.kind]} />;
	}
};

/* rough head height (in world px at s=1) so cameras and bubbles can aim */
export const ANIMAL_H: Record<AnimalKind, number> = {bulldog: 120, beagle: 120, retriever: 150, shepherd: 160, greyhound: 190, spaniel: 120, cat: 110, crow: 90, canary: 50, pigeon: 70, gull: 90, raccoon: 120, elephant: 380, bee: 20};
