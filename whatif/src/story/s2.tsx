import React from 'react';
import {scene} from './dsl';
import {hero, ppl, Wind, Arrow, Tag, Stat} from './helpers';

const crowRow = (n: number, x0: number, dx: number, y: number, t0: string, off = 0) =>
	Array.from({length: n}).map((_, i) => ({an: 'crow' as const, id: 'c' + i, x: x0 + i * dx, y, s: 0.9, face: (i % 2 ? -1 : 1) as 1 | -1, hide: [0, `${t0}+${off + i * 5}`] as [number, string], hop: [[`${t0}+${off + i * 5}`, `${t0}+${off + i * 5 + 14}`]] as [string, string][], flap: [[`${t0}+${off + i * 5}`, `${t0}+${off + i * 5 + 10}`]] as [string, string][]}));

/* 020–064: the power, the rules, home, school, the building */
export const S2 = [
	scene({
		at: '020', loc: 'courtyard', whip: true,
		cast: [hero(960, {acts: [['handsOnHead', '020+6', '020+50'], ['cheer', '020+56', '020e']]})],
		fx: [{k: 'bulb', t: '020+6', at: 'hero'}, {k: 'sparkle', t: '020+10', at: 'hero'}, {k: 'accent', t: '020+20', t1: '020e', text: 'YOU UNDERSTAND EVERY ANIMAL'}, {k: 'flash', t: '020+4', c: '#fff6c0'}],
		subj: [['020', 'hero']],
	}),
	scene({
		at: '021', loc: 'park',
		cast: [hero(900, {face: 1, acts: [['presentF', '021+4', '021e']]})],
		animals: [
			{an: 'retriever', x: 1250, hide: [0, '021+14'], hop: [['021+14', '021+30']], talk: [['021+14', '021+30']], say: [['021+16', '021+44', 'Woof!']]},
			{an: 'cat', x: 1500, hide: [0, '021+34'], hop: [['021+34', '021+46']], say: [['021+36', '021+62', 'Meow.']]},
			{an: 'canary', x: 1700, hide: [0, '021+54'], flap: [['021+54', '021+70']], say: [['021+56', '021+80', 'Tweet!']]},
			{an: 'pigeon', x: 1380, y: 700, hide: [0, '021+70'], flap: [['021+70', '021+82']], say: [['021+72', '021+96', 'Coo!']]},
			{an: 'raccoon', x: 1000, hide: [0, '021+86'], hop: [['021+86', '021+100']], say: [['021+88', '021e', 'Trash!']], face: -1},
		],
		fx: [{k: 'sparkle', t: '021+14', at: [1250, 760]}, {k: 'sparkle', t: '021+34', at: [1500, 780]}, {k: 'sparkle', t: '021+54', at: [1700, 780]}, {k: 'sparkle', t: '021+86', at: [1000, 780]}],
		subj: [['021', 'hero'], ['021+14', 'retriever'], ['021+36', 'cat'], ['021+56', 'canary'], ['021+88', 'raccoon']],
	}),
	scene({
		at: '022', loc: 'alley', whip: true,
		cast: [hero(1330, {face: -1, acts: [['scratch', '022+30', '022+70']]})],
		animals: [{an: 'shepherd', x: 600, pose: 'sit', face: 1, talk: [['022+50', '022e']], say: [['022+52', '022e', 'Someone is HERE!']]}],
		fx: [{k: 'accent', t: '022+4', t1: '022+60', text: '3:00 AM', sub: 'why dogs bark at night'}, {k: 'exclaim', t: '022+70', at: 'hero'}],
		subj: [['022', 'shepherd'], ['022+60', 'hero']],
	}),
	scene({
		at: '023', loc: 'city', whip: true,
		cast: [hero(300, {mv: [['023', '023e', 1500]]})],
		animals: [
			{an: 'beagle', x: 100, mv: [['023+10', '023e', 1300]], wag: 2}, {an: 'cat', x: -100, mv: [['023+20', '023e', 1120]]}, {an: 'bulldog', x: -250, mv: [['023+30', '023e', 980]]},
			{an: 'pigeon', x: -200, y: 620, mv: [['023+30', '023e', 800]], flap: [['023', '023e']]}, {an: 'retriever', x: -420, mv: [['023+40', '023e', 700]]}, {an: 'greyhound', x: -600, mv: [['023+50', '023e', 540]]},
		],
		fx: [{k: 'accent', t: '023+10', t1: '023e', text: 'EVERY PET IN THE CITY'}],
		subj: [['023', 'hero']],
		cam: [['023', 600, 1.15, 640], ['023+50', 1000, 1.25, 640], ['023e', 1300, 1.2, 640]],
	}),
	scene({
		at: '024', loc: 'roofNight',
		cast: [hero(800, {acts: [['wave', '024+10', '024+40'], ['presentF', '024+50', '024e']]})],
		animals: [
			...[0, 1, 2, 3].map((i) => ({an: 'pigeon' as const, id: 'pg' + i, x: 1100 + i * 110, face: -1 as const, hide: [0, `024+${8 + i * 8}`] as [number, string], flap: [[`024+${8 + i * 8}`, `024+${20 + i * 8}`]] as [string, string][]})),
			{an: 'cat', x: 1560, face: -1, hide: [0, '024+20']}, {an: 'raccoon', x: 1700, face: -1, hide: [0, '024+34']}, {an: 'gull', x: 1000, y: 880, face: -1, hide: [0, '024+44']},
		],
		fx: [{k: 'accent', t: '024+14', t1: '024e', text: 'EVERYTHING THE ANIMALS KNOW'}, {k: 'sparkle', t: '024+30', at: 'hero'}],
		subj: [['024', 'hero'], ['024+40', 'cat']],
	}),
	scene({
		at: '025', loc: 'nightStreet', whip: true,
		cast: [hero(900, {face: 1, acts: [['think', '025+4', '027e']], look: [0.3, -0.7]})],
		fx: [{k: 'snow', t: 0, t1: '027e'}, {k: 'accent', t: '025+10', t1: '027e', text: 'ONE WINTER NIGHT...', sub: 'you will hear something the whole building should have heard first', y: 840}, {k: 'pulse', t: '026', t1: '027e', c: '60,80,200'}],
		subj: [['025', 'hero']],
		cam: [['025', 900, 1.1, 640], ['026+20', 900, 1.6, 600], ['027e', 880, 2.2, 580]],
	}),
	scene({
		at: '028', loc: 'kitchen', whip: true,
		cast: [hero(1100, {face: -1, acts: [['shrug', '028+30', '028e'], ['facepalm', '029+30', '029e']], ex: [['worried', '029+10', '029e']]})],
		animals: [{an: 'beagle', x: 600, pose: 'sit', talk: [['029+8', '029+50']], say: [['029+8', '029e', 'Those socks. Hmm.']], tilt: [['028+30', '029e', -8]]}],
		props: [{k: 'heart', x: 640, y: 560, t0: '028+4', t1: '028+30', s: 0.6, c: '#ff4a6a'}],
		fx: [{k: 'accent', t: '028+6', t1: '028+50', text: 'ONE DOG', sub: 'strong opinions'}],
		subj: [['028', 'beagle'], ['029+10', 'hero']],
	}),
	scene({
		at: '030', loc: 'park', whip: true,
		cast: [hero(800, {acts: [['think', '030+4', '030+60'], ['presentF', '031', '031e']]})],
		animals: [{an: 'retriever', x: 1250, pose: 'sit', face: -1, tilt: [['030', '030+60', 12]]}, {an: 'cat', x: 1560, face: -1}],
		fx: [{k: 'question', t: '030+10', at: 'hero'}, {k: 'accent', t: '031+4', t1: '031e', text: "YOU DON'T HAVE TO GUESS", sub: 'but there are limits'}],
		subj: [['030', 'hero'], ['031', 'retriever']],
	}),
	scene({
		at: '032', loc: 'park',
		cast: [hero(740, {acts: [['presentF', '032', '033e']]})],
		animals: [{an: 'beagle', x: 1250, pose: 'sit', face: -1, tilt: [['033', '033e', -14]]}],
		extra: (c) => (
			<g>
				<Tag f={c.f} t0={c.tf('032+10')} t1={c.tf('034')} x={1250} y={470} text="WHAT THEY SMELL" c="#8be88b" size={42} />
				<Tag f={c.f} t0={c.tf('033')} t1={c.tf('034')} x={1520} y={600} text="WHAT THEY HEAR" c="#7ac8ff" size={42} />
				<Tag f={c.f} t0={c.tf('033+40')} t1={c.tf('034')} x={1000} y={390} text="WHAT THEY SEE" c="#ffd84a" size={42} />
			</g>
		),
		subj: [['032', 'hero'], ['033', 'beagle']],
	}),
	scene({
		at: '034', loc: 'infoRed',
		cast: [hero(700, {ex: [['sad', '034+8', '034e']], acts: [['shrug', '034+8', '034+50']]})],
		extra: (c) => (
			<g>
				<Tag f={c.f} t0={c.tf('034+4')} t1={c.tf('034e')} x={1320} y={450} text="PREDICT" c="#fff" size={80} />
				<path d="M1060,500 L1580,400 M1060,400 L1580,500" stroke="#ff3a4a" strokeWidth={16} strokeLinecap="round" opacity={c.f > c.tf('034+14') ? 1 : 0} />
			</g>
		),
		animals: [{an: 'beagle', x: 1300, y: 900, pose: 'sit', face: -1, tilt: [['034', '034e', -12]]}],
		fx: [{k: 'impact', t: '034+14', at: [1300, 300], text: 'NO!', s: 0.6}],
		subj: [['034', 'hero']],
	}),
	scene({
		at: '035', loc: 'kitchen', whip: true,
		cast: [hero(560, {face: 1, acts: [['scratch', '035+10', '035+40']]})],
		animals: [{an: 'cat', x: 1100, pose: 'sit', face: -1, talk: [['035+8', '035+50']], say: [['035+8', '035+44', "I didn't do it."]]}],
		extra: (c) => (
			<g>
				{Array.from({length: 16}).map((_, i) => (
					<circle key={i} cx={1300 + ((c.f * 3 + i * 50) % 700)} cy={892 + Math.sin(i * 2 + c.f / 4) * 3} r={5} fill="#2b2a36" />
				))}
				<Tag f={c.f} t0={c.tf('035+34')} t1={c.tf('036e')} x={1600} y={720} text="we-we-we-we..." c="#e8d6c0" size={30} />
				<Tag f={c.f} t0={c.tf('036+10')} t1={c.tf('036e')} x={1380} y={800} text="and—" c="#e8d6c0" size={30} />
			</g>
		),
		fx: [{k: 'accent', t: '036+6', t1: '036e', text: 'NOBODY FINISHES A SENTENCE'}],
		subj: [['035', 'cat'], ['036', 'hero']],
	}),
	scene({
		at: '037', loc: 'infoGreen', whip: true,
		cast: [],
		animals: [{an: 'beagle', x: 500, y: 900, s: 1.7, pose: 'sit', face: 1, tilt: [['037', '037e', -8]]}],
		extra: (c) => {
			const k = Math.min(1, Math.max(0, (c.f - c.tf('037+6')) / 60));
			const k2 = Math.min(1, Math.max(0, (c.f - c.tf('038')) / 20));
			return (
				<g>
					<g transform="translate(900,0)">
						{Array.from({length: 150}).map((_, i) => {
							const on = i / 150 < k;
							return <circle key={i} cx={(i % 15) * 28} cy={330 + Math.floor(i / 15) * 28} r={9} fill={on ? '#8be88b' : '#1f3a30'} />;
						})}
					</g>
					<Stat f={c.f} t0={c.tf('037+30')} t1={c.tf('038')} x={1120} y={650} big="300,000,000" label="SCENT RECEPTORS (DOG)" c="#8be88b" s={1.0} />
					<Stat f={c.f} t0={c.tf('038')} t1={c.tf('038e')} x={1120} y={650} big="6,000,000" label="SCENT RECEPTORS (HUMAN)" c="#ff9a6a" s={k2 > 0 ? 1.0 : 0} />
				</g>
			);
		},
		fx: [{k: 'shock', t: '037+50'}],
		subj: [['037', 'beagle']],
		cam: [['037', 700, 1.1, 560], ['037e', 1000, 1.2, 560]],
	}),
	scene({
		at: '039', loc: 'vet', whip: true,
		cast: [ppl('vet', 1250, {face: -1, acts: [['presentF', '039+10', '039+50']]})],
		animals: [{an: 'shepherd', x: 800, face: 1, pose: 'stand', tilt: [['039+20', '039+90', 14]]}],
		props: [{k: 'mug', x: 1000, y: 800, c: '#8be8ff', t0: '039+10', s: 1.3}],
		fx: [{k: 'sparkle', t: '039+60', at: [900, 650]}, {k: 'accent', t: '039+30', t1: '039e', text: 'DOGS SNIFF OUT SOME DISEASES', sub: 'in studies'}],
		subj: [['039', 'shepherd'], ['039+60', 'vet']],
	}),
	scene({
		at: '040', loc: 'park', whip: true,
		cast: [hero(900, {acts: [['think', '040+4', '040+50'], ['scratch', '041+10', '041+50']], ex: [['worried', '041', '041e']]})],
		animals: [{an: 'retriever', x: 1300, face: -1, say: [['040+10', '040+55', 'I know things.']]}, {an: 'crow', x: 550, y: 620, face: 1, say: [['041+10', '041+60', 'Trust me.']]}],
		fx: [{k: 'question', t: '041+20', at: 'hero'}, {k: 'accent', t: '041+4', t1: '041e', text: 'THINGS YOU CAN\'T CHECK'}],
		subj: [['040', 'retriever'], ['041', 'hero']],
	}),
	scene({
		at: '042', loc: 'kitchen', whip: true,
		cast: [hero(300, {mv: [['042', '042+34', 880]]})],
		animals: [{an: 'beagle', x: 1250, pose: 'lie', face: -1, say: [['043+30', '043e', 'zzz']]}],
		fx: [{k: 'accent', t: '042+8', t1: '042e', text: 'YOU START AT HOME'}],
		subj: [['042', 'hero'], ['043', 'beagle']],
	}),
	scene({
		at: '044', loc: 'kitchen',
		cast: [hero(980, {face: 1, acts: [['presentF', '045', '045+50']]})],
		animals: [{an: 'beagle', x: 1250, pose: 'lie', face: -1}],
		fx: [{k: 'accent', t: '044+6', t1: '045e', text: '3 DAYS → HIS WHOLE VOCABULARY'}],
		subj: [['044', 'beagle'], ['045', 'hero']],
	}),
	scene({
		at: '046', loc: 'kitchen',
		cast: [hero(740, {face: 1, acts: [['point', '046+8', '046+30'], ['presentF', '046+40', '046e']]})],
		animals: [{an: 'beagle', x: 1250, pose: 'sit', face: -1, tilt: [['046', '046e', 10]]}],
		props: [{k: 'bowl', x: 1000, y: 900, t0: '046+8', s: 1}, {k: 'ball', x: 1560, y: 900, t0: '046+32', s: 1.2}],
		extra: (c) => (
			<g>
				{['FOOD', 'DOOR', 'BALL', 'SQUIRREL', 'NO', 'YOU'].map((w, i) => (
					<Tag key={w} f={c.f} t0={c.tf(`046+${4 + i * 15}`)} t1={c.tf('046e')} x={1230} y={300 + (i % 3) * 80 - (i > 2 ? 0 : 0) + (i > 2 ? 0 : 0)} text={w} c={['#ffd84a', '#8be88b', '#7ac8ff', '#ff9a6a', '#ff6a8a', '#c8a8ff'][i]} size={44} />
				))}
			</g>
		),
		subj: [['046', 'beagle']],
	}),
	scene({
		at: '047', loc: 'kitchen',
		cast: [hero(860, {face: 1, acts: [['crouch', '047+8', '049e']]})],
		animals: [{an: 'beagle', x: 1180, pose: 'sit', face: -1, tilt: [['047+30', '047e', 22]], talk: [['048', '048e']], say: [['048', '048e', 'Food.']]}],
		fx: [{k: 'sparkle', t: '047+40', at: [1180, 700]}],
		subj: [['047', 'hero'], ['048', 'beagle']],
	}),
	scene({
		at: '049', loc: 'kitchen',
		cast: [hero(860, {face: 1, acts: [['crouch', '049', '051e']], ex: [['worried', '050', '050e']]})],
		animals: [{an: 'beagle', x: 1180, pose: 'sit', face: -1, wag: 2.5, talk: [['049+4', '049e']], say: [['049+6', '049e', 'Food, food, food, door, food, YOU.']], hop: [['049+50', '049+66']]}],
		fx: [{k: 'question', t: '050+4', at: 'hero'}],
		props: [{k: 'bowl', x: 1000, y: 900, s: 1}],
		subj: [['049', 'beagle'], ['050', 'hero'], ['051', 'beagle']],
	}),
	scene({
		at: '051', loc: 'kitchen',
		cast: [hero(860, {face: 1, acts: [['crouch', '051', '052e'], ['hug', '052+6', '052e']], ex: [['happy', '052', '052e']]})],
		animals: [{an: 'beagle', x: 1180, pose: 'sit', face: -1, wag: 3, talk: [['051+2', '051+38']], say: [['051+4', '051+38', 'Food. You. Food.']]}],
		props: [{k: 'heart', x: 1020, y: 520, t0: '052+4', s: 0.9}, {k: 'heart', x: 1100, y: 470, t0: '052+20', s: 0.6, c: '#ff8aa0'}],
		fx: [{k: 'accent', t: '052+4', t1: '052e', text: 'THE NICEST THING ANYONE SAID ALL WEEK'}, {k: 'sparkle', t: '052+10', at: 'hero'}],
		subj: [['051', 'beagle'], ['052', 'hero']],
	}),
	scene({
		at: '053', loc: 'classroom', whip: true,
		cast: [hero(600, {acts: [['shrug', '053+6', '053+30']]}), ppl('dex', 1100, {face: -1, seat: 790, acts: [['sit', 0, 9999]]})],
		animals: [{an: 'crow', x: 1560, y: 330, ym: [['054', '054+34', 520]], mv: [['054', '054+34', 1560]], hide: [0, '053+34'], flap: [['053+34', '054+30']], face: -1}],
		fx: [{k: 'exclaim', t: '054+34', at: 'hero'}],
		subj: [['053', 'hero'], ['054', 'crow']],
	}),
	scene({
		at: '055', loc: 'classroom',
		cast: [ppl('dex', 760, {face: 1, seat: 790}), hero(300, {face: 1})],
		animals: [{an: 'crow', x: 1500, y: 530, face: -1, talk: [['055+40', '056+40']], say: [['055+44', '056+20', '@#$%!'], ['056+22', '056e', 'DEX!']], hop: [['056+22', '056+40']]}],
		fx: [{k: 'impact', t: '056+22', at: [1500, 300], text: 'DEX!', s: 0.5, c: '#ff5a5a'}],
		subj: [['055', 'crow'], ['056', 'dex']],
	}),
	scene({
		at: '057', loc: 'park', whip: true,
		cast: [ppl('dex', 400, {s: 1, face: 1, acts: [['point', '057+6', '057+26']], mv: [['057', '057+14', 500]]})],
		animals: [{an: 'crow', x: 1300, y: 420, face: -1, sad: ['057+30', '057e']}],
		props: [{k: 'ball', x: 520, y: 640, t0: '057+14', t1: '057+40', mv: [['057+14', '057+34', 1280, 430]], s: 0.7, spin: 14}, {k: 'twigs', x: 1300, y: 440, s: 1}],
		fx: [{k: 'accent', t: '057+4', t1: '057e', text: '3 YEARS AGO'}, {k: 'impact', t: '057+34', at: [1300, 330], text: 'CRACK!', s: 0.5}],
		subj: [['057', 'dex'], ['057+30', 'crow']],
	}),
	scene({
		at: '058', loc: 'infoDay', whip: true,
		cast: [],
		animals: [{an: 'crow', x: 560, y: 900, s: 1.8, face: 1, tilt: [['058', '059e', 8]]}],
		props: [{k: 'frame', x: 1120, y: 620, s: 1.8, t0: '058+20'}, {k: 'frame', x: 1420, y: 700, s: 1.2, c: '#e8b8c8', t0: '058+50'}, {k: 'frame', x: 1700, y: 600, s: 1.2, c: '#c8e8b8', t0: '058+70'}],
		fx: [{k: 'accent', t: '058+30', t1: '059e', text: 'CROWS REMEMBER HUMAN FACES — FOR YEARS', y: 860}, {k: 'sparkle', t: '058+60', at: [1120, 440]}],
		subj: [['058', 'crow']],
	}),
	scene({
		at: '060', loc: 'roof', whip: true,
		cast: [],
		animals: [{an: 'crow', id: 'wilma', x: 700, y: 760, s: 1.6, face: 1, talk: [['060', '061+50']], say: [['060+8', '061+10', 'DEX did it!']]}, ...crowRow(7, 1000, 120, 790, '060', 20)],
		fx: [{k: 'accent', t: '061+10', t1: '061e', text: 'WILMA TOLD 40 CROWS'}],
		subj: [['060', 'wilma']],
	}),
	scene({
		at: '062', loc: 'city', whip: true,
		cast: [ppl('dex', 500, {mv: [['062+10', '063+90', 2100, 'run']]}), hero(1300, {face: -1, acts: [['laugh', '063+20', '064e']]})],
		animals: [
			...[0, 1, 2, 3, 4, 5].map((i) => ({an: 'crow' as const, id: 'bc' + i, x: -200 + i * 180, y: 420 + (i % 3) * 90, face: 1 as const, mv: [[`062+${10 + i * 6}`, '063+100', 2300 + i * 90]] as any, flap: [[0, '064e']] as [number, string][]})),
		],
		fx: [{k: 'accent', t: '062+10', t1: '063', text: '3:15 — THE BUS STOP IS SURROUNDED'}, {k: 'speed', t: '063+10', t1: '063+60', at: 'dex'}],
		subj: [['062', 'dex'], ['063+40', 'hero']],
		cam: [['062', 800, 1.1, 640], ['063', 1100, 1.3, 600], ['063+60', 1500, 1.3, 620], ['064e', 1300, 1.8, 600]],
	}),
];
