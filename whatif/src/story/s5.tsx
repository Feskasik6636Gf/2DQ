import React from 'react';
import {scene} from './dsl';
import {hero, ppl, Wind, Arrow, Tag, Stat} from './helpers';

const zzz = (c: {f: number}, x: number, y: number, i: number) => {
	const k = ((c.f + i * 25) % 90) / 90;
	return <text key={i} x={x + Math.sin(k * 5 + i) * 20} y={y - k * 120} fontFamily="Rubik" fontWeight={900} fontSize={44 + i * 6} fill="#cfe0ff" stroke="#1d1626" strokeWidth={3} opacity={1 - k}>Z</text>;
};

/* 195–260: the night, the choice, the alarm */
export const S5 = [
	scene({
		at: '195', loc: 'nightStreet', whip: true,
		cast: [],
		fx: [{k: 'snow', t: 0, t1: '196'}, {k: 'accent', t: '195+8', t1: '195e', text: 'WINTER — THE FIRST COLD SNAP'}],
		animals: [{an: 'pigeon', x: 500, y: 900, face: 1, hop: [['195', '195e']]}],
		subj: [['195', 'pigeon']],
		cam: [['195', 900, 1.0, 560], ['195e', 1000, 1.5, 640]],
	}),
	scene({
		at: '196', loc: 'bedroomNight',
		cast: [hero(1000, {face: -1, seat: 700, acts: [['sit', 0, 9999], ['touchFace', '196+30', '196e']], ex: [['sleepy', 0, 9999]]})],
		fx: [{k: 'accent', t: '196+6', t1: '196e', text: '3:12 AM', sub: 'you wake up with a headache'}, {k: 'pulse', t: '196+30', t1: '196e', c: '255,40,60'}],
		subj: [['196', 'hero']],
	}),
	scene({
		at: '197', loc: 'hallNight', whip: true,
		cast: [hero(1500, {face: -1, mv: [['197', '197+30', 1150]], acts: [['crouch', '198', '199e']]})],
		animals: [{an: 'beagle', x: 700, pose: 'lie', face: 1, sad: [0, 9999], tilt: [['198', '200e', 14]]}],
		fx: [{k: 'accent', t: '198+4', t1: '198e', text: 'NOT ASKING FOR DINNER'}, {k: 'accent', t: '199+4', t1: '200e', text: 'PANTING... EYES HALF CLOSED'}],
		subj: [['197', 'beagle'], ['199', 'hero']],
	}),
	scene({
		at: '201', loc: 'bedroomNight', whip: true,
		cast: [hero(800, {face: 1, look: [0, -1], acts: [['scare', '201+20', '201e']]})],
		animals: [{an: 'canary', x: 1450, y: 300, flap: [['201', '205e']], talk: [['201', '205e']], hop: [['201', '205e']], say: [['201+6', '202+20', 'SUNNY! sleepy!'], ['204', '204e', 'Everyone\'s sleepy!'], ['205', '205e', 'Wake up! Wake up!']]}],
		props: [{k: 'cage', x: 1450, y: 330, s: 1.4}],
		fx: [{k: 'shock', t: '201+10'}, {k: 'accent', t: '201+10', t1: '202e', text: 'UPSTAIRS — A TINY VOICE SHRIEKING', y: 880}],
		subj: [['201', 'hero'], ['202', 'canary'], ['204', 'canary']],
	}),
	scene({
		at: '206', loc: 'roofSmoke', whip: true,
		cast: [hero(600, {face: 1, acts: [['point', '207', '207e'], ['scare', '206+20', '206e']]})],
		animals: [0, 1, 2, 3].map((i) => ({an: 'pigeon' as const, id: 'pg' + i, x: 1050 + i * 180, y: 900, s: 1.2, face: -1 as const, flap: [['206', '207e']] as [string, string][], talk: [['206', '207e']] as [string, string][], say: i % 2 ? [[`206+${10 + i * 6}`, '207e', ['AAAH!', 'WAKE UP!', 'DANGER!'][i % 3]]] as [string, string, string][] : undefined})),
		fx: [{k: 'accent', t: '207+4', t1: '207e', text: 'THE CHIMNEY IS BREATHING WRONG'}, {k: 'pulse', t: '206', t1: '207e', c: '255,40,60'}],
		subj: [['206', 'pg1'], ['207', 'hero']],
	}),
	scene({
		at: '208', loc: 'infoRed', whip: true,
		cast: [hero(560, {face: 1, ex: [['wide', '208', '209e']], acts: [['scare', '208+4', '208e']]})],
		extra: (c) => (
			<g opacity={Math.min(1, (c.f - c.tf('209')) / 20)}>
				{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={1260 + Math.sin(c.f / 20 + i * 2) * 120 + i * 20} cy={560 + Math.cos(c.f / 25 + i) * 80 - i * 30} r={90 - i * 6} fill="#b6bbd0" opacity={0.28} />)}
				<text x={1300} y={880} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={80} fill="#fff" stroke="#1d1626" strokeWidth={8} paintOrder="stroke" opacity={c.f > c.tf('209+20') ? 1 : 0}>CO</text>
			</g>
		),
		fx: [{k: 'accent', t: '208+6', t1: '208e', text: 'YOU KNOW WHAT THIS IS'}, {k: 'accent', t: '209+10', t1: '209e', text: 'CARBON MONOXIDE — NO COLOR, NO SMELL', y: 840}],
		subj: [['208', 'hero']],
	}),
	scene({
		at: '210', loc: 'infoRed',
		extra: (c) => <Stat f={c.f} t0={c.tf('210+10')} t1={c.tf('210e')} x={960} y={500} big="~400" label="DEATHS A YEAR IN THE US" c="#ff7a7a" s={1.5} />,
		fx: [{k: 'shake', t: '210+20'}],
		cast: [hero(300, {face: 1, ex: [['worried', 0, 9999]]})],
		subj: [['210', 'hero']],
		cam: [['210', 960, 1.0, 540], ['210e', 960, 1.12, 540]],
	}),
	scene({
		at: '211', loc: 'infoRed',
		extra: (c) => {
			const k = Math.min(1, Math.max(0, (c.f - c.tf('211+20')) / 50));
			return (
				<g>
					<ellipse cx={960} cy={540} rx={380} ry={250} fill="#d83a4a" stroke="#1d1626" strokeWidth={8} />
					<ellipse cx={960} cy={540} rx={180} ry={100} fill="#a82838" />
					{Array.from({length: 6}).map((_, i) => <circle key={i} cx={640 + (i % 3) * 120 + Math.sin(c.f / 12 + i) * 10} cy={400 + Math.floor(i / 3) * 280} r={34} fill="#7ac8ff" stroke="#1d1626" strokeWidth={4} opacity={1 - k} />)}
					{Array.from({length: 8}).map((_, i) => <circle key={'c' + i} cx={620 + (i % 4) * 230 + (1 - k) * (i % 2 ? 180 : -180)} cy={380 + Math.floor(i / 4) * 300} r={40} fill="#4a4a58" stroke="#1d1626" strokeWidth={4} opacity={0.3 + 0.7 * k} />)}
					<text x={960} y={560} textAnchor="middle" fontFamily="Rubik" fontWeight={900} fontSize={110} fill="#fff" stroke="#1d1626" strokeWidth={8} paintOrder="stroke">200×</text>
					<Tag f={c.f} t0={c.tf('211+30')} t1={c.tf('212')} x={960} y={900} text="CO BINDS 200× STRONGER THAN OXYGEN" c="#ffd84a" size={46} />
				</g>
			);
		},
		fx: [{k: 'shock', t: '211+50'}, {k: 'accent', t: '212+6', t1: '212e', text: 'YOUR BODY SLOWLY STARVES', y: 900}],
		subj: [],
		cam: [['211', 960, 1.0, 540], ['212e', 960, 1.2, 540]],
	}),
	scene({
		at: '213', loc: 'bedroomNight', whip: true,
		cast: [hero(1100, {face: -1, acts: [['cry', '213+10', '213e']], ex: [['sleepy', 0, 9999]]})],
		props: [{k: 'mug', x: 700, y: 760, t0: '213+10', s: 1.3}],
		fx: [{k: 'accent', t: '213+6', t1: '213e', text: 'THE SYMPTOMS FEEL LIKE THE FLU'}],
		subj: [['213', 'hero']],
	}),
	scene({
		at: '214', loc: 'bedroomNight',
		cast: [],
		props: [{k: 'bed', x: 900, y: 900, s: 2}, {k: 'pillow', x: 760, y: 740, s: 1}],
		extra: (c) => <g>{[0, 1, 2].map((i) => zzz(c, 960 + i * 40, 600, i))}</g>,
		animals: [],
		fx: [{k: 'accent', t: '214+6', t1: '214e', text: 'PEOPLE WHO ARE ASLEEP NEVER FEEL A THING'}],
		subj: [],
		cam: [['214', 900, 1.0, 640], ['214e', 900, 1.5, 700]],
	}),
	scene({
		at: '215', loc: 'basement', whip: true,
		cast: [ppl('chen', 700, {face: 1, hold: [['cage', 0, 9999, {s: 0.8}]], acts: [['presentF', '216', '216e']]}), ppl('sup', 1250, {face: -1})],
		animals: [{an: 'canary', x: 900, y: 650, hop: [['217', '217e']], flap: [['217', '217e']]}],
		fx: [{k: 'accent', t: '215+4', t1: '215e', text: '150 YEARS', sub: 'British miners carried canaries underground'}, {k: 'accent', t: '217+4', t1: '217e', text: 'BIRDS NOTICE FIRST'}],
		subj: [['215', 'chen'], ['217', 'canary']],
	}),
	scene({
		at: '218', loc: 'infoWarm',
		cast: [],
		props: [{k: 'cage', x: 960, y: 760, s: 3.0, t0: '218+4'}],
		extra: (c) => <Stat f={c.f} t0={c.tf('218+14')} t1={c.tf('218e')} x={960} y={300} big="RETIRED 1986" label="the last mine canaries" c="#ffd84a" s={0.95} />,
		animals: [{an: 'canary', x: 960, y: 600, s: 2.2, flap: [['218', '218e']]}],
		subj: [['218', 'canary']],
	}),
	scene({
		at: '219', loc: 'courtyardNight', whip: true,
		cast: [hero(300, {face: 1, look: [0, -1], mv: [['219', '219+30', 500]]})],
		animals: [{an: 'canary', x: 1300, y: 640, s: 2, hop: [['219', '220e']], flap: [['219+30', '220e']]}],
		props: [{k: 'cage', x: 1300, y: 660, s: 2.2}],
		extra: (c) => <g>{[0, 1, 2, 3].map((i) => zzz(c, 300 + i * 450, 360, i))}</g>,
		fx: [{k: 'accent', t: '219+8', t1: '220e', text: '40 PEOPLE ARE ASLEEP', sub: 'and Sunny is the alarm'}, {k: 'pulse', t: '220', t1: '220e', c: '255,200,60'}],
		subj: [['219', 'canary'], ['220', 'hero']],
	}),
	scene({
		at: '221', loc: 'bedroomNight', whip: true,
		cast: [hero(900, {face: 1, hold: [['phone', 0, 9999, {s: 0.9}]], acts: [['think', '222', '222e']]})],
		fx: [{k: 'accent', t: '221+6', t1: '221e', text: 'YOU COULD CALL 911'}, {k: 'question', t: '222+10', at: 'hero'}],
		subj: [['221', 'hero']],
	}),
	scene({
		at: '222', loc: 'bedroomNight',
		cast: [hero(900, {face: 1, hold: [['phone', 0, 9999, {s: 0.9}]], ex: [['worried', 0, 9999]]})],
		extra: (c) => (
			<g>
				<Tag f={c.f} t0={c.tf('223')} t1={c.tf('223e')} x={900} y={300} text="I... smell something?" c="#fff" size={42} />
				<Tag f={c.f} t0={c.tf('224')} t1={c.tf('224e')} x={900} y={380} text="You don't." c="#ff9a6a" size={42} />
				<Tag f={c.f} t0={c.tf('225')} t1={c.tf('225e')} x={900} y={460} text="Nobody can." c="#ff6a6a" size={42} />
			</g>
		),
		subj: [['222', 'hero']],
		cam: [['222', 900, 1.3, 600], ['225e', 900, 1.8, 560]],
	}),
	scene({
		at: '226', loc: 'bedroomNight',
		cast: [hero(800, {face: 1, hold: [['phone', 0, 9999, {s: 0.9}]], acts: [['shrug', '226+30', '226+60']]})],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('226+10')} t1={c.tf('226+60')} x={1300} y={400} text='"My dog told me..."' c="#fff" size={40} /><Tag f={c.f} t0={c.tf('226+50')} t1={c.tf('226e')} x={1300} y={500} text="*click* (they hang up)" c="#ffb27a" size={36} /></g>,
		fx: [{k: 'impact', t: '226+54', at: [1300, 300], text: 'CLICK', s: 0.5}],
		subj: [['226', 'hero']],
	}),
	scene({
		at: '227', loc: 'nightStreet',
		cast: [],
		extra: (c) => <Stat f={c.f} t0={c.tf('227+4')} t1={c.tf('228e')} x={560} y={300} big="20 MIN" label="fire crews — if they came at all" c="#ff9a6a" s={1.0} />,
		fx: [{k: 'accent', t: '228+6', t1: '228e', text: 'IF THEY CAME AT ALL'}],
		subj: [],
		cam: [['227', 960, 1.0, 540], ['228e', 1300, 1.3, 640]],
	}),
	scene({
		at: '229', loc: 'hallNight', whip: true,
		cast: [hero(700, {face: 1, mv: [['229', '229+60', 1100]], acts: [['fist', '229+66', '229+100'], ['point', '230', '231e']]})],
		props: [{k: 'alarm', x: 1400, y: 760, s: 1.6, t0: '229+8'}],
		fx: [{k: 'accent', t: '229+8', t1: '229e', text: 'OR PULL THE ALARM — BANG ON EVERY DOOR'}, {k: 'accent', t: '231+4', t1: '231e', text: '"THE ANIMALS WARNED YOU"'}],
		subj: [['229', 'hero'], ['231', 'hero']],
	}),
	scene({
		at: '232', loc: 'hallNight',
		cast: [hero(960, {face: 1, ex: [['sad', 0, 9999]], acts: [['crouch', '232+20', '232e']]})],
		crowd: [{n: 4, x0: -200, x1: 600, s: 0.9, mode: 'stand', seed: 'ang1'}, {n: 4, x0: 1300, x1: 2100, s: 0.9, mode: 'stand', seed: 'ang2'}],
		fx: [{k: 'accent', t: '232+6', t1: '232e', text: 'THE WEIRD KID. FOREVER.'}],
		subj: [['232', 'hero']],
		cam: [['232', 960, 1.1, 620], ['232e', 960, 1.8, 640]],
	}),
	scene({
		at: '233', loc: 'bedroomNight', whip: true,
		cast: [hero(1000, {face: -1, seat: 700, acts: [['sit', 0, 9999], ['think', '233', '234e']], ex: [['worried', 0, 9999]]})],
		fx: [{k: 'accent', t: '233+4', t1: '235e', text: 'THE KID WHO CRIED WOLF', sub: 'in the middle of the night'}],
		subj: [['233', 'hero']],
	}),
	scene({
		at: '236', loc: 'bedroomNight',
		cast: [hero(1100, {face: -1, seat: 700, acts: [['sit', 0, 9999]], ex: [['sleepy', 0, 9999]]})],
		props: [{k: 'pillow', x: 700, y: 760, s: 1.2}],
		animals: [{an: 'beagle', x: 650, pose: 'lie', face: 1, sad: [0, 9999]}],
		fx: [{k: 'accent', t: '236+6', t1: '236e', text: 'NOBODY WOULD BLAME YOU FOR STAYING IN BED'}],
		subj: [['236', 'hero']],
		cam: [['236', 960, 1.1, 640], ['236e', 960, 1.4, 640]],
	}),
	scene({
		at: '237', loc: 'hallNight', whip: true,
		cast: [hero(300, {face: 1, mv: [['237+10', '237+50', 1250, 'run']], acts: [['carry', '237+10', '237e']]})],
		animals: [{an: 'beagle', x: 360, mv: [['237+10', '237+50', 1200, 'run']], sad: [0, 9999]}],
		props: [{k: 'alarm', x: 1400, y: 760, s: 1.6}],
		fx: [{k: 'speed', t: '237+10', t1: '237+50', at: 'hero'}, {k: 'impact', t: '237+56', at: [1400, 500], text: 'PULL!', s: 0.6}, {k: 'shockwave', t: '237+56', at: [1400, 700]}, {k: 'flash', t: '237+56', c: '#ffd0d0'}],
		subj: [['237', 'hero']],
	}),
	scene({
		at: '238', loc: 'hallOpen',
		cast: [hero(300, {face: 1, acts: [['wave', '238', '238+60']]}), ppl('kowalski', 1390, {face: -1, hide: [0, '238+50']})],
		fx: [{k: 'pulse', t: '238', t1: '238e', c: '255,40,60'}, {k: 'shake', t: '238+4'}, {k: 'shake', t: '238+30'}, {k: 'accent', t: '238+10', t1: '238e', text: 'THE BUILDING SCREAMS. DOORS CRACK OPEN.'}],
		subj: [['238', 'hero'], ['238+50', 'kowalski']],
	}),
	scene({
		at: '239', loc: 'hallOpen',
		cast: [hero(700, {face: 1, acts: [['point', '241', '241e'], ['wave', '239+30', '240e']]}), ppl('kowalski', 1390, {face: -1, acts: [['shrug', '242', '242e']]})],
		extra: (c) => (
			<g>
				<Tag f={c.f} t0={c.tf('240')} t1={c.tf('240e')} x={1390} y={260} text="It's 3 in the morning!" c="#fff" size={34} />
				<Tag f={c.f} t0={c.tf('241')} t1={c.tf('241e')} x={700} y={260} text="Please, get outside!" c="#ff9a6a" size={34} />
				<Tag f={c.f} t0={c.tf('242')} t1={c.tf('242e')} x={1390} y={260} text="Is it a fire?" c="#fff" size={34} />
			</g>
		),
		subj: [['239', 'kowalski'], ['241', 'hero'], ['242', 'kowalski']],
	}),
	scene({
		at: '243', loc: 'hallOpen',
		cast: [hero(700, {face: 1, acts: [['presentF', '243', '244e']]}), ppl('kowalski', 1390, {face: -1, acts: [['scratch', '245', '245e']]})],
		animals: [{an: 'canary', x: 1000, y: 560, hide: [0, '246'], flap: [['246', '246e']], say: [['246+6', '246e', 'Everyone\'s sleepy!']]}],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('243')} t1={c.tf('244e')} x={700} y={260} text="It's the air! It's the air!" c="#ffd84a" size={38} /><Tag f={c.f} t0={c.tf('245')} t1={c.tf('245e')} x={1390} y={260} text="What about the air?" c="#fff" size={34} /></g>,
		subj: [['243', 'hero'], ['245', 'kowalski'], ['246', 'hero']],
	}),
	scene({
		at: '247', loc: 'hallOpen',
		cast: [hero(1000, {face: 1, mv: [['247', '247+20', 1100], ['248+4', '248+30', 1400]], acts: [['fist', '247+20', '247+36']]}), ppl('kowalski', 1390, {face: 1, mv: [['247', '247+12', 1390]], hide: [0, 0]})],
		fx: [{k: 'impact', t: '247+22', at: [1300, 380], text: 'KNOCK', s: 0.5}, {k: 'impact', t: '248+10', at: [1500, 380], text: 'KNOCK', s: 0.5}, {k: 'impact', t: '249+4', at: [1700, 380], text: 'KNOCK', s: 0.5}],
		subj: [['247', 'hero']],
		cam: [['247', 1000, 1.3, 620], ['248', 1300, 1.4, 620], ['249', 1600, 1.4, 620]],
	}),
	scene({
		at: '250', loc: 'hallNight',
		cast: [hero(700, {face: 1, acts: [['presentF', '250', '251e']]}), ppl('robe', 1250, {face: -1, acts: [['point', '250+10', '250e'], ['shrug', '251', '251e']]})],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('250+14')} t1={c.tf('250e')} x={1250} y={260} text="I'll call the police!" c="#ff6a6a" size={34} /><Tag f={c.f} t0={c.tf('251+4')} t1={c.tf('251e')} x={1250} y={260} text="It's a prank." c="#fff" size={34} /></g>,
		subj: [['250', 'robe'], ['251', 'robe']],
	}),
	scene({
		at: '252', loc: 'hallOpen',
		cast: [hero(700, {face: 1, ex: [['worried', 0, 9999]]}), ppl('marisol', 1390, {face: -1, acts: [['scratch', '252+10', '252+50'], ['think', '253', '253e']], ex: [['sleepy', '252', '253e']]})],
		fx: [{k: 'accent', t: '253+6', t1: '253e', text: 'A VERY LONG MOMENT'}],
		subj: [['252', 'marisol'], ['253', 'marisol']],
		cam: [['252', 1200, 1.3, 620], ['253e', 1390, 2.0, 600]],
	}),
	scene({
		at: '254', loc: 'hallOpen',
		cast: [hero(700, {face: 1, acts: [['presentF', '255', '255e']]}), ppl('marisol', 1390, {face: -1, hide: [0, '254'], acts: [['stop', '254+4', '254+30']]})],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('254+4')} t1={c.tf('254e')} x={1390} y={260} text="Is this about my cat?" c="#fff" size={34} /><Tag f={c.f} t0={c.tf('255+4')} t1={c.tf('255e')} x={700} y={260} text="It's about everything." c="#ffd84a" size={34} /></g>,
		fx: [{k: 'impact', t: '256+4', at: [1390, 380], text: 'SLAM', s: 0.5}, {k: 'shake', t: '256+4'}],
		subj: [['254', 'marisol'], ['255', 'hero'], ['256', 'marisol']],
	}),
	scene({
		at: '257', loc: 'hallNight',
		cast: [ppl('peterson', 1500, {face: -1, mv: [['257', '258+10', 1100]], hold: []}), ppl('mrsp', 1700, {face: -1, mv: [['257', '258+10', 1300]]}), hero(500, {face: 1})],
		fx: [{k: 'accent', t: '258+6', t1: '259e', text: 'ONE SLIPPER ONLY'}],
		props: [{k: 'sign', x: 1600, y: 1000, t0: 0, t1: 1, s: 0.1}],
		subj: [['257', 'peterson'], ['259', 'peterson']],
	}),
	scene({
		at: '260', loc: 'hallNight',
		cast: [ppl('peterson', 1100, {face: -1}), ppl('mrsp', 1350, {face: -1}), hero(560, {face: 1, acts: [['presentF', '261', '262+20']]})],
		extra: (c) => <g><Tag f={c.f} t0={c.tf('261')} t1={c.tf('261e')} x={1100} y={260} text="You're the weird kid." c="#fff" size={36} /></g>,
		subj: [['260', 'peterson'], ['261', 'peterson'], ['262', 'hero']],
	}),
];
