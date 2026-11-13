import type {Base} from '../kit/actions';

/* Characters of «What if every lie came true?». The hero is the user's character:
   glossy black head, half-lidded white eyes, red hoodie with white drawstrings. */
export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#ff2a3c', rim: '#ffd0d4', rimW: 2.4, gloss: true, lidBase: 0.42, pupils: false, shoe: '#f2f2f2'},
	kai: {color: '#2f8fe0', hair: 'cap', hairColor: '#f2b21c', rim: '#d8ecff', rimW: 2.4, shoe: '#f2f2f2'},
	zoe: {color: '#9b6cf0', hair: 'ponytail', hairColor: '#ffd34a', rim: '#efe2ff', rimW: 2.4, shoe: '#efe2ff'},
	emma: {color: '#ff8fc0', hair: 'bun', rim: '#ffe4f0', rimW: 2.2, shoe: '#ffffff'},
	mom: {color: '#3aa37a', hair: 'bob', rim: '#e6fff2', rimW: 2.4, shoe: '#2c2540'},
	dad: {color: '#5b6bd6', hair: 'short', rim: '#e6ecff', rimW: 2.4, shoe: '#2b2f3a', acc: ['mustache']},
	dadRich: {color: '#2a2f44', outfit: 'suit', hair: 'short', rim: '#e6ecff', rimW: 2.4, shoe: '#111', acc: ['mustache'], sp: 'DAD'},
	hollis: {color: '#8e5a3a', outfit: 'suit', hair: 'grey', hairColor: '#d9d9d9', acc: ['glasses'], rim: '#ffe6d6', rimW: 2.4, shoe: '#2b1d24'},
	grandma: {color: '#e86aa0', outfit: 'gown', hair: 'grey', hairColor: '#e8e8e8', acc: ['glasses'], rim: '#ffe6f0', rimW: 2.4, shoe: '#5a2a3a'},
	player: {color: '#f08a3c', outfit: 'tee', hair: 'none', rim: '#fff0dc', rimW: 2.4, shoe: '#ffffff', chestText: '23'},
	reporter: {color: '#3fc1c9', outfit: 'suit', hair: 'bob', rim: '#e0ffff', rimW: 2.4, shoe: '#111'},
	clerk: {color: '#3aa37a', outfit: 'apron', hair: 'bun', rim: '#e8fff2', rimW: 2.4, shoe: '#1d2b24'},
	cashier: {color: '#f2b21c', outfit: 'apron', hair: 'ponytail', hairColor: '#7a3a1a', rim: '#fff0cc', rimW: 2.4, shoe: '#222'},
	guy: {color: '#6b7f8e', hair: 'spiky', rim: '#eef4ff', rimW: 2.4, shoe: '#222'},
	chef: {color: '#f2f2f2', outfit: 'apron', hair: 'none', acc: ['mustache'], rim: '#fff', rimW: 2.4, shoe: '#222'},
	assistant: {color: '#c94a3a', outfit: 'suit', hair: 'bun', rim: '#ffe0d8', rimW: 2.4, shoe: '#111'},
	kaimom: {color: '#2f6fd8', hair: 'bob', rim: '#e0ecff', rimW: 2.4, shoe: '#222'},
	sci: {color: '#eef3f2', outfit: 'coat', hair: 'bob', acc: ['glasses'], rim: '#d8fff2', rimW: 2.4, shoe: '#2c3a40'},
	sit1: {color: '#8b5cf6', hair: 'spiky', rim: '#efe2ff', rimW: 2.2},
};
