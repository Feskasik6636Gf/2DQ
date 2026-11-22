import React from 'react';
import {scene} from './dsl';
import {hero, ppl, Wind, Arrow, Tag, Stat} from './helpers';

/* 065–127: cat, canary, boiler, pigeons, bees, vet, dog walking, K9 */
export const S3 = [
	scene({
		at: '065', loc: 'kitchen', whip: true,
		cast: [hero(560, {face: 1, acts: [['scare', '065+36', '065+60']]})],
		animals: [{an: 'cat', x: 1280, y: 560, pose: 'sit', face: -1, tilt: [['065+20', '065+50', -16]]}],
		extra: () => <g><rect x={1080} y={560} width={420} height={18} rx={6} fill="#a8723e" stroke="#1d1626" strokeWidth={3.4} /><rect x={1100} y={578} width={14} height={50} fill="#7a4a24" /></g>,
		props: [{k: 'vase', x: 1180, y: 560, mv: [['065+34', '065+52', 1000, 900]], rot: 0, spin: 0}],
		fx: [{k: 'impact', t: '065+52', at: [1000, 760], text: 'CRASH!', s: 0.6}, {k: 'shock', t: '065+52'}],
		subj: [['065', 'cat'], ['065+40', 'hero']],
	}),
	scene({
		at: '066', loc: 'kitchen',
		cast: [hero(640, {face: 1, acts: [['point', '066+4', '066+30']], ex: [['angry', '066', '067']]})],
		animals: [{an: 'cat', x: 1200, y: 900, pose: 'sit', face: -1, talk: [['067', '067e']], say: [['067+2', '068', 'Which vase?']]}],
		props: [{k: 'vase', x: 1000, y: 900, rot: 90, t0: 0, c: '#3a9ad8'}],
		fx: [{k: 'question', t: '067+4', at: 'cat'}],
		subj: [['066', 'hero'], ['067', 'cat']],
	}),
	scene({
		at: '068', loc: 'kitchen',
		cast: [hero(640, {face: 1, acts: [['facepalm', '068+20', '068e']]})],
		animals: [{an: 'cat', x: 1200, pose: 'sit', face: -1, tilt: [['068', '068e', -10]], say: [['068+10', '068+70', 'Never saw it.'], ['068+74', '068e', 'Totally innocent.']]}],
		props: [{k: 'flower', x: 1380, y: 900, c: '#fff', s: 1.2}],
		fx: [{k: 'sparkle', t: '068+30', at: 'cat'}, {k: 'accent', t: '068+6', t1: '068+60', text: 'CATS LIE BEAUTIFULLY'}],
		subj: [['068', 'cat']],
	}),
	scene({
		at: '069', loc: 'hall3', whip: true,
		cast: [hero(600, {face: 1, mv: [['069', '069+40', 1000]], acts: [['touchFace', '070', '070e']]})],
		extra: (c) => (
			<g>
				{[0, 1, 2, 3].map((i) => {
					const k = ((c.f - c.tf('070') + i * 20) % 80) / 80;
					return c.f > c.tf('070') ? <text key={i} x={1480 + Math.sin(k * 6 + i) * 30} y={560 - k * 200} fontSize={56 + i * 6} fill="#ffd84a" stroke="#1d1626" strokeWidth={3} opacity={1 - k}>♪</text> : null;
				})}
			</g>
		),
		fx: [{k: 'accent', t: '069+10', t1: '069e', text: '3RD FLOOR — MRS. LINDQUIST', sub: 'canary: Sunny'}, {k: 'accent', t: '070+10', t1: '070e', text: 'SINGS EVERY DAWN'}],
		subj: [['069', 'hero']],
	}),
	scene({
		at: '071', loc: 'kitchen', whip: true,
		cast: [ppl('lindquist', 560, {face: 1, acts: [['presentF', '073', '073+50']]}), hero(1500, {face: -1})],
		animals: [{an: 'canary', x: 1000, y: 700, flap: [['072+30', '072+60']], talk: [['072+30', '073e']], say: [['072+34', '073+10', 'Morning!'], ['073+10', '073+30', 'Morning!'], ['073+30', '073e', 'Morning!']], hop: [['072+30', '073e']]}],
		props: [{k: 'cage', x: 1000, y: 880, s: 1.8, t0: 0}],
		fx: [{k: 'accent', t: '071+6', t1: '072', text: 'THE ONLY ONE WHO SPEAKS IN COMPLETE SENTENCES'}],
		subj: [['071', 'canary'], ['073', 'lindquist']],
	}),
	scene({
		at: '074', loc: 'kitchen',
		cast: [ppl('lindquist', 560, {face: 1, ex: [['sad', '075', '076e']]}), hero(1500, {face: -1})],
		animals: [{an: 'canary', x: 1000, y: 700, hop: [['076', '076e']]}],
		props: [{k: 'cage', x: 1000, y: 880, s: 1.8}, {k: 'frame', x: 760, y: 560, s: 1.4, t0: '075', c: '#caa86a'}],
		fx: [{k: 'accent', t: '074+4', t1: '074+50', text: 'MRS. LINDQUIST IS 90'}, {k: 'accent', t: '075+6', t1: '076e', text: 'HER LATE HUSBAND WAS A COAL MINER', sub: 'the bird is a gift from his old crew'}],
		subj: [['074', 'lindquist'], ['076', 'canary']],
	}),
	scene({
		at: '077', loc: 'basement', whip: true,
		cast: [hero(500, {face: 1, acts: [['scare', '078+10', '078+50']]}), ppl('sup', 1500, {face: -1, acts: [['shrug', '079', '079e']]})],
		fx: [{k: 'accent', t: '077+6', t1: '077e', text: 'THE BOILER IS OLDER THAN YOUR MOM'}, {k: 'shake', t: '078+8'}, {k: 'shake', t: '078+40'}, {k: 'impact', t: '078+8', at: [1000, 330], text: 'RUMBLE', s: 0.5}, {k: 'accent', t: '079+6', t1: '079e', text: '"IT\'S FINE"', y: 820}],
		subj: [['077', 'hero'], ['078', 'hero'], ['079', 'sup']],
	}),
	scene({
		at: '080', loc: 'roof', whip: true,
		cast: [hero(500, {face: 1, acts: [['presentF', '080+10', '080+40']]})],
		animals: [0, 1, 2, 3, 4].map((i) => ({an: 'pigeon' as const, id: 'p' + i, x: 1000 + i * 150, y: 900, s: 1.1, face: -1 as const, hop: [[`080+${10 + i * 8}`, `080+${24 + i * 8}`]] as [string, string][], talk: [['080', '085e']] as [string, string][]})),
		fx: [{k: 'accent', t: '080+4', t1: '080e', text: 'PIGEONS KNOW EVERYTHING'}],
		subj: [['080', 'p0']],
	}),
	scene({
		at: '081', loc: 'roof',
		cast: [hero(450, {face: 1, acts: [['rubChin', '081', '083e']]})],
		animals: [0, 1, 2, 3, 4].map((i) => ({an: 'pigeon' as const, id: 'p' + i, x: 900 + i * 170, y: 900, s: 1.1, face: -1 as const, hop: [[`08${1 + (i % 3)}+${10 + i * 8}`, `08${1 + (i % 3)}+${26 + i * 8}`]] as [string, string][]})),
		extra: (c) => (
			<g>
				<Tag f={c.f} t0={c.tf('081+6')} t1={c.tf('082')} x={1100} y={560} text="Which teacher eats alone on the roof?" c="#fff" size={34} />
				<Tag f={c.f} t0={c.tf('082+6')} t1={c.tf('083')} x={1300} y={640} text="Which janitor has a 2nd job?" c="#ffd84a" size={34} />
				<Tag f={c.f} t0={c.tf('083+4')} t1={c.tf('084')} x={1100} y={560} text="Where do the good fries drop?" c="#ffb27a" size={34} />
			</g>
		),
		subj: [['081', 'p1'], ['082', 'p3'], ['083', 'p0']],
	}),
	scene({
		at: '084', loc: 'roof',
		cast: [hero(500, {face: 1, acts: [['scare', '084+10', '084+50']]})],
		animals: [0, 1, 2, 3, 4, 5, 6].map((i) => ({an: 'pigeon' as const, id: 'p' + i, x: 800 + i * 130, y: 900, s: 1.1, face: -1 as const, hop: [['084', '085e']] as [string, string][], talk: [['084', '084e']] as [string, string][], flap: [[`084+${i * 6}`, `084+${i * 6 + 18}`]] as [string, string][], say: i % 3 === 0 ? [[`084+${6 + i * 5}`, '084e', ['BLAH!', 'GOSSIP!', 'COO COO!'][i % 3]]] as [string, string, string][] : undefined})),
		fx: [{k: 'accent', t: '084+8', t1: '084e', text: 'ALL AT ONCE, ALL DAY'}, {k: 'shake', t: '084+10'}],
		subj: [['084', 'p3']],
	}),
	scene({
		at: '085', loc: 'roof',
		cast: [hero(700, {face: 1, acts: [['bow', '085+6', '085+40'], ['wave', '085+40', '085e']]})],
		animals: [0, 1, 2].map((i) => ({an: 'pigeon' as const, id: 'p' + i, x: 1100 + i * 190, y: 900, s: 1.1, face: -1 as const, hop: [['085', '085e']] as [string, string][]})),
		fx: [{k: 'accent', t: '085+10', t1: '085e', text: 'NOD POLITELY'}],
		subj: [['085', 'hero']],
	}),
	scene({
		at: '086', loc: 'market', whip: true,
		cast: [hero(1500, {face: -1, mv: [['086', '086+30', 1200]]}), ppl('bee', 560, {face: 1, acts: [['wave', '087+10', '087+40']]})],
		props: [{k: 'hive', x: 780, y: 900, s: 1.4}, {k: 'jar', x: 380, y: 900, s: 1.4}],
		animals: [0, 1, 2, 3].map((i) => ({an: 'bee' as const, id: 'b' + i, x: 700 + (i % 2) * 120, y: 700 - i * 30, s: 1.2, face: 1 as const, mv: [[0, 9999, 700 + (i % 2) * 120 + 900 * 0]] as any})),
		fx: [{k: 'accent', t: '086+4', t1: '087e', text: 'FARMER\'S MARKET', sub: 'a beekeeper lets you ask her hives'}],
		subj: [['086', 'hero'], ['087', 'bee']],
	}),
	scene({
		at: '088', loc: 'infoDay',
		cast: [],
		extra: (c) => {
			const t = c.f / 30;
			const ph = (t * 2.5) % (Math.PI * 2);
			const bx = 700 + Math.sin(ph) * 160;
			const by = 540 + Math.sin(ph * 2) * 90;
			const lines = (<path d="M700,540 C560,380 560,700 700,540 C840,380 840,700 700,540" stroke="#1d1626" strokeWidth={6} fill="none" opacity={0.25} strokeDasharray="10 12" />);
			return (
				<g>
					{lines}
					<circle cx={1300} cy={600} r={120} fill="#ffd84a" opacity={0.9} stroke="#1d1626" strokeWidth={5} />
					{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={1300 + Math.cos(i * 1.26) * 100} cy={600 + Math.sin(i * 1.26) * 100} rx={26} ry={44} fill="#ff6aa0" stroke="#1d1626" strokeWidth={4} transform={`rotate(${i * 72 + 18} ${1300 + Math.cos(i * 1.26) * 100} ${600 + Math.sin(i * 1.26) * 100})`} />)}
					<circle cx={1300} cy={600} r={44} fill="#ffb92e" stroke="#1d1626" strokeWidth={4} />
					<g transform={`translate(${bx},${by})`}><circle r={0} /></g>
					<Tag f={c.f} t0={c.tf('088+30')} t1={c.tf('089')} x={1000} y={300} text="FLOWERS ARE THAT WAY →" c="#ffd84a" size={46} />
				</g>
			);
		},
		animals: [{an: 'bee', x: 700, y: 540, s: 2.2, face: 1, rot: [[0, 9999, -10, 10]]}],
		fx: [{k: 'accent', t: '088+6', t1: '088e', text: 'THE WAGGLE DANCE'}],
		subj: [['088', 'bee']],
		cam: [['088', 900, 1.0, 540], ['088e', 1000, 1.15, 540]],
	}),
	scene({
		at: '089', loc: 'infoDay',
		extra: (c) => (
			<g>
				<circle cx={600} cy={700} r={14} fill="#1d1626" />
				<path d={`M600,700 L${600 + Math.cos(-0.7) * 560},${700 + Math.sin(-0.7) * 560}`} stroke="#ff3a4a" strokeWidth={10} strokeLinecap="round" opacity={c.f > c.tf('089+10') ? 1 : 0} />
				<path d="M600,700 L1150,700" stroke="#1d1626" strokeWidth={4} strokeDasharray="8 10" />
				<path d="M780,700 A180,180 0 0 0 740,610" stroke="#ffd84a" strokeWidth={10} fill="none" />
				<Tag f={c.f} t0={c.tf('089+10')} t1={c.tf('090')} x={1220} y={400} text="ANGLE = DIRECTION" c="#ffd84a" size={54} />
				<Tag f={c.f} t0={c.tf('090')} t1={c.tf('090e')} x={1220} y={520} text="LENGTH = DISTANCE" c="#8be88b" size={54} />
				<path d={`M600,880 H${600 + Math.min(1, Math.max(0, (c.f - c.tf('090')) / 36)) * 700}`} stroke="#8be88b" strokeWidth={14} strokeLinecap="round" />
			</g>
		),
		animals: [{an: 'bee', x: 760, y: 560, s: 2, face: 1, rot: [[0, 9999, -40, -20]]}],
		subj: [['089', 'bee']],
	}),
	scene({
		at: '091', loc: 'market',
		cast: [hero(760, {face: 1, acts: [['presentF', '091+4', '091+60'], ['point', '092', '092e']]}), ppl('bee', 1340, {face: -1, acts: [['point', '091+10', '092e']]})],
		props: [{k: 'hive', x: 1560, y: 900, s: 1.3}],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('091+10')} t1={c.tf('091e')} x={1060} y={330} text="1.5 MILES →" c="#ffd84a" size={56} /><Tag f={c.f} t0={c.tf('092')} t1={c.tf('092e')} x={1060} y={440} text="PAST THE WATER TOWER" c="#fff" size={40} /></g>,
		subj: [['091', 'bee'], ['092', 'hero']],
	}),
	scene({
		at: '093', loc: 'market',
		cast: [ppl('bee', 700, {face: 1, acts: [['cheer', '093+30', '094e']]}), hero(1250, {face: -1, acts: [['wave', '094', '094e']]})],
		props: [{k: 'jar', x: 380, y: 900, s: 1.5, t0: '093+6'}, {k: 'jar', x: 480, y: 900, s: 1.5, t0: '093+14'}, {k: 'jar', x: 580, y: 900, s: 1.5, t0: '093+22'}, {k: 'jar', x: 430, y: 790, s: 1.5, t0: '093+30'}, {k: 'jar', x: 530, y: 790, s: 1.5, t0: '093+38'}],
		fx: [{k: 'accent', t: '093+6', t1: '094e', text: '300 JARS IN ONE MORNING'}, {k: 'confetti', t: '094'}],
		subj: [['093', 'bee'], ['094', 'hero']],
	}),
	scene({
		at: '095', loc: 'vet', whip: true,
		cast: [ppl('mom', 520, {face: 1, mv: [['095', '095+40', 760]]}), hero(300, {mv: [['095', '095+50', 560]]})],
		crowd: [{n: 5, x0: 1250, x1: 1900, s: 0.8, mode: 'stand', seed: 'vet'}],
		animals: [{an: 'spaniel', x: 1350, pose: 'sit', face: -1, sad: [0, 9999]}],
		fx: [{k: 'accent', t: '095+6', t1: '095e', text: 'SATURDAY AT THE VET'}],
		subj: [['095', 'mom'], ['095+40', 'hero']],
	}),
	scene({
		at: '096', loc: 'vet',
		cast: [hero(760, {face: 1, seat: 770, acts: [['sit', 0, 9999], ['touchFace', '096+30', '096e']]})],
		crowd: [{n: 6, x0: 1200, x1: 1900, s: 0.8, mode: 'stand', seed: 'vet'}],
		props: [{k: 'magazine', x: 880, y: 740, s: 1.2}],
		animals: [{an: 'spaniel', x: 1500, pose: 'sit', face: -1, sad: [0, 9999]}],
		fx: [{k: 'accent', t: '096+6', t1: '096e', text: '20 OWNERS WATCH YOU'}, {k: 'question', t: '096+30', at: 'hero'}],
		extra: () => <g><rect x={540} y={760} width={560} height={50} rx={14} fill="#4a86b8" stroke="#1d1626" strokeWidth={3.4} /></g>,
		subj: [['096', 'hero']],
	}),
	scene({
		at: '097', loc: 'vet',
		cast: [hero(800, {face: 1, acts: [['point', '098+10', '098e'], ['scare', '097+10', '097+40']]})],
		crowd: [{n: 4, x0: 1300, x1: 1900, s: 0.8, mode: 'stand', seed: 'vet'}],
		animals: [{an: 'spaniel', x: 1350, pose: 'sit', face: -1, sad: [0, 9999], hop: [['097+40', '097+60']], say: [['097+30', '098e', 'Left leg! It\'s the left leg!']], talk: [['097+30', '098e']]}],
		fx: [{k: 'exclaim', t: '097+40', at: 'hero'}],
		subj: [['097', 'spaniel'], ['098', 'hero']],
	}),
	scene({
		at: '099', loc: 'vet',
		cast: [ppl('vet', 1000, {face: -1, acts: [['think', '099+10', '099e'], ['shrug', '100', '100e']]}), hero(540, {face: 1, ex: [['worried', '099', '100e']]})],
		animals: [{an: 'spaniel', x: 1350, pose: 'sit', face: -1, sad: [0, 9999]}],
		fx: [{k: 'question', t: '100+10', at: 'vet'}, {k: 'accent', t: '099+4', t1: '100e', text: 'THE VET CHECKS THE RIGHT LEG', sub: 'finds nothing'}],
		subj: [['099', 'vet'], ['100', 'hero']],
	}),
	scene({
		at: '101', loc: 'vet',
		cast: [hero(700, {face: 1, acts: [['stop', '101+4', '101+24'], ['point', '102', '102e']]}), ppl('vet', 1050, {face: -1})],
		animals: [{an: 'spaniel', x: 1350, pose: 'sit', face: -1, sad: [0, 9999]}],
		fx: [{k: 'accent', t: '102+4', t1: '102e', text: '"MAYBE TRY THE LEFT."', y: 820}],
		subj: [['101', 'hero'], ['102', 'vet']],
	}),
	scene({
		at: '103', loc: 'vet',
		cast: [ppl('vet', 1000, {face: -1, acts: [['crouch', '103+4', '103+40']]}), hero(560, {face: 1})],
		animals: [{an: 'spaniel', x: 1350, pose: 'sit', face: -1}],
		props: [{k: 'thorn', x: 1270, y: 900, s: 4, t0: '103+36'}],
		fx: [{k: 'impact', t: '103+36', at: [1270, 600], text: 'A THORN!', s: 0.55}, {k: 'sparkle', t: '103+40', at: [1270, 800]}, {k: 'shock', t: '103+36'}],
		subj: [['103', 'vet'], ['103+36', 'spaniel']],
	}),
	scene({
		at: '104', loc: 'vet',
		cast: [hero(700, {face: 1, acts: [['scare', '104+20', '104e']]})],
		crowd: [{n: 8, x0: 900, x1: 1900, s: 0.8, mode: 'stand', seed: 'vet2'}],
		fx: [{k: 'accent', t: '104+10', t1: '104e', text: 'THE WHOLE ROOM GOES QUIET'}, {k: 'exclaim', t: '104+20', at: [1200, 520]}],
		subj: [['104', 'hero']],
	}),
	scene({
		at: '105', loc: 'vet',
		cast: [ppl('rep', 1100, {face: -1, acts: [['presentF', '105+6', '105+50']]}), hero(600, {face: 1, acts: [['scratch', '106+10', '106+50']]})],
		extra: (c) => <Tag f={c.f} t0={c.tf('105+20')} t1={c.tf('105e')} x={1100} y={330} text="Do you take appointments?" c="#fff" size={36} />,
		fx: [{k: 'bulb', t: '106+30', at: 'hero'}],
		subj: [['105', 'rep'], ['106', 'hero']],
	}),
	scene({
		at: '107', loc: 'infoGreen', whip: true,
		cast: [hero(700, {face: 1, acts: [['think', '107+20', '107e']]})],
		animals: [{an: 'retriever', x: 1250, face: -1, wag: 2}],
		extra: (c) => <Stat f={c.f} t0={c.tf('107+30')} t1={c.tf('108')} x={960} y={330} big="$15 / HOUR" label="AVERAGE DOG WALKER" c="#8be88b" />,
		subj: [['107', 'hero']],
	}),
	scene({
		at: '108', loc: 'park',
		cast: [hero(500, {mv: [['108', '111e', 1500]], acts: [['cheer', '109+20', '109e']]})],
		animals: [{an: 'beagle', x: 300, mv: [['108', '111e', 1300]]}, {an: 'bulldog', x: 120, mv: [['108', '111e', 1180]]}, {an: 'greyhound', x: -80, mv: [['108', '111e', 1020]], say: [['110+4', '110+40', 'The LONG route.']]}, {an: 'spaniel', x: -260, mv: [['108', '111e', 880]], say: [['111+4', '111e', 'I hate the red leash!']]}],
		props: [{k: 'leash', x: 1100, y: 800, t0: '111', s: 1.2, c: '#e03a3a'}],
		fx: [{k: 'accent', t: '108+6', t1: '109e', text: 'YOU KNOW WHAT EACH DOG WANTS'}],
		subj: [['108', 'hero'], ['110', 'greyhound'], ['111', 'spaniel']],
		cam: [['108', 600, 1.2, 650], ['110', 1000, 1.5, 650], ['111e', 1300, 1.5, 650]],
	}),
	scene({
		at: '112', loc: 'park', whip: true,
		cast: [hero(700, {face: 1, acts: [['presentF', '113', '113e']]})],
		animals: [{an: 'retriever', x: 1250, face: -1, hop: [['112+10', '112+30'], ['113+10', '113+30']], say: [['112+6', '112+60', 'The PARK! Let\'s go!'], ['113+4', '113e', 'Not THAT park. The OTHER park.']], talk: [['112', '113e']]}],
		fx: [{k: 'accent', t: '112+4', t1: '112e', text: 'MOOSE', sub: 'shaggy retriever'}, {k: 'question', t: '113+30', at: 'hero'}],
		subj: [['112', 'retriever'], ['113', 'hero']],
	}),
	scene({
		at: '114', loc: 'park',
		cast: [hero(960, {acts: [['cheer', '115+20', '116e']]})],
		crowd: [{n: 6, x0: 100, x1: 1000, s: 0.5, mode: 'stand', seed: 'dg'}],
		animals: [0, 1, 2, 3, 4, 5].map((i) => ({an: (['beagle', 'bulldog', 'retriever', 'spaniel', 'shepherd', 'greyhound'] as const)[i], id: 'd' + i, x: 200 + i * 250, face: (i < 3 ? 1 : -1) as 1 | -1, hide: [0, `114+${i * 10}`] as [number, string], wag: 2, hop: [[`115+${i * 8}`, `115+${i * 8 + 16}`]] as [string, string][]})),
		extra: (c) => <g><Stat f={c.f} t0={c.tf('115+20')} t1={c.tf('116')} x={960} y={300} big="62 CLIENTS" label="at the dog park" c="#7ac8ff" s={0.9} /><Stat f={c.f} t0={c.tf('116')} t1={c.tf('116e')} x={960} y={300} big="$400 / WEEK" label="you make" c="#8be88b" s={0.9} /></g>,
		fx: [{k: 'confetti', t: '116'}],
		subj: [['114', 'hero'], ['115', 'd2'], ['116', 'hero']],
	}),
	scene({
		at: '117', loc: 'park', whip: true,
		cast: [ppl('rep', 700, {face: 1, hold: [['mic', 0, 9999, {s: 0.9}]], acts: [['presentF', '117+10', '117e']]}), hero(1200, {face: -1, acts: [['wave', '118+10', '118e']]})],
		props: [{k: 'camera', x: 360, y: 900, s: 1.5}],
		fx: [{k: 'accent', t: '117+10', t1: '117e', text: 'LOCAL NEWS'}, {k: 'accent', t: '118+6', t1: '118e', text: '"THE DOG WHISPERER"', y: 820}, {k: 'sparkle', t: '118+10', at: 'hero'}],
		subj: [['117', 'rep'], ['118', 'hero']],
	}),
	scene({
		at: '119', loc: 'city', whip: true,
		cast: [ppl('sgt', 1300, {face: -1, acts: [['armsCrossed', '119+10', '119e']]}), hero(300, {mv: [['119', '119+40', 800]]})],
		animals: [{an: 'shepherd', x: 1050, pose: 'sit', face: -1}],
		fx: [{k: 'accent', t: '119+6', t1: '119e', text: 'POLICE K9 DEMO'}],
		subj: [['119', 'sgt'], ['119+40', 'hero']],
	}),
	scene({
		at: '120', loc: 'city',
		cast: [hero(760, {face: 1, ex: [['wide', '120', '120e']]}), ppl('sgt', 1450, {face: -1})],
		animals: [{an: 'shepherd', x: 1100, face: -1, pose: 'sit', talk: [['121', '124e']], say: [['121', '121e', 'I like that guy.'], ['122', '122e', 'I like that guy.'], ['123', '123e', 'I like him.'], ['124', '124e', 'Is he my guy?']], wag: 3, tilt: [['121', '124e', 12]]}],
		props: [{k: 'heart', x: 1100, y: 470, t0: '123', s: 0.7}],
		subj: [['120', 'hero'], ['121', 'shepherd'], ['124', 'shepherd']],
	}),
	scene({
		at: '125', loc: 'city',
		cast: [ppl('sgt', 1380, {face: -1, acts: [['point', '125+4', '125+40'], ['shrug', '125+44', '125e']]}), hero(800, {face: 1, acts: [['presentF', '126', '127e']]})],
		animals: [{an: 'shepherd', x: 1080, pose: 'sit', face: -1, wag: 3, hop: [['127', '127+40']]}],
		props: [{k: 'heart', x: 1090, y: 480, t0: '127+6', s: 0.8}],
		fx: [{k: 'sparkle', t: '127+10', at: 'hero'}],
		subj: [['125', 'sgt'], ['126', 'hero'], ['127', 'shepherd']],
	}),
];
