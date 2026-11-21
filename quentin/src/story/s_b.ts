import type {SceneSpec} from './direct';
import {b, fx} from './s_a';

/* 020-075: the rules, school, honesty research, practice */
export const SC_B: SceneSpec[] = [
	/* 020-026 sidewalk: everybody lies a little */
	{
		at: '020',
		set: 'sidewalk',
		whip: true,
		cast: {hero: {x: -250}, woman: {x: 1500, face: -1}, man: {x: 1250, face: -1}, str: {x: 1750, face: -1}},
		crowds: [{id: 'walkers', n: 5, x0: 100, x1: 1800, floor: 905, s: 0.7, mode: 'walk', seed: 'wk'}],
		beats: [
			b('020', 'hero', 'm', {mv: {hero: [-250, 760]}, fx: [fx('fact', {m: 'chat', text: '1–2 LIES|EVERY DAY', sub: 'MOST PEOPLE', c: '#2a3a7a', d: 66, o: 10})]}),
			b('021', 'all', 'w', {fx: [fx('rule', {text: 'DIARY STUDY|lies today: 2', sub: 'PEOPLE WROTE IT DOWN', d: 70})]}),
			b('022', 'woman', 'c', {fc: {woman: 'hero'}, g: {woman: 'present'}, fx: [fx('say', {a: 'woman', text: 'Love your haircut!', o: 4}), fx('mark', {a: 'woman', text: '✗', o: 40})]}),
			b('023', 'man', 'c', {fc: {man: 'hero'}, g: {man: 'wave'}, fx: [fx('say', {a: 'man', text: "I'm fine, really.", o: 4}), fx('mark', {a: 'man', text: '✗', o: 36})]}),
			b('024', 'hero', 'm', {e: {hero: 'worried'}, g: {hero: 'chin'}, fx: [fx('fact', {m: 'brain', text: 'THE|TRUTH DEFAULT', sub: 'THE NAME FOR IT', c: '#5a2a6a', d: 52, o: 30})]}),
			b('025', 'str', 'c', {fc: {str: 'hero'}, g: {str: 'nod'}, e: {str: 'normal+smile'}, mv: {str: 1230}, fx: [fx('mark', {a: 'str', text: '✓', o: 20})]}),
			b('026', 'hero', 'x', {e: {hero: 'wide'}, g: {hero: 'scratch'}, fx: [fx('mark', {a: 'hero', text: '!'}), fx('ono', {a: 'hero', tx: 130, ty: 30, text: 'SUS', s: 0.7, o: 12, d: 40})], sh: 0.4}),
		],
	},
	/* 027-033 hallway: the rules */
	{
		at: '027',
		set: 'hall',
		whip: true,
		cast: {hero: {x: 820}, kofi: {x: 1350, face: -1}},
		beats: [
			b('027', 'hero', 'm', {g: {hero: 'present'}, e: {hero: 'normal+smirk'}, fx: [fx('title', {text: 'THE RULES', d: 70})]}),
			b('028', 'hero', 'c', {e: {hero: 'worried'}, fx: [fx('rule', {text: 'SCARY TRUTHS|ONLY', sub: 'RULE 1', d: 55})]}),
			b('029', 'hero', 'm', {g: {hero: 'shrug'}, fx: [fx('say', {a: 'hero', text: "It's Tuesday."}), fx('stat', {text: '$0', c: '#ff6a5a', y: 120, d: 50, o: 22})]}),
			b('030', 'kofi', 'c', {e: {kofi: 'wide'}, fx: [fx('say', {a: 'kofi', text: 'I love broccoli!', o: 2}), fx('stat', {text: 'LIE = $0', c: '#ff6a5a', y: 120, d: 46, o: 18})]}),
			b('031', 'hero', 'c', {g: {hero: 'chin'}, fx: [fx('say', {a: 'hero', text: 'Sort of… maybe…', o: 2}), fx('stat', {text: 'HALF-TRUTH = $0', s: 110, c: '#ff6a5a', y: 120, d: 46, o: 16})]}),
			b('032', 'all', 'w', {fc: {kofi: 'hero'}, fx: [fx('fact', {m: 'scale', text: 'THE MONEY|KNOWS', sub: 'NO LOOPHOLES', c: '#2a3a5a', d: 80})]}),
			b('033', 'hero', 'c', {g: {hero: 'cheer'}, e: {hero: 'normal+smile'}, fx: [fx('rain', {n: 14, d: 70}), fx('stat', {text: '$100 FLAT', c: '#6ef0a0', y: 120, d: 70})]}),
		],
	},
	/* 034-042 history class */
	{
		at: '034',
		set: 'class',
		whip: true,
		extra: 'desks',
		deskXs: [640, 880, 1120, 1360, 1600],
		cast: {teacher: {x: -250, s: 1.05, face: 1}, hero: {x: 640, sit: true, face: -1, floor: 920}},
		crowds: [{id: 'st', n: 4, x0: 860, x1: 1700, floor: 900, s: 0.82, sit: true, rows: 1, seed: 'cls'}, {id: 'st2', n: 3, x0: 1000, x1: 1640, floor: 860, s: 0.74, sit: true, seed: 'cls2'}],
		beats: [
			b('034', 'all', 'w', {mv: {teacher: [-250, 380]}, fx: [fx('title', {text: 'MONDAY', sub: 'History class', d: 70})]}),
			b('035', 'teacher', 'c', {g: {teacher: 'point'}, fx: [fx('say', {a: 'teacher', text: 'Who did the reading?', o: 2})]}),
			b('036', 'all', 'w', {crowd: {st: 'hands', st2: 'hands'}, fx: [fx('stat', {to: 28, sub: 'HANDS GO UP', o: 4, d: 60})]}),
			b('037', 'hero', 'c', {e: {hero: 'worried'}, g: {hero: 'slump'}, fx: [fx('sweat', {a: 'hero', d: 70})]}),
			b('038', 'hero', 'x', {e: {hero: 'worried+frown'}, fx: [fx('say', {a: 'hero', text: "I didn't.", o: 2})]}),
			b('039', [640, 760], 'c', {fx: [fx('bill', {tx: 640, ty: 760, m: 'slide', d: 90}), fx('ono', {x: 640, y: 690, text: 'FLOP', s: 0.6, o: 36, d: 30})], sh: 0.2}),
			b('040', 'teacher', 'c', {fc: {teacher: 1}, g: {teacher: 'cross'}, e: {teacher: 'normal+flat'}, fx: [fx('say', {a: 'teacher', th: true, text: 'I see nothing…', o: 2})]}),
			b('041', 'teacher', 'm', {g: {teacher: 'point'}, e: {teacher: 'angry'}, fx: [fx('stat', {text: 'DETENTION', c: '#ff6a5a', s: 150, d: 55, o: 20}), fx('ono', {a: 'teacher', tx: 90, text: 'TSK!', s: 0.7, o: 4, d: 30})]}),
			b('042', 'hero', 'm', {e: {hero: 'normal+smirk'}, g: {hero: 'present'}, fx: [fx('stat', {text: '$100', sub: 'BEST DETENTION EVER', c: '#6ef0a0', d: 70, o: 4})]}),
		],
	},
	/* 043-049 hallway, Dana's bangs */
	{
		at: '043',
		set: 'hall',
		whip: true,
		cast: {hero: {x: 700}, dana: {x: 2150, face: -1}},
		beats: [
			b('043', 'dana', 'm', {mv: {dana: [2150, 1180]}, g: {dana: 'touch'}, fc: {hero: 'dana'}, fx: [fx('tag', {a: 'dana', text: 'DANA', o: 34})]}),
			b('044', 'dana', 'c', {g: {dana: 'touch'}, e: {dana: 'normal+smile'}, fx: [fx('say', {a: 'dana', text: 'Do I look good?', o: 2}), fx('hearts', {a: 'dana', o: 10, d: 50})]}),
			b('045', 'hero', 'c', {e: {hero: 'worried'}, g: {hero: 'scratch'}, fx: [fx('ono', {a: 'hero', tx: 120, text: 'GULP', s: 0.7, o: 2, d: 36}), fx('sweat', {a: 'hero', d: 70})]}),
			b('046', 'hero', 'x', {e: {hero: 'normal+smirk'}, fx: [fx('say', {a: 'hero', text: 'A startled lamp.', o: 2}), fx('bill', {a: 'hero', o: 12, d: 50})]}),
			b('047', 'dana', 'x', {e: {dana: 'wide+flat'}, g: {dana: 'stop'}, fx: [fx('mark', {a: 'dana', text: '…', c: '#fff'})]}),
			b('048', 'dana', 'm', {g: {dana: 'laugh'}, e: {dana: 'normal+open'}, fx: [fx('ono', {a: 'dana', tx: 120, ty: -20, text: 'HA HA HA', s: 0.7, o: 4, d: 60})], sh: 0.3}),
			b('049', 'dana', 'c', {g: {dana: 'touch'}, e: {dana: 'normal+smile'}, fx: [fx('say', {a: 'dana', th: true, text: 'Finally, honesty.', o: 2})]}),
		],
	},
	/* 050-051 sidewalk: she helps pick it up */
	{
		at: '050',
		set: 'sidewalk',
		whip: true,
		cast: {hero: {x: 760, face: 1}, dana: {x: 1060, face: -1}},
		beats: [
			b('050', 'all', 'm', {fx: [fx('bill', {tx: 880, ty: 880, m: 'slide', d: 80}), fx('ono', {x: 880, y: 800, text: 'FWIP', s: 0.6, o: 36, d: 30})], g: {hero: 'present'}}),
			b('051', 'all', 'c', {g: {hero: 'reachdown', dana: 'reachdown'}, e: {dana: 'normal+smile'}, fx: [fx('bill', {tx: 900, ty: 860, m: 'fly', d: 70, o: 0}), fx('hearts', {a: 'dana', o: 30, d: 50})]}),
		],
	},
	/* 052-058 the research */
	{
		at: '052',
		set: 'bench',
		whip: true,
		cast: {hero: {x: 800, sit: true, face: 1, floor: 900}, kofi: {x: 1120, sit: true, face: -1, floor: 900}},
		beats: [
			b('052', 'all', 'w', {fx: [fx('fact', {m: 'scale', text: 'RESEARCHERS|TESTED IT', sub: 'A REAL EXPERIMENT', c: '#2a3a5a', d: 70})]}),
			b('053', 'kofi', 'c', {g: {kofi: 'present'}, fx: [fx('say', {a: 'kofi', text: 'Okay, be honest with me.', o: 2})]}),
			b('054', 'hero', 'c', {e: {hero: 'worried'}, g: {hero: 'scratch'}, fx: [fx('say', {a: 'hero', th: true, text: 'This will be awkward…', o: 4}), fx('sweat', {a: 'hero', d: 60})]}),
			b('055', 'all', 'w', {fx: [fx('fact', {m: 'bars', text: 'FAR LESS|AWKWARD', sub: 'THAN THEY EXPECTED', c: '#2a4a7a', d: 78})]}),
			b('056', 'hero', 'm', {g: {hero: 'laugh', kofi: 'laugh'}, e: {hero: 'normal+smile'}, fx: [fx('hearts', {a: 'hero', d: 60}), fx('stat', {text: 'ENJOYED MORE', sub: 'THAN THEY PREDICTED', s: 120, d: 60, o: 6})]}),
			b('057', 'all', 'w', {fx: [fx('fact', {m: 'brain', text: 'SCARIER|IN YOUR HEAD', c: '#5a2a6a', d: 52})]}),
			b('058', 'hero', 'c', {e: {hero: 'normal+smile'}, g: {hero: 'present'}, fx: [fx('stat', {text: 'THAN IN REAL LIFE', s: 100, y: 140, d: 60})]}),
		],
	},
	/* 059-075 football practice */
	{
		at: '059',
		set: 'field',
		whip: true,
		cast: {coach: {x: 1560, s: 1.08, face: -1}, hero: {x: 900}, colm: {x: 620, s: 1.12, face: 1}},
		crowds: [{id: 'team', n: 7, x0: 300, x1: 1450, floor: 925, s: 0.82, mode: 'run', seed: 'team'}],
		beats: [
			b('059', 'coach', 'm', {g: {coach: 'point'}, fx: [fx('whistle', {a: 'coach', d: 90}), fx('sun', {x: 1500, y: 170, d: 120}), fx('title', {text: 'PRACTICE', sub: 'Coach Brandt', d: 80})], crowd: {team: 'run'}}),
			b('060', 'coach', 'c', {e: {coach: 'angry'}, g: {coach: 'fist'}, fx: [fx('tag', {a: 'coach', text: 'COACH NO EXCUSES', c: '#ff6a5a'})]}),
			b('061', [350, 560], 'm', {fx: [fx('ring', {x: 350, y: 490, o: 20})], dx: 0}),
			b('062', [350, 520], 'c', {fx: [fx('stat', {text: 'WATER IS A REWARD', s: 96, y: 160, d: 60})]}),
			b('063', 'coach', 'm', {fc: {coach: 'hero'}, g: {coach: 'cross'}, fx: [fx('say', {a: 'coach', text: 'How do you like practice?', o: 2})]}),
			b('064', 'hero', 'c', {e: {hero: 'normal+smirk'}, g: {hero: 'shrug'}, fx: [fx('say', {a: 'hero', text: 'Honestly? I hate it.', o: 2})]}),
			b('065', 'hero', 'm', {fx: [fx('bill', {tx: 940, ty: 880, m: 'slide', d: 70}), fx('ono', {x: 940, y: 800, text: 'FWIP', s: 0.6, o: 36, d: 30})]}),
			b('066', 'coach', 'm', {g: {coach: 'point'}, e: {coach: 'angry'}, crowd: {team: 'run'}, mv: {hero: [900, 1300]}, run: ['hero'], fx: [fx('speed', {a: 'hero', d: 70, o: 10})]}),
			b('067', 'hero', 'c', {e: {hero: 'worried'}, g: {hero: 'slump'}, fx: [fx('stat', {text: '$100 + A BLISTER', s: 100, y: 140, d: 70, c: '#6ef0a0'}), fx('sweat', {a: 'hero', d: 70})]}),
			b('068', 'colm', 'm', {mv: {hero: 700}, fx: [fx('tag', {a: 'colm', text: 'COLM'})]}),
			b('069', 'colm', 'c', {e: {colm: 'normal+smile'}, fx: [fx('stat', {text: '6\'3"', sub: 'AND A CRACKED FINGER', s: 150, d: 70, o: 4, c: '#ffd34a'})]}),
			b('070', 'coach', 'm', {fc: {coach: 'colm'}, mv: {coach: 1080}, fx: [fx('say', {a: 'coach', text: 'Are you hurt?', o: 2})]}),
			b('071', 'colm', 'c', {g: {colm: 'present'}, e: {colm: 'normal+smile'}, fx: [fx('say', {a: 'colm', text: "I'm good.", o: 2})]}),
			b('072', 'colm', 'm', {g: {colm: 'nod'}, fx: [fx('say', {a: 'colm', text: "I'm good.", o: 2, tx: 0}), fx('say', {a: 'hero', text: "…", o: 24, th: true})]}),
			b('073', 'all', 'w', {fx: [fx('fact', {m: 'flame', text: 'SPRAINED ANKLE?|"I\'M GOOD."', sub: 'EVERY TIME', c: '#6a3a1a', s: 110, d: 40, o: 0}), fx('fact', {m: 'flame', text: 'CUT LIP?|"I\'M GOOD."', c: '#6a3a1a', s: 110, d: 40, o: 40}), fx('fact', {m: 'flame', text: 'FEVER?|"I\'M GOOD."', c: '#6a3a1a', s: 110, d: 40, o: 80})]}),
			b('074', 'colm', 'c', {g: {colm: 'nod'}, e: {colm: 'normal+smile'}, fx: [fx('stat', {text: 'HIS CATCHPHRASE', s: 100, d: 60, y: 140})]}),
			b('075', 'hero', 'x', {e: {hero: 'worried'}, g: {hero: 'chin'}, fx: [fx('mark', {a: 'hero', text: '?'})]}),
		],
	},
];
