import type {SceneSpec, Beat, Size} from './direct';
import type {FxCall} from './fx';

/* short builders */
export const b = (n: string, f: Beat['f'], z: Size | number, x: Partial<Beat> = {}): Beat => ({n, f, z, ...x});
export const fx = (k: string, x: Partial<FxCall> = {}): FxCall => ({k, ...x});
export const D = (n: number) => n; // frames helper (30 fps)

/* ------------------------- 1. Sunday dinner (001-019) ------------------------- */
export const dinnerCast = {
	kofi: {x: 450, sit: true, face: 1 as const},
	hero: {x: 650, sit: true, face: 1 as const},
	mom: {x: 830, sit: true, face: 1 as const},
	rosa: {x: 1180, sit: true, face: -1 as const},
};
export const SC_A: SceneSpec[] = [
	{
		at: '001',
		set: 'dinner',
		cast: dinnerCast,
		crowds: [
			{id: 'rel1', n: 8, x0: 260, x1: 1680, floor: 872, s: 0.78, sit: true, mode: 'stand'},
			{id: 'rel2', n: 6, x0: 420, x1: 1560, floor: 850, s: 0.7, sit: true, mode: 'stand', seed: 'rb'},
		],
		beats: [
			b('001', 'hero', 'm', {g: {hero: 'shrug'}, e: {hero: 'normal+smirk'}, fx: [fx('title', {text: 'SUNDAY DINNER', sub: "Grandma Rosa's house", d: 80})]}),
			b('002', 'all', 'w', {crowd: {rel1: 'gasp', rel2: 'gasp'}, g: {kofi: 'recoil', mom: 'recoil'}, e: {mom: 'wide', kofi: 'wide'}, fx: [fx('stat', {to: 14, sub: 'RELATIVES FREEZE', d: 90, o: 6})], sh: 0.5}),
			b('003', 'rosa', 'm', {g: {rosa: 'present'}, e: {rosa: 'normal+smile'}, fx: [fx('tag', {a: 'rosa', text: 'GRANDMA ROSA'})]}),
			b('004', [960, 340], 'm', {dy: 80, fx: [fx('bill', {tx: 960, ty: 660, m: 'slow', d: 150})]}),
			b('005', [960, 640], 'c', {fx: [fx('ono', {x: 960, y: 560, text: 'PLOP!', o: 52, d: 40})], sh: 0.6}),
			b('006', 'kofi', 'c', {fc: {kofi: 'hero'}, e: {kofi: 'wide+open'}, g: {kofi: 'present'}, fx: [fx('say', {a: 'kofi', text: 'Did you just get paid for that?', th: false, o: 8, d: 70})]}),
			b('007', 'mom', 'c', {g: {mom: 'facepalm'}, e: {mom: 'sad'}}),
			b('008', 'rosa', 'm', {g: {rosa: 'present'}, e: {rosa: 'wide'}, fx: [fx('ring', {a: 'rosa', y: 640, o: 40})]}),
			b('009', 'rosa', 'c', {e: {rosa: 'wide+open'}, fx: [fx('mark', {a: 'rosa', text: '!'})]}),
			b('010', 'rosa', 'x', {e: {rosa: 'angry+frown'}, g: {rosa: 'fist'}, fx: [fx('ono', {a: 'rosa', ty: -10, tx: 120, text: 'HMPH', d: 40, o: 6, s: 0.6})]}),
			b('011', 'hero', 'm', {e: {hero: 'worried'}, fx: [fx('rule', {text: 'SCARY TRUTH|= $100 BILL', sub: 'THE RULE', d: 95})]}),
			b('012', 'hero', 'c', {g: {hero: 'present'}, fx: [fx('bill', {a: 'hero', d: 80, o: 6}), fx('ring', {a: 'hero', y: 700, o: 40})]}),
			b('013', [700, 700], 'x', {g: {hero: 'present'}, fx: [fx('ring', {x: 700, y: 700, o: 10})]}),
			b('014', 'all', 'w', {fx: [fx('fact', {m: 'coin', text: 'PAY FOR|LUNCH', sub: 'THIS WEEK', c: '#2f6a4a', d: 70})]}),
			b('015', 'all', 'w', {fx: [fx('fact', {m: 'bars', text: 'PAY FOR|COLLEGE', sub: 'BY SPRING', c: '#2a3a7a', d: 70})]}),
			b('016', 'mom', 'm', {g: {mom: 'touch'}, e: {mom: 'normal+smile'}, fx: [fx('fact', {m: 'coin', text: 'BUY MOM|A HOUSE', sub: 'KEEP GOING', c: '#6a2a5a', d: 60})]}),
			b('017', 'hero', 'm', {e: {hero: 'worried'}, fx: [fx('mark', {a: 'hero', text: '?'})]}),
			b('018', 'hero', 'x', {g: {hero: 'think'}}),
			b('019', 'rosa', 'm', {e: {rosa: 'angry'}, g: {rosa: 'cross'}, fx: [fx('stat', {to: 100, pre: '$', sub: 'UP $100 · DOWN ONE GRANDMOTHER', s: 150, d: 90})]}),
		],
	},
];
