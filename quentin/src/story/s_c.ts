import type {SceneSpec} from './direct';
import {b, fx} from './s_a';

/* 076-196: Rosa, money, school, bridge, fame, the cost */
export const SC_C: SceneSpec[] = [
	/* 076-084 kitchen with Grandma Rosa */
	{
		at: '076',
		set: 'kitchen',
		whip: true,
		cast: {hero: {x: -250}, rosa: {x: 1260, face: -1}},
		beats: [
			b('076', 'hero', 'm', {mv: {hero: [-250, 760]}, fx: [fx('title', {text: 'SUNDAY', sub: 'You apologize to Grandma Rosa', d: 80})]}),
			b('077', 'hero', 'c', {g: {hero: 'present'}, fx: [fx('say', {a: 'hero', text: 'The casserole is terrible,', o: 2})]}),
			b('078', 'hero', 'c', {g: {hero: 'shrug'}, e: {hero: 'normal+smile'}, fx: [fx('say', {a: 'hero', text: "…but your lasagna is the best ever.", o: 2}), fx('bill', {a: 'hero', o: 60, d: 60})]}),
			b('079', 'rosa', 'c', {g: {rosa: 'laugh'}, e: {rosa: 'normal+open'}, fx: [fx('tag', {a: 'rosa', text: 'RETIRED NURSE', o: 30}), fx('hearts', {a: 'rosa', d: 60})]}),
			b('080', 'rosa', 'm', {fx: [fx('fact', {m: 'flame', text: '30 YEARS|IN THE DESERT', sub: 'ROSA, RETIRED NURSE', c: '#6a3a1a', d: 52})]}),
			b('081', 'rosa', 'c', {g: {rosa: 'present'}, fx: [fx('say', {a: 'rosa', text: 'Back in July, I remember…', o: 2})]}),
			b('082', 'rosa', 'x', {g: {rosa: 'point'}, e: {rosa: 'normal+open'}, fx: [fx('rule', {text: 'THE ONLY THING|THAT MATTERS: COLD', sub: 'GRANDMA ROSA SAYS', d: 70, o: 6})]}),
			b('083', 'hero', 'm', {g: {hero: 'nod'}, fx: [fx('rule', {text: 'COOL FIRST|AMBULANCE SECOND|ICE IN THE TUB', d: 70, o: 0})]}),
			b('084', 'hero', 'x', {e: {hero: 'worried'}, g: {hero: 'chin'}, fx: [fx('say', {a: 'hero', th: true, text: 'Why do I remember this?', o: 6})]}),
		],
	},
	/* 085-092 bedroom, mom and the cash */
	{
		at: '085',
		set: 'bedroom',
		whip: true,
		cast: {hero: {x: 760}, mom: {x: 2200, face: -1}},
		beats: [
			b('085', 'hero', 'm', {g: {hero: 'cheer'}, e: {hero: 'normal+smile'}, fx: [fx('stat', {to: 2400, pre: '$', sub: 'BY DAY FIVE', d: 80, o: 6}), fx('rain', {n: 22, d: 70})]}),
			b('086', 'all', 'w', {mv: {mom: [2200, 1250]}, fx: [fx('tag', {a: 'hero', text: 'SOCK DRAWER', c: '#6ef0a0', o: 20}), fx('pile', {x: 900, y: 880, from: 3, to: 14, d: 60})]}),
			b('087', 'mom', 'c', {e: {mom: 'wide+open'}, g: {mom: 'present'}, fx: [fx('say', {a: 'mom', text: 'Where did this come from?', o: 2})]}),
			b('088', 'hero', 'c', {e: {hero: 'normal+smile'}, g: {hero: 'shrug', mom: 'laugh'}, fx: [fx('say', {a: 'hero', text: 'I tell the truth.', o: 2})]}),
			b('089', 'mom', 'x', {e: {mom: 'wide'}, g: {mom: 'recoil'}, fx: [fx('mark', {a: 'mom', text: '!'})]}),
			b('090', 'hero', 'm', {g: {hero: 'point'}, fx: [fx('say', {a: 'hero', text: 'I stole a cookie in third grade.', o: 2})]}),
			b('091', 'hero', 'c', {e: {hero: 'wide'}, fx: [fx('bill', {a: 'hero', d: 70}), fx('ring', {a: 'hero', y: 700, o: 38})]}),
			b('092', 'mom', 'm', {mv: {mom: 2250}, g: {mom: 'facepalm'}, e: {mom: 'sad'}, fx: [fx('ono', {x: 1650, y: 520, text: 'SLAM!', o: 40, d: 30})], sh: 0.7}),
		],
	},
	/* 093 pizza for the class */
	{
		at: '093',
		set: 'class',
		whip: true,
		cast: {hero: {x: 960}},
		crowds: [{id: 'cls', n: 9, x0: 220, x1: 1700, floor: 930, s: 0.9, mode: 'cheer', seed: 'pz', rows: 2}],
		beats: [b('093', 'hero', 'm', {g: {hero: 'cheer'}, fx: [fx('stat', {text: 'PIZZA!', sub: 'FOR THE WHOLE CLASS', d: 70, o: 4}), fx('rain', {n: 10, d: 60})]})],
	},
	/* 094 Dana paid back */
	{
		at: '094',
		set: 'hall',
		whip: true,
		cast: {hero: {x: 760}, dana: {x: 1120, face: -1}},
		beats: [b('094', 'all', 'm', {g: {hero: 'present', dana: 'laugh'}, fx: [fx('bill', {a: 'hero', m: 'fly', d: 60}), fx('stat', {text: 'BANGS-RELATED|EMOTIONAL DAMAGE', s: 90, y: 100, d: 80}), fx('hearts', {a: 'dana', d: 80})]})],
	},
	/* 095 coat for mom */
	{
		at: '095',
		set: 'kitchen',
		whip: true,
		cast: {hero: {x: 800}, mom: {x: 1160, face: -1}},
		beats: [b('095', 'mom', 'c', {g: {mom: 'cry', hero: 'present'}, e: {mom: 'normal+smile'}, fx: [fx('tears', {a: 'mom', d: 80}), fx('hearts', {a: 'mom', d: 80}), fx('stat', {text: 'A NEW COAT', y: 120, d: 70, o: 8})]})],
	},
	/* 096-097 a light week */
	{
		at: '096',
		set: 'sidewalk',
		whip: true,
		cast: {hero: {x: -250}},
		crowds: [{id: 'wk', n: 4, x0: 100, x1: 1800, floor: 905, s: 0.7, mode: 'walk', seed: 'wk2'}],
		beats: [
			b('096', 'hero', 'm', {mv: {hero: [-250, 800]}, fx: [fx('stat', {to: 11, sub: 'TRUTHS THIS WEEK', d: 52, o: 4})]}),
			b('097', 'hero', 'c', {g: {hero: 'cheer'}, e: {hero: 'normal+smile'}, fx: [fx('hearts', {a: 'hero', d: 70}), fx('sun', {x: 1400, y: 140, d: 70})]}),
		],
	},
	/* 098-108 assembly + cafeteria */
	{
		at: '098',
		set: 'assembly',
		whip: true,
		cast: {principal: {x: 1330, face: -1}, hero: {x: 900, floor: 960, s: 0.95, face: 1}, ibrahim: {x: 420, floor: 955, s: 0.9, face: 1}},
		crowds: [{id: 'students', n: 13, x0: 120, x1: 1800, floor: 990, s: 0.78, sit: false, rows: 2, seed: 'asm'}],
		beats: [
			b('098', 'all', 'w', {fx: [fx('title', {text: 'THE ASSEMBLY', d: 66})], dy: 20}),
			b('099', 'all', 'm', {fx: [fx('stat', {to: 900, sub: 'STUDENTS', d: 52, o: 0})], crowd: {students: 'look'}, dx: -300}),
			b('100', 'principal', 'c', {g: {principal: 'present'}, fx: [fx('say', {a: 'principal', text: 'Any questions?', o: 2})]}),
			b('101', 'hero', 'c', {g: {hero: 'sway'}, e: {hero: 'worried'}, fx: [fx('sweat', {a: 'hero', d: 80}), fx('mark', {a: 'hero', text: '?'})], crowd: {students: 'stand'}}),
			b('102', 'hero', 'm', {g: {hero: 'point'}, fx: [fx('fact', {m: 'folder', text: 'THE FISH STICKS', sub: 'IN THE CAFETERIA', c: '#5a3a2a', d: 52})]}),
			b('103', 'hero', 'c', {g: {hero: 'present'}, fx: [fx('say', {a: 'hero', text: 'They expired Monday. I read the box.', o: 2})]}),
			b('104', 'all', 'm', {crowd: {students: 'gasp'}, e: {principal: 'wide'}, fx: [fx('ono', {x: 960, y: 420, text: 'GASP!', o: 4, d: 40})], sh: 0.5, dx: -150}),
			b('105', 'ibrahim', 'c', {e: {ibrahim: 'wide'}, g: {ibrahim: 'recoil'}, fx: [fx('tag', {a: 'ibrahim', text: 'LUNCH MANAGER'}), fx('sweat', {a: 'ibrahim', d: 60})]}),
		],
	},
	{
		at: '106',
		set: 'cafe',
		whip: true,
		cast: {ibrahim: {x: 1400, face: -1}, hero: {x: 700, face: 1}},
		beats: [
			b('106', 'ibrahim', 'm', {g: {ibrahim: 'shrug'}, fx: [fx('mark', {x: 1420, y: 280, text: '✗'}), fx('ono', {x: 1420, y: 480, text: 'GONE', s: 0.8, o: 20, d: 40})]}),
			b('107', 'all', 'w', {fx: [fx('title', {text: 'FRIDAY', sub: 'A new supplier', d: 66}), fx('mark', {x: 1420, y: 200, text: '✓', o: 20})]}),
			b('108', 'hero', 'c', {e: {hero: 'normal+smirk'}, g: {hero: 'present'}, fx: [fx('bill', {a: 'hero', d: 70})]}),
		],
	},
	/* 109-114 the reporter */
	{
		at: '109',
		set: 'school',
		whip: true,
		cast: {hero: {x: 720}, rep: {x: 2200, face: -1}},
		beats: [
			b('109', 'rep', 'm', {mv: {rep: [2200, 1200]}, fx: [fx('tag', {a: 'rep', text: 'LOCAL REPORTER', o: 40})]}),
			b('110', 'rep', 'c', {g: {rep: 'present'}, fx: [fx('say', {a: 'rep', text: 'Are you scared right now?', o: 2})]}),
			b('111', 'hero', 'c', {e: {hero: 'worried+frown'}, g: {hero: 'scratch'}, fx: [fx('say', {a: 'hero', text: 'Yes.', o: 2}), fx('bill', {a: 'hero', o: 20, d: 60})]}),
			b('112', 'all', 'm', {fx: [fx('news', {text: 'STUDENT TELLS SCARY TRUTHS', sub: 'BREAKING', d: 80})], dx: 200}),
			b('113', 'hero', 'c', {e: {hero: 'wide'}, fx: [fx('stat', {text: 'THE TRUTH KID', c: '#ffd34a', d: 60})]}),
			b('114', 'hero', 'm', {g: {hero: 'cheer'}, fx: [fx('followers', {to: 14000, d: 80}), fx('hearts', {a: 'hero', d: 70})]}),
		],
	},
	/* 115-129 city council */
	{
		at: '115',
		set: 'council',
		whip: true,
		cast: {hero: {x: 960, floor: 960, s: 0.95, face: 1}, uncle: {x: 1500, floor: 940, s: 0.9, face: -1}, man: {x: 1600, floor: 960, s: 0.95, face: -1}},
		crowds: [{id: 'adults', n: 12, x0: 140, x1: 1800, floor: 1000, s: 0.8, rows: 3, seed: 'cc', mode: 'look'}],
		beats: [
			b('115', 'all', 'w', {fx: [fx('title', {text: 'THEN: THE CITY COUNCIL', d: 66})], dy: 20}),
			b('116', 'all', 'w', {fx: [fx('fact', {m: 'bridge', text: 'A BRIDGE|ON THE EAST SIDE', c: '#2a3a5a', d: 52})]}),
			b('117', 'all', 'w', {fx: [fx('fact', {m: 'bridge', text: 'SIGNED OFF BY|AN INSPECTOR', c: '#2a3a5a', d: 52})]}),
			b('118', 'all', 'w', {fx: [fx('fact', {m: 'bridge', text: 'WHO NEVER|VISITED IT', c: '#5a2a3a', d: 56})]}),
			b('119', 'uncle', 'c', {fc: {uncle: -1}, fx: [fx('tag', {a: 'uncle', text: 'YOUR UNCLE'})]}),
			b('120', 'uncle', 'm', {g: {uncle: 'laugh'}, fx: [fx('say', {a: 'uncle', text: "Ha! Nobody checked it.", o: 2})]}),
			b('121', 'hero', 'm', {crowd: {adults: 'look'}, fx: [fx('stat', {to: 60, sub: 'ADULTS IN THE ROOM', d: 54, o: 4})], g: {hero: 'sway'}, e: {hero: 'worried'}}),
			b('122', 'hero', 'x', {g: {hero: 'point'}, e: {hero: 'worried+open'}, fx: [fx('say', {a: 'hero', text: '…the bridge is unsafe.', o: 2}), fx('sweat', {a: 'hero', d: 70})], sh: 0.3}),
			b('123', 'all', 'w', {crowd: {adults: 'gasp'}, fx: [fx('fact', {m: 'bridge', text: 'BRIDGE CLOSED|THAT WEEK', c: '#6a2a2a', d: 52})]}),
			b('124', 'all', 'w', {fx: [fx('fact', {m: 'bridge', text: 'CRANE CRACKS|UNDER THE DECK', c: '#6a2a2a', d: 62})]}),
			b('125', 'all', 'w', {fx: [fx('fact', {m: 'coin', text: 'REPAIRED|BY SPRING', c: '#2a5a3a', d: 40})]}),
			b('126', 'man', 'm', {mv: {man: [1600, 1500]}, g: {man: 'present'}, fx: [fx('ring', {a: 'man', y: 600})], crowd: {adults: 'stand'}}),
			b('127', 'all', 'm', {mv: {man: 1120}, g: {man: 'present', hero: 'present'}, fc: {hero: 'man'}, fx: [fx('hearts', {a: 'man', d: 80, o: 30})]}),
			b('128', 'hero', 'c', {e: {hero: 'normal+smile'}, fx: [fx('bill', {a: 'hero', d: 60}), fx('stat', {text: '$100', d: 56, o: 10, c: '#6ef0a0'})]}),
			b('129', 'hero', 'c', {e: {hero: 'worried'}, fx: [fx('fact', {m: 'scale', text: 'SAME PRICE', sub: 'THE TRUTH MIGHT HAVE SAVED A LIFE', c: '#2a3a5a', d: 80, s: 140, o: 20})]}),
		],
	},
	/* 130-135 strangers line up */
	{
		at: '130',
		set: 'house',
		whip: true,
		cast: {hero: {x: 960, s: 1.02, face: 1}, str: {x: 1360, face: -1}, woman: {x: 1560, face: -1}, man: {x: 1740, face: -1}},
		crowds: [{id: 'line', n: 7, x0: 1250, x1: 2150, floor: 915, s: 0.78, mode: 'stand', seed: 'ln'}],
		beats: [
			b('130', 'all', 'w', {fx: [fx('title', {text: 'NOW IT GETS REAL', sub: 'Strangers line up outside your house', d: 80})]}),
			b('131', 'str', 'c', {g: {str: 'point'}, fx: [fx('say', {a: 'str', text: 'What do you honestly think of him?', o: 2})]}),
			b('132', 'woman', 'c', {g: {woman: 'present'}, fx: [fx('say', {a: 'woman', text: 'My business plan?', o: 2}), fx('mark', {a: 'woman', text: '✗', o: 36})], mv: {woman: 1280}}),
			b('133', 'man', 'c', {g: {man: 'present'}, fx: [fx('say', {a: 'man', text: 'My poem?', o: 2}), fx('mark', {a: 'man', text: '✗', o: 30})], mv: {man: 1280}}),
			b('134', 'all', 'm', {g: {woman: 'cry', man: 'present'}, fx: [fx('tears', {a: 'woman', d: 70}), fx('hearts', {a: 'man', d: 70})]}),
			b('135', 'hero', 'm', {g: {hero: 'present'}, fx: [fx('rain', {n: 20, d: 70})]}),
		],
	},
	/* 136-140 the YouTuber */
	{
		at: '136',
		set: 'house',
		cast: {hero: {x: 800, face: 1}, yt: {x: 2200, face: -1}},
		beats: [
			b('136', 'all', 'w', {mv: {yt: [2200, 1180]}, fx: [fx('plane', {d: 80}), fx('tag', {a: 'yt', text: 'FAMOUS YOUTUBER', o: 45})]}),
			b('137', 'yt', 'c', {g: {yt: 'present'}, e: {yt: 'normal+smile'}, fx: [fx('say', {a: 'yt', text: 'Is my new video any good?', o: 2})]}),
			b('138', 'hero', 'c', {g: {hero: 'shake'}, e: {hero: 'worried+frown'}, fx: [fx('say', {a: 'hero', text: 'No.', o: 2}), fx('bill', {a: 'hero', o: 16, d: 60})]}),
			b('139', 'yt', 'c', {g: {yt: 'cheer'}, e: {yt: 'normal+smile'}, fx: [fx('say', {a: 'yt', text: 'Nicest thing ever!', o: 2}), fx('hearts', {a: 'yt', d: 60})]}),
			b('140', 'all', 'm', {g: {yt: 'laugh', hero: 'shrug'}, fx: [fx('stat', {text: 'NICEST THING ANYONE DID', sub: 'FOR HIM ALL YEAR', s: 90, y: 120, d: 80})]}),
		],
	},
	/* 141-151 the lawyer friend */
	{
		at: '141',
		set: 'kitchen',
		whip: true,
		cast: {hero: {x: 760, face: 1}, lawyer: {x: 2200, face: -1}},
		beats: [
			b('141', 'all', 'm', {mv: {lawyer: [2200, 1200]}, fx: [fx('tag', {a: 'lawyer', text: "DAD'S LAWYER FRIEND", o: 44})]}),
			b('142', 'lawyer', 'c', {g: {lawyer: 'present'}, fx: [fx('say', {a: 'lawyer', text: 'Sit down. Listen to this.', o: 2})]}),
			b('143', 'all', 'w', {fx: [fx('fact', {m: 'folder', text: 'HUGE CORPORATE|FRAUD', sub: 'IN THE US', c: '#3a3a5a', d: 56})]}),
			b('144', 'all', 'w', {fx: [fx('fact', {m: 'coin', text: 'REPORT IT TO THE SEC|10% – 30%', sub: 'OF THE FINES', c: '#2a5a3a', d: 56, s: 110})]}),
			b('145', 'hero', 'c', {e: {hero: 'wide'}, fx: [fx('stat', {text: '10% – 30%', d: 50, c: '#6ef0a0'})]}),
			b('146', 'all', 'w', {fx: [fx('fact', {m: 'coin', text: 'FINES OVER|$1 MILLION', c: '#2a5a3a', d: 50})]}),
			b('147', 'hero', 'x', {e: {hero: 'wide+open'}, g: {hero: 'hands'}, fx: [fx('stat', {text: "THAT'S A LOT", c: '#ffd34a', d: 40, y: 140})]}),
			b('148', 'hero', 'c', {g: {hero: 'chin'}, fx: [fx('fact', {m: 'bridge', text: 'THE TRUTH THAT|CLOSED A BRIDGE', c: '#2a3a5a', d: 52})]}),
			b('149', 'all', 'w', {fx: [fx('fact', {m: 'tie', text: 'PAID LIKE|"YOUR TIE IS UGLY"', c: '#5a2a3a', d: 78})]}),
			b('150', 'hero', 'c', {e: {hero: 'worried'}, fx: [fx('stat', {text: 'THE PRICE IS FLAT', c: '#ffd34a', d: 50, s: 120})]}),
			b('151', 'hero', 'x', {g: {hero: 'think'}, fx: [fx('fact', {m: 'scale', text: 'COURAGE = CRUELTY', sub: 'EXACTLY THE SAME PRICE', c: '#2a3a5a', d: 80, s: 120})]}),
		],
	},
	/* 152-154 doing the math */
	{
		at: '152',
		set: 'bedroom',
		whip: true,
		cast: {hero: {x: 960}},
		beats: [
			b('152', 'hero', 'm', {g: {hero: 'chin'}, e: {hero: 'normal+smirk'}, fx: [fx('mark', {a: 'hero', text: '$'})]}),
			b('153', 'hero', 'c', {g: {hero: 'present'}, fx: [fx('rule', {text: 'EVERY SCARY TRUTH|= $100', d: 60, o: 0})]}),
			b('154', 'hero', 'c', {g: {hero: 'shrug'}, e: {hero: 'normal+smirk'}, fx: [fx('say', {a: 'hero', text: 'Why bother with the hard ones?', o: 2})]}),
		],
	},
	/* 155-158 easy targets */
	{
		at: '155',
		set: 'hall',
		whip: true,
		cast: {hero: {x: 760}, girl: {x: 1300, face: -1}},
		beats: [
			b('155', 'girl', 'c', {g: {girl: 'present'}, e: {girl: 'normal+open'}, fx: [fx('ono', {a: 'girl', tx: 130, ty: -30, text: '♪ LA LA ♪', s: 0.7, d: 70, o: 4})]}),
			b('156', 'all', 'm', {fx: [fx('ono', {x: 960, y: 420, text: 'TOUPEE?!', s: 0.9, d: 50, o: 4})], g: {hero: 'point'}}),
			b('157', 'all', 'w', {fx: [fx('fact', {m: 'flame', text: 'A LAWN LIKE|A CRIME SCENE', c: '#4a3a1a', d: 66})]}),
			b('158', 'hero', 'c', {e: {hero: 'worried'}, g: {hero: 'scratch'}, fx: [fx('say', {a: 'hero', th: true, text: 'Scary enough…', o: 4})]}),
		],
	},
	/* 159-162 day 20 */
	{
		at: '159',
		set: 'sidewalk',
		whip: true,
		cast: {hero: {x: 800}, girl: {x: 1180, face: -1}},
		crowds: [{id: 'q', n: 5, x0: 1300, x1: 2000, floor: 915, s: 0.75, mode: 'stand', seed: 'q'}],
		beats: [
			b('159', 'hero', 'm', {g: {hero: 'cheer'}, e: {hero: 'normal+smirk'}, fx: [fx('title', {text: 'DAY 20', d: 50}), fx('stat', {text: '$3,000 A DAY', c: '#6ef0a0', d: 80, o: 14}), fx('rain', {n: 30, d: 80})]}),
			b('160', 'hero', 'c', {g: {hero: 'point'}, fx: [fx('stat', {to: 30, sub: 'TRUTHS BEFORE LUNCH', d: 60, o: 2}), fx('say', {a: 'hero', text: 'Ugly. Ugly. Ugly.', o: 4})]}),
			b('161', 'girl', 'c', {g: {girl: 'cry'}, e: {girl: 'sad'}, fx: [fx('tears', {a: 'girl', d: 80}), fx('tag', {a: 'girl', text: 'SEVENTH-GRADER'})]}),
			b('162', 'hero', 'm', {g: {hero: 'present'}, e: {hero: 'worried'}, fx: [fx('bill', {a: 'girl', d: 70}), fx('stat', {text: '$100 "FOR THE TROUBLE"', s: 90, d: 70, y: 120})]}),
		],
	},
	/* 163-169 moral licensing (cards over a dark room) */
	{
		at: '163',
		set: 'bedroom',
		whip: true,
		cast: {hero: {x: 960}},
		beats: [
			b('163', 'all', 'w', {fx: [fx('fact', {m: 'scale', text: 'MORAL|LICENSING', sub: 'PSYCHOLOGISTS CALL IT', c: '#2a3a6a', d: 66, s: 160})]}),
			b('164', 'hero', 'm', {g: {hero: 'cheer'}, e: {hero: 'normal+smile'}, fx: [fx('mark', {a: 'hero', text: '✓'}), fx('stat', {text: 'DONE SOMETHING GOOD', s: 90, d: 50, y: 120})]}),
			b('165', 'all', 'w', {fx: [fx('fact', {m: 'brain', text: 'EARNED A LITTLE|CRUELTY', c: '#5a2a6a', d: 78})]}),
			b('166', 'all', 'w', {fx: [fx('fact', {m: 'bridge', text: 'THE BRIDGE|TRUTH', c: '#2a3a5a', d: 48})]}),
			b('167', 'all', 'w', {fx: [fx('fact', {m: 'tie', text: '"YOUR TIE IS|HIDEOUS"', c: '#5a2a3a', d: 70})]}),
			b('168', 'hero', 'c', {e: {hero: 'normal+smirk'}, g: {hero: 'present'}, fx: [fx('stat', {text: 'PAID IN ADVANCE', c: '#ffd34a', d: 50, s: 120})]}),
			b('169', 'hero', 'x', {e: {hero: 'worried'}, fx: [fx('tint', {c: '#1a2a6a', d: 70})]}),
		],
	},
	/* 170-177 first cost: nobody asks */
	{
		at: '170',
		set: 'hall',
		whip: true,
		cast: {hero: {x: 960}, dana: {x: 2200, face: -1}},
		crowds: [{id: 'away', n: 5, x0: 100, x1: 1800, floor: 905, s: 0.78, mode: 'walk', seed: 'aw'}],
		beats: [
			b('170', 'hero', 'm', {fx: [fx('title', {text: '1 · NOBODY ASKS', d: 66})], g: {hero: 'shrug'}}),
			b('171', 'all', 'w', {fx: [fx('say', {a: 'hero', text: 'Anyone?', o: 6})], e: {hero: 'sad'}}),
			b('172', 'hero', 'c', {g: {hero: 'slump'}, fx: [fx('mark', {a: 'hero', text: '?'})]}),
			b('173', 'all', 'w', {mv: {dana: [2200, 1250]}, fx: [fx('tag', {a: 'dana', text: 'DANA', o: 40})]}),
			b('174', 'dana', 'c', {g: {dana: 'point'}, e: {dana: 'angry'}, fx: [fx('say', {a: 'dana', text: 'You said my jacket looked like a garbage bag.', o: 2})]}),
			b('175', 'dana', 'x', {g: {dana: 'cross'}, e: {dana: 'normal+flat'}, fx: [fx('say', {a: 'dana', text: 'Real… or farming?', o: 2})]}),
			b('176', 'hero', 'c', {e: {hero: 'wide+open'}, g: {hero: 'scratch'}, fx: [fx('sweat', {a: 'hero', d: 60})]}),
			b('177', 'hero', 'x', {e: {hero: 'worried+frown'}, g: {hero: 'shrug'}, fx: [fx('mark', {a: 'hero', text: '?'}), fx('ono', {a: 'hero', tx: 120, text: "DON'T KNOW", s: 0.5, d: 50, o: 14})]}),
		],
	},
	/* 178-186 second cost: hunting */
	{
		at: '178',
		set: 'cafe',
		whip: true,
		cast: {hero: {x: 800, face: 1}, kofi: {x: 1200, face: -1}},
		beats: [
			b('178', 'hero', 'c', {e: {hero: 'angry'}, g: {hero: 'chin'}, fx: [fx('title', {text: '2 · HUNTING', d: 66})]}),
			b('179', 'kofi', 'c', {e: {kofi: 'worried'}, g: {kofi: 'present'}, fx: [fx('say', {a: 'kofi', text: 'So… how was your day?', o: 2})]}),
			b('180', 'hero', 'x', {e: {hero: 'angry+smirk'}, fx: [fx('ring', {a: 'kofi', y: 600}), fx('arrow', {a: 'kofi', y: 430})]}),
			b('181', 'hero', 'm', {e: {hero: 'sad'}, g: {hero: 'slump'}, fx: [fx('stat', {text: 'MISSING THE GOOD ONES', s: 90, y: 120, d: 60})]}),
			b('182', 'kofi', 'm', {g: {kofi: 'cheer'}, e: {kofi: 'normal+smile'}, fx: [fx('stat', {text: 'MARATHON FINISHED!', s: 100, d: 60, y: 130})], mv: {kofi: 1250}}),
			b('183', 'hero', 'c', {g: {hero: 'point'}, fx: [fx('arrow', {x: 1220, y: 800, o: 4}), fx('say', {a: 'hero', text: 'Your shoes are untied.', o: 4})]}),
		],
	},
	{
		at: '184',
		set: 'house',
		whip: true,
		cast: {hero: {x: 820, face: 1}, woman: {x: 1180, face: -1}},
		beats: [
			b('184', 'all', 'm', {g: {woman: 'present'}, e: {woman: 'normal+smile'}, fx: [fx('hearts', {a: 'woman', d: 70}), fx('tag', {a: 'woman', text: 'HIS MOM'})]}),
			b('185', 'hero', 'c', {e: {hero: 'worried'}, fx: [fx('arrow', {a: 'woman', y: 450}), fx('say', {a: 'hero', th: true, text: 'Her hair is thinning.', o: 4})]}),
			b('186', 'hero', 'm', {g: {hero: 'shrug'}, e: {hero: 'sad'}, fx: [fx('stat', {text: 'KIND TRUTHS = $0', c: '#ff6a5a', d: 80, o: 8})]}),
		],
	},
	/* 187-196 third cost: no joy */
	{
		at: '187',
		set: 'bedroom',
		whip: true,
		cast: {hero: {x: 760, face: 1}},
		beats: [
			b('187', 'hero', 'c', {e: {hero: 'sad'}, fx: [fx('title', {text: '3 · NO JOY', d: 66})]}),
			b('188', 'hero', 'm', {g: {hero: 'shrug'}, fx: [fx('stat', {text: 'A PAID TRUTH', sub: 'IS A JOB', d: 54, y: 120})]}),
			b('189', 'all', 'w', {fx: [fx('pile', {x: 1300, y: 880, from: 10, to: 22, d: 80})], e: {hero: 'sad'}}),
			b('190', 'hero', 'c', {g: {hero: 'slump'}, e: {hero: 'sad'}, fx: [fx('say', {a: 'hero', th: true, text: '…nobody to spend it with.', o: 6})]}),
			b('191', 'hero', 'm', {fx: [fx('mark', {a: 'hero', text: '☎'}), fx('say', {a: 'hero', text: 'Grandma Rosa?', o: 14})], g: {hero: 'present'}}),
			b('192', 'hero', 'c', {e: {hero: 'worried+flat'}, g: {hero: 'scratch'}, fx: [fx('say', {a: 'hero', text: "I'll try.", o: 2}), fx('stat', {text: 'THAT\'S A LIE', c: '#ff6a5a', s: 120, d: 60, o: 60})]}),
			b('193', 'hero', 'x', {e: {hero: 'sad+frown'}, fx: [fx('stat', {text: 'NO BILL.', c: '#ff6a5a', d: 40, s: 120})]}),
			b('194', 'hero', 'm', {g: {hero: 'shrug'}, fx: [fx('stat', {text: 'AT LEAST A LIE', sub: 'IS FREE', d: 50, y: 120})]}),
			b('195', 'hero', 'c', {e: {hero: 'sad'}, g: {hero: 'slump'}}),
			b('196', 'hero', 'x', {e: {hero: 'sad+frown'}, fx: [fx('tint', {c: '#1a2a6a', d: 60})]}),
		],
	},
];
