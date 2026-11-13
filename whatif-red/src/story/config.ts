/* Story-level settings: «What if every lie came true?» */
export type CounterKeyDef = {line: string; off?: number; v: number; roll?: number};

export const STORY: {
	title: string;
	hero: string;
	counter?: {label: string; color?: string; keys: CounterKeyDef[]};
	heroAge?: (counter: number) => number;
	heroGrow?: number;
	bed: string;
	musicVolume?: number;
	endCaption?: string[];
} = {
	title: 'What if every lie came true?',
	hero: 'hero',
	counter: {
		label: 'LIES',
		color: '#ff3b4e',
		keys: [
			{line: '001', v: 0},
			{line: '004', off: 45, v: 1, roll: 4},
			{line: '030', off: 40, v: 2, roll: 4},
			{line: '034', off: 40, v: 3, roll: 4},
			{line: '043', off: 40, v: 4, roll: 4},
			{line: '051', off: 30, v: 5, roll: 4},
			{line: '055', off: 15, v: 6, roll: 4},
			{line: '057', off: 70, v: 7, roll: 4},
			{line: '065', off: 30, v: 8, roll: 4},
			{line: '073', off: 10, v: 9, roll: 4},
			{line: '076', off: 30, v: 10, roll: 4},
			{line: '081', off: 50, v: 11, roll: 4},
			{line: '085', off: 30, v: 12, roll: 4},
			{line: '095', off: 0, v: 47, roll: 70},
			{line: '108', off: 20, v: 48, roll: 4},
			{line: '110', off: 20, v: 49, roll: 4},
			{line: '113', off: 60, v: 50, roll: 4},
			{line: '122', off: 10, v: 51, roll: 4},
			{line: '166', off: 20, v: 52, roll: 4},
			{line: '167', off: 30, v: 0, roll: 20},
		],
	},
	bed: 'sfx/bed.wav',
};
