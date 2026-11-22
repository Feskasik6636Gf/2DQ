import React from 'react';
import {scene} from './dsl';
import {hero, ppl, Wind, Arrow, Tag, Stat} from './helpers';

const rings = (x: number, y: number, c: {f: number; tf: (t: any) => number}, t0: string, n = 4, col = '#ffd84a') => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const k = ((c.f - c.tf(t0) + i * 14) % 56) / 56;
			return c.f > c.tf(t0) ? <circle key={i} cx={x} cy={y} r={30 + k * 420} fill="none" stroke={col} strokeWidth={10 * (1 - k)} opacity={1 - k} /> : null;
		})}
	</g>
);

/* 128–194: zoo, celebrity, fallout */
export const S4 = [
	scene({
		at: '128', loc: 'zoo', whip: true,
		cast: [hero(500, {face: 1, mv: [['128', '128+40', 700]], acts: [['presentF', '128+44', '128e']]})],
		animals: [{an: 'elephant', x: 1450, s: 0.85, face: -1, pose: 'stand'}],
		fx: [{k: 'accent', t: '128+6', t1: '128e', text: 'CITY ZOO — AN ELEPHANT'}],
		subj: [['128', 'hero'], ['128+40', 'elephant']],
	}),
	scene({
		at: '129', loc: 'zoo',
		cast: [hero(700, {face: 1, acts: [['touchFace', '130+20', '131e']], ex: [['wide', '131', '131e']]})],
		animals: [{an: 'elephant', x: 1450, s: 0.85, face: -1, talk: [['129', '131e']]}],
		extra: (c) => rings(1300, 620, c, '130', 4, '#9ad8ff'),
		fx: [{k: 'accent', t: '129+6', t1: '129e', text: 'NOT WORDS — RUMBLES'}, {k: 'shake', t: '130+10'}, {k: 'shake', t: '131+4'}],
		subj: [['129', 'elephant'], ['131', 'hero']],
	}),
	scene({
		at: '132', loc: 'infoDay', whip: true,
		extra: (c) => (
			<g>
				<rect x={-200} y={820} width={2400} height={300} fill="#d9c28a" stroke="#1d1626" strokeWidth={4} />
				{rings(300, 780, c, '132', 5, '#ff7a4a')}
				{rings(1620, 780, c, '133+10', 5, '#ff7a4a')}
				<Tag f={c.f} t0={c.tf('133+20')} t1={c.tf('133e')} x={960} y={300} text="ACROSS MILES OF GROUND" c="#ffd84a" size={58} />
			</g>
		),
		animals: [{an: 'elephant', x: 300, y: 900, s: 0.5, face: 1, talk: [['132', '132e']]}, {an: 'elephant', x: 1620, y: 900, s: 0.5, face: -1}],
		subj: [['132', 'elephant']],
		cam: [['132', 300, 1.3, 760], ['133', 960, 1.0, 640], ['133e', 1620, 1.3, 760]],
	}),
	scene({
		at: '134', loc: 'zoo', whip: true,
		cast: [hero(700, {face: 1, acts: [['handsOnHead', '135+10', '135e']], ex: [['sad', '134+30', '135e']]})],
		animals: [{an: 'elephant', x: 1450, s: 0.85, face: -1, sad: [0, 9999], talk: [['134', '135e']], say: [['134+6', '134+70', 'Cold. Hungry.'], ['135+2', '135e', "Where's my sister?"]]}],
		subj: [['134', 'elephant'], ['135+10', 'hero']],
	}),
	scene({
		at: '136', loc: 'zoo',
		cast: [hero(560, {face: 1, acts: [['sad' as any, '136', '136']]})],
		animals: [{an: 'elephant', x: 1450, s: 0.85, face: -1, sad: [0, 9999]}, {an: 'elephant', id: 'sis', x: 2300, s: 0.7, face: -1, mv: [[0, '136+30', 2300]]}],
		fx: [{k: 'accent', t: '136+4', t1: '136e', text: 'HER SISTER WAS MOVED LAST SPRING'}],
		subj: [['136', 'elephant']],
	}),
	scene({
		at: '137', loc: 'city', whip: true,
		cast: [hero(500, {face: 1, acts: [['presentF', '137+10', '137+30']]})],
		props: [{k: 'envelope', x: 640, y: 740, t0: '137+10', mv: [['137+20', '138e', 1700, 300]], s: 1.3, spin: 3}],
		fx: [{k: 'accent', t: '137+4', t1: '137e', text: 'YOU WRITE A LETTER'}, {k: 'sparkle', t: '137+20', at: [640, 700]}],
		subj: [['137', 'hero']],
	}),
	scene({
		at: '138', loc: 'infoWarm',
		extra: (c) => {
			const n = Math.min(90, Math.floor(((c.f - c.tf('138')) / 36) * 90));
			return (
				<g>
					<rect x={560} y={260} width={800} height={560} rx={40} fill="#fff8e0" stroke="#1d1626" strokeWidth={8} />
					<rect x={560} y={260} width={800} height={110} rx={40} fill="#ff4a6a" stroke="#1d1626" strokeWidth={8} />
					<text x={960} y={340} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={64} fill="#fff">THREE MONTHS</text>
					<text x={960} y={700} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={260} fill="#1d1626">{Math.max(1, n)}</text>
					<text x={960} y={780} textAnchor="middle" fontFamily="Rubik" fontWeight={700} fontSize={44} fill="#8a5a4a">days waiting...</text>
				</g>
			);
		},
		fx: [{k: 'shock', t: '138+36'}],
	}),
	scene({
		at: '139', loc: 'zoo', whip: true,
		cast: [hero(560, {face: 1, acts: [['cheer', '139+30', '139e']]})],
		animals: [{an: 'elephant', x: 1250, s: 0.85, face: 1, talk: [['139+20', '139e']], hop: [['139+24', '139+44']]}, {an: 'elephant', id: 'sis', x: 2400, s: 0.7, face: -1, mv: [['139', '139+34', 1650]]}],
		props: [{k: 'heart', x: 1400, y: 400, t0: '139+36', s: 1.2}, {k: 'heart', x: 1520, y: 340, t0: '139+44', s: 0.8, c: '#ff8aa0'}],
		fx: [{k: 'accent', t: '139+4', t1: '139+40', text: 'THEY BRING HER BACK'}, {k: 'sparkle', t: '139+40', at: [1450, 600]}, {k: 'confetti', t: '139+34'}],
		subj: [['139', 'elephant'], ['139+36', 'hero']],
	}),
	scene({
		at: '140', loc: 'vet', whip: true,
		cast: [hero(1000, {face: -1, acts: [['wave', '141', '141+30']]})],
		props: [{k: 'flyer', x: 560, y: 520, s: 2.4, t0: '140+10', text: 'PET TALKER'}],
		crowd: [{n: 4, x0: 1300, x1: 1900, s: 0.8, mode: 'stand', seed: 'v3'}],
		fx: [{k: 'accent', t: '140+10', t1: '140e', text: 'YOUR NAME IS ON A FLYER AT THE VET'}],
		subj: [['140', 'hero']],
	}),
	scene({
		at: '141', loc: 'city',
		cast: [hero(960, {face: 1, ex: [['wide', '141', '142e']], acts: [['scare', '142+10', '142+60']]})],
		crowd: [{n: 6, x0: -100, x1: 700, s: 0.85, mode: 'stand', seed: 'fan1'}, {n: 6, x0: 1200, x1: 2000, s: 0.85, mode: 'stand', seed: 'fan2'}],
		animals: [{an: 'beagle', x: 720, face: 1, say: [['141+8', '141+40', 'Hey!']]}, {an: 'cat', x: 1200, face: -1, say: [['141+30', '141+70', 'Psst!']]}, {an: 'pigeon', x: 560, y: 700, face: 1, say: [['142+4', '142+40', 'Coo!']]}, {an: 'retriever', x: 1450, face: -1, say: [['142+30', '142+70', 'Me next!']]}],
		fx: [{k: 'accent', t: '141+6', t1: '141+70', text: 'A SMALL, WEIRD CELEBRITY'}, {k: 'accent', t: '142+10', t1: '142e', text: 'SO MANY CONVERSATIONS'}],
		subj: [['141', 'hero'], ['141+30', 'cat'], ['142', 'beagle']],
	}),
	scene({
		at: '143', loc: 'kitchenNight', whip: true,
		cast: [hero(900, {face: 1, acts: [['cry', '143+14', '143e']], ex: [['sleepy', '143', '143e']]})],
		animals: [{an: 'beagle', x: 560, say: [['143+8', '143+40', 'Food?']]}, {an: 'cat', x: 1450, face: -1, say: [['143+30', '143e', 'Pet me.']]}],
		fx: [{k: 'accent', t: '143+6', t1: '143e', text: 'IT STOPS BEING CUTE ON A TUESDAY'}],
		subj: [['143', 'hero']],
	}),
	scene({
		at: '144', loc: 'kitchen', whip: true,
		cast: [hero(1500, {face: -1, acts: [['think', '145', '145e']]})],
		animals: [{an: 'cat', x: 560, pose: 'sit', face: 1, say: [['145+6', '145+60', 'I know everything.']]}, {an: 'beagle', x: 1000, face: -1}],
		fx: [{k: 'accent', t: '144+4', t1: '145e', text: 'PETS KNOW THEIR PEOPLE\'S SECRETS'}],
		subj: [['144', 'beagle'], ['145', 'cat']],
	}),
	scene({
		at: '146', loc: 'courtyard', whip: true,
		cast: [ppl('mrsp', 900, {face: 1, hold: [['napkin', 0, 9999, {s: 0.8}]], acts: [['point', '147', '147e']]}), ppl('peterson', 400, {face: 1, ex: [['worried', 0, 9999]]})],
		animals: [{an: 'bulldog', x: 1400, pose: 'sit', face: -1}],
		fx: [{k: 'accent', t: '146+4', t1: '147e', text: 'MRS. PETERSON FOUND THE STEAK'}, {k: 'exclaim', t: '146+20', at: 'peterson'}],
		subj: [['146', 'mrsp'], ['147', 'peterson']],
	}),
	scene({
		at: '148', loc: 'kitchenNight', whip: true,
		cast: [ppl('peterson', 780, {face: 1, mv: [['148', '148+40', 1000]], hold: [['steak', '148+40', '150e', {s: 0.9}]]})],
		animals: [{an: 'bulldog', x: 1500, face: -1, pose: 'sit', tilt: [['150', '150e', 10]], say: [['150+6', '150e', 'I saw everything.']]}],
		props: [{k: 'note', x: 560, y: 620, s: 1.3, t0: '149', text: 'DOCTOR: DIET!'}],
		fx: [{k: 'accent', t: '148+6', t1: '149e', text: 'HIDING FOOD FROM THE DIET'}, {k: 'exclaim', t: '150+20', at: 'bulldog'}],
		subj: [['148', 'peterson'], ['150', 'bulldog']],
	}),
	scene({
		at: '151', loc: 'hall', whip: true,
		cast: [ppl('mrsp', 600, {face: 1, acts: [['fist', '151+6', '151e'], ['point', '152', '152e']]}), ppl('peterson', 1200, {face: -1, acts: [['handsOnHead', '151+6', '152e']]})],
		fx: [{k: 'impact', t: '151+10', at: [900, 340], text: 'YOU!!', s: 0.55}, {k: 'shake', t: '151+10'}, {k: 'accent', t: '152+6', t1: '152e', text: 'THE WHOLE BUILDING CAN HEAR'}],
		subj: [['151', 'mrsp'], ['152', 'peterson']],
	}),
	scene({
		at: '153', loc: 'hall',
		cast: [hero(1000, {face: -1, acts: [['facepalm', '153+10', '153e']], ex: [['sad', '153', '153e']]}), ppl('mrsp', 400, {face: 1}), ppl('peterson', 220, {face: 1})],
		fx: [{k: 'accent', t: '153+8', t1: '153e', text: 'YOU RUINED THEIR WEEK'}],
		subj: [['153', 'hero']],
		cam: [['153', 900, 1.0, 620], ['153e', 1000, 2.0, 600]],
	}),
	scene({
		at: '154', loc: 'hall3', whip: true,
		cast: [hero(700, {face: 1, look: [0.5, -0.5]})],
		animals: [{an: 'cat', x: 1200, y: 640, pose: 'sit', face: -1, talk: [['155', '155+80']], say: [['155+6', '155e', 'She cries every Sunday... in the laundry room.']], sad: [0, 9999]}],
		extra: () => <g><rect x={1020} y={640} width={360} height={20} rx={6} fill="#a8723e" stroke="#1d1626" strokeWidth={3.4} /></g>,
		subj: [['154', 'cat'], ['155', 'cat']],
	}),
	scene({
		at: '156', loc: 'hallOpen',
		cast: [hero(500, {face: 1}), ppl('kowalski', 1390, {face: -1, hold: []})],
		animals: [{an: 'cat', x: 1300, pose: 'sit', face: -1}],
		extra: (c) => <Tag f={c.f} t0={c.tf('156+10')} t1={c.tf('156e')} x={1490} y={190} text="4B — MRS. KOWALSKI" c="#fff" size={34} />,
		subj: [['156', 'kowalski']],
	}),
	scene({
		at: '157', loc: 'elevator', whip: true,
		cast: [hero(620, {face: 1, acts: [['wave', '157+10', '157+40']]}), ppl('kowalski', 1280, {face: -1, ex: [['normal', 0, '159']]})],
		fx: [{k: 'accent', t: '158+4', t1: '158e', text: '"EVERYTHING OKAY ON SUNDAYS?"', y: 840}],
		subj: [['157', 'hero'], ['158', 'hero'], ['159', 'kowalski']],
	}),
	scene({
		at: '159', loc: 'elevator',
		cast: [hero(620, {face: 1, ex: [['worried', '159', '160e']]}), ppl('kowalski', 1280, {face: -1, mouth: [['flat', '159', '160e']], ex: [['sad', '159+20', '160e']], mv: [['160', '160+30', 1500]]})],
		fx: [{k: 'impact', t: '159+8', at: [1280, 400], text: '...', s: 0.5}, {k: 'accent', t: '160+4', t1: '160e', text: 'SHE NEVER SPEAKS TO YOU AGAIN'}],
		subj: [['159', 'kowalski'], ['160', 'hero']],
	}),
	scene({
		at: '161', loc: 'courtyard', whip: true,
		cast: [hero(1300, {face: -1}), ppl('chen', 900, {face: -1, mv: [['162', '162e', 100]]})],
		animals: [{an: 'greyhound', x: 780, face: -1, mv: [['162', '162e', -20]]}],
		fx: [{k: 'accent', t: '161+6', t1: '161e', text: 'MR. CHEN + GREYHOUND'}, {k: 'accent', t: '162+4', t1: '162e', text: 'CROSSES THE COURTYARD TO AVOID YOU'}],
		subj: [['161', 'chen'], ['162', 'hero']],
	}),
	scene({
		at: '163', loc: 'infoWarm', whip: true,
		cast: [hero(300, {face: 1, ex: [['worried', 0, 9999]]})],
		extra: (c) => (
			<g>
				<rect x={600} y={220} width={1100} height={640} rx={20} fill="#c8884a" stroke="#1d1626" strokeWidth={10} />
				<rect x={630} y={250} width={1040} height={580} rx={10} fill="#e0a868" />
			</g>
		),
		props: [{k: 'note', x: 900, y: 560, s: 1.4, t0: '163+6', text: 'Stay away!', rot: -6}, {k: 'note', x: 1240, y: 520, s: 1.4, t0: '163+22', text: 'Weird kid.', rot: 5}, {k: 'note', x: 1500, y: 600, s: 1.4, t0: '163+40', text: 'Hush!', rot: -3}, {k: 'note', x: 1100, y: 800, s: 1.8, t0: '164', text: "Don't ask the kid anything!", rot: 2}],
		fx: [{k: 'impact', t: '164+4', at: [1100, 360], text: 'NOTE!', s: 0.5}],
		subj: [['163', 'hero']],
		cam: [['163', 1100, 1.0, 560], ['164e', 1200, 1.4, 600]],
	}),
	scene({
		at: '165', loc: 'courtyard',
		cast: [hero(1100, {face: -1, acts: [['scare', '165+14', '165e']]})],
		props: [{k: 'envelope', x: 300, y: 860, t0: '165', mv: [['165+4', '165+40', 880, 860]], s: 1.6}],
		fx: [{k: 'accent', t: '165+8', t1: '165e', text: 'THE BILL ARRIVES QUIETLY'}],
		subj: [['165', 'hero']],
	}),
	scene({
		at: '166', loc: 'school', whip: true,
		cast: [hero(700, {face: 1, ex: [['worried', '167', '171e']]}), ppl('marisol', 1300, {face: -1, mv: [['167', '167+40', 2000]]})],
		fx: [{k: 'accent', t: '166+2', t1: '166e', text: '1. THE PEOPLE', y: 140, c: '#ff7a7a'}, {k: 'accent', t: '167+6', t1: '167e', text: 'MARISOL STOPS SAYING HI'}],
		subj: [['166', 'hero'], ['167', 'marisol']],
	}),
	scene({
		at: '168', loc: 'school',
		cast: [hero(640, {face: 1}), ppl('marisol', 1180, {face: -1, acts: [['armsCrossed', '168', '168+40'], ['stop', '169', '169e']]})],
		extra: (c) => <Tag f={c.f} t0={c.tf('169+6')} t1={c.tf('169e')} x={1180} y={320} text="I can't be your friend." c="#fff" size={38} />,
		fx: [{k: 'impact', t: '169+40', at: [1180, 420], text: 'OUCH', s: 0.5}],
		subj: [['168', 'marisol'], ['169', 'marisol'], ['170', 'hero']],
	}),
	scene({
		at: '170', loc: 'school',
		cast: [hero(640, {face: 1, acts: [['shrug', '170+4', '170+40'], ['facepalm', '171', '171e']]}), ppl('marisol', 1180, {face: -1})],
		animals: [{an: 'cat', x: 1480, pose: 'sit', face: -1, say: [['170+10', '170+50', '...who are you?']]}],
		fx: [{k: 'accent', t: '170+6', t1: '171e', text: "YOUR CAT DOESN'T THINK ABOUT YOU", sub: "that's worse"}],
		subj: [['170', 'cat'], ['171', 'hero']],
	}),
	scene({
		at: '172', loc: 'school',
		cast: [hero(960, {face: 1, ex: [['sad', 0, 9999]]})],
		crowd: [{n: 6, x0: -100, x1: 700, s: 0.7, mode: 'stand', seed: 'kid1'}, {n: 6, x0: 1200, x1: 2000, s: 0.7, mode: 'stand', seed: 'kid2'}],
		animals: [{an: 'pigeon', x: 960, y: 640, face: 1, hide: [0, '172+20'], flap: [['172+20', '172+30']]}],
		fx: [{k: 'accent', t: '172+14', t1: '172e', text: '"THE PIGEON WHISPERER"'}, {k: 'accent', t: '173+4', t1: '173e', text: "IT'S NOT A COMPLIMENT", y: 140}],
		subj: [['172', 'hero']],
	}),
	scene({
		at: '174', loc: 'bedroomNight', whip: true,
		cast: [hero(1000, {face: -1, acts: [['handsOnHead', '174+6', '175e']], ex: [['sleepy', 0, 9999]]})],
		fx: [{k: 'accent', t: '174+4', t1: '174e', text: '2. YOU', y: 140, c: '#7ac8ff'}, {k: 'accent', t: '175+4', t1: '175e', text: 'THE CITY IS NEVER QUIET'}],
		subj: [['174', 'hero']],
	}),
	scene({
		at: '176', loc: 'alley', whip: true,
		cast: [],
		animals: [{an: 'raccoon', x: 1300, face: -1, talk: [['176+30', '177e']], say: [['176+36', '177e', 'GARBAGE! GARBAGE! GARBAGE!']], hop: [['177', '177e']]}],
		subj: [['176', 'raccoon']],
		cam: [['176', 1300, 1.2, 760], ['177e', 1260, 1.9, 780]],
	}),
	scene({
		at: '178', loc: 'nightStreet', whip: true,
		cast: [],
		animals: [{an: 'gull', x: 800, y: 900, s: 1.2, face: 1, flap: [['178+10', '178+30']], talk: [['178', '178e']], say: [['178+6', '178e', 'SQUAWK!']]}, {an: 'cat', x: 1600, y: 900, face: -1, say: [['179+6', '179e', 'Let me in! Please!']], sad: [0, 9999]}],
		subj: [['178', 'gull'], ['179', 'cat']],
	}),
	scene({
		at: '180', loc: 'bedroomNight',
		cast: [hero(1250, {face: -1, seat: 700, acts: [['sit', 0, 9999], ['handsOnHead', '180+10', '181e']], ex: [['sleepy', 0, 9999]]})],
		props: [{k: 'pillow', x: 1230, y: 480, s: 1.1, t0: '180+6'}],
		fx: [{k: 'accent', t: '181+6', t1: '181e', text: 'NO SILENCE IN WEEKS'}],
		subj: [['180', 'hero']],
	}),
	scene({
		at: '182', loc: 'kitchenNight', whip: true,
		cast: [hero(900, {face: 1, acts: [['think', '182+10', '183e']]})],
		animals: [{an: 'beagle', x: 1300, pose: 'sit', face: -1}],
		props: [{k: 'heart', x: 1000, y: 360, t0: '183+10', s: 1.2}],
		fx: [{k: 'accent', t: '182+6', t1: '182e', text: '3. THE THING YOU WANTED MOST', y: 140, c: '#ffd84a'}, {k: 'question', t: '183+20', at: 'beagle'}],
		subj: [['182', 'hero'], ['183', 'beagle']],
	}),
	scene({
		at: '184', loc: 'kitchenNight',
		cast: [hero(900, {face: 1, acts: [['presentF', '184+10', '184e']]})],
		animals: [{an: 'beagle', x: 1300, pose: 'sit', face: -1, wag: 2}],
		fx: [{k: 'bulb', t: '184+10', at: 'hero'}, {k: 'accent', t: '184+14', t1: '184e', text: 'WHY YOU TOOK THIS POWER'}],
		subj: [['184', 'hero']],
	}),
	scene({
		at: '185', loc: 'bedroomNight', whip: true,
		cast: [hero(900, {face: 1, seat: 700, acts: [['sit', 0, 9999], ['think', '186', '186e']]})],
		animals: [{an: 'beagle', x: 1130, pose: 'lie', face: -1, mv: [[0, 0, 1130]]}],
		fx: [{k: 'sparkle', t: '185+20', at: [1130, 760]}],
		props: [{k: 'heart', x: 1130, y: 560, t0: '185+30', s: 0.6}],
		subj: [['185', 'beagle'], ['186', 'hero']],
	}),
	scene({
		at: '187', loc: 'bedroomNight',
		cast: [hero(900, {face: 1, seat: 700, ex: [['wide', '188', '189e']]})],
		animals: [{an: 'beagle', x: 1130, pose: 'lie', face: -1, talk: [['187', '187e']], say: [['187+4', '187e', 'Dinner.']], tilt: [['187', '188', 12]]}],
		fx: [{k: 'impact', t: '187+8', at: [1130, 480], text: 'DINNER', s: 0.5}],
		subj: [['187', 'beagle'], ['188', 'hero']],
	}),
	scene({
		at: '188', loc: 'bedroomNight',
		cast: [hero(900, {face: 1, seat: 700, acts: [['facepalm', '189+10', '189e']], ex: [['sad', '188', '189e']]})],
		animals: [{an: 'beagle', x: 1130, pose: 'lie', face: -1, talk: [['189', '189+30']], say: [['189+4', '189+34', 'Dinner.']]}],
		fx: [{k: 'accent', t: '189+20', t1: '189e', text: "YOU'VE NEVER FELT SO SMALL"}],
		subj: [['188', 'hero'], ['189', 'beagle']],
		cam: [['188', 1000, 1.4, 620], ['189e', 960, 2.2, 620]],
	}),
	scene({
		at: '190', loc: 'kitchenNight', whip: true,
		cast: [hero(1100, {face: -1, acts: [['sad' as any, 0, 0], ['rubChin', '191', '191e']], ex: [['sad', 0, 9999]]})],
		animals: [{an: 'beagle', x: 600, pose: 'sit', face: 1, wag: 2}],
		props: [{k: 'bowl', x: 800, y: 900, s: 1.1}],
		fx: [{k: 'accent', t: '190+4', t1: '191e', text: 'HE LOVES DINNER. YOU MAKE IT.'}],
		subj: [['190', 'beagle'], ['191', 'hero']],
	}),
	scene({
		at: '192', loc: 'kitchenNight',
		cast: [hero(900, {face: 1, ex: [['worried', 0, 9999]], acts: [['think', '192', '193e']]})],
		animals: [{an: 'beagle', x: 1300, pose: 'sit', face: -1, tilt: [['192', '193e', 14]]}],
		props: [{k: 'heart', x: 1000, y: 300, t0: '192+10', s: 1.0}, {k: 'bowl', x: 1100, y: 300, t0: '193+10', s: 1.0}],
		fx: [{k: 'question', t: '193+20', at: 'hero'}, {k: 'accent', t: '193+6', t1: '193e', text: 'LOVE... OR FOOD?'}],
		subj: [['192', 'beagle'], ['193', 'hero']],
	}),
	scene({
		at: '194', loc: 'kitchenNight',
		cast: [hero(1000, {face: -1, acts: [['stop', '194+4', '194+30']], ex: [['sad', 0, 9999]]})],
		animals: [{an: 'beagle', x: 600, pose: 'sit', face: 1}],
		fx: [{k: 'accent', t: '194+4', t1: '194e', text: 'YOU CAN NEVER ASK AGAIN'}],
		subj: [['194', 'hero']],
		cam: [['194', 900, 1.2, 640], ['194e', 1000, 1.9, 600]],
	}),
];
