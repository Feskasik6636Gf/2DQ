import React from 'react';
import {scene} from './dsl';
import {hero, ppl, Wind, Arrow, Tag, Stat} from './helpers';

/* 263–349: rescue, repair, the question */
export const S6 = [
	scene({
		at: '263', loc: 'hallNight',
		cast: [ppl('peterson', 1000, {face: -1, acts: [['crouch', '263', '263e'], ['stop', '264', '264e']]}), hero(500, {face: 1, acts: [['presentF', '264', '264e']]})],
		animals: [{an: 'bulldog', x: 1250, pose: 'lie', face: -1, sad: [0, 9999]}],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('263+4')} t1={c.tf('263e')} x={1000} y={260} text="I know." c="#fff" size={40} /><Tag f={c.f} t0={c.tf('264')} t1={c.tf('264e')} x={500} y={260} text="Get out. Please." c="#ffd84a" size={40} /></g>,
		subj: [['263', 'peterson'], ['264', 'hero']],
	}),
	scene({
		at: '265', loc: 'hallNight',
		cast: [ppl('peterson', 1000, {face: -1, ex: [['wide', '266', '266e']]}), hero(500, {face: 1})],
		animals: [{an: 'bulldog', x: 1250, pose: 'lie', face: -1}],
		props: [{k: 'cushion', x: 1000, y: 480, s: 0.9, t0: '266', t1: '266e', c: '#3a7bf0'}],
		fx: [{k: 'accent', t: '265+4', t1: '265e', text: 'HE DOESN\'T ASK FOR PROOF'}, {k: 'bulb', t: '266+10', at: 'peterson'}],
		subj: [['265', 'peterson'], ['266', 'peterson']],
		cam: [['265', 800, 1.2, 620], ['266e', 1000, 2.0, 580]],
	}),
	scene({
		at: '267', loc: 'hallNight',
		cast: [ppl('peterson', 1000, {face: 1, mv: [['268+4', '270e', 1700]], acts: [['carry', '267', '270e'], ['fist', '268+14', '268+26']]}), hero(500, {face: 1})],
		animals: [{an: 'bulldog', x: 1250, pose: 'lie', face: 1, mv: [['267', '267+30', 1030], ['268+4', '270e', 1730]], ym: [['267', '267+30', 760], ['268+4', '268+5', 760]]}],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('269')} t1={c.tf('269e')} x={1500} y={260} text="He found my steak!" c="#fff" size={40} /><Tag f={c.f} t0={c.tf('270')} t1={c.tf('270e')} x={1500} y={260} text="If he says something's wrong, something's wrong!" c="#ffd84a" size={30} /></g>,
		fx: [{k: 'impact', t: '268+20', at: [1350, 380], text: 'BANG', s: 0.5}, {k: 'impact', t: '269+14', at: [1550, 380], text: 'BANG', s: 0.5}, {k: 'shake', t: '268+20'}],
		subj: [['267', 'peterson'], ['269', 'peterson']],
		cam: [['267', 1100, 1.3, 620], ['268+4', 1400, 1.4, 620], ['270e', 1700, 1.5, 620]],
	}),
	scene({
		at: '271', loc: 'hallOpen',
		cast: [ppl('chen', 1400, {face: -1, mv: [['271', '271+30', 1100]]}), ppl('lindquist', 1500, {face: -1, mv: [['272', '272+40', 800]], hold: [['cage', '273', '274', {s: 0.8}]]}), ppl('marisol', 2000, {face: -1, mv: [['274', '274+40', 500]]}), hero(300, {face: 1})],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('271+20')} t1={c.tf('272')} x={1100} y={260} text="MR. CHEN" c="#fff" size={36} /><Tag f={c.f} t0={c.tf('272+20')} t1={c.tf('273e')} x={900} y={260} text="MRS. LINDQUIST + SUNNY" c="#ffd84a" size={36} /><Tag f={c.f} t0={c.tf('274+30')} t1={c.tf('274e')} x={560} y={260} text="MARISOL" c="#ff9a8a" size={36} /></g>,
		fx: [{k: 'accent', t: '271+4', t1: '271e', text: 'ONE BY ONE, THE DOORS OPEN'}],
		subj: [['271', 'chen'], ['272', 'lindquist'], ['274', 'marisol']],
	}),
	scene({
		at: '275', loc: 'hall3', whip: true,
		cast: [hero(1000, {face: 1, acts: [['fist', '275', '275+40'], ['touchFace', '276', '276e']]})],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('277')} t1={c.tf('277e')} x={1480} y={300} text="...sleepy... sleepy..." c="#cfe0ff" size={36} /></g>,
		fx: [{k: 'impact', t: '275+16', at: [1300, 380], text: 'KNOCK', s: 0.5}, {k: 'impact', t: '275+36', at: [1300, 380], text: 'KNOCK', s: 0.5}, {k: 'accent', t: '275+6', t1: '275e', text: 'MRS. LINDQUIST DOESN\'T ANSWER'}],
		subj: [['275', 'hero'], ['277', 'hero']],
		cam: [['275', 1100, 1.2, 620], ['276', 1450, 1.6, 600], ['277e', 1480, 2.0, 520]],
	}),
	scene({
		at: '278', loc: 'hall3',
		cast: [ppl('peterson', 300, {face: 1, mv: [['278', '278+20', 1000, 'run'], ['278+40', '278+56', 1000, 'run']]}), hero(1700, {face: -1})],
		fx: [{k: 'speed', t: '278+4', t1: '278+22', at: 'peterson'}, {k: 'impact', t: '278+22', at: [1300, 400], text: 'WHAM!', s: 0.6}, {k: 'shake', t: '278+22'}, {k: 'impact', t: '278+56', at: [1300, 400], text: 'WHAM!!', s: 0.7}, {k: 'shake', t: '278+56'}, {k: 'accent', t: '279+4', t1: '279e', text: 'THE LOCK GIVES', y: 860}, {k: 'flash', t: '279+2'}],
		subj: [['278', 'peterson'], ['279', 'hero']],
		cam: [['278', 700, 1.2, 640], ['278+40', 1000, 1.5, 640], ['279e', 1200, 1.3, 640]],
	}),
	scene({
		at: '280', loc: 'bedroomNight', whip: true,
		cast: [ppl('lindquist', 1000, {face: 1, seat: 700, acts: [['sit', 0, 9999], ['touchFace', '281', '281e']], ex: [['sleepy', 0, 9999]]}), hero(500, {face: 1, mv: [['280', '280+30', 700]]})],
		props: [{k: 'bed', x: 1000, y: 900, s: 2}],
		fx: [{k: 'accent', t: '280+6', t1: '281e', text: 'DAZED, WITH A HEADACHE SHE THOUGHT WAS THE FLU'}],
		subj: [['280', 'lindquist'], ['281', 'hero']],
	}),
	scene({
		at: '282', loc: 'bedroomNight',
		cast: [hero(1100, {face: 1, acts: [['presentF', '282', '282+30']]})],
		extra: (c) => <g><rect x={760} y={170} width={420} height={330} fill="#bfe8ff" opacity={Math.min(1, (c.f - c.tf('282+10')) / 20) * 0.6} /></g>,
		fx: [{k: 'accent', t: '282+4', t1: '282e', text: 'YOU OPEN THE WINDOWS'}, {k: 'snow', t: '282+10', t1: '283e'}, {k: 'flash', t: '282+10', c: '#dff0ff'}],
		subj: [['282', 'hero']],
	}),
	scene({
		at: '283', loc: 'courtyardNight', whip: true,
		cast: [hero(900, {face: 1, acts: [['presentF', '283+20', '283+60'], ['point', '284', '284e']]})],
		crowd: [{n: 9, x0: -100, x1: 1900, s: 0.8, mode: 'walk', seed: 'out', t: '283'}],
		animals: [{an: 'canary', x: 700, y: 660, s: 1, hide: [0, 0]}],
		extra: (c) => <Stat f={c.f} t0={c.tf('284')} t1={c.tf('284e')} x={960} y={260} big="38" label="YOU COUNT 38 PEOPLE" c="#8be88b" s={0.8} />,
		fx: [{k: 'snow', t: 0, t1: '284e'}, {k: 'accent', t: '283+10', t1: '283e', text: 'OUT INTO THE COLD, ONTO THE GRASS'}],
		subj: [['283', 'hero'], ['284', 'hero']],
	}),
	scene({
		at: '285', loc: 'nightStreet', whip: true,
		cast: [hero(500, {face: 1, acts: [['wave', '285+10', '285e']]})],
		fx: [{k: 'accent', t: '285+4', t1: '285e', text: 'THE FIRE CREW ARRIVES IN 8 MINUTES'}, {k: 'pulse', t: '285', t1: '285e', c: '255,40,60'}],
		subj: [['285', 'hero']],
		cam: [['285', 600, 1.2, 640], ['285e', 1500, 1.3, 640]],
	}),
	scene({
		at: '286', loc: 'basementAlarm', whip: true,
		cast: [ppl('fire', 400, {face: 1, mv: [['286', '286+50', 800]], hold: [['meter', 0, 9999, {s: 0.9}]]})],
		fx: [{k: 'accent', t: '286+6', t1: '287e', text: 'A FIREFIGHTER WALKS INTO THE BASEMENT WITH A GAS METER'}, {k: 'shake', t: '287+10'}],
		subj: [['286', 'fire']],
		cam: [['286', 500, 1.2, 640], ['287e', 900, 1.7, 600]],
	}),
	scene({
		at: '288', loc: 'basementAlarm',
		cast: [ppl('fire', 900, {face: -1, mv: [['288', '288+30', 300, 'run']], hold: [['meter', 0, 9999, {text: '640', s: 0.9}]]})],
		extra: (c) => <Stat f={c.f} t0={c.tf('288+30')} t1={c.tf('288e')} x={1250} y={380} big="640 ppm" label="CARBON MONOXIDE" c="#ff5a5a" s={0.9} />,
		fx: [{k: 'speed', t: '288', t1: '288+30', at: 'fire'}, {k: 'pulse', t: '288+30', t1: '288e', c: '255,40,60'}, {k: 'shake', t: '288+34'}],
		subj: [['288', 'fire']],
	}),
	scene({
		at: '289', loc: 'courtyardNight', whip: true,
		cast: [ppl('robe', 700, {face: 1, seat: 770, acts: [['sit', 0, 9999], ['touchFace', '289+10', '289e']]}), ppl('chen', 1100, {face: 1, seat: 770, acts: [['sit', 0, 9999]]}), hero(1500, {face: -1})],
		fx: [{k: 'snow', t: 0, t1: '293e'}, {k: 'accent', t: '289+6', t1: '289e', text: 'TWO NEIGHBORS CAN BARELY WALK'}],
		subj: [['289', 'robe']],
	}),
	scene({
		at: '290', loc: 'courtyardNight',
		cast: [ppl('kowalski', 1000, {face: -1, seat: 770, acts: [['sit', 0, 9999], ['hug', '290', '293e']], ex: [['sad', 0, '292']]}), hero(500, {face: 1})],
		animals: [{an: 'cat', x: 1000, y: 770, hide: [0, 0], pose: 'sit'}],
		fx: [{k: 'snow', t: 0, t1: '293e'}, {k: 'accent', t: '290+6', t1: '291e', text: 'MRS. KOWALSKI, SHIVERING, HOLDING HER CAT'}],
		subj: [['290', 'kowalski']],
		cam: [['290', 800, 1.3, 680], ['291e', 1000, 1.8, 680]],
	}),
	scene({
		at: '292', loc: 'courtyardNight',
		cast: [ppl('kowalski', 1300, {face: -1, seat: 770, acts: [['sit', 0, 9999]], ex: [['normal', '293', '293e']]}), hero(700, {face: 1, ex: [['wide', '292+10', '293e']]})],
		fx: [{k: 'snow', t: 0, t1: '293e'}, {k: 'accent', t: '293+10', t1: '293e', text: 'FOR THE FIRST TIME IN A MONTH — SHE DOESN\'T LOOK AWAY', y: 860}, {k: 'sparkle', t: '293+20', at: 'kowalski'}],
		subj: [['292', 'kowalski'], ['293', 'hero'], ['293+40', 'kowalski']],
		cam: [['292', 1000, 1.3, 640], ['293', 1000, 1.7, 620], ['293e', 1000, 2.2, 620]],
	}),
	scene({
		at: '294', loc: 'roofSmoke', whip: true,
		cast: [ppl('fire', 700, {face: 1, acts: [['point', '294+10', '294e']]})],
		props: [{k: 'twigs', x: 375, y: 570, s: 1.8, t0: '294+30'}],
		fx: [{k: 'accent', t: '294+6', t1: '295e', text: 'THE CAUSE: TWIGS IN THE CHIMNEY — A PIGEON\'S NEST'}, {k: 'sparkle', t: '294+40', at: [375, 450]}],
		animals: [{an: 'pigeon', x: 560, y: 900, face: -1, hide: [0, '295'], hop: [['295', '295e']]}],
		subj: [['294', 'fire'], ['295', 'pigeon']],
		cam: [['294', 700, 1.1, 640], ['294+40', 400, 1.6, 560], ['295e', 500, 1.5, 640]],
	}),
	scene({
		at: '296', loc: 'courtyardNight',
		cast: [hero(900, {face: 1, acts: [['presentF', '296+20', '296+50']]})],
		animals: [{an: 'pigeon', x: 400, y: 300, s: 1.3, face: 1, hide: [0, '296'], mv: [['296', '296+30', 960]], ym: [['296', '296+30', 700]], flap: [['296', '296+28']], talk: [['297', '297e']], say: [['297+4', '297e', "I didn't know the chimney needed to breathe."]]}],
		fx: [{k: 'snow', t: 0, t1: '297e'}, {k: 'accent', t: '296+6', t1: '296+50', text: 'THE BIRD LANDS ON YOUR SHOULDER, SHAKING'}],
		subj: [['296', 'pigeon'], ['297', 'pigeon']],
	}),
	scene({
		at: '298', loc: 'courtyardNight',
		cast: [hero(700, {face: 1, acts: [['point', '298+10', '298+40'], ['stop', '299', '299+30']]}), ppl('fire', 1300, {face: -1, acts: [['shrug', '299+20', '299e']]})],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('298+14')} t1={c.tf('298e')} x={700} y={300} text='"It felt like the flu."' c="#fff" size={34} /><Tag f={c.f} t0={c.tf('299+20')} t1={c.tf('299e')} x={1000} y={380} text="...who told you?" c="#ffb27a" size={34} /></g>,
		fx: [{k: 'snow', t: 0, t1: '299e'}, {k: 'accent', t: '299+10', t1: '299e', text: "YOU DON'T SAY WHO TOLD YOU"}],
		subj: [['298', 'hero'], ['299', 'fire']],
	}),
	scene({
		at: '300', loc: 'courtyardNight',
		cast: [hero(900, {face: 1, acts: [['cheer', '300+6', '300e']]})],
		crowd: [{n: 8, x0: -100, x1: 1900, s: 0.8, mode: 'dance', seed: 'safe'}],
		fx: [{k: 'snow', t: 0, t1: '300e'}, {k: 'accent', t: '300+4', t1: '300e', text: 'EVERYONE LIVES'}, {k: 'confetti', t: '300+6'}, {k: 'flash', t: '300+2', c: '#fff6c0'}],
		subj: [['300', 'hero']],
	}),
	scene({
		at: '301', loc: 'hall', whip: true,
		cast: [hero(1000, {face: -1, ex: [['wide', '301+20', '303e']]}), ppl('peterson', 400, {face: 1, mv: [['301', '301+30', 700]], hold: [['plate', '301+30', '304e', {s: 1.0}], ['steak', '302', '304e', {s: 0.7}]]})],
		animals: [{an: 'bulldog', x: 520, face: 1, wag: 3, mv: [['301', '301+30', 560]], hop: [['303', '303+30']]}],
		fx: [{k: 'accent', t: '301+6', t1: '301e', text: 'THE NEXT DAY'}, {k: 'sparkle', t: '302+30', at: [700, 640]}],
		subj: [['301', 'peterson'], ['303', 'peterson']],
	}),
	scene({
		at: '304', loc: 'hall',
		cast: [hero(1000, {face: -1, acts: [['wave', '304+20', '304e']]}), ppl('peterson', 700, {face: 1, acts: [['presentF', '304', '304e']]})],
		props: [{k: 'plate', x: 840, y: 630, s: 1.0}, {k: 'steak', x: 830, y: 610, s: 0.8}],
		extra: (c) => <Tag f={c.f} t0={c.tf('304+4')} t1={c.tf('304e')} x={700} y={260} text="I owe you a hundred of these." c="#ffd84a" size={34} />,
		fx: [{k: 'sparkle', t: '304+20', at: 'hero'}],
		subj: [['304', 'peterson']],
	}),
	scene({
		at: '305', loc: 'courtyard', whip: true,
		cast: [hero(1500, {face: -1}), ppl('marisol', -200, {face: 1, mv: [['305', '306+40', 1000]]})],
		animals: [0, 1, 2, 3, 4].map((i) => ({an: (['beagle', 'bulldog', 'retriever', 'spaniel', 'greyhound'] as const)[i], id: 'dg' + i, x: -450 - i * 150, face: 1 as const, mv: [['305', '306+40', 700 - i * 130]] as any, wag: 2})),
		props: [{k: 'leash', x: 880, y: 700, s: 1, t0: '306+10'}],
		fx: [{k: 'accent', t: '305+6', t1: '306e', text: 'MARISOL — WITH ALL FIVE DOGS ON LEASHES'}],
		subj: [['305', 'marisol'], ['306', 'marisol']],
		cam: [['305', 400, 1.2, 640], ['306', 900, 1.2, 640], ['306e', 1100, 1.4, 640]],
	}),
	scene({
		at: '307', loc: 'courtyard',
		cast: [hero(1500, {face: -1, acts: [['wave', '308+10', '308e']]}), ppl('marisol', 1000, {face: 1, acts: [['presentF', '307', '308e']], ex: [['sad', '308', '308e']]})],
		animals: [0, 1, 2].map((i) => ({an: (['beagle', 'bulldog', 'retriever'] as const)[i], id: 'dg' + i, x: 400 + i * 150, face: 1 as const, wag: 2})),
		extra: (c) => <g><Tag f={c.f} t0={c.tf('307+6')} t1={c.tf('307e')} x={1000} y={300} text="I lost the bet. One week of dog walking." c="#fff" size={34} /><Tag f={c.f} t0={c.tf('308+4')} t1={c.tf('308e')} x={1000} y={300} text="I'm sorry I stopped talking to you." c="#ffb27a" size={34} /></g>,
		subj: [['307', 'marisol'], ['308', 'marisol'], ['309', 'hero']],
	}),
	scene({
		at: '309', loc: 'courtyard',
		cast: [hero(1450, {face: -1, acts: [['presentF', '309', '309e']]}), ppl('marisol', 1000, {face: 1, ex: [['happy', '310+10', '310e']], acts: [['presentF', '310', '310e']]})],
		animals: [0, 1].map((i) => ({an: (['beagle', 'retriever'] as const)[i], id: 'dg' + i, x: 450 + i * 150, face: 1 as const, wag: 3, hop: [['310+20', '310+40']] as [string, string][]})),
		extra: (c) => <g><Tag f={c.f} t0={c.tf('309')} t1={c.tf('309e')} x={1450} y={300} text="It's okay." c="#fff" size={40} /><Tag f={c.f} t0={c.tf('310')} t1={c.tf('310e')} x={1000} y={300} text="It's not. But I'm here." c="#ffd84a" size={40} /></g>,
		props: [{k: 'heart', x: 1220, y: 440, t0: '310+30', s: 0.8}],
		fx: [{k: 'sparkle', t: '310+30', at: [1220, 560]}],
		subj: [['309', 'hero'], ['310', 'marisol']],
	}),
	scene({
		at: '311', loc: 'courtyard',
		cast: [hero(700, {face: 1}), ppl('chen', 1700, {face: -1, hide: [0, 0]})],
		animals: [{an: 'greyhound', x: 1900, s: 1.1, face: -1, mv: [['311', '312+20', 1100]]}],
		fx: [{k: 'accent', t: '311+10', t1: '312e', text: "MR. CHEN'S OLD GREYHOUND — MABEL", sub: 'that evening'}],
		subj: [['311', 'greyhound'], ['312', 'hero']],
	}),
	scene({
		at: '313', loc: 'courtyard',
		cast: [hero(700, {face: 1, acts: [['crouch', '313', '314e']]})],
		animals: [{an: 'greyhound', x: 1100, s: 1.1, face: -1, talk: [['315', '315e']], say: [['315+4', '316e', "You're the one with the ears."]], tilt: [['313', '314e', -8]]}],
		fx: [{k: 'accent', t: '313+6', t1: '314e', text: 'SHE\'S 16. SHE\'S SLOW.'}],
		subj: [['313', 'greyhound'], ['315', 'greyhound']],
	}),
	scene({
		at: '316', loc: 'courtyard',
		cast: [hero(700, {face: 1, ex: [['sad', '316', '319e']], acts: [['touchFace', '317', '317e'], ['shrug', '318', '318e']]})],
		animals: [{an: 'greyhound', x: 1100, s: 1.1, face: -1, talk: [['316', '319e']], say: [['316+4', '316e', 'The little one is sad.'], ['318+4', '319e', 'He said "dinner." You think it\'s an insult.']]}],
		subj: [['316', 'greyhound'], ['317', 'hero'], ['318', 'greyhound']],
	}),
	scene({
		at: '320', loc: 'courtyard',
		cast: [hero(700, {face: 1, acts: [['think', '321', '323e']]})],
		animals: [{an: 'greyhound', x: 1100, s: 1.1, face: -1, pose: 'sit', poses: [['lie', '320', '324']], talk: [['320', '323e']]}],
		extra: (c) => (
			<g>
				<Tag f={c.f} t0={c.tf('321')} t1={c.tf('323e')} x={1100} y={380} text="DOG: love = dinner" c="#ffd84a" size={44} />
				<Tag f={c.f} t0={c.tf('322')} t1={c.tf('323e')} x={1100} y={470} text="you feed → you love" c="#8be88b" size={40} />
				<Tag f={c.f} t0={c.tf('323')} t1={c.tf('323e')} x={1100} y={560} text="they feed you → you're theirs" c="#ff9aa8" size={40} />
			</g>
		),
		subj: [['320', 'greyhound'], ['321', 'hero'], ['323', 'greyhound']],
	}),
	scene({
		at: '324', loc: 'infoGreen', whip: true,
		extra: (c) => {
			const k = Math.min(1, Math.max(0, (c.f - c.tf('325+30')) / 50));
			const k2 = Math.min(1, Math.max(0, (c.f - c.tf('326+30')) / 50));
			return (
				<g>
					<path d="M300,620 C260,380 520,260 760,300 C1000,260 1180,420 1100,620 C1060,740 760,760 680,720 C540,740 340,720 300,620 Z" fill="#e8b8c8" stroke="#1d1626" strokeWidth={8} />
					<circle cx={720} cy={500} r={80 + 20 * Math.sin(c.f / 8) * (k2 > 0 ? 1 : 0.3)} fill="#ff5a3a" opacity={0.3 + 0.6 * Math.max(k, k2)} />
					<rect x={1260} y={760 - 360 * k2} width={200} height={360 * k2} fill="#ff9a3a" stroke="#1d1626" strokeWidth={5} />
					<rect x={1520} y={760 - 150 * k} width={200} height={150 * k} fill="#6a7a9a" stroke="#1d1626" strokeWidth={5} />
					<text x={1360} y={820} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={32} fill="#fff">OWN PERSON</text>
					<text x={1620} y={820} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={32} fill="#fff">STRANGER</text>
					<Tag f={c.f} t0={c.tf('324+10')} t1={c.tf('324e')} x={900} y={160} text="SCIENCE AGREES" c="#ffd84a" size={60} />
					<Tag f={c.f} t0={c.tf('325+10')} t1={c.tf('327e')} x={720} y={900} text="BRAIN SCAN STUDY: REWARD CENTER" c="#fff" size={34} />
				</g>
			);
		},
		fx: [{k: 'sparkle', t: '326+60', at: [720, 500]}],
		subj: [],
		cam: [['324', 960, 1.0, 540], ['327e', 1000, 1.2, 540]],
	}),
	scene({
		at: '328', loc: 'courtyardNight', whip: true,
		cast: [hero(900, {face: 1, seat: 770, acts: [['sit', 0, 9999], ['think', '328+10', '328e']], ex: [['sad', 0, 9999]]})],
		animals: [{an: 'beagle', x: 1400, face: -1, mv: [['329', '329+30', 1020]], wag: 3, hop: [['329+30', '329+50']]}],
		fx: [{k: 'snow', t: 0, t1: '331e'}, {k: 'accent', t: '328+4', t1: '328e', text: 'YOU SIT ON THE COLD GROUND FOR A LONG TIME'}],
		subj: [['328', 'hero'], ['329', 'beagle']],
	}),
	scene({
		at: '330', loc: 'courtyardNight',
		cast: [hero(900, {face: 1, seat: 770, acts: [['sit', 0, 9999], ['touchFace', '331', '331e']]})],
		animals: [{an: 'beagle', x: 1020, y: 770, face: 1, pose: 'sit', wag: 6, hop: [['330', '330e']]}],
		props: [{k: 'heart', x: 1100, y: 480, t0: '330+30', s: 0.7}],
		fx: [{k: 'snow', t: 0, t1: '331e'}, {k: 'accent', t: '330+6', t1: '330e', text: 'WAGGING WITH HIS WHOLE BACK HALF'}],
		subj: [['330', 'beagle'], ['331', 'hero']],
	}),
	scene({
		at: '332', loc: 'courtyardNight',
		cast: [hero(900, {face: 1, seat: 770, acts: [['sit', 0, 9999], ['presentF', '332', '332+20']]})],
		animals: [{an: 'beagle', x: 1020, y: 770, face: -1, pose: 'sit', wag: 3, talk: [['333', '333e']], say: [['332+4', '332e', 'Hey... do you love me?']], hop: []}],
		extra: (c) => <Tag f={c.f} t0={c.tf('333+4')} t1={c.tf('333e')} x={1100} y={420} text="Dinner." c="#ffd84a" size={54} />,
		fx: [{k: 'snow', t: 0, t1: '337e'}],
		subj: [['332', 'hero'], ['333', 'beagle']],
	}),
	scene({
		at: '334', loc: 'courtyardNight',
		cast: [hero(900, {face: 1, seat: 770, acts: [['sit', 0, 9999], ['hug', '334', '337e'], ['cry', '336', '337e']], ex: [['sad', '334', '337e']]})],
		animals: [{an: 'beagle', x: 1020, y: 770, face: -1, pose: 'sit', wag: 5, talk: [['334', '334+27']], say: [['334+2', '334+27', 'Love you too.']]}],
		props: [{k: 'heart', x: 1040, y: 470, t0: '334+10', s: 0.8, c: '#ff4a6a'}],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('336+4')} t1={c.tf('336e')} x={900} y={380} text="Why are you crying?" c="#fff" size={36} /><Tag f={c.f} t0={c.tf('337+4')} t1={c.tf('337e')} x={1100} y={420} text="In this house, everyone is fed." c="#ffd84a" size={36} /></g>,
		fx: [{k: 'snow', t: 0, t1: '337e'}, {k: 'accent', t: '335+6', t1: '335e', text: 'THUMP · THUMP', y: 860}],
		subj: [['334', 'beagle'], ['336', 'hero'], ['337', 'beagle']],
		cam: [['334', 980, 1.5, 640], ['336', 940, 2.0, 640], ['337e', 1000, 1.7, 640]],
	}),
	scene({
		at: '338', loc: 'courtyard', whip: true,
		cast: [hero(960, {face: 1, ex: [['wide', '338+30', '343e']], acts: [['scare', '338+40', '339e'], ['handsOnHead', '340', '341e']]})],
		animals: [
			...Array.from({length: 8}).map((_, i) => ({an: 'pigeon' as const, id: 'wp' + i, x: 120 + i * 230, y: 560, face: (i < 4 ? 1 : -1) as 1 | -1, s: 1.1, hide: [0, `338+${i * 7}`] as [number, string], flap: [[`338+${i * 7}`, `338+${i * 7 + 14}`]] as [string, string][]})),
			...Array.from({length: 5}).map((_, i) => ({an: 'cat' as const, id: 'wc' + i, x: 200 + i * 330, y: 900, face: (i < 3 ? 1 : -1) as 1 | -1, hide: [0, `339+${i * 8}`] as [number, string]})),
			{an: 'raccoon', x: 1650, face: -1, hide: [0, '340'], say: [['340+10', '341e', 'ahem...']]},
		],
		fx: [{k: 'accent', t: '338+6', t1: '338e', text: 'THE NEXT MORNING: 41 PIGEONS ON THE WINDOWSILL'}, {k: 'accent', t: '339+6', t1: '339e', text: 'A LINE OF CATS ALONG THE FENCE'}, {k: 'accent', t: '340+6', t1: '340e', text: 'A RACCOON WAITING POLITELY'}, {k: 'shake', t: '341'}],
		subj: [['338', 'hero'], ['339', 'wc1'], ['340', 'raccoon'], ['341', 'hero']],
		cam: [['338', 1000, 1.0, 600], ['339', 900, 1.2, 700], ['340', 1500, 1.4, 700], ['341', 960, 1.1, 640]],
	}),
	scene({
		at: '342', loc: 'courtyard',
		cast: [hero(960, {face: 1, ex: [['wide', 0, 9999]], acts: [['scare', '342', '342+30']]})],
		animals: [
			...Array.from({length: 5}).map((_, i) => ({an: 'pigeon' as const, id: 'wp' + i, x: 140 + i * 160, y: 900, face: 1 as const, s: 1.2, talk: [['342', '343e']] as [string, string][]})),
			{an: 'cat', x: 1250, face: -1, talk: [['342', '343e']]}, {an: 'cat', id: 'c2', x: 1420, face: -1, talk: [['342', '343e']]}, {an: 'raccoon', x: 1650, face: -1, talk: [['342', '343e']]},
		],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('342+4')} t1={c.tf('342e')} x={960} y={300} text="The old man in the park stopped coming." c="#ffd84a" size={42} /><Tag f={c.f} t0={c.tf('343+4')} t1={c.tf('343e')} x={960} y={400} text="Please find out why." c="#fff" size={52} /></g>,
		fx: [{k: 'shake', t: '342+6'}, {k: 'question', t: '343+20', at: 'hero'}],
		subj: [['342', 'hero'], ['343', 'wp2']],
		cam: [['342', 960, 1.0, 620], ['343', 960, 1.6, 600], ['343e', 960, 2.2, 600]],
	}),
	scene({
		at: '344', loc: 'info', whip: true,
		cast: [hero(560, {face: 1, acts: [['think', '344', '346e']]})],
		animals: [{an: 'beagle', x: 1360, pose: 'sit', face: -1, tilt: [['345', '346e', 10]]}],
		extra: (c) => (
			<g>
				<Tag f={c.f} t0={c.tf('344+6')} t1={c.tf('346e')} x={960} y={200} text="WOULD YOU TAKE THIS POWER?" c="#ffd84a" size={64} />
				<Tag f={c.f} t0={c.tf('345+10')} t1={c.tf('346e')} x={960} y={330} text="understand every animal" c="#fff" size={44} />
				<Tag f={c.f} t0={c.tf('346+4')} t1={c.tf('346e')} x={960} y={430} text="the one thing you want to hear..." c="#ff9aa8" size={44} />
			</g>
		),
		props: [{k: 'heart', x: 1000, y: 700, t0: '346+10', s: 1.3}],
		subj: [['344', 'hero'], ['345', 'beagle']],
	}),
	scene({
		at: '347', loc: 'courtyardNight', whip: true,
		cast: [hero(800, {face: 1, acts: [['presentF', '347', '348e'], ['shrug', '349', '349e']]})],
		animals: [{an: 'canary', x: 1300, y: 600, s: 1.6, hop: [['348', '349e']], flap: [['349', '349e']]}],
		props: [{k: 'cage', x: 1300, y: 620, s: 1.8}, {k: 'alarm', x: 1700, y: 760, s: 1.6, t0: '348'}],
		fx: [{k: 'snow', t: 0, t1: '349e'}, {k: 'accent', t: '347+4', t1: '347e', text: 'TELL ME IN THE COMMENTS'}, {k: 'accent', t: '348+10', t1: '349e', text: 'WOULD YOU HAVE PULLED THAT ALARM AT 3 A.M.?', sub: 'with nothing but a canary to go on', y: 780}, {k: 'pulse', t: '349', t1: '349e', c: '255,200,60'}],
		subj: [['347', 'hero'], ['348', 'canary'], ['349', 'hero']],
		cam: [['347', 900, 1.1, 640], ['348+20', 1250, 1.5, 620], ['349e', 1300, 2.0, 600]],
	}),
];
