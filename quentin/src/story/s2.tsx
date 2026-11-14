import React from 'react';
import type {Spec} from './dsl';
import {Arrow, Chalk, Phone, Rings, Wave, Water} from './places';
import {BarPair, Board, Clock, Eyeball, Note, Pages, Speech, Thought, WallFace, Zzz} from './fxlib';
import {FONT} from '../kit/ui';

const Y = '#ffd34a';
const RED = '#ff5a5a';
const BLUE = '#7fd0ff';
const lamp = (f: number, x: number, y: number, on = true) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-110} y={-18} width={220} height={36} rx={6} fill={on ? '#fffbe2' : '#6a6448'} />
		{on ? <path d="M-100,18 L100,18 L220,340 L-220,340 Z" fill="#fff6c0" opacity={0.18} /> : null}
	</g>
);

/* ---- 023–051: day one to the water room ---- */
export const S2: Spec[] = [
	{
		at: '023', place: 'hall', pv: {seed: 'a1', open: [900]}, cam: [250, 560, 1.3], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['023+10', '023+90', 900], ['023+100', 'e023', 1500]], ex: [['wide', 'open', '023+40', 'e023']], g: [['presentF', '023+20', '023+80'], ['wave', '023+100', 'e023']]}],
		gfx: [{k: 'tag', t: ['023+30', '023+80'], x: 640, y: 420, text: 'HELLO?!', size: 46}, {k: 'tag', t: ['023+90', 'e023'], x: 1280, y: 400, text: 'ANYONE?!', size: 46}],
	},
	{
		at: '024', place: 'hall', pv: {seed: 'a2', open: [1500]}, cam: [900, 540, 1.5, 700, 540, 1.25],
		actors: [{who: 'hero', x: 700, g: [['presentF', '024', '024+40']], ex: [['wide', 'open', '024', '024+50'], ['sad', 'frown', '024+60', 'e024']], face: 1}],
		fx: (c) => (
			<g fontFamily={FONT} fontWeight={900} fill="#fff">
				{[0, 1, 2].map((i) => (
					<text key={i} x={860 + i * 150} y={400 + i * 10} fontSize={78 - i * 18} opacity={Math.max(0, 1 - Math.max(0, c.f - 18 - i * 14) / 40) * (c.f > 10 ? 1 : 0)}>
						{['HEEEY', 'hey', 'hey'][i]}
					</text>
				))}
			</g>
		),
		gfx: [{k: 'big', t: ['024+50', 'e024'], text: '~ 3 SECONDS', sub: 'THEN THE HUM EATS IT', c: '#fff', y: 120, size: 120}],
	},
	{
		at: '025', whip: true, place: 'void', cam: [900, 520, 1.15, 1000, 500, 1.35],
		actors: [{who: 'hero', x: 420, s: 0.9, g: [['think', '025+10', 'e025']], look: [1, -0.3]}],
		back: (c) => (
			<g transform="translate(1200,0)">{lamp(c.gf, 0, 260, c.f % 14 < 9)}</g>
		),
		gfx: [{k: 'big', t: ['025+10', 'e025'], text: 'THE HUM', c: '#fff26a', y: 120, size: 170}],
	},
	{
		at: '026', place: 'void', cam: [1100, 520, 1.3, 1200, 460, 1.7],
		actors: [{who: 'hero', x: 420, s: 0.9, g: [['point', '026+10', '026+90']], look: [0.8, -0.5]}],
		back: (c) => <g transform="translate(1200,0)">{lamp(c.gf, 0, 260, c.f % 4 < 2)}</g>,
		fx: (c) => <Rings x={1200} y={300} f={c.gf} c={Y} n={3} r={420} />,
		gfx: [{k: 'tag', t: ['026+20', 'e026'], x: 1200, y: 640, text: 'TOO FAST FOR YOUR EYES', size: 44, c: '#fff'}],
	},
	{
		at: '027', place: 'void', cam: [960, 460, 1.0, 1000, 470, 1.25],
		actors: [{who: 'hero', x: 250, s: 0.8, g: [['shrug', '027+30', 'e027']]}],
		fx: (c) => (
			<g>
				<text x={520} y={250} fontFamily={FONT} fontWeight={900} fontSize={60} fill="#fff">THE WALL ELECTRICITY</text>
				<polyline points={Array.from({length: 120}).map((_, i) => `${520 + i * 9},${520 + Math.sin(i / 6 + c.gf / 8) * 110}`).join(' ')} stroke={BLUE} strokeWidth={9} fill="none" strokeLinecap="round" />
			</g>
		),
		gfx: [{k: 'big', t: ['027+30', 'e027'], text: '50–60×', sub: 'CHANGES DIRECTION EVERY SECOND', c: BLUE, y: 760, size: 130}],
	},
	{
		at: '028', place: 'void', cam: [1000, 480, 1.2, 1100, 500, 1.55],
		actors: [{who: 'hero', x: 300, s: 0.8, g: [['point', '028+20', 'e028']]}],
		back: (c) => <g transform="translate(1200,0)">{lamp(c.gf, 0, 230, c.f % 8 < 4)}</g>,
		fx: (c) => <Wave f={c.gf} x={760} y={800} w={880} h={150} hz={3} c="#fff3a0" />,
		gfx: [{k: 'tag', t: ['028+10', 'e028'], x: 1200, y: 640, text: 'LIGHT… DIM… LIGHT… DIM…', size: 40, c: Y}],
	},
	{
		at: '029', place: 'void', cam: [900, 480, 1.1, 960, 500, 1.4],
		actors: [{who: 'hero', x: 300, s: 0.8, ex: [['wide', 'open', '029+40', 'e029']], g: [['handsOnHead', '029+50', 'e029']]}],
		fx: (c) => <Wave f={c.gf} x={560} y={760} w={1000} h={190} hz={12} c="#fff3a0" />,
		gfx: [{k: 'big', t: ['029+16', 'e029'], text: '120 FLICKERS', sub: 'EVERY SECOND', c: '#fff26a', y: 100, size: 150}],
	},
	{
		at: '030', whip: true, place: 'hall', pv: {seed: 'b1', flick: 0.25}, cam: [900, 560, 1.4, 900, 520, 1.9],
		actors: [{who: 'hero', x: 900, g: [['touchFace', '030+50', 'e030']], ex: [['normal', 'line', '030', '030+50'], ['worried', 'frown', '030+60', 'e030']]}],
		gfx: [{k: 'tag', t: ['030+10', '030+60'], x: 900, y: 330, text: 'BRAIN: "ALL FINE"', size: 38, c: '#fff'}, {k: 'tag', t: ['030+70', 'e030'], x: 900, y: 330, text: 'A FEW HOURS LATER…', size: 38, c: RED}],
	},
	{
		at: '031', place: 'hall', pv: {seed: 'b2', flick: 0.3}, cam: [900, 560, 2.0, 920, 540, 2.4],
		actors: [{who: 'hero', x: 900, g: [['handsOnHead', '031', '031+30'], ['touchFace', '031+36', '031+60'], ['facepalm', '031+66', 'e031']], ex: [['worried', 'frown', '031', 'e031']]}],
		gfx: [{k: 'tag', t: ['031', '031+30'], x: 900, y: 300, text: 'DULL HEADACHE', size: 34, c: RED}, {k: 'tag', t: ['031+34', '031+64'], x: 1100, y: 450, text: 'TIGHT JAW', size: 34, c: RED}, {k: 'tag', t: ['031+66', 'e031'], x: 760, y: 450, text: 'TIRED EYES', size: 34, c: RED}],
	},
	{
		at: '032', place: 'hall', pv: {seed: 'b3', open: [1300]}, cam: [900, 560, 1.4, 900, 600, 1.9],
		actors: [{who: 'hero', x: 800, lean: [12, '032+10', 'e032'], g: [['touchFace', '032+20', 'e032']], ex: [['sleepy', 'frown', '032', 'e032']]}],
		fx: (c) => <Water x={1130} y={430 + Math.sin(c.gf / 8) * 8} s={1.4} />,
		gfx: [{k: 'tag', t: ['032+16', 'e032'], x: 1130, y: 320, text: 'THIRSTY', size: 46, c: BLUE}],
	},
	{
		at: '033', whip: true, place: 'void', cam: [960, 480, 1.0, 960, 480, 1.2],
		actors: [{who: 'hero', x: 220, s: 0.85, g: [['stop', '033+30', 'e033']]}],
		fx: (c) => <Board x={1050} y={150} f={c.f} t0={c.R('033+10')} lines={['THE RULE', 'FROM SCHOOL:', '(the only one that matters)']} size={62} />,
	},
	{
		at: '034', place: 'void', cam: [960, 520, 1.0, 960, 500, 1.15],
		actors: [{who: 'hero', x: 220, s: 0.85, g: [['point', '034+30', '034+70'], ['shrug', '034+110', 'e034']]}],
		fx: (c) => <BarPair x={560} y={360} f={c.f} t0={c.R('034+6')} />,
		gfx: [{k: 'flash', t: ['034+96']}],
	},
	{
		at: '035', whip: true, place: 'hall', pv: {seed: 'c1', open: [700, 1500]}, cam: [300, 560, 1.3], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['035+4', 'e035', 1700, 'run']]}],
		gfx: [{k: 'tag', t: ['035+10', 'e035'], x: 700, y: 360, text: 'FASTER!', size: 54, c: Y}],
	},
	{
		at: '036', place: 'hall', pv: {seed: 'c2', open: [500, 1300]}, cam: [900, 560, 1.1, 900, 560, 1.3],
		actors: [{who: 'hero', x: -100, go: [['036', '036+90', 1100, 'run'], ['036+100', 'e036', 2100, 'run']]}],
		back: (c) => (
			<g>
				{[300, 1250, 2200].map((x) => (
					<g key={x}>
						<ellipse cx={x} cy={420} rx={90} ry={60} fill="#7a621a" opacity={0.7} />
						<text x={x} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff" opacity={0.9}>SAME STAIN</text>
					</g>
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['036+20', 'e036'], x: 900, y: 240, text: 'EVERY TURN LOOKS IDENTICAL', size: 44, c: '#fff'}],
	},
	{
		at: '037', place: 'hall', pv: {seed: 'c3'}, cam: [900, 560, 1.5, 900, 560, 1.2],
		actors: [{who: 'hero', x: 900, g: [['touchFace', '037+6', '037+50'], ['think', '037+56', '037+110'], ['handsOnHead', '037+116', 'e037']], ex: [['worried', 'flat', '037', 'e037']]}],
		gfx: [{k: 'tag', t: ['037+6', '037+60'], x: 560, y: 330, text: 'THE SAME STAIN', size: 38}, {k: 'tag', t: ['037+50', '037+110'], x: 1260, y: 330, text: 'THE SAME SMELL', size: 38}, {k: 'tag', t: ['037+90', 'e037'], x: 900, y: 200, text: 'THE SAME HUM', size: 38}],
	},
	{
		at: '038', place: 'hall', pv: {seed: 'c4'}, cam: [900, 560, 1.9, 900, 540, 2.3],
		actors: [{who: 'hero', x: 900, g: [['touchFace', '038+10', 'e038']], ex: [['sleepy', 'open', '038', 'e038']]}],
		fx: (c) => (
			<g>
				{Array.from({length: 14}).map((_, i) => (
					<circle key={i} cx={780 + (i % 7) * 40 + Math.sin(c.gf / 5 + i) * 6} cy={420 + Math.floor(i / 7) * 34 - ((c.f + i * 3) % 40)} r={4} fill="#e8d8a0" opacity={0.7} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['038+30', 'e038'], x: 900, y: 300, text: 'MOUTH = SANDPAPER', size: 38, c: '#e8c870'}],
	},
	{
		at: '039', place: 'hall', pv: {seed: 'c5'}, cam: [900, 540, 2.3, 900, 560, 2.7],
		actors: [{who: 'hero', x: 900, g: [['touchFace', '039+4', 'e039']], ex: [['sad', 'frown', '039', 'e039']]}],
		gfx: [{k: 'tag', t: ['039+16', 'e039'], x: 900, y: 270, text: 'LIPS CRACK', size: 40, c: RED}, {k: 'shake', t: ['039+36', '039+50'], amp: 12}],
	},
	{
		at: '040', place: 'hall', pv: {seed: 'd1', open: [1400]}, cam: [500, 560, 1.7, 900, 560, 1.6],
		actors: [{who: 'hero', x: 400, go: [['040+30', 'e040', 1300]], g: [['fist', '040', '040+30']], lean: [8, '040', '040+30']}],
		fx: (c) => <Arrow x={1100} y={560} f={c.gf} c={Y} />,
		gfx: [{k: 'tag', t: ['040+6', '040+60'], x: 420, y: 340, text: 'HANDS SHAKING', size: 38, c: RED}, {k: 'shake', t: ['040', '040+30'], amp: 6}],
	},
	{
		at: '041', whip: true, place: 'closet', pv: {bottles: 0}, cam: [900, 540, 1.1, 1000, 560, 1.4],
		actors: [{who: 'hero', x: 300, go: [['041+4', '041+60', 900]], ex: [['wide', 'open', '041+50', 'e041']]}],
		gfx: [{k: 'tag', t: ['041+30', 'e041'], x: 1150, y: 230, text: 'A TINY ROOM — A CLOSET', size: 42}],
	},
	{
		at: '042', place: 'closet', pv: {bottles: 8}, cam: [760, 760, 1.5, 1300, 760, 1.7],
		actors: [{who: 'hero', x: 500, go: [['042+10', '042+80', 700]], ex: [['wide', 'smile', '042+20', 'e042']]}],
		gfx: [{k: 'tag', t: ['042+30', 'e042'], x: 1050, y: 600, text: 'NO LABELS', size: 44, c: BLUE}],
	},
	{
		at: '043', place: 'closet', pv: {bottles: 8}, cam: [800, 680, 1.9, 760, 700, 2.4],
		actors: [{who: 'hero', x: 700, lean: [26, '043', 'e043'], reachTo: [['043+10', 'e043', 820, 840]], g: [], ex: [['worried', 'open', '043', 'e043']]}],
		gfx: [{k: 'shake', t: ['043+8', 'e043'], amp: 5}, {k: 'tag', t: ['043+20', 'e043'], x: 820, y: 560, text: 'SHAKING FINGERS', size: 32, c: RED}],
	},
	{
		at: '044', place: 'closet', pv: {bottles: 8}, cam: [800, 660, 2.0, 820, 640, 2.4],
		actors: [{who: 'hero', x: 700, lean: [10, '044', 'e044'], reachTo: [['044', 'e044', 840, 720]], ex: [['wide', 'smile', '044+60', 'e044']]}],
		fx: (c) => <Water x={880} y={640} s={1.2} />,
		gfx: [{k: 'tag', t: ['044+12', '044+90'], x: 1000, y: 500, text: 'CLEAR & COLD', size: 36, c: BLUE}, {k: 'tag', t: ['044+100', 'e044'], x: 1000, y: 500, text: 'FAINT ALMONDS?', size: 36, c: '#ffd9a0'}],
	},
	{
		at: '045', place: 'closet', pv: {bottles: 7}, cam: [800, 560, 1.7, 800, 560, 2.2],
		actors: [{who: 'hero', x: 800, lean: [-14, '045+10', 'e045'], reachTo: [['045+6', 'e045', 850, 470]], ex: [['normal', 'open', '045', 'e045']]}],
		fx: (c) => (
			<g>
				<rect x={845} y={450} width={22} height={64} rx={6} fill="#bfe6f4" transform={`rotate(-40 856 482)`} />
				{[0, 1, 2, 3].map((i) => (
					<circle key={i} cx={900 + (i % 2) * 10} cy={560 + ((c.f * 4 + i * 20) % 80)} r={6} fill="#7fd0ff" opacity={0.8} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['045+10', 'e045'], x: 980, y: 330, text: 'GLUG GLUG GLUG', size: 36, c: BLUE}],
	},
	{
		at: '046', place: 'closet', pv: {bottles: 7}, cam: [850, 700, 1.5, 850, 720, 2.0],
		actors: [{who: 'hero', x: 850, sit: true, g: [['facepalm', '046+40', 'e046']], ex: [['sad', 'frown', '046+20', 'e046']]}],
		fx: (c) => (
			<g>
				{Array.from({length: 6}).map((_, i) => (
					<circle key={i} cx={820 + (i % 2) * 40} cy={640 + ((c.f * 3 + i * 17) % 120)} r={5} fill="#9fe0ff" opacity={c.f > 40 ? 0.9 : 0} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['046+10', 'e046'], x: 850, y: 350, text: 'THEN YOU CRY', size: 40, c: '#fff'}],
	},
	{
		at: '047', place: 'closet', pv: {bottles: 7}, cam: [900, 560, 1.3, 960, 540, 1.8],
		actors: [{who: 'hero', x: 700, go: [['047+10', '047+60', 960]], g: [['think', '047+70', 'e047']], ex: [['worried', 'flat', '047+60', 'e047']]}],
		gfx: [{k: 'big', t: ['047+30', 'e047'], text: 'IT WANTS YOU ALIVE', sub: '…WHICH IS ALMOST WORSE', c: '#ff7a6a', y: 110, size: 120}],
	},
	{
		at: '048', place: 'hall', pv: {seed: 'e1', open: [1300]}, cam: [300, 540, 1.4], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['048+10', 'e048', 1000]]}],
		fx: (c) => (
			<g>
				{[0, 1, 2, 3, 4].map((i) => {
					const hx = c.xs.hero ?? 100;
					return (
						<g key={i} transform={`translate(${hx + 60 + i * 12},${700 - i * 10 + Math.sin(c.gf / 6 + i) * 4})`}>
							<rect x={-9} y={-42} width={18} height={44} rx={4} fill="#bfe6f4" />
						</g>
					);
				})}
			</g>
		),
		gfx: [{k: 'tag', t: ['048+16', 'e048'], x: 700, y: 330, text: '5 BOTTLES', size: 46, c: BLUE}],
	},
	{
		at: '049', place: 'hall', pv: {seed: 'e2'}, cam: [800, 520, 1.5, 700, 480, 2.0],
		actors: [{who: 'hero', x: 800, reachTo: [['049+6', 'e049', 920, 460]], g: [], ex: [['normal', 'line', '049', 'e049']], lean: [-6, '049', 'e049']}],
		fx: (c) => <Note x={930} y={470} f={c.f} t0={c.R('049+20')} text="WATER" size={90} />,
		gfx: [{k: 'tag', t: ['049+6', '049+60'], x: 800, y: 280, text: 'A PEN FROM YOUR POCKET', size: 34}],
	},
	{
		at: '050', place: 'hall', pv: {seed: 'e2'}, cam: [800, 520, 1.5, 1000, 520, 1.5],
		actors: [{who: 'hero', x: 800, reachTo: [['050', '050+60', 920, 560]], ex: [['normal', 'line', '050', 'e050']]}],
		fx: (c) => (
			<g>
				<Note x={850} y={470} f={c.f} t0={-100} text="WATER" size={90} />
				<Note x={850} y={600} f={c.f} t0={c.R('050+14')} text="ROOM 14" size={90} c="#fff" />
			</g>
		),
		gfx: [{k: 'tag', t: ['050+60', 'e050'], x: 1200, y: 330, text: 'ANOTHER RULE…', size: 44, c: Y}],
	},
	{
		at: '051', place: 'hall', pv: {seed: 'e3', open: [700, 1500]}, cam: [900, 540, 1.1, 1200, 540, 1.3],
		actors: [{who: 'hero', x: 600, go: [['051', '051+80', 1000]], g: [['point', '051+90', 'e051']]}],
		back: (c) => (
			<g fontFamily={FONT} fontWeight={800} fill="#fffdf4" fontSize={44}>
				<text x={420} y={420}>✕ WATER</text>
				<text x={1250} y={420}>✕ ROOM 14</text>
			</g>
		),
		fx: (c) => <Arrow x={1180} y={560} f={c.gf} c="#fff" />,
		gfx: [{k: 'tag', t: ['051+10', 'e051'], x: 960, y: 250, text: 'NO MARKS = SAME HALLWAY', size: 44, c: RED}],
	},
];

/* ---- 052–107 ---- */
export const S3: Spec[] = [
	{
		at: '052', whip: true, place: 'hall', pv: {seed: 'f1', flick: 0.1}, cam: [900, 600, 1.5, 900, 640, 1.8],
		actors: [{who: 'hero', x: 800, sit: true, ex: [['sleepy', 'frown', '052', 'e052']], g: [['facepalm', '052+20', 'e052']]}],
		fx: (c) => <Zzz x={880} y={560} f={c.gf} />,
		gfx: [{k: 'tag', t: ['052+30', 'e052'], x: 1200, y: 400, text: "CAN'T SLEEP", size: 44, c: RED}],
	},
	{
		at: '053', place: 'hall', pv: {seed: 'f2'}, cam: [900, 520, 1.1, 900, 500, 1.4],
		actors: [{who: 'hero', x: 600, sit: true, look: [0, -1], ex: [['wide', 'open', '053+60', 'e053']]}],
		fx: (c) => <Clock x={1250} y={420} r={150} f={c.gf} q />,
		gfx: [{k: 'tag', t: ['053+10', '053+80'], x: 900, y: 200, text: 'LIGHTS NEVER TURN OFF', size: 42, c: '#fff'}, {k: 'tag', t: ['053+90', 'e053'], x: 1250, y: 640, text: 'A CLOCK INSIDE YOU', size: 42}],
	},
	{
		at: '054', whip: true, place: 'cave', cam: [1300, 540, 1.1, 1100, 560, 1.5],
		actors: [{who: 'siffre', x: 1000, face: -1, g: [['presentF', '054+20', 'e054']]}],
		gfx: [{k: 'big', t: ['054+10', 'e054'], text: '1962', c: '#ffd9a0', y: 120, size: 200}],
	},
	{
		at: '055', place: 'cave', cam: [1000, 560, 1.5, 1000, 540, 1.9],
		actors: [{who: 'siffre', x: 1000, face: -1, go: [['055+20', '055+90', 800]], ex: [['normal', 'smile', '055', 'e055']]}],
		gfx: [{k: 'tag', t: ['055+10', '055+90'], x: 1000, y: 280, text: 'MICHEL SIFFRE', size: 46, c: '#ffd9a0'}, {k: 'tag', t: ['055+100', 'e055'], x: 1000, y: 280, text: '2 MONTHS ALONE', size: 46, c: '#fff'}],
	},
	{
		at: '056', place: 'cave', cam: [900, 520, 1.1, 900, 520, 1.3],
		actors: [{who: 'siffre', x: 1300, face: -1, g: [['shrug', '056+80', 'e056']]}],
		gfx: [{k: 'tag', t: ['056+6', '056+50'], x: 460, y: 330, text: '✕ NO SUN', size: 44, c: RED}, {k: 'tag', t: ['056+40', '056+90'], x: 560, y: 190, text: '✕ NO CLOCK', size: 44, c: RED}, {k: 'tag', t: ['056+80', 'e056'], x: 940, y: 150, text: '✕ NO CALENDAR', size: 44, c: RED}],
	},
	{
		at: '057', place: 'cave', cam: [1300, 640, 1.4, 1250, 620, 1.8],
		actors: [{who: 'siffre', x: 1450, sit: false, face: -1, g: [['think', '057+60', 'e057']], ex: [['wide', 'open', '057+40', 'e057']]}],
		fx: (c) => <Phone x={1000} y={760} text="CALL" s={1.3} glow="#ffd9a0" />,
		gfx: [{k: 'tag', t: ['057+10', '057+60'], x: 1000, y: 600, text: '"TIME\'S UP!"', size: 40, c: '#fff'}, {k: 'tag', t: ['057+70', 'e057'], x: 1450, y: 330, text: '"MIDDLE OF THE EXPERIMENT"', size: 34, c: '#ffd9a0'}],
	},
	{
		at: '058', place: 'cave', cam: [900, 520, 1.2, 950, 520, 1.6],
		actors: [{who: 'siffre', x: 1300, face: -1, g: [['handsOnHead', '058+10', 'e058']], ex: [['wide', 'open', '058', 'e058']]}],
		fx: (c) => <Pages x={760} y={380} f={c.f} t0={c.R('058')} n={10} />,
		gfx: [{k: 'big', t: ['058+10', 'e058'], text: 'ALMOST A MONTH OFF', c: '#ffd9a0', y: 110, size: 120}, {k: 'shake', t: ['058+4', '058+20'], amp: 20}],
	},
	{
		at: '059', place: 'cave', cam: [800, 460, 1.2, 800, 460, 1.5],
		actors: [{who: 'siffre', x: 1400, sit: false, face: -1, ex: [['sleepy', 'line', '059', 'e059']]}],
		fx: (c) => (
			<g>
				<Clock x={800} y={360} r={170} f={c.f} speed={0.8} />
				<text x={800} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={Y}>
					24h +
				</text>
			</g>
		),
		gfx: [{k: 'tag', t: ['059+10', 'e059'], x: 1400, y: 340, text: 'SLEEP · WAKE · SLEEP · WAKE', size: 34, c: '#fff'}],
	},
	{
		at: '060', place: 'cave', cam: [900, 480, 1.2, 900, 480, 1.5],
		actors: [{who: 'siffre', x: 1300, face: -1, g: [['scratch', '060+20', 'e060']], ex: [['worried', 'flat', '060', 'e060']]}],
		fx: (c) => <Pages x={760} y={420} f={c.f} t0={c.R('060')} n={9} />,
		gfx: [{k: 'tag', t: ['060+20', 'e060'], x: 760, y: 250, text: 'THE MIND LOSES DAYS', size: 44, c: RED}],
	},
	{
		at: '061', whip: true, place: 'hall', pv: {seed: 'g1', open: [1500]}, cam: [900, 560, 1.4, 900, 600, 1.8],
		actors: [{who: 'hero', x: 800, sit: true, ex: [['worried', 'flat', '061', 'e061']], g: [['think', '061+20', 'e061']]}],
		fx: (c) => <Pages x={1100} y={500} f={c.f} t0={c.R('061+10')} n={8} />,
		gfx: [{k: 'tag', t: ['061+10', 'e061'], x: 800, y: 330, text: 'SAME FOR YOU', size: 46, c: Y}],
	},
	{
		at: '062', place: 'hall', pv: {seed: 'g2'}, cam: [900, 600, 1.4, 900, 680, 1.8],
		actors: [{who: 'hero', x: 800, go: [['062', '062+50', 1000]], lean: [[30, '062+30', 'e062']], ex: [['sleepy', 'line', '062+20', 'e062']]}],
		fx: (c) => <Zzz x={1000} y={620} f={c.gf} />,
		gfx: [{k: 'tag', t: ['062+10', 'e062'], x: 900, y: 330, text: 'FALL ASLEEP WHEN YOU CAN\'T STAY AWAKE', size: 32, c: '#fff'}],
	},
	{
		at: '063', place: 'hall', pv: {seed: 'g3'}, cam: [900, 560, 1.6, 900, 560, 2.0],
		actors: [{who: 'hero', x: 900, reachTo: [['063+10', 'e063', 925, 790]], ex: [['wide', 'open', '063+20', 'e063']], lean: [8, '063+20', 'e063']}],
		gfx: [{k: 'big', t: ['063+20', 'e063'], text: 'GRRRRR…', sub: 'YOUR STOMACH WAKES YOU', c: '#ffb36a', y: 120, size: 130}, {k: 'shake', t: ['063+20', '063+60'], amp: 10}],
	},
	{
		at: '064', place: 'hall', pv: {seed: 'g4'}, cam: [900, 520, 1.3, 900, 520, 1.6],
		actors: [{who: 'hero', x: 900, g: [['scratch', '064+10', 'e064']], ex: [['worried', 'flat', '064', 'e064']]}],
		fx: (c) => (
			<g fontFamily={FONT} fontWeight={900} fontSize={64} fill={Y}>
				<text x={520} y={340 + Math.sin(c.gf / 9) * 10}>MORNING?</text>
				<text x={1100} y={300 + Math.sin(c.gf / 8) * 10}>2 HOURS?</text>
				<text x={1240} y={440 + Math.sin(c.gf / 7) * 10}>OR 12?</text>
			</g>
		),
	},
	{
		at: '065', place: 'hall', pv: {seed: 'h1'}, cam: [800, 540, 1.6, 900, 520, 1.9],
		actors: [{who: 'hero', x: 800, reachTo: [['065+6', 'e065', 960, 520]], ex: [['normal', 'line', '065', 'e065']]}],
		fx: (c) => <Chalk x={940} y={440} n={Math.min(10, Math.floor(c.f / 14))} />,
		gfx: [{k: 'tag', t: ['065+10', 'e065'], x: 960, y: 330, text: 'ONE SCRATCH PER SLEEP', size: 34}],
	},
	{
		at: '066', place: 'hall', pv: {seed: 'h1'}, cam: [900, 520, 1.3, 1100, 520, 1.6],
		actors: [{who: 'hero', x: 800, g: [['scratch', '066+40', 'e066-20']], ex: [['worried', 'flat', '066+30', 'e066']]}],
		fx: (c) => (
			<g>
				<Chalk x={940} y={440} n={10} />
				<g fontFamily={FONT} fontWeight={900} fontSize={60} fill={RED}>
					<text x={1000} y={380} opacity={c.f > 20 ? 1 : 0}>SHORT?</text>
					<text x={1180} y={560} opacity={c.f > 60 ? 1 : 0}>LONG?</text>
					<text x={1100} y={700} opacity={c.f > 110 ? 1 : 0}>DID I SCRATCH?</text>
				</g>
			</g>
		),
	},
	{
		at: '067', whip: true, place: 'hall', pv: {seed: 'i1', flick: 0.2}, cam: [900, 540, 1.1, 1000, 520, 1.5],
		actors: [{who: 'hero', x: 700, look: [0.8, -0.2], ex: [['wide', 'open', '067+40', 'e067']], g: [['stop', '067+60', 'e067']]}],
		fx: (c) => (
			<g>
				<WallFace x={1100} y={380} f={c.gf} s={1.2} o={Math.min(1, c.f / 40)} />
				<WallFace x={1400} y={430} f={c.gf} s={0.9} o={Math.min(1, Math.max(0, c.f - 60) / 40)} />
			</g>
		),
		gfx: [{k: 'tag', t: ['067+30', 'e067'], x: 1250, y: 220, text: 'FACES IN THE WALLPAPER', size: 38, c: '#fff'}],
	},
	{
		at: '068', place: 'hall', pv: {seed: 'i2', open: [1450], dark: 0.1}, cam: [900, 540, 1.3, 1100, 540, 1.3],
		actors: [{who: 'hero', x: 800, face: 1, ex: [['worried', 'flat', '068', 'e068']]}],
		fx: (c) => {
			const away = (c.f % 70) > 36;
			return (
				<g opacity={away ? 0 : 0.9}>
					<ellipse cx={1700} cy={560} rx={60} ry={190} fill="#0b0902" />
					<ellipse cx={1700} cy={380} rx={46} ry={54} fill="#0b0902" />
				</g>
			);
		},
		gfx: [{k: 'tag', t: ['068+30', 'e068'], x: 960, y: 250, text: 'NOT MAGIC · NOT GHOSTS', size: 46, c: '#fff'}],
	},
	{
		at: '069', whip: true, place: 'void', cam: [960, 460, 1.0, 960, 480, 1.2],
		actors: [{who: 'hero', x: 360, s: 0.9, look: [1, 0], g: [['think', '069+30', 'e069']]}],
		fx: (c) => (
			<g>
				<rect x={640} y={150} width={640} height={420} rx={12} fill="#e2cf6a" />
				<Eyeball x={960} y={680} f={c.gf} s={1.4} />
				<text x={960} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill="#fff">ONE FLAT, EMPTY COLOR…</text>
			</g>
		),
	},
	{
		at: '070', place: 'void', cam: [960, 460, 1.1, 960, 440, 1.4],
		actors: [{who: 'hero', x: 360, s: 0.9, g: [['handsOnHead', '070+30', 'e070']], ex: [['wide', 'open', '070+20', 'e070']]}],
		fx: (c) => (
			<g>
				<text x={960} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#fff">BRAIN: "I NEED SOMETHING TO LOOK AT"</text>
				{[0, 1, 2, 3, 4].map((i) => (
					<WallFace key={i} x={600 + i * 190} y={600 + Math.sin(c.gf / 10 + i) * 20} f={c.gf} s={0.8} o={Math.min(1, Math.max(0, c.f - 40 - i * 10) / 20)} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['070+50', 'e070'], x: 960, y: 880, text: 'SO IT INVENTS IT', size: 44, c: Y}],
	},
	{
		at: '071', place: 'void', cam: [960, 480, 1.0, 960, 500, 1.2],
		actors: [{who: 'hero', x: 300, s: 0.85, g: [['presentF', '071+10', 'e071']]}],
		gfx: [{k: 'big', t: ['071+6', 'e071'], text: 'GANZFELD EFFECT', sub: 'SCIENTISTS CALL IT', c: '#7fd0ff', y: 200, size: 150}],
	},
	{
		at: '072', place: 'hall', pv: {seed: 'j1'}, cam: [900, 560, 1.2, 900, 540, 1.5],
		actors: [{who: 'hero', x: 700, g: [['point', '072+10', 'e072']]}, {who: 'iris', x: 1200, face: -1, hide: [0, 0], ex: [['wide', 'open', '072', 'e072']]}],
		fx: (c) => <Clock x={1350} y={300} r={100} f={c.f} speed={2} />,
		gfx: [{k: 'tag', t: ['072+20', 'e072'], x: 1350, y: 460, text: 'HEALTHY PEOPLE · A FEW HOURS', size: 36, c: '#fff'}],
	},
	{
		at: '073', place: 'hall', pv: {seed: 'j2'}, cam: [900, 540, 1.6, 900, 540, 2.0],
		actors: [{who: 'hero', x: 900, ex: [['sad', 'frown', '073', 'e073']], g: [['facepalm', '073+10', 'e073']]}],
		gfx: [{k: 'big', t: ['073+4', 'e073'], text: 'YOU\'VE HAD WEEKS', c: '#ff7a6a', y: 100, size: 130}],
	},
	{
		at: '074', place: 'hall', pv: {seed: 'k1', open: [1300]}, cam: [900, 560, 1.4, 900, 560, 1.7],
		actors: [{who: 'hero', x: 900, ex: [['sad', 'flat', '074', 'e074']], g: [['think', '074+20', 'e074']]}],
		gfx: [{k: 'tag', t: ['074+30', 'e074'], x: 900, y: 300, text: '…', size: 60, c: '#fff'}, {k: 'tag', t: ['074+6', 'e074'], x: 900, y: 200, text: 'NO MORE TALKING TO YOURSELF', size: 36, c: RED}],
	},
	{
		at: '075', place: 'hall', pv: {seed: 'k2'}, cam: [900, 700, 1.4, 900, 740, 1.8],
		actors: [{who: 'hero', x: 800, sit: true, face: 1, lean: [14, '075+10', 'e075'], ex: [['normal', 'open', '075+10', 'e075']], g: [['presentF', '075+20', 'e075']]}],
		fx: (c) => (
			<g>
				<ellipse cx={1080} cy={910} rx={140} ry={30} fill="#7a6628" />
				<circle cx={1080} cy={860} r={24} fill="#c9b250" />
				<circle cx={1070} cy={855} r={4} fill="#14112a" />
				<circle cx={1092} cy={855} r={4} fill="#14112a" />
				<path d="M1068,872 q12,10 24,0" stroke="#14112a" strokeWidth={3} fill="none" />
			</g>
		),
		gfx: [{k: 'tag', t: ['075+10', 'e075'], x: 1000, y: 540, text: '"…HI, CARPET."', size: 40, c: '#fff'}],
	},
	{
		at: '076', place: 'hall', pv: {seed: 'k3'}, cam: [900, 540, 1.4, 900, 540, 1.7],
		actors: [{who: 'hero', x: 900, ex: [['sleepy', 'smile', '076', 'e076']], g: [['think', '076+10', 'e076']]}],
		fx: (c) => (
			<Thought f={c.f} t0={c.R('076+20')} t1={c.R('e076')} x={1300} y={300} w={460} h={300}>
				{[0, 1, 2, 3].map((i) => (
					<rect key={i} x={-170} y={-100 + i * 50} width={340} height={36} rx={8} fill={['#f2b21c', '#d94a3a', '#fff3c0', '#d94a3a'][i]} />
				))}
			</Thought>
		),
		gfx: [{k: 'tag', t: ['076+40', 'e076'], x: 900, y: 300, text: "MOM'S LASAGNA RECIPE", size: 40, c: '#ffd9a0'}],
	},
	{
		at: '077', place: 'hall', pv: {seed: 'k3'}, cam: [900, 540, 1.8, 900, 520, 2.1],
		actors: [{who: 'hero', x: 900, ex: [['sleepy', 'smile', '077', 'e077']], lean: [-8, '077+10', 'e077']}],
		fx: (c) => (
			<g stroke="#ffd9a0" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8}>
				{[0, 1, 2].map((i) => (
					<path key={i} d={`M${1010 + i * 40},${600 - ((c.f * 2 + i * 30) % 120)} q18,-20 0,-40 q-18,-20 0,-40`} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['077+10', 'e077'], x: 1100, y: 300, text: 'A REAL KITCHEN SMELL', size: 38, c: '#ffd9a0'}],
	},
	{
		at: '078', place: 'hall', pv: {seed: 'k4'}, cam: [1000, 540, 1.2, 1100, 540, 1.4],
		actors: [{who: 'hero', x: 600, face: 1, g: [['presentF', '078+10', 'e078']], ex: [['normal', 'smile', '078', 'e078']]}, {who: 'noah', x: 1350, s: 0.6, face: -1, hide: ['078+60', 'e078']}],
		fx: (c) => (
			<g>
				<circle cx={1350} cy={420} r={150} fill="#ffe9a0" opacity={0.3 * Math.min(1, Math.max(0, c.f - 60) / 20)} />
			</g>
		),
		gfx: [{k: 'tag', t: ['078+10', '078+60'], x: 900, y: 330, text: 'TELLING THE WALLPAPER', size: 38, c: '#fff'}, {k: 'tag', t: ['078+70', 'e078'], x: 1350, y: 270, text: 'LITTLE BROTHER NOAH', size: 36}],
	},
	{
		at: '079', place: 'hall', pv: {seed: 'k5'}, cam: [900, 540, 1.3, 1000, 540, 1.4],
		actors: [{who: 'hero', x: 700, g: [['wave', '079+10', 'e079']], ex: [['normal', 'smile', '079', 'e079']]}],
		fx: (c) => (
			<Thought f={c.f} t0={c.R('079+10')} t1={c.R('e079')} x={1250} y={330} w={420} h={300}>
				<rect x={-130} y={-10} width={260} height={150} fill="#c9573a" />
				<polygon points="-150,-10 0,-90 150,-10" fill="#7a2f22" />
				<rect x={-30} y={50} width={60} height={90} fill="#ffe9a0" />
			</Thought>
		),
		gfx: [{k: 'tag', t: ['079+20', 'e079'], x: 1250, y: 560, text: 'ABOUT SCHOOL', size: 36, c: '#fff'}],
	},
	{
		at: '080', place: 'hall', pv: {seed: 'k6'}, cam: [1100, 560, 1.3, 1100, 560, 1.6],
		actors: [{who: 'hero', x: 700, g: [['fist', '080+40', 'e080']], ex: [['angry', 'frown', '080+30', 'e080']]}, {who: 'mom', x: 1500, s: 0.8, face: -1, g: [['fist', '080+40', 'e080']], ex: [['angry', 'frown', '080+30', 'e080']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('080+40')} t1={c.R('e080')} x={1100} y={330} text="THE DISHES!" tx={1400} ty={470} size={44} />,
		gfx: [{k: 'tag', t: ['080+4', '080+40'], x: 1100, y: 250, text: 'THE DUMB ARGUMENT', size: 38, c: '#fff'}],
	},
	{
		at: '081', place: 'hall', pv: {seed: 'k7'}, cam: [900, 560, 1.5, 900, 540, 1.9],
		actors: [{who: 'hero', x: 900, sit: true, g: [['facepalm', '081+30', 'e081']], ex: [['sad', 'smile', '081+20', 'e081']]}],
		gfx: [{k: 'big', t: ['081+30', 'e081'], text: "YOU'D GIVE ANYTHING", sub: 'TO HAVE IT AGAIN', c: '#ffd9a0', y: 110, size: 110}],
	},
	{
		at: '082', whip: true, place: 'hall', pv: {seed: 'l1', open: [200, 1300], dark: 0.15}, cam: [900, 620, 1.2, 1100, 620, 1.5],
		actors: [{who: 'hero', x: 800, sit: true, look: [1, 0], ex: [['wide', 'open', '082+60', 'e082']]}],
		fx: (c) => <Rings x={1800} y={500} f={c.gf} c="#ffe9a0" n={2} r={160} />,
		gfx: [{k: 'tag', t: ['082+60', 'e082'], x: 1400, y: 400, text: 'A SOUND…', size: 44, c: '#fff'}],
	},
	{
		at: '083', place: 'hall', pv: {seed: 'l1', open: [200, 1300], dark: 0.15}, cam: [1100, 560, 1.4, 1500, 560, 1.7],
		actors: [{who: 'hero', x: 700, lean: [-8, '083', 'e083'], look: [1, 0], ex: [['wide', 'flat', '083', 'e083']]}],
		fx: (c) => <Rings x={1900} y={520} f={c.gf} c="#ffe9a0" n={4} r={420} />,
		gfx: [{k: 'tag', t: ['083+10', 'e083'], x: 1550, y: 360, text: 'A VOICE, FAR AWAY', size: 42, c: '#fff'}],
	},
	{
		at: '084', place: 'hall', pv: {seed: 'l2', dark: 0.2}, cam: [900, 560, 1.6, 900, 540, 2.1],
		actors: [{who: 'hero', x: 800, g: [['handsOnHead', '084+40', 'e084']], ex: [['wide', 'open', '084+30', 'e084']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('084')} t1={c.R('084+80')} x={1250} y={330} text="Dinner's ready." tx={1500} ty={470} size={46} />,
		gfx: [{k: 'flash', t: ['084+40']}, {k: 'big', t: ['084+44', 'e084'], text: '♥ ✕', sub: 'YOUR HEART STOPS', c: '#ff4a5a', y: 100, size: 160}],
	},
	{
		at: '085', place: 'hall', pv: {seed: 'l2', dark: 0.2}, cam: [900, 560, 1.7, 900, 540, 2.2],
		actors: [{who: 'hero', x: 900, g: [['presentF', '085+20', 'e085']], ex: [['wide', 'open', '085', 'e085']]}],
		gfx: [{k: 'big', t: ['085+10', 'e085'], text: "IT'S MOM", sub: 'THE EXACT VOICE', c: '#ffe9a0', y: 120, size: 170}],
	},
	{
		at: '086', place: 'hall', pv: {seed: 'l3'}, cam: [900, 540, 1.3, 900, 540, 1.6],
		actors: [{who: 'hero', x: 900, ex: [['wide', 'smile', '086', 'e086']]}],
		fx: (c) => <Wave f={c.gf} x={560} y={460} w={800} h={60} hz={9} c="#ffe9a0" />,
		gfx: [{k: 'tag', t: ['086+4', 'e086'], x: 960, y: 700, text: 'TIRED · A LITTLE SING-SONG', size: 44, c: '#ffe9a0'}],
	},
	{
		at: '087', place: 'hall', pv: {seed: 'l3'}, cam: [900, 560, 1.3, 1100, 560, 1.2],
		actors: [{who: 'hero', x: 800, lean: [[-12, '087', '087+20'], [18, '087+30', 'e087']], go: [['087+40', 'e087', 1300, 'run']], ex: [['wide', 'open', '087', 'e087']]}],
		gfx: [{k: 'shake', t: ['087+20', '087+34'], amp: 16}],
	},
	{
		at: '088', place: 'hall', pv: {seed: 'm1', open: [1700]}, cam: [300, 560, 1.3], follow: 'hero',
		actors: [{who: 'hero', x: 200, go: [['088', 'e088', 1800, 'run']], ex: [['wide', 'open', '088', 'e088']], g: [['wave', '088', 'e088']]}],
		gfx: [{k: 'tag', t: ['088+10', 'e088'], x: 900, y: 360, text: '"MOM! MOM!"', size: 58, c: '#fff'}, {k: 'tag', t: ['088+70', 'e088'], x: 1500, y: 360, text: '"MOM!!"', size: 66, c: '#fff'}],
	},
	{
		at: '089', place: 'hall', pv: {seed: 'm2', open: [900]}, cam: [900, 560, 1.4, 1300, 560, 1.2],
		actors: [{who: 'hero', x: 400, go: [['089', '089+60', 1100, 'run']], ex: [['wide', 'open', '089+60', 'e089']], look: [-1, 0]}],
		fx: (c) => <Rings x={1900} y={520} f={c.gf} c="#ffe9a0" n={3} r={300} />,
		gfx: [{k: 'tag', t: ['089+40', '089+100'], x: 1000, y: 380, text: 'EMPTY HALLWAY', size: 40, c: '#fff'}, {k: 'tag', t: ['089+90', 'e089'], x: 1650, y: 380, text: 'FROM THE OTHER END!', size: 40, c: RED}],
	},
	{
		at: '090', place: 'hall', pv: {seed: 'm3'}, cam: [900, 560, 1.4, 900, 560, 1.7],
		actors: [{who: 'hero', x: 1100, face: -1, go: [['090', '090+20', 1000]], ex: [['worried', 'open', '090+10', 'e090']], look: [-1, 0]}],
		fx: (c) => <Speech f={c.f} t0={c.R('090')} t1={c.R('090+60')} x={600} y={320} text="Dinner's ready." tx={500} ty={460} size={42} />,
		gfx: [{k: 'shake', t: ['090+20', '090+30'], amp: 14}],
	},
	{
		at: '091', place: 'hall', pv: {seed: 'm3'}, cam: [900, 540, 1.8, 900, 540, 2.2],
		actors: [{who: 'hero', x: 900, g: [['handsOnHead', '091+40', 'e091']], ex: [['worried', 'frown', '091', 'e091']], lean: [-6, '091', 'e091']}],
		gfx: [{k: 'shake', t: ['091', 'e091'], amp: 6}, {k: 'tag', t: ['091+10', 'e091'], x: 900, y: 300, text: 'LEGS SHAKING', size: 36, c: RED}],
	},
	{
		at: '092', place: 'hall', pv: {seed: 'm4', open: [1300]}, cam: [900, 540, 1.1, 900, 540, 1.3],
		actors: [{who: 'hero', x: 900, face: -1, look: [-1, 0], ex: [['wide', 'flat', '092', 'e092']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('092+50')} t1={c.R('e092')} x={1300} y={330} text="Dinner's ready." tx={1100} ty={540} size={42} />,
		gfx: [{k: 'tag', t: ['092+6', '092+46'], x: 900, y: 300, text: 'NOTHING THERE', size: 44, c: '#fff'}],
	},
	{
		at: '093', place: 'hall', pv: {seed: 'm4', open: [1300]}, cam: [880, 540, 2.2, 880, 540, 2.5],
		actors: [{who: 'hero', x: 900, face: 1, look: [0.2, 0], ex: [['wide', 'flat', '093', 'e093']], lean: [-8, '093+30', 'e093']}],
		fx: (c) => (
			<g>
				<Rings x={790} y={600} f={c.gf} c="#ffe9a0" n={3} r={140} />
				<ellipse cx={700} cy={560} rx={36} ry={120} fill="#0b0902" opacity={0.8} />
			</g>
		),
		gfx: [{k: 'tag', t: ['093+10', 'e093'], x: 800, y: 300, text: 'RIGHT BEHIND YOUR SHOULDER', size: 34, c: RED}],
	},
	{
		at: '094', place: 'hall', pv: {seed: 'm5'}, cam: [900, 540, 1.6, 900, 540, 2.0],
		actors: [{who: 'hero', x: 900, ex: [['wide', 'open', '094', 'e094']], g: [['stop', '094+40', 'e094']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('094')} t1={c.R('e094')} x={1200} y={320} text="Dinner's rea—" tx={1000} ty={470} size={46} />,
		gfx: [{k: 'tag', t: ['094+70', 'e094'], x: 700, y: 300, text: '…CUT OFF', size: 40, c: RED}],
	},
	{
		at: '095', place: 'hall', pv: {seed: 'm5'}, cam: [900, 540, 1.3, 1000, 540, 1.5],
		actors: [{who: 'hero', x: 800, ex: [['worried', 'flat', '095', 'e095']], g: [['think', '095+10', 'e095']]}],
		fx: (c) => <Wave f={c.gf} x={1060} y={480} w={640} h={50} hz={8} c="#ffe9a0" />,
		gfx: [{k: 'tag', t: ['095+10', 'e095'], x: 1380, y: 560, text: 'SAME VOICE · SAME TONE', size: 36, c: '#fff'}, {k: 'tag', t: ['095+80', 'e095'], x: 1380, y: 640, text: 'EVEN HER TINY BREATH', size: 36, c: Y}],
	},
	{
		at: '096', place: 'hall', pv: {seed: 'm6'}, cam: [900, 540, 1.6, 900, 540, 1.9],
		actors: [{who: 'hero', x: 900, ex: [['sad', 'frown', '096', 'e096']], g: [['think', '096+20', 'e096']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('096+10')} t1={c.R('e096')} x={1300} y={340} text="…buddy?" tx={1100} ty={480} size={50} c="#ff5a5a" />,
		gfx: [{k: 'big', t: ['096+10', 'e096'], text: 'NEVER "BUDDY"', c: '#ffe9a0', y: 120, size: 130}],
	},
	{
		at: '097', place: 'hall', pv: {seed: 'm6'}, cam: [900, 540, 1.3, 1100, 540, 1.6],
		actors: [{who: 'hero', x: 900, g: [['shrug', '097+10', 'e097']], ex: [['worried', 'flat', '097', 'e097']]}],
		fx: (c) => <Arrow x={1100} y={540} f={c.gf} c="#ff5a5a" />,
		gfx: [{k: 'tag', t: ['097+4', 'e097'], x: 1400, y: 420, text: 'NEVER GETS TO THE END', size: 40, c: RED}],
	},
	{
		at: '098', place: 'void', cam: [960, 500, 1.0, 960, 480, 1.25],
		actors: [{who: 'hero', x: 260, s: 0.85, g: [['point', '098+20', 'e098']]}],
		fx: (c) => (
			<g>
				<text x={960} y={210} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff">A RECORDING OF MOM</text>
				<polyline points={Array.from({length: 100}).map((_, i) => `${520 + i * 9},${500 + (i > 62 ? 0 : Math.sin(i / 3) * 90 * Math.sin(i / 11 + 1))}`).join(' ')} stroke={BLUE} strokeWidth={8} fill="none" />
				<rect x={1090} y={380} width={330} height={240} rx={10} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="14 10" />
				<text x={1255} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={RED}>MOST IMPORTANT PART CUT</text>
			</g>
		),
	},
	{
		at: '099', whip: true, place: 'hall', pv: {seed: 'n1'}, cam: [900, 540, 1.3, 900, 540, 1.6],
		actors: [{who: 'hero', x: 900, g: [['think', '099+30', 'e099']], ex: [['worried', 'flat', '099', 'e099']]}],
		fx: (c) => <Rings x={1500} y={480} f={c.gf} c="#ff5a5a" n={3} r={260} />,
		gfx: [{k: 'tag', t: ['099+10', 'e099'], x: 1500, y: 320, text: 'SOMETHING COPIED IT', size: 40, c: RED}, {k: 'tag', t: ['099+90', 'e099'], x: 900, y: 250, text: '…RIGHT BEFORE YOU FELL', size: 36, c: '#fff'}],
	},
	{
		at: '100', place: 'hall', pv: {seed: 'n2'}, cam: [900, 540, 1.6, 900, 540, 2.0],
		actors: [{who: 'hero', x: 900, g: [['rubChin', '100+10', 'e100']], ex: [['normal', 'smirk', '100', 'e100']]}],
		gfx: [{k: 'big', t: ['100+10', 'e100'], text: "IT DOESN'T KNOW", sub: 'THE WORD ONLY SHE SAYS', c: '#ffe9a0', y: 110, size: 120}],
	},
	{
		at: '101', place: 'hall', pv: {seed: 'o1', open: [300, 1500]}, cam: [900, 560, 1.3, 800, 560, 1.4],
		actors: [{who: 'hero', x: 1000, face: 1, go: [['101+10', 'e101', 600]], look: [1, 0], ex: [['worried', 'flat', '101', 'e101']]}],
		gfx: [{k: 'tag', t: ['101+6', 'e101'], x: 900, y: 300, text: "DON'T RUN.", size: 54, c: '#fff'}],
	},
	{
		at: '102', place: 'hall', pv: {seed: 'o1', open: [300, 1500]}, cam: [700, 560, 1.4, 500, 560, 1.3],
		actors: [{who: 'hero', x: 800, face: 1, go: [['102', 'e102', 200]], look: [1, 0], lean: [-6, '102', 'e102']}, {who: 'iris', x: 1900, s: 0.5, hide: [0, 0]}],
		fx: (c) => <g opacity={0.8}><ellipse cx={1750} cy={820} rx={70} ry={40} fill="#0b0902" /><circle cx={1690} cy={780} r={22} fill="#0b0902" /></g>,
		gfx: [{k: 'tag', t: ['102+20', 'e102'], x: 700, y: 320, text: 'LIKE A DOG THAT MIGHT BITE', size: 40, c: '#fff'}],
	},
	{
		at: '103', place: 'hall', pv: {seed: 'o2', dark: 0.25}, cam: [500, 560, 1.2, 700, 560, 1.2],
		actors: [{who: 'hero', x: 700, face: 1, go: [['103', 'e103', 100]], look: [1, 0], ex: [['worried', 'flat', '103', 'e103']]}],
		fx: (c) => (
			<g>
				<Rings x={1000} y={540} f={c.gf} c="#ffe9a0" n={3} r={Math.max(60, 300 - c.f * 1.6)} />
				<g fontFamily={FONT} fontWeight={900} fill="#fff">
					{[0, 1, 2].map((i) => (
						<text key={i} x={1000 + i * 210} y={380} fontSize={64 - i * 16} opacity={Math.max(0.1, 1 - (c.f / 160 + i * 0.2))}>
							{['Dinner\'s', 'ready.', '…'][i]}
						</text>
					))}
				</g>
			</g>
		),
		gfx: [{k: 'dim', t: ['103+40', 'e103'], o: 0.25}],
	},
	{
		at: '104', place: 'hall', pv: {seed: 'o3'}, cam: [900, 540, 2.2, 900, 540, 2.0],
		actors: [{who: 'hero', x: 900, ex: [['wide', 'flat', '104', 'e104']], g: [['stop', '104+10', 'e104']]}],
		fx: (c) => <Clock x={1300} y={380} r={80} f={c.f} speed={4} />,
		gfx: [{k: 'big', t: ['104+30', 'e104'], text: '1 MINUTE', sub: 'WITHOUT BREATHING', c: '#7fd0ff', y: 110, size: 130}],
	},
	{
		at: '105', whip: true, place: 'hall', pv: {seed: 'p1', dark: 0.5, flick: 0.1}, cam: [900, 700, 1.4, 900, 730, 1.7],
		actors: [{who: 'hero', x: 900, sit: true, ex: [['sad', 'frown', '105', 'e105']], g: [['facepalm', '105+10', 'e105']]}],
		gfx: [{k: 'dim', t: ['105', 'e105'], o: 0.35}, {k: 'tag', t: ['105+10', 'e105'], x: 900, y: 440, text: 'THAT NIGHT · NO SLEEP', size: 40, c: '#fff'}],
	},
	{
		at: '106', place: 'hall', pv: {seed: 'p1', dark: 0.5, flick: 0.1}, cam: [900, 640, 1.6, 900, 640, 2.0],
		actors: [{who: 'hero', x: 900, sit: true, ex: [['worried', 'flat', '106', 'e106']], g: [['handsOnHead', '106+30', 'e106']]}],
		fx: (c) => <Rings x={900} y={150} f={c.gf} c={Y} n={4} r={500} />,
		gfx: [{k: 'tag', t: ['106+10', 'e106'], x: 900, y: 440, text: 'AFRAID OF THE HUM', size: 44, c: RED}],
	},
	{
		at: '107', place: 'hall', pv: {seed: 'p2', dark: 0.6, open: [500, 1400]}, cam: [900, 560, 1.1, 900, 560, 1.4],
		actors: [{who: 'hero', x: 900, sit: true, ex: [['worried', 'flat', '107', 'e107']]}],
		fx: (c) => (
			<g>
				{[[640, 600], [1630, 560], [760, 740]].map(([x, y], i) => (
					<g key={i} opacity={0.35 + 0.65 * Math.abs(Math.sin(c.gf / 22 + i * 2))}>
						<ellipse cx={x} cy={y} rx={12} ry={6} fill="#fff" />
						<ellipse cx={x + 36} cy={y} rx={12} ry={6} fill="#fff" />
					</g>
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['107+10', 'e107'], x: 900, y: 360, text: 'THE HUM MIGHT HIDE SOMETHING', size: 40, c: '#fff'}],
	},
];
