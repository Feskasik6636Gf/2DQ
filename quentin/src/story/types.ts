/* Plain-data scene description (no JSX): read by src/story/dsl.tsx for the picture and by
   tools/build-sound.mjs for the sound. Time T: a number = frames from shot start, or a
   string 'NNN' / 'NNN+12' / 'NNN-6' = line NNN start (+/- frames), 'NNN>' / 'NNN>+10' = line end. */
export type T = number | string;
export type Gest = 'touchFace' | 'rubChin' | 'facepalm' | 'scratch' | 'shrug' | 'point' | 'handsOnHead' | 'wave' | 'armsCrossed' | 'think' | 'fist' | 'presentF' | 'stop';
export type Expr = 'normal' | 'angry' | 'sad' | 'sleepy' | 'wide' | 'worried' | 'happy';
export type Mouth = 'line' | 'frown' | 'open' | 'smile' | 'flat' | 'smirk' | 'laugh' | 'none';

export type Hold = {k: string; t?: string; n?: number; c?: string; dx?: number; dy?: number; s?: number; rot?: number; show?: [T, T?]};

export type ActorSpec = {
	who: string;
	x: number | [number, number];
	walk?: [T, T];
	speed?: number;
	run?: boolean;
	s?: number;
	size?: 'adult' | 'teen' | 'kid' | 'toddler' | 'tall' | 'giant';
	facing?: 1 | -1;
	floor?: number;
	seat?: number; // hip y of a sitting figure
	g?: [Gest, T, T?][];
	auto?: boolean; // automatic gesture cycle (default true)
	expr?: Expr | [Expr, T][];
	mouth?: Mouth;
	look?: [number, number];
	says?: boolean | [T, T][]; // lip flap from the narrator voice (a quoted line)
	hop?: [T, T];
	hand?: 'point' | 'fist' | 'snap';
	armOver?: boolean;
	acc?: string[];
	pace?: number;
	badge?: boolean;
	faceTurn?: number;
	hold?: Hold;
	hold2?: Hold;
	wob?: [T, T]; // trembling / laughing shake
	hide?: [T, T?]; // actor visible from T0 (default always) ... see `appear`
	appear?: T;
	vanish?: T;
	spin?: [T, T]; // full turn (dance / collapse)
	sink?: [T, T]; // sinks down (knees / slumps)
	age?: number;
	color?: string;
};

export type PropSpec = {
	k: string;
	x?: number | [number, number];
	y?: number | [number, number];
	at?: string; // actor id: x,y are offsets from that actor's feet
	move?: [T, T];
	s?: number | [number, number];
	rot?: number | [number, number];
	show?: [T, T?];
	flip?: boolean;
	layer?: 'b' | 'f' | 'm';
	pop?: boolean;
	t?: string;
	n?: number;
	c?: string;
	bob?: number;
};

export type FxSpec =
	| {k: 'text'; t: T; x: number; y: number; text: string; c?: string; s?: number}
	| {k: 'shock'; t: T; x: number; y: number; c?: string; r?: number}
	| {k: 'spark'; t: T; x: number; y: number; n?: number; c?: string}
	| {k: 'exclaim' | 'question' | 'bulb'; t: T; x: number; y: number; s?: number}
	| {k: 'call'; t: T; t1?: T; from: [number, number]; to: [number, number]; text: string; c?: string; size?: number}
	| {k: 'cap'; t: T; t1: T; lines: string[]; top?: number; c?: string; size?: number}
	| {k: 'big'; t: T; t1: T; text: string; sub?: string; c?: string; y?: number; size?: number; rot?: number}
	| {k: 'flash'; t: T; len?: number}
	| {k: 'glitch'; t: T; len?: number}
	| {k: 'speed'; t: T; t1: T; x?: number; y?: number}
	| {k: 'smoke'; t: T; x: number; y: number; s?: number}
	| {k: 'confetti'; t: T}
	| {k: 'punch'; t: T; amp?: number}
	| {k: 'shake'; t: T; t1?: T; amp?: number}
	| {k: 'pulse'; t: T; t1: T}
	| {k: 'rain'; t?: T}
	| {k: 'snow'; t?: T}
	| {k: 'bolt'; t: T; x: number}
	| {k: 'sfx'; t: T; type: string; amp?: number; dur?: number};

export type CamSpec = number[] | {fol: number; z?: number; z1?: number; y?: number; lead?: number};

export type ShotSpec = {
	at: string;
	p: string; // place: kitchen | kitchenN | kitchenDoor | dining | diningDay | street | streetN | streetDusk | bakery | lab | fridge | fact:230
	a?: ActorSpec[];
	pr?: PropSpec[];
	fx?: FxSpec[];
	cam?: CamSpec;
	whip?: boolean;
	crowd?: [number, number, number, 'dance' | 'stand' | 'run' | 'walk' | 'panic', number?]; // n, x0, x1, mode, s
	fg?: 'counter' | 'steam' | 'lamp';
	hue?: number;
	off?: number;
};
