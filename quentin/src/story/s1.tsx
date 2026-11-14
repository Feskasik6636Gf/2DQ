import React from 'react';
import type {Spec} from './dsl';
import {Arrow, Phone, Rings, Wave} from './places';
import {FONT} from '../kit/ui';

const Y = '#ffd34a';
const RED = '#ff5a5a';
const BLUE = '#7fd0ff';

/* ---- 001–022: the hook ---- */
export const S1: Spec[] = [
	{
		at: '001', place: 'kitchen', cam: [1000, 560, 1.15, 900, 540, 1.5],
		actors: [{who: 'mom', x: 1000, face: -1, g: [['wave', '001+6', '001+50'], ['presentF', '002', '002+80']], ex: [['wide', 'open', '001', '001+60']]}],
		fx: (c) => <Rings x={880} y={580} f={c.gf} c="#ffe9a0" />,
		gfx: [{k: 'tag', t: ['001', '001+70'], x: 1000, y: 330, text: "DINNER'S READY, BUDDY!", size: 42}],
	},
	{
		at: '003', whip: true, place: 'living', pv: {portal: 0},
		cam: [900, 620, 1.2, 980, 640, 1.9],
		actors: [{who: 'hero', x: 880, lean: [38, '003+10', '004-6'], reachTo: [['003+20', '004-10', 1030, 800]], face: 1}],
		fx: (c) => <Rings x={1850} y={560} f={c.gf} c="#ffe9a0" n={2} r={200} />,
		gfx: [{k: 'tag', t: ['003+30', '004'], x: 1030, y: 690, text: 'PHONE CHARGER', size: 32}],
	},
	{
		at: '004', place: 'living', pv: {portal: 0},
		cam: [880, 570, 1.7, 900, 560, 2.2],
		actors: [{who: 'hero', x: 880, g: [['stop', '004+6', '005-6']], ex: [['normal', 'smirk', '004', '005']]}],
		gfx: [{k: 'tag', t: ['004+30', '005+4'], x: 880, y: 330, text: '"ONE MINUTE!"', size: 46, c: '#fff'}],
	},
	{
		at: '005', place: 'living', pv: (c: any) => ({portal: Math.min(1, c.f / 90), f: c.gf}),
		cam: [1000, 640, 1.5, 1010, 700, 2.1],
		actors: [{who: 'hero', x: 900, reachTo: [['005+8', 'e005', 1040, 760]], ex: [['wide', 'open', '005+40', 'e005']], face: 1}],
		gfx: [{k: 'shake', t: ['005+40', 'e005'], amp: 16}, {k: 'tag', t: ['005+30', 'e005'], x: 1030, y: 560, text: 'THROUGH THE WALL!', size: 40, c: Y}],
	},
	{
		at: '006', place: 'living', pv: {portal: 1},
		cam: [960, 640, 1.3, 960, 600, 1.9],
		actors: [{who: 'hero', x: 900, reachTo: [['006', 'e006-20', 1040, 760]], ex: [['worried', 'open', '006+20', 'e006']], lean: [-10, '006+30', 'e006']}],
		fx: (c) => (
			<g opacity={0.7}>
				{[0, 1, 2, 3].map((i) => (
					<path key={i} d={`M${940 + i * 60},${640 + Math.sin(c.gf / 5 + i) * 14} q30,-30 60,0`} stroke={BLUE} strokeWidth={8} fill="none" strokeLinecap="round" />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['006+16', 'e006'], x: 1040, y: 480, text: 'COLD LIKE WATER', size: 42, c: BLUE}],
	},
	{
		at: '007', whip: true, place: 'hall', pv: {f: 0, seed: 'fall', dark: 0.25},
		cam: [900, 520, 1.0, 900, 700, 1.25],
		actors: [{who: 'hero', x: 900, drop: [4, '007+60', 760], squash: [0.25, '007+60', '007+75'], ex: [['wide', 'open', '007', '007+70']]}],
		gfx: [{k: 'flash', t: ['007']}, {k: 'shake', t: ['007+58', '007+80'], amp: 34}, {k: 'big', t: ['007+58', '007+110'], text: 'SPLAT', c: '#9fd2a0', y: 140, size: 150}, {k: 'tag', t: ['007+90', 'e007'], x: 960, y: 760, text: 'SOFT & DAMP', size: 38}],
	},
	{
		at: '008', place: 'hall', pv: {seed: 'a', open: [1250], flick: 0.15},
		cam: [800, 600, 1.8, 900, 560, 1.1],
		actors: [{who: 'hero', x: 800, lean: [30, '008', '008+30'], ex: [['wide', 'open', '008+30', 'e008']], look: [0.3, -0.5], g: [['touchFace', '008+8', '008+32']]}],
		gfx: [{k: 'big', t: ['008+50', 'e008'], text: 'ALL YELLOW', c: '#fff26a', y: 150, size: 170}],
	},
	{
		at: '009', place: 'hall', pv: {seed: 'b', open: [-100, 1500], flick: 0.2, chalk: false},
		cam: [500, 540, 1.3, 1500, 540, 1.3], follow: undefined,
		actors: [{who: 'hero', x: 300, go: [['009+10', 'e009-10', 1500]], ex: [['wide', 'open', '009', '010']]}],
		gfx: [
			{k: 'tag', t: ['009+4', '009+60'], x: 640, y: 300, text: 'YELLOW WALLPAPER', size: 40},
			{k: 'tag', t: ['009+50', '009+110'], x: 1000, y: 960, text: 'CARPET: OLD SPONGE', size: 40, c: '#d8c05a'},
			{k: 'tag', t: ['009+100', 'e009'], x: 1420, y: 150, text: 'FLICKERING LIGHTS', size: 40, c: '#fff'},
		],
	},
	{
		at: '010', place: 'hall', pv: {seed: 'c', flick: 0.3},
		cam: [900, 560, 1.4, 900, 540, 1.9],
		actors: [{who: 'hero', x: 900, g: [['handsOnHead', '010+10', 'e010']], ex: [['worried', 'open', '010', 'e010']]}],
		fx: (c) => (
			<g>
				<Rings x={900} y={150} f={c.gf} c={Y} n={4} r={480} />
				<Wave f={c.gf} x={300} y={420} w={1300} h={40} hz={7} c="#fff3a0" />
			</g>
		),
		gfx: [{k: 'tag', t: ['010+20', 'e010'], x: 900, y: 330, text: 'MMMMMMMMM…', size: 44, c: '#fff'}],
	},
	{
		at: '011', place: 'hall', pv: {seed: 'd', open: [350, 1000, 1650]},
		cam: [300, 540, 1.2], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['011', '011+50', 640], ['011+60', '011+110', 1180], ['011+120', 'e011', 1780]]}],
		gfx: [{k: 'tag', t: ['011+6', '011+50'], x: 640, y: 380, text: '← LEFT', size: 46}, {k: 'tag', t: ['011+60', '011+110'], x: 1180, y: 380, text: 'RIGHT →', size: 46}, {k: 'tag', t: ['011+120', 'e011'], x: 1780, y: 380, text: '← LEFT', size: 46}],
	},
	{
		at: '012', place: 'hall', pv: {seed: 'e', open: [1100]},
		cam: [900, 560, 0.95, 960, 560, 0.8],
		actors: [{who: 'hero', x: 300, s: 0.9, go: [['012', 'e012', 1600, 'run']]}],
		gfx: [{k: 'tag', t: ['012+6', '012+50'], x: 400, y: 330, text: 'NO WINDOWS', size: 46, c: RED}, {k: 'tag', t: ['012+36', '012+80'], x: 900, y: 250, text: 'NO DOORS', size: 46, c: RED}, {k: 'tag', t: ['012+66', 'e012'], x: 1450, y: 330, text: 'NO END', size: 46, c: RED}],
	},
	{
		at: '013', place: 'hall', pv: {seed: 'f'},
		cam: [900, 560, 1.7, 940, 520, 2.1],
		actors: [{who: 'hero', x: 780, face: 1, reachTo: [['013+4', 'e013', 905, 540]], look: [0.8, 0.2]}],
		fx: (c) => <Phone x={940} y={510} text="6:42 PM" s={2} rot={-6} />,
		gfx: [{k: 'tag', t: ['013+30', 'e013'], x: 960, y: 730, text: 'NO SIGNAL', size: 40, c: RED}],
	},
	{
		at: '014', place: 'hall', pv: {seed: 'g', open: [1500]},
		cam: [900, 560, 1.5, 900, 560, 1.9],
		actors: [{who: 'hero', x: 780, go: [['014', '014+40', 800]], reachTo: [['014+4', 'e014', 905, 540]], ex: [['worried', 'smirk', '014+50', 'e014']], g: [['scratch', '014+70', 'e014-4']]}],
		fx: (c) => (
			<g>
				<Phone x={940} y={510} text="6:42 PM" s={2} rot={-6} />
				<g transform="translate(1200,330)">
					<circle r={70} fill="#14112a" stroke={Y} strokeWidth={6} />
					<line x1={0} y1={0} x2={0} y2={-48} stroke="#fff" strokeWidth={6} strokeLinecap="round" transform={`rotate(${(c.f / 120) * 720})`} />
				</g>
			</g>
		),
		gfx: [{k: 'tag', t: ['014+30', 'e014'], x: 1200, y: 480, text: '+20 MIN = 6:42', size: 38}],
	},
	{
		at: '015', place: 'hall', pv: {seed: 'h', dark: 0.35},
		cam: [900, 540, 1.6, 900, 540, 2.0],
		actors: [{who: 'hero', x: 900, g: [['shrug', '015+10', 'e015']], ex: [['worried', 'flat', '015', 'e015']]}],
		gfx: [{k: 'tag', t: ['015+20', 'e015'], x: 900, y: 320, text: 'WHAT YOU DON\'T KNOW YET…', size: 40, c: '#fff'}, {k: 'dim', t: ['015', 'e015'], o: 0.3}],
	},
	{
		at: '016', place: 'hall', pv: {seed: 'i', flick: 0.4},
		cam: [900, 520, 1.1, 900, 560, 1.7],
		actors: [{who: 'hero', x: 560, s: 0.9, g: [['handsOnHead', '016+30', 'e016']], ex: [['wide', 'open', '016+20', 'e016']]}],
		gfx: [{k: 'big', t: ['016+10', 'e016'], text: '100 DAYS', sub: 'IN THIS PLACE', c: '#fff26a', y: 130, size: 190}],
	},
	{
		at: '017', place: 'hall', pv: {seed: 'j', open: [200, 1300]},
		cam: [900, 540, 1.3, 960, 540, 1.6],
		actors: [{who: 'hero', x: 900, g: [['scratch', '017+10', 'e017']], ex: [['worried', 'flat', '017', 'e017']]}],
		fx: (c) => (
			<g fontFamily={FONT} fontWeight={800} fill={Y} fontSize={70}>
				{[12, 13, '??', 14, '?', 15].map((n, i) => (
					<text key={i} x={500 + i * 160} y={320 + Math.sin(c.gf / 9 + i) * 24 - Math.max(0, c.f - 20 - i * 6) * 2} opacity={Math.max(0, 1 - Math.max(0, c.f - 30 - i * 8) / 50)}>
						{n}
					</text>
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['017+30', 'e017'], x: 900, y: 760, text: 'LOSING COUNT', size: 42, c: RED}],
	},
	{
		at: '018', place: 'hall', pv: {seed: 'k', open: [1500], dark: 0.3},
		cam: [1100, 560, 1.2, 1500, 600, 1.7],
		actors: [{who: 'hero', x: 500, look: [1, 0], ex: [['wide', 'open', '018+30', 'e018']], g: [['wave', '018+60', 'e018']]}, {who: 'mom', x: 1760, s: 0.5, face: -1, hide: ['018+20', 'e018'], g: [['wave', '018+40', 'e018']]}],
		fx: (c) => <Rings x={1700} y={540} f={c.gf} c="#ffe9a0" n={4} r={420} />,
		gfx: [{k: 'tag', t: ['018+30', 'e018'], x: 1500, y: 360, text: '"DINNER\'S READY"', size: 40, c: '#fff'}],
	},
	{
		at: '019', place: 'hall', pv: {seed: 'l', open: [1500]},
		cam: [1400, 560, 1.2, 1100, 560, 1.4],
		actors: [{who: 'hero', x: 600, look: [1, 0]}, {who: 'iris', x: 1650, s: 0.62, face: -1, g: [['wave', '019+30', 'e019']], hide: ['019+16', 'e019']}],
		gfx: [{k: 'tag', t: ['019+20', 'e019'], x: 1500, y: 380, text: '3 YEARS HERE', size: 44, c: Y}],
	},
	{
		at: '020', whip: true, place: 'door', pv: {f: 0},
		cam: [1100, 540, 1.1, 1400, 560, 1.5],
		actors: [{who: 'hero', x: 700, go: [['020', '020+90', 1180]], ex: [['worried', 'flat', '020+60', 'e020']]}],
		gfx: [{k: 'big', t: ['020+10', '020+100'], text: 'DAY 100', c: '#fff26a', y: 120, size: 190}, {k: 'tag', t: ['020+100', 'e020'], x: 1500, y: 160, text: 'THE ONLY DOOR OUT', size: 40, c: '#fff'}],
	},
	{
		at: '021', place: 'door', pv: {f: 0},
		cam: [1000, 560, 1.4, 960, 560, 1.2],
		actors: [{who: 'hero', x: 800, face: 1, g: [['point', '021+30', 'e021']]}, {who: 'iris', x: 1120, face: -1, g: [['point', '021+40', 'e021']]}],
		gfx: [{k: 'tag', t: ['021+4', 'e021'], x: 960, y: 270, text: 'WHO LEAVES FIRST?', size: 52, c: '#fff'}],
	},
	{
		at: '022', whip: true, place: 'living', pv: {f: 0},
		cam: [1200, 600, 1.2, 1500, 600, 1.5],
		actors: [{who: 'hero', x: 700, go: [['022', '022+70', 1350]], ex: [['smile', 'smile', '022+70', 'e022']]}, {who: 'mom', x: 1800, face: -1, g: [['wave', '022+30', 'e022']]}],
		fx: (c) => <Rings x={1760} y={560} f={c.gf} c="#ffe9a0" n={3} r={300} />,
		gfx: [{k: 'tag', t: ['022+40', 'e022'], x: 1700, y: 330, text: 'STILL CALLING', size: 40}],
	},
];
