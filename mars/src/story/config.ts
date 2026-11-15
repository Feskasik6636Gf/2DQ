/* Mars: «Что если бы Земля исчезла». Счётчик над героем — номер марсианских суток (SOL). */
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
	title: 'Mars: Earth is gone',
	hero: 'hero',
	counter: {
		label: 'SOL',
		color: '#ff6a5a',
		keys: [
			{line: '001', v: 0},
			{line: '019', off: 0, v: 1, roll: 6},
			{line: '057', off: 0, v: 3, roll: 14},
			{line: '092', off: 0, v: 9, roll: 14},
			{line: '160', off: 0, v: 40, roll: 24},
			{line: '161', off: 0, v: 60, roll: 24},
			{line: '167', off: 0, v: 70, roll: 14},
			{line: '185', off: 0, v: 101, roll: 30},
			{line: '213', off: 0, v: 109, roll: 14},
			{line: '266', off: 0, v: 500, roll: 40},
			{line: '281', off: 0, v: 687, roll: 40},
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ['WHAT WOULD YOU DO?', 'TELL US IN THE COMMENTS'],
};
