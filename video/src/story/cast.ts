import type {Base} from '../kit/actions';

export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#1f2f55', outfit: 'coat', hair: 'cap', hairColor: '#f4f4f0', age: 0.5, chestText: 'INSPECTOR', rim: '#bcd0ff', rimW: 2.4, shoe: '#0c0c10', sp: 'HERO'},
	captain: {color: '#1f2c52', outfit: 'coat', hair: 'cap', hairColor: '#eef1f8', acc: ['mustache'], rim: '#dfe8ff', rimW: 2.4, shoe: '#0c0f18', sp: 'CAPTAIN'},
	cook: {color: '#eceae2', outfit: 'apron', hair: 'bun', hairColor: '#f4f4f0', rim: '#fff5e0', rimW: 2.4, shoe: '#222', sp: 'COOK'},
	pilot: {color: '#e8742a', outfit: 'hoodie', hair: 'cap', hairColor: '#1b1f2b', acc: ['headphones'], rim: '#ffe6c8', rimW: 2.4, shoe: '#111', sp: 'PILOT'},
	newbie: {color: '#3aa37a', hair: 'short', hairColor: '#7a4a2a', acc: ['glasses'], rim: '#e8fff2', rimW: 2.4, shoe: '#f2f2f2', sp: 'NEWBIE'},
};
