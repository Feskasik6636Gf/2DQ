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
	title: 'The Most Beautiful Chef',
	hero: 'hero',
	counter: {
		label: 'DAY',
		keys: [
			{line: '001', v: 0},
			{line: '044', off: 0, v: 1, roll: 6},
			{line: '052', off: 0, v: 3, roll: 6},
			{line: '059', off: 0, v: 5, roll: 6},
			{line: '064', off: 0, v: 7, roll: 6},
			{line: '071', off: 0, v: 9, roll: 6},
			{line: '081', off: 0, v: 11, roll: 6},
			{line: '089', off: 0, v: 14, roll: 6},
			{line: '100', off: 0, v: 16, roll: 6},
			{line: '112', off: 0, v: 18, roll: 6},
			{line: '127', off: 0, v: 20, roll: 6},
			{line: '148', off: 0, v: 21, roll: 6},
			{line: '166', off: 20, v: 28, roll: 10},
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ['DEFEND IT', 'IN THE COMMENTS'],
};
