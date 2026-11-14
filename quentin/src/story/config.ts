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
	title: 'Dinner is ready',
	hero: 'hero',
	counter: {
		label: 'DAY',
		color: '#ffd34a',
		keys: [
			{line: '001', v: 0},
			{line: '023', v: 1},
			{line: '035', v: 2},
			{line: '040', v: 3},
			{line: '052', v: 9, roll: 24},
			{line: '067', v: 16, roll: 24},
			{line: '074', v: 18, roll: 12},
			{line: '075', v: 23, roll: 16},
			{line: '076', v: 30, roll: 18},
			{line: '082', v: 40, roll: 20},
			{line: '108', v: 52, roll: 24},
			{line: '160', v: 70, roll: 30},
			{line: '166', v: 98, roll: 30},
			{line: '190', v: 100, roll: 12},
			{line: '218', v: 0},
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ['PART 2 SOON', 'LIKE + SUBSCRIBE'],
};
