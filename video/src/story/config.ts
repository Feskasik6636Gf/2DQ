/* Story-level settings. Claude rewrites this file for every new video. */
export type CounterKeyDef = {line: string; off?: number; v: number; roll?: number};

export const STORY: {
	title: string;
	hero: string; // cast id of the main character
	counter?: {label: string; color?: string; keys: CounterKeyDef[]}; // badge over the hero (age, lives, money…)
	heroAge?: (counter: number) => number; // 0..1 body ageing driven by the counter (optional)
	heroGrow?: number; // how much bigger the hero gets at full ageing (0.07 = +7 %)
	bed: string; // sound bed in public/ (ambience + sfx, music only if the user wants it)
	musicVolume?: number; // only if the bed has music in it
	endCaption?: string[]; // last words on screen (call to action), optional
} = {
	title: 'The Halcyon Star',
	hero: 'hero',
	counter: {
		label: 'CREW COUNT',
		color: '#ff6a5a',
		keys: [
			{line: '001', v: 22},
			{line: '003', off: 6, v: 23, roll: 6},
			{line: '017', v: 22, roll: 5},
			{line: '026', off: 4, v: 23, roll: 5},
			{line: '069', off: 0, v: 22, roll: 5},
			{line: '079', off: 14, v: 23, roll: 6},
			{line: '109', off: 30, v: 22, roll: 5},
			{line: '116', off: 60, v: 23, roll: 5},
			{line: '117', off: 10, v: 22, roll: 5},
			{line: '145', off: 10, v: 23, roll: 6},
			{line: '171', off: 70, v: 23, roll: 3},
		],
	},
	bed: 'sfx/bed.m4a',
	endCaption: ['YOU ARE LATE FOR THE COUNT'],
};
