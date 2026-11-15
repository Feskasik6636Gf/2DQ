import type {Base} from '../kit/actions';

/* Герой — персонаж пользователя: чёрная круглая голова, прищуренные глаза, улыбка, красная худи. */
export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#ff2640', hair: 'none', expr: 'sleepy', mouth: 'smile', rim: '#ffb3bd', rimW: 2.6, shoe: '#f2f2f2'},
	mom: {color: '#8b6bd6', hair: 'bob', rim: '#ffe6c8', rimW: 2.4, shoe: '#2c2540'},
	dad: {color: '#e8862a', hair: 'short', acc: ['glasses'], rim: '#ffe0c0', rimW: 2.4, shoe: '#2a2a2a'},
	hale: {color: '#2f7f9e', outfit: 'suit', hair: 'bun', rim: '#d8f2ff', rimW: 2.4, shoe: '#101820'},
	anna: {color: '#2fb59f', hair: 'ponytail', hairColor: '#222', acc: ['glasses'], rim: '#d6fff4', rimW: 2.4, shoe: '#f2f2f2'},
	husband: {color: '#4a5a78', hair: 'short', rim: '#dfe8ff', rimW: 2.4, shoe: '#222'},
	singh: {color: '#e8d9a8', outfit: 'coat', hair: 'grey', hairColor: '#e8e8e8', acc: ['mustache'], rim: '#fff4d0', rimW: 2.4, shoe: '#2a2a2a'},
	cook: {color: '#f4f4f0', outfit: 'apron', hair: 'cap', hairColor: '#ffffff', rim: '#fff', rimW: 2.4, shoe: '#2a2a2a'},
	eng1: {color: '#f08a3c', outfit: 'tee', hair: 'cap', hairColor: '#e0572b', rim: '#ffe0c0', rimW: 2.4, shoe: '#1f1f1f'},
	eng2: {color: '#5b8bd6', outfit: 'tee', hair: 'spiky', rim: '#dfeaff', rimW: 2.4, shoe: '#1f1f1f'},
	doc: {color: '#eef3f2', outfit: 'coat', hair: 'bob', rim: '#d8fff2', rimW: 2.4, shoe: '#2c3a40'},
	kid1: {color: '#ffd23f', hair: 'spiky', rim: '#fff', rimW: 2, shoe: '#fff'},
	kid2: {color: '#3fc1c9', hair: 'ponytail', hairColor: '#f2b21c', rim: '#fff', rimW: 2, shoe: '#fff'},
	kid3: {color: '#9be564', hair: 'cap', hairColor: '#d94a3a', rim: '#fff', rimW: 2, shoe: '#fff'},
	tara: {color: '#ffd1dc', hair: 'bob', hairColor: '#111', rim: '#fff', rimW: 2, shoe: '#fff'},
	x1: {color: '#3fc1c9', hair: 'short', rim: '#fff', rimW: 2, shoe: '#222'},
	x2: {color: '#e86aa0', hair: 'ponytail', hairColor: '#333', rim: '#fff', rimW: 2, shoe: '#222'},
	x3: {color: '#9be564', hair: 'spiky', rim: '#fff', rimW: 2, shoe: '#222'},
	x4: {color: '#ffd23f', hair: 'bun', rim: '#fff', rimW: 2, shoe: '#222'},
	x5: {color: '#8b6bd6', hair: 'cap', hairColor: '#2f6fd8', rim: '#fff', rimW: 2, shoe: '#222'},
	x6: {color: '#f08a3c', hair: 'bob', rim: '#fff', rimW: 2, shoe: '#222'},
};
