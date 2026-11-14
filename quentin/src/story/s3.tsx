import React from 'react';
import type {Spec} from './dsl';
import {Arrow, Chalk, Phone, Rings} from './places';
import {Board, Clock, Note, Speech, Thought} from './fxlib';
import {FONT} from '../kit/ui';

const Y = '#ffd34a';
const RED = '#ff5a5a';
const BLUE = '#7fd0ff';
const W = '#fffdf4';

/* ---- 108–165: Iris ---- */
export const S4: Spec[] = [
	{
		at: '108', whip: true, place: 'hall', pv: {seed: 'q1', open: [1400]}, cam: [700, 560, 1.6, 900, 540, 2.0],
		actors: [{who: 'hero', x: 600, go: [['108+10', '108+60', 800]], reachTo: [['108+60', 'e108', 920, 520]], ex: [['wide', 'open', '108+60', 'e108']]}],
		fx: (c) => <Chalk x={880} y={470} n={1} />,
		gfx: [{k: 'big', t: ['108+10', 'e108'], text: 'DAY 52: CHALK', c: W, y: 110, size: 130}],
	},
	{
		at: '109', place: 'hall', pv: {seed: 'q1', open: [1400]}, cam: [880, 520, 2.0, 880, 520, 2.2],
		actors: [{who: 'hero', x: 700, face: 1, reachTo: [['109+4', 'e109', 920, 520]], ex: [['wide', 'smile', '109', 'e109']]}],
		fx: (c) => <Chalk x={880} y={470} n={c.f > 60 ? 2 : 1} />,
		gfx: [{k: 'tag', t: ['109+10', 'e109'], x: 900, y: 360, text: 'A WHITE TALLY MARK… THEN TWO', size: 34, c: W}],
	},
	{
		at: '110', place: 'hall', pv: {seed: 'q2', chalk: true, open: [2100]}, cam: [300, 540, 1.4], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['110+10', 'e110', 1700]], ex: [['wide', 'open', '110', 'e110']], look: [0.5, -0.2]}],
		gfx: [{k: 'tag', t: ['110+16', 'e110'], x: 800, y: 330, text: 'HUNDREDS OF MARKS', size: 44, c: W}],
	},
	{
		at: '111', place: 'hall', pv: {seed: 'q2', chalk: true}, cam: [1500, 560, 1.4, 1900, 540, 1.7],
		actors: [{who: 'hero', x: 1400, go: [['111+10', '111+80', 1800]], ex: [['wide', 'open', '111', 'e111']]}],
		fx: (c) => <Arrow x={1850} y={600} f={c.gf} c={W} />,
		gfx: [{k: 'tag', t: ['111+30', 'e111'], x: 1700, y: 300, text: 'A HAND-DRAWN ARROW', size: 38, c: W}],
	},
	{
		at: '112', place: 'hall', pv: {seed: 'q2', chalk: true}, cam: [1950, 560, 1.6, 1950, 560, 2.2],
		actors: [{who: 'hero', x: 1750, ex: [['wide', 'open', '112', 'e112']], reachTo: [['112+10', 'e112', 1960, 640]]}],
		gfx: [{k: 'big', t: ['112', 'e112'], text: '"HI"', c: W, y: 120, size: 240}, {k: 'flash', t: ['112']}],
	},
	{
		at: '113', place: 'hall', pv: {seed: 'q3', open: [600, 1400]}, cam: [300, 560, 1.3], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['113', 'e113', 1900, 'run']], ex: [['wide', 'smile', '113', 'e113']]}],
		fx: (c) => <Arrow x={(c.xs.hero ?? 0) + 200} y={420} f={c.gf} c={W} />,
	},
	{
		at: '114', whip: true, place: 'boxes', cam: [300, 560, 1.2], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['114+4', '114+70', 750, 'run']], ex: [['wide', 'open', '114+70', 'e114']]}],
		gfx: [{k: 'tag', t: ['114+6', '114+60'], x: 700, y: 280, text: 'AROUND 5 CORNERS…', size: 40, c: '#fff'}, {k: 'tag', t: ['114+80', 'e114'], x: 900, y: 240, text: 'A ROOM OF CARDBOARD BOXES', size: 40, c: '#ffe0a0'}],
	},
	{
		at: '115', place: 'boxes', cam: [1100, 620, 1.2, 1250, 640, 1.7],
		actors: [{who: 'hero', x: 600, ex: [['wide', 'open', '115', 'e115']], g: [['stop', '115+60', 'e115']]}, {who: 'iris', x: 1250, sit: true, face: -1, g: [['armsCrossed', '115+20', 'e115']], ex: [['sad', 'flat', '115+20', 'e115']]}],
		gfx: [{k: 'tag', t: ['115+30', 'e115'], x: 1250, y: 410, text: 'A BLANKET · A PILE OF BOTTLES', size: 34, c: '#fff'}],
	},
	{
		at: '116', place: 'boxes', cam: [1250, 640, 1.9, 1250, 620, 2.3],
		actors: [{who: 'iris', x: 1250, sit: true, face: -1, g: [['armsCrossed', '116', 'e116']], ex: [['worried', 'flat', '116', 'e116']]}],
		fx: (c) => <rect x={1180} y={780} width={40} height={10} fill={W} rx={4} />,
		gfx: [{k: 'tag', t: ['116+6', '116+80'], x: 1250, y: 430, text: 'DIRTY HOODIE', size: 36, c: '#fff'}, {k: 'tag', t: ['116+70', 'e116'], x: 1250, y: 430, text: 'WHITE CHALK IN HAND', size: 36, c: W}],
	},
	{
		at: '117', place: 'boxes', cam: [900, 620, 1.2, 1000, 620, 1.5],
		actors: [{who: 'hero', x: 650, look: [1, 0], ex: [['wide', 'flat', '117', 'e117']]}, {who: 'iris', x: 1250, sit: true, face: -1, look: [-1, 0], ex: [['wide', 'flat', '117', 'e117']]}],
		gfx: [{k: 'tag', t: ['117+10', 'e117'], x: 960, y: 300, text: 'SHE STARES AT YOU…', size: 44, c: '#fff'}],
	},
	{
		at: '118', place: 'boxes', cam: [1250, 640, 1.8, 1250, 640, 2.2],
		actors: [{who: 'iris', x: 1250, sit: true, face: -1, ex: [['worried', 'open', '118+20', 'e118']], g: [['touchFace', '118+60', 'e118']]}],
		fx: (c) => <Rings x={1160} y={640} f={c.gf} c="#cfd8ff" n={2} r={120} />,
		gfx: [{k: 'tag', t: ['118+30', 'e118'], x: 1250, y: 420, text: 'A VOICE UNUSED FOR YEARS', size: 36, c: '#fff'}],
	},
	{
		at: '119', place: 'boxes', cam: [1100, 620, 1.4, 1200, 620, 1.6],
		actors: [{who: 'hero', x: 700, ex: [['wide', 'open', '119', 'e119']], g: [['presentF', '119+10', 'e119']]}, {who: 'iris', x: 1250, sit: true, face: -1, ex: [['wide', 'flat', '119', 'e119']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('119')} t1={c.R('e119')} x={1250} y={420} text="You're real?" tx={1250} ty={560} size={48} />,
	},
	{
		at: '120', place: 'boxes', cam: [1000, 620, 1.3, 1200, 620, 1.6],
		actors: [{who: 'hero', x: 700, ex: [['normal', 'smile', '120', 'e120']], g: [['wave', '120', '120+30']]}, {who: 'iris', x: 1250, sit: true, face: -1, ex: [['normal', 'smile', '120+30', '120+90'], ['sad', 'open', '120+90', '120+140'], ['normal', 'smile', '120+140', 'e120']], g: [['facepalm', '120+90', '120+140']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('120')} t1={c.R('120+50')} x={700} y={340} text="I think so." tx={700} ty={470} size={42} />,
		gfx: [{k: 'tag', t: ['120+60', 'e120'], x: 1250, y: 400, text: 'LAUGHS · CRIES · LAUGHS', size: 36, c: Y}],
	},
	{
		at: '121', place: 'boxes', cam: [1000, 600, 1.3, 1100, 600, 1.6],
		actors: [{who: 'hero', x: 800, ex: [['wide', 'open', '121+40', 'e121']]}, {who: 'iris', x: 1250, face: -1, ex: [['normal', 'smile', '121', 'e121']], g: [['presentF', '121+10', 'e121']]}],
		gfx: [{k: 'tag', t: ['121+6', '121+60'], x: 1250, y: 300, text: 'HER NAME: IRIS', size: 44, c: '#e8d4ff'}, {k: 'big', t: ['121+70', 'e121'], text: '1,094 DAYS', c: Y, y: 110, size: 170}],
	},
	{
		at: '122', place: 'boxes', cam: [1100, 560, 1.4, 1100, 560, 1.6],
		actors: [{who: 'iris', x: 1250, face: -1, ex: [['normal', 'smile', '122', 'e122']]}, {who: 'hero', x: 800, ex: [['wide', 'open', '122', 'e122']], g: [['handsOnHead', '122+10', 'e122']]}],
		gfx: [{k: 'big', t: ['122', 'e122'], text: '≈ 3 YEARS', c: '#fff', y: 110, size: 170}],
	},
	{
		at: '123', place: 'hall', pv: {seed: 'r1', chalk: true}, cam: [900, 540, 1.1, 700, 540, 1.3],
		actors: [{who: 'iris', x: 900, face: 1, reachTo: [['123+10', 'e123', 1080, 480]], ex: [['normal', 'line', '123', 'e123']]}],
		fx: (c) => <Chalk x={1060} y={420} n={Math.min(24, Math.floor(c.f / 5))} />,
		gfx: [{k: 'tag', t: ['123+60', 'e123'], x: 1000, y: 250, text: 'EVEN THE LOST DAYS', size: 40, c: W}],
	},
	{
		at: '124', place: 'boxes', cam: [1100, 560, 1.5, 1200, 560, 1.8],
		actors: [{who: 'iris', x: 1250, face: -1, ex: [['normal', 'line', '124', 'e124']], g: [['presentF', '124+10', 'e124']]}, {who: 'hero', x: 800, ex: [['wide', 'open', '124+20', 'e124']]}],
		gfx: [{k: 'big', t: ['124+6', 'e124'], text: 'SHE\'S 15', sub: '…SAME AGE AS WHEN SHE FELL', c: '#e8d4ff', y: 110, size: 170}],
	},
	{
		at: '125', place: 'boxes', cam: [1250, 560, 1.8, 1250, 560, 2.2],
		actors: [{who: 'iris', x: 1250, face: -1, ex: [['worried', 'flat', '125', 'e125']], g: [['scratch', '125+20', 'e125']]}],
		gfx: [{k: 'tag', t: ['125+10', 'e125'], x: 1250, y: 330, text: '…NOT SURE IT\'S TRUE', size: 40, c: '#fff'}],
	},
	{
		at: '126', place: 'boxes', cam: [1000, 580, 1.3, 900, 580, 1.5],
		actors: [{who: 'hero', x: 750, ex: [['wide', 'open', '126', 'e126']], g: [['presentF', '126+10', 'e126']]}, {who: 'iris', x: 1250, face: -1}],
		fx: (c) => <Speech f={c.f} t0={c.R('126+10')} t1={c.R('e126')} x={750} y={320} text="How is that possible?" tx={750} ty={450} size={40} />,
	},
	{
		at: '127', place: 'boxes', cam: [1100, 580, 1.3, 1200, 580, 1.5],
		actors: [{who: 'hero', x: 750, g: [['point', '127+10', 'e127']], ex: [['normal', 'line', '127', 'e127']]}, {who: 'iris', x: 1250, face: -1, ex: [['wide', 'open', '127+20', 'e127']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('127')} t1={c.R('e127')} x={750} y={320} text="I've been here 50 days." tx={750} ty={450} size={40} />,
	},
	{
		at: '128', place: 'boxes', cam: [1100, 540, 1.5, 1200, 520, 2.0],
		actors: [{who: 'iris', x: 1250, face: -1, reachTo: [['128+10', 'e128', 1130, 560]], g: [], ex: [['normal', 'smile', '128', 'e128']]}, {who: 'hero', x: 800, look: [1, 0]}],
		fx: (c) => <Phone x={1090} y={540} text="3:17 AM" s={1.5} rot={-8} />,
		gfx: [{k: 'tag', t: ['128+30', 'e128'], x: 1050, y: 380, text: 'SHE SHOWS YOU HER PHONE', size: 36, c: '#fff'}],
	},
	{
		at: '129', place: 'boxes', cam: [1050, 520, 2.0, 1050, 520, 2.4],
		actors: [{who: 'iris', x: 1250, face: -1, reachTo: [['129', 'e129', 1130, 560]]}],
		fx: (c) => <Phone x={1090} y={540} text="3:17 AM" s={1.5} rot={-8} />,
		gfx: [{k: 'tag', t: ['129+6', 'e129'], x: 1060, y: 360, text: 'ON — EVERY SINGLE DAY', size: 36, c: '#fff'}],
	},
	{
		at: '130', place: 'boxes', cam: [1000, 520, 1.6, 1000, 520, 1.9],
		actors: [{who: 'iris', x: 1300, face: -1, g: [['presentF', '130+10', 'e130']]}],
		fx: (c) => (
			<g>
				{[0, 1, 2].map((i) => (
					<g key={i} opacity={Math.min(1, Math.max(0, (c.f - i * 24) / 12))}>
						<Phone x={700 + i * 220} y={520} text="3:17 AM" s={1.2} rot={(i - 1) * 6} />
						<text x={700 + i * 220} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill="#fff">DAY {i + 1}</text>
					</g>
				))}
			</g>
		),
		gfx: [{k: 'big', t: ['130+30', 'e130'], text: 'STILL 3:17', c: Y, y: 110, size: 150}],
	},
	{
		at: '131', place: 'boxes', cam: [1100, 560, 1.4, 1200, 560, 1.6],
		actors: [{who: 'iris', x: 1250, face: -1, g: [['presentF', '131+10', 'e131']], ex: [['normal', 'flat', '131', 'e131']]}, {who: 'hero', x: 800, ex: [['worried', 'flat', '131', 'e131']], g: [['think', '131+20', 'e131']]}],
		fx: (c) => <Clock x={1000} y={300} r={90} f={c.f} speed={0.2} />,
		gfx: [{k: 'tag', t: ['131+10', 'e131'], x: 1000, y: 440, text: '"TIME IS SLOW HERE"', size: 36, c: '#fff'}],
	},
	{
		at: '132', place: 'boxes', cam: [1000, 560, 1.2, 1000, 560, 1.5],
		actors: [{who: 'iris', x: 1250, face: -1, g: [['think', '132+10', 'e132']], ex: [['normal', 'smile', '132', 'e132']]}, {who: 'hero', x: 800, ex: [['wide', 'open', '132+40', 'e132']]}],
		fx: (c) => <Clock x={1000} y={280} r={100} f={c.f} speed={0.12} />,
		gfx: [{k: 'big', t: ['132+40', 'e132'], text: 'OUT THERE: < 1 DAY', c: '#7fd0ff', y: 110, size: 120}],
	},
	{
		at: '133', place: 'boxes', cam: [800, 560, 1.7, 800, 560, 2.2],
		actors: [{who: 'hero', x: 800, ex: [['wide', 'smile', '133', 'e133']], g: [['touchFace', '133+20', 'e133']]}],
		gfx: [{k: 'tag', t: ['133+10', 'e133'], x: 800, y: 330, text: 'YOU LET YOURSELF BELIEVE', size: 40, c: Y}, {k: 'flash', t: ['133+60']}],
	},
	{
		at: '134', whip: true, place: 'kitchen', cam: [900, 560, 1.2, 1000, 560, 1.5],
		actors: [{who: 'mom', x: 950, face: -1, g: [['think', '134+30', 'e134']], ex: [['normal', 'smile', '134', 'e134']]}],
		gfx: [{k: 'tag', t: ['134+6', 'e134'], x: 1000, y: 310, text: 'MOM DOESN\'T KNOW YOU\'RE GONE', size: 38, c: '#fff'}],
	},
	{
		at: '135', place: 'kitchen', cam: [1000, 560, 1.5, 900, 560, 1.9],
		actors: [{who: 'mom', x: 1000, face: -1, g: [['armsCrossed', '135+10', 'e135']], ex: [['normal', 'smile', '135', 'e135']]}],
		fx: (c) => <Clock x={1400} y={330} r={90} f={c.f} speed={0.1} />,
		gfx: [{k: 'tag', t: ['135+10', 'e135'], x: 1000, y: 290, text: 'WAITING FOR HER SON', size: 40, c: '#ffe9a0'}],
	},
	{
		at: '136', place: 'kitchen', cam: [1000, 540, 1.8, 1000, 540, 2.1],
		actors: [{who: 'mom', x: 1000, face: -1, g: [['wave', '136+10', 'e136']], ex: [['wide', 'open', '136', 'e136']]}],
		gfx: [{k: 'big', t: ['136', 'e136'], text: 'A FEW SECONDS', c: '#ffe9a0', y: 120, size: 140}],
	},
	{
		at: '137', whip: true, place: 'boxes', cam: [1000, 560, 1.4, 1200, 560, 1.4],
		actors: [{who: 'iris', x: 1200, face: -1, g: [['point', '137+20', 'e137']], ex: [['normal', 'smile', '137', 'e137']]}, {who: 'hero', x: 800, ex: [['normal', 'smile', '137', 'e137']]}],
		fx: (c) => <Board x={1000} y={80} w={520} h={180} f={c.f} t0={c.R('137+10')} lines={['IRIS\'S RULES']} size={70} />,
	},
	{
		at: '138', place: 'hall', pv: {seed: 's1', open: [1200]}, cam: [900, 560, 1.2, 900, 560, 1.3],
		actors: [{who: 'hero', x: 300, go: [['138', '138+40', 700], ['138+40', '138+80', 400], ['138+80', 'e138', 900]]}],
		gfx: [{k: 'tag', t: ['138+4', 'e138'], x: 960, y: 250, text: "RULE: DON'T WALK STRAIGHT", size: 46, c: W}],
	},
	{
		at: '139', place: 'hall', pv: {seed: 's2', open: [800]}, cam: [900, 560, 1.2, 900, 560, 1.4],
		actors: [{who: 'hero', x: 600, go: [['139+10', '139+60', 1100]], ex: [['wide', 'open', '139+30', 'e139']], lean: [[20, '139+30', 'e139']]}],
		gfx: [{k: 'shake', t: ['139+30', 'e139'], amp: 14}, {k: 'tag', t: ['139+6', 'e139'], x: 960, y: 250, text: 'THE PLACE BENDS', size: 46, c: RED}],
	},
	{
		at: '140', place: 'hall', pv: {seed: 's3'}, cam: [900, 540, 1.6, 900, 540, 1.9],
		actors: [{who: 'hero', x: 800, g: [['stop', '140+30', 'e140']], ex: [['normal', 'open', '140', '140+30'], ['wide', 'flat', '140+30', 'e140']]}],
		fx: (c) => (
			<g fontFamily={FONT} fontWeight={900} fill="#fff" fontSize={54}>
				{['♪', '♫', '♪'].map((n, i) => (
					<text key={i} x={940 + i * 70} y={420 - ((c.f * 2 + i * 20) % 120)} opacity={c.f < 40 ? 1 : 0.2}>
						{n}
					</text>
				))}
				<text x={1010} y={560} fill={RED} fontSize={130} opacity={c.f > 40 ? 1 : 0}>✕</text>
			</g>
		),
		gfx: [{k: 'tag', t: ['140+40', 'e140'], x: 1000, y: 260, text: 'THE VOICE LIKES WHISTLING', size: 38, c: RED}],
	},
	{
		at: '141', place: 'hall', pv: {seed: 's4', open: [1300]}, cam: [900, 540, 1.4, 900, 540, 1.7],
		actors: [{who: 'hero', x: 800, g: [['stop', '141+10', 'e141']], ex: [['worried', 'flat', '141', 'e141']]}, {who: 'iris', x: 1100, face: -1, g: [['presentF', '141+10', 'e141']]}],
		fx: (c) => <Rings x={1700} y={520} f={c.gf} c="#ffe9a0" n={3} r={260} />,
		gfx: [{k: 'tag', t: ['141+10', 'e141'], x: 1450, y: 330, text: '✕ NEVER FOLLOW A SOUND YOU KNOW', size: 36, c: RED}],
	},
	{
		at: '142', place: 'hall', pv: {seed: 's5', open: [1300]}, cam: [900, 540, 1.3, 1100, 540, 1.5],
		actors: [{who: 'hero', x: 800, go: [['142+30', 'e142', 1250]], ex: [['wide', 'smile', '142', 'e142']]}, {who: 'iris', x: 1000, face: 1, g: [['point', '142+10', 'e142']]}],
		fx: (c) => <Rings x={1750} y={520} f={c.gf} c="#7fd0ff" n={2} r={220} />,
		gfx: [{k: 'tag', t: ['142+6', 'e142'], x: 1450, y: 330, text: '✓ ONLY SOUNDS YOU DON\'T', size: 36, c: '#9ff0b0'}],
	},
	{
		at: '143', place: 'hall', pv: {seed: 's6', chalk: true}, cam: [700, 540, 1.3, 1000, 540, 1.3],
		actors: [{who: 'hero', x: 500, go: [['143', 'e143', 800]], reachTo: [['143+40', 'e143', 880, 520]]}, {who: 'iris', x: 400, go: [['143', 'e143', 700]]}],
		gfx: [{k: 'tag', t: ['143+6', 'e143'], x: 700, y: 280, text: 'STAY CLOSE TO THE CHALK', size: 42, c: W}],
	},
	{
		at: '144', whip: true, place: 'boxes', cam: [1000, 640, 1.2, 1000, 640, 1.5],
		actors: [{who: 'hero', x: 800, sit: true, face: 1, g: [['presentF', '144+20', 'e144']], ex: [['normal', 'smile', '144', 'e144']]}, {who: 'iris', x: 1150, sit: true, face: -1, ex: [['normal', 'smile', '144', 'e144']]}],
		gfx: [{k: 'tag', t: ['144+6', 'e144'], x: 960, y: 330, text: 'WEEKS PASS · YOU LEARN ABOUT EACH OTHER', size: 36, c: '#fff'}],
	},
	{
		at: '145', place: 'boxes', cam: [1100, 640, 1.5, 1250, 640, 1.8],
		actors: [{who: 'iris', x: 1150, sit: true, face: -1, g: [['presentF', '145+10', 'e145']], ex: [['normal', 'smile', '145', 'e145']]}, {who: 'hero', x: 800, sit: true, face: 1, ex: [['wide', 'smile', '145', 'e145']]}],
		gfx: [{k: 'tag', t: ['145+6', 'e145'], x: 1150, y: 410, text: 'A LITTLE BROTHER, TOO', size: 42, c: '#e8d4ff'}],
	},
	{
		at: '146', place: 'boxes', cam: [1100, 600, 1.4, 1100, 600, 1.7],
		actors: [{who: 'iris', x: 1000, face: 1, ex: [['normal', 'smile', '146', 'e146']]}, {who: 'leo', x: 1250, s: 0.55, face: -1, g: [['wave', '146+10', 'e146']]}],
		gfx: [{k: 'big', t: ['146', 'e146'], text: 'LEO · 8', c: '#9ff0b0', y: 120, size: 190}],
	},
	{
		at: '147', whip: true, place: 'void', cam: [960, 560, 1.2, 1100, 560, 1.4],
		back: (c) => (
			<g>
				<rect x={1300} y={300} width={260} height={600} rx={14} fill="#d94a3a" />
				<rect x={1330} y={340} width={200} height={260} rx={8} fill="#1c2150" />
				{[0, 1, 2, 3].map((i) => (
					<rect key={i} x={1346} y={356 + i * 60} width={168} height={40} rx={6} fill={['#ffd34a', '#7fd0ff', '#9ff0b0', '#ff9ab8'][i]} />
				))}
				<rect x={1330} y={820} width={200} height={50} rx={6} fill="#0b0d22" />
			</g>
		),
		actors: [{who: 'iris', x: 1000, face: 1, go: [['147+10', '147+60', 1180]], reachTo: [['147+80', 'e147', 1330, 880]], lean: [[20, '147+80', 'e147']]}, {who: 'leo', x: 760, s: 0.55, face: 1, go: [['147+10', '147+60', 920]], hide: [0, '147+110']}],
		fx: (c) => <g transform={`translate(1340,${860})`}><path d="M0,0 q14,-30 26,-4 l-6,24 z" fill="#ff9a3a" opacity={c.f > 60 ? 1 : 0} /></g>,
		gfx: [{k: 'tag', t: ['147+6', '147+70'], x: 960, y: 250, text: 'WALKING HOME FROM SCHOOL', size: 40, c: '#fff'}, {k: 'tag', t: ['147+80', 'e147'], x: 1300, y: 250, text: 'A DROPPED GLOVE…', size: 40, c: Y}, {k: 'flash', t: ['147+110']}],
	},
	{
		at: '148', whip: true, place: 'hall', pv: {seed: 't1', open: [1400], dark: 0.2}, cam: [900, 560, 1.3, 1100, 560, 1.4],
		actors: [{who: 'iris', x: 800, face: 1, look: [1, 0], ex: [['sad', 'smile', '148', 'e148']], g: [['stop', '148+80', 'e148']]}],
		fx: (c) => (
			<g>
				<Rings x={1750} y={540} f={c.gf} c="#9ff0b0" n={3} r={300} />
				<text x={1700} y={380} fontFamily={FONT} fontWeight={900} fontSize={50} fill="#9ff0b0" opacity={0.5 + 0.5 * Math.sin(c.gf / 6)}>ha-ha-ha…</text>
			</g>
		),
		gfx: [{k: 'tag', t: ['148+80', 'e148'], x: 800, y: 300, text: 'SHE NEVER FOLLOWS IT', size: 42, c: '#fff'}],
	},
	{
		at: '149', place: 'boxes', cam: [1000, 640, 1.3, 1100, 640, 1.5],
		actors: [{who: 'hero', x: 800, sit: true, face: 1, g: [['presentF', '149+20', 'e149']], ex: [['normal', 'smile', '149', 'e149']]}, {who: 'iris', x: 1150, sit: true, face: -1, g: [['presentF', '149+30', 'e149']], ex: [['normal', 'smile', '149', 'e149']]}],
		gfx: [{k: 'tag', t: ['149+6', 'e149'], x: 960, y: 330, text: 'PRETEND TO MAKE DINNER', size: 42, c: '#ffe9a0'}],
	},
	{
		at: '150', place: 'boxes', cam: [1000, 600, 1.5, 1000, 600, 1.8],
		actors: [{who: 'hero', x: 800, sit: true, face: 1, g: [['presentF', '150+10', '150+80'], ['fist', '150+100', 'e150']], ex: [['normal', 'smile', '150', 'e150']]}, {who: 'iris', x: 1150, sit: true, face: -1, g: [['point', '150+110', 'e150']], ex: [['angry', 'smile', '150+100', 'e150']]}],
		fx: (c) => (
			<g transform="translate(980,560)">
				{[0, 1, 2, 3].map((i) => (
					<rect key={i} x={-90} y={50 - Math.min(i, Math.floor(c.f / 24)) * 0 - i * 24} width={180} height={20} rx={6} fill={['#f2b21c', '#d94a3a', '#fff3c0', '#d94a3a'][i]} opacity={Math.min(1, Math.max(0, (c.f - i * 24) / 12))} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['150+6', '150+90'], x: 980, y: 380, text: 'LASAGNA OUT OF NOTHING', size: 38, c: '#ffe9a0'}, {k: 'tag', t: ['150+100', 'e150'], x: 980, y: 380, text: 'HOW MUCH CHEESE?!', size: 38, c: Y}],
	},
	{
		at: '151', place: 'boxes', cam: [1000, 600, 1.4, 1000, 600, 1.7],
		actors: [{who: 'iris', x: 1150, sit: true, face: -1, g: [['fist', '151+6', '151+70']], ex: [['angry', 'open', '151', '151+70']]}, {who: 'hero', x: 800, sit: true, face: 1, g: [['shrug', '151+60', 'e151']], ex: [['normal', 'smirk', '151', 'e151']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('151+4')} t1={c.R('151+70')} x={1150} y={380} text="MORE CHEESE!" tx={1150} ty={520} size={40} />,
	},
	{
		at: '152', place: 'boxes', cam: [1000, 600, 1.2, 1000, 600, 1.4],
		actors: [{who: 'iris', x: 1150, sit: true, face: -1, ex: [['normal', 'smile', '152', 'e152']], g: [['shrug', '152+4', 'e152']]}, {who: 'hero', x: 800, sit: true, face: 1, ex: [['normal', 'smile', '152', 'e152']], g: [['shrug', '152+8', 'e152']]}],
		gfx: [{k: 'big', t: ['152', 'e152'], text: 'NEITHER WINS', c: '#fff', y: 120, size: 140}],
	},
	{
		at: '153', whip: true, place: 'hall', pv: {seed: 'u1', open: [700, 1500]}, cam: [300, 560, 1.3], follow: 'hero',
		actors: [{who: 'hero', x: 100, go: [['153+4', 'e153', 1700]], ex: [['wide', 'smile', '153', 'e153']]}, {who: 'iris', x: -60, go: [['153+4', 'e153', 1560]], ex: [['normal', 'smile', '153', 'e153']]}],
		gfx: [{k: 'big', t: ['153+6', '153+90'], text: '40 MORE DAYS', sub: 'EXPLORING TOGETHER', c: Y, y: 120, size: 130}],
	},
	{
		at: '154', place: 'boxes', cam: [1000, 620, 1.4, 1000, 640, 1.7],
		actors: [{who: 'hero', x: 800, sit: true, face: 1, g: [['presentF', '154+20', 'e154']]}, {who: 'iris', x: 1250, sit: true, face: -1, ex: [['normal', 'smile', '154', 'e154']]}],
		fx: (c) => (
			<g transform="translate(1030,700) rotate(-4)">
				<rect x={-150} y={-30} width={300} height={200} fill="#c9a06a" stroke="#8a6a3a" strokeWidth={6} />
				<polyline points="-120,20 -60,20 -60,80 20,80 20,30 100,30" stroke="#14112a" strokeWidth={5} fill="none" strokeDasharray={600} strokeDashoffset={600 - Math.min(600, c.f * 6)} />
			</g>
		),
		gfx: [{k: 'tag', t: ['154+6', 'e154'], x: 1030, y: 430, text: 'MAP ON A CARDBOARD BOX', size: 38, c: '#ffe0a0'}],
	},
	{
		at: '155', place: 'boxes', cam: [1000, 580, 1.2, 1000, 580, 1.6],
		actors: [{who: 'hero', x: 800, face: 1, reachTo: [['155+10', 'e155', 1000, 520]], ex: [['normal', 'smile', '155', 'e155']]}, {who: 'iris', x: 1250, face: -1, reachTo: [['155+30', 'e155', 1060, 560]], ex: [['normal', 'smile', '155', 'e155']]}],
		fx: (c) => (
			<g stroke="#14112a" strokeWidth={5} fill="none" strokeLinecap="round">
				<rect x={900} y={420} width={300} height={220} fill="#c9a06a" />
				<path d="M920,460 l80,40 l60,-30 l80,50" />
				<path d="M940,600 q60,-60 120,0 t120,0" />
				<text x={1140} y={470} fontFamily="Caveat" fontSize={34} fill="#14112a" stroke="none">here!</text>
			</g>
		),
		gfx: [{k: 'tag', t: ['155+6', 'e155'], x: 1050, y: 340, text: 'ARROWS · SYMBOLS · NOTES', size: 38, c: '#ffe0a0'}],
	},
	{
		at: '156', place: 'hall', pv: {seed: 'v1'}, cam: [900, 560, 1.4, 1000, 560, 1.7],
		actors: [{who: 'hero', x: 800, face: 1, reachTo: [['156+30', '156+90', 1000, 520]], ex: [['normal', 'smirk', '156+20', '156+90']]}, {who: 'iris', x: 1200, face: -1, sit: true, g: [['facepalm', '156+110', 'e156']], ex: [['wide', 'open', '156+100', 'e156']]}],
		fx: (c) => (
			<g stroke={W} strokeWidth={7} fill="none" strokeLinecap="round" transform="translate(900,360)">
				<path d="M60,0 v180 M120,0 v180 M0,60 h180 M0,120 h180" />
				<g opacity={c.f > 40 ? 1 : 0}><path d="M10,10 l40,40 m0,-40 l-40,40" /></g>
				<g opacity={c.f > 80 ? 1 : 0}><circle cx={90} cy={90} r={22} /></g>
				<g opacity={c.f > 120 ? 1 : 0}><path d="M70,130 l40,40 m0,-40 l-40,40" /></g>
			</g>
		),
		gfx: [{k: 'tag', t: ['156+6', '156+80'], x: 1000, y: 270, text: 'TIC-TAC-TOE ON THE WALL', size: 38, c: W}, {k: 'tag', t: ['156+110', 'e156'], x: 1200, y: 480, text: 'HA-HA-HA!', size: 46, c: Y}],
	},
	{
		at: '157', place: 'void', cam: [960, 500, 1.0, 960, 480, 1.2],
		actors: [{who: 'hero', x: 520, s: 0.85, g: [['think', '157+10', 'e157']]}, {who: 'iris', x: 1400, s: 0.85, face: -1, g: [['shrug', '157+30', 'e157']]}],
		gfx: [{k: 'big', t: ['157+10', 'e157'], text: 'WHAT THE LONELIEST KNOW', c: '#7fd0ff', y: 150, size: 110}],
	},
	{
		at: '158', place: 'void', cam: [960, 520, 1.0, 960, 520, 1.15],
		actors: [{who: 'hero', x: 700, s: 0.9, sit: true, g: [['facepalm', '158+30', 'e158']], ex: [['sad', 'frown', '158', 'e158']]}],
		fx: (c) => (
			<g fontFamily={FONT} fontWeight={900} fill="#fff" textAnchor="middle">
				<text x={1100} y={300} fontSize={110} fill={RED}>100 DAYS ALONE</text>
				<text x={1100} y={440} fontSize={60} opacity={Math.min(1, c.f / 30)}>= MUCH HARDER</text>
				<text x={1100} y={560} fontSize={60} opacity={Math.min(1, Math.max(0, c.f - 50) / 20)} fill={RED}>THAN WITH ONE OTHER PERSON</text>
			</g>
		),
	},
	{
		at: '159', place: 'void', cam: [960, 520, 1.0, 960, 500, 1.2],
		actors: [{who: 'hero', x: 600, s: 0.9, g: [['wave', '159+20', 'e159']], ex: [['wide', 'smile', '159', 'e159']]}, {who: 'iris', x: 780, s: 0.9, face: -1, g: [['wave', '159+30', 'e159']], ex: [['wide', 'smile', '159', 'e159']]}],
		fx: (c) => (
			<g textAnchor="middle" fontFamily={FONT} fontWeight={900}>
				<text x={1300} y={300} fontSize={96} fill="#9ff0b0">100 DAYS TOGETHER</text>
				<text x={1300} y={420} fontSize={70} fill="#fff">≈ A VACATION</text>
				<text x={1300} y={560} fontSize={110}>🌴</text>
			</g>
		),
	},
	{
		at: '160', whip: true, place: 'boxes', cam: [1000, 580, 1.2, 1000, 540, 1.6],
		actors: [{who: 'iris', x: 1250, face: -1, g: [['presentF', '160+30', 'e160']], ex: [['normal', 'smile', '160', 'e160']]}, {who: 'hero', x: 800, ex: [['wide', 'open', '160+30', 'e160']]}],
		fx: (c) => (
			<g transform="translate(1020,500) rotate(-3)">
				<rect x={-160} y={-120} width={320} height={240} fill="#c9a06a" stroke="#8a6a3a" strokeWidth={6} />
				<path d="M-120,-80 l60,40 l70,-30 l60,50 M-110,60 q50,-60 100,0 t100,0" stroke="#14112a" strokeWidth={5} fill="none" />
			</g>
		),
		gfx: [{k: 'tag', t: ['160+10', 'e160'], x: 1020, y: 330, text: 'HER MAP · 3 YEARS', size: 44, c: Y}],
	},
	{
		at: '161', place: 'boxes', cam: [1020, 520, 1.8, 1020, 500, 2.2],
		actors: [{who: 'iris', x: 1250, face: -1}, {who: 'hero', x: 780, ex: [['worried', 'flat', '161', 'e161']]}],
		fx: (c) => (
			<g transform="translate(1020,500) rotate(-3)">
				<rect x={-160} y={-120} width={320} height={240} fill="#c9a06a" stroke="#8a6a3a" strokeWidth={6} />
				<path d="M-120,-80 l60,40 l70,-30 l60,50 M-110,60 q50,-60 100,0 t100,0" stroke="#14112a" strokeWidth={5} fill="none" />
				{[[-100, -90], [20, 10], [-50, 70]].map(([x, y], i) => (
					<path key={i} d={`M${x},${y} l50,50 m0,-50 l-50,50`} stroke={RED} strokeWidth={9} opacity={Math.min(1, Math.max(0, c.f - i * 30) / 10)} />
				))}
			</g>
		),
		gfx: [{k: 'tag', t: ['161+6', 'e161'], x: 1020, y: 330, text: 'DEAD ENDS · LOOPS', size: 42, c: RED}],
	},
	{
		at: '162', place: 'boxes', cam: [1020, 520, 2.0, 1000, 500, 2.4],
		actors: [{who: 'iris', x: 1250, face: -1, g: [['point', '162+20', 'e162']]}],
		fx: (c) => (
			<g transform="translate(1020,500) rotate(-3)">
				<rect x={-160} y={-120} width={320} height={240} fill="#c9a06a" stroke="#8a6a3a" strokeWidth={6} />
				<path d="M-120,-80 l60,40 l70,-30 l60,50 M-110,60 q50,-60 100,0 t100,0" stroke="#14112a" strokeWidth={5} fill="none" />
				<ellipse cx={-90} cy={-10} rx={64} ry={52} fill="none" stroke={RED} strokeWidth={8} strokeDasharray={400} strokeDashoffset={400 - Math.min(400, c.f * 6)} />
			</g>
		),
		gfx: [{k: 'tag', t: ['162+10', 'e162'], x: 1020, y: 330, text: 'ONE SPOT CIRCLED IN RED', size: 40, c: RED}],
	},
	{
		at: '163', place: 'boxes', cam: [1000, 580, 1.4, 1100, 580, 1.6],
		actors: [{who: 'iris', x: 1250, face: -1, g: [['point', '163+10', 'e163']], ex: [['worried', 'open', '163', 'e163']]}, {who: 'hero', x: 800, ex: [['normal', 'flat', '163', 'e163']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('163+10')} t1={c.R('e163')} x={1250} y={340} text="The only place I haven't gone." tx={1250} ty={470} size={38} />,
	},
	{
		at: '164', place: 'boxes', cam: [1100, 600, 1.7, 1200, 600, 2.1],
		actors: [{who: 'iris', x: 1250, face: -1, g: [['armsCrossed', '164+10', 'e164']], ex: [['sad', 'frown', '164', 'e164']]}, {who: 'hero', x: 800, ex: [['worried', 'open', '164+30', 'e164']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('164')} t1={c.R('164+60')} x={1250} y={340} text="I'm scared." tx={1250} ty={470} size={44} />,
		gfx: [{k: 'tag', t: ['164+70', 'e164'], x: 800, y: 320, text: '"WHY?"', size: 52, c: '#fff'}],
	},
	{
		at: '165', place: 'boxes', cam: [1100, 600, 1.8, 1100, 600, 2.2],
		actors: [{who: 'iris', x: 1250, face: -1, sit: true, ex: [['sad', 'frown', '165', 'e165']], g: [['facepalm', '165+30', 'e165']]}, {who: 'hero', x: 800, sit: true, ex: [['sad', 'flat', '165', 'e165']]}],
		fx: (c) => <Speech f={c.f} t0={c.R('165')} t1={c.R('165+90')} x={1250} y={380} text="Last time, I heard my brother." tx={1250} ty={520} size={36} />,
		gfx: [{k: 'dim', t: ['165+60', 'e165'], o: 0.35}],
	},
];
