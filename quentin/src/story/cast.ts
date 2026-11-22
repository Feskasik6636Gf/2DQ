import type {Base} from '../kit/actions';

/* Cast of "The Most Beautiful Chef". The hero is the same glossy black head + red hoodie. */
export type CastMember = Base & {sp?: string};

const m = (color: string, o: Partial<Base> = {}): CastMember => ({color, rim: '#ffe6d0', rimW: 2.4, ...o} as CastMember);

export const CAST: Record<string, CastMember> = {
	hero: {color: '#ff2540', hero: true, outfit: 'hoodie', legColor: '#1c1a26', shoe: '#f4f1ea', rim: '#ffd0d6', rimW: 2.4},
	imri: m('#f4f4f4', {outfit: 'apron', hair: 'short', hairColor: '#1d1626', skin: '#c98d63', eye: '#3a2a1a', legColor: '#2b2f3a', shoe: '#222'}),
	bea: m('#3a6fe0', {outfit: 'dress', build: 'f', hair: 'ponytail', hairColor: '#2a1a14', skin: '#f1c4a0', eye: '#4a6a8a', legColor: '#2b2f3a', shoe: '#222'}),
	santos: m('#5a6070', {outfit: 'suit', hair: 'grey', hairColor: '#cfcfd6', acc: ['mustache'], age: 0.55, skin: '#e8b48c', eye: '#4a3a2a', legColor: '#2a2d38', shoe: '#111'}),
	yuki: m('#ffb3c8', {outfit: 'apron', build: 'f', hair: 'bun', hairColor: '#1d1626', skin: '#f6d2b4', eye: '#3a2a2a', legColor: '#3a3f5c', shoe: '#f2f2f2'}),
	tomas: m('#6b7f8e', {outfit: 'tee', hair: 'short', hairColor: '#2a1a10', skin: '#8d5a3b', eye: '#2a1a10', legColor: '#2b3a4a', shoe: '#2b2f3a'}),
	vance: m('#4a3a2a', {outfit: 'coat', hair: 'grey', hairColor: '#ececf2', acc: ['mustache', 'glasses'], age: 0.9, skin: '#e8b48c', eye: '#6a7a8a', legColor: '#2a2a30', shoe: '#111'}),
	odile: m('#2a2a50', {outfit: 'coat', build: 'f', hair: 'long', hairColor: '#cfd0d8', acc: ['glasses'], age: 0.6, skin: '#e6b088', eye: '#555a66', legColor: '#2a2a35', shoe: '#222'}),
	kit: m('#ffd84a', {outfit: 'tee', build: 'k', hair: 'spiky', hairColor: '#4a2c22', skin: '#e9b58c', eye: '#3a2a1a', legColor: '#3a5ac0', shoe: '#e86a5a'}),
	dad: m('#3a8a6a', {outfit: 'tee', hair: 'short', hairColor: '#4a2c22', skin: '#e9b58c', eye: '#3a2a1a', legColor: '#2b2f3a', shoe: '#222'}),
	baker: m('#fff', {outfit: 'apron', hair: 'cap', hairColor: '#fff', acc: ['mustache'], age: 0.3, skin: '#e8b48c', eye: '#5a4a3a', legColor: '#3a3f4b', shoe: '#2b2f3a'}),
	driver: m('#8a5a2c', {outfit: 'hoodie', hair: 'cap', hairColor: '#4a2c22', skin: '#c98d63', eye: '#3a2a1a', legColor: '#3a3f4b', shoe: '#222'}),
	cust1: m('#3d6fe0', {outfit: 'tee', hair: 'spiky', hairColor: '#8a3f1e', skin: '#e6b088', eye: '#6b4a2a', legColor: '#2b2f3a', shoe: '#f2f2f2'}),
	cust2: m('#e8664a', {outfit: 'dress', build: 'f', hair: 'bob', hairColor: '#4a2c22', skin: '#e9b58c', eye: '#8a5a2a', legColor: '#3a3f5c', shoe: '#2c2540'}),
	cust3: m('#7a5cc4', {outfit: 'dress', build: 'f', hair: 'long', hairColor: '#2b1f3a', skin: '#8d5a3b', eye: '#3a2a1a', legColor: '#3a3f5c', shoe: '#2c2540'}),
	cust4: m('#52a870', {outfit: 'tee', hair: 'short', hairColor: '#cfcfd6', age: 0.5, skin: '#f1c4a0', eye: '#5a7a8a', legColor: '#3a3f4b', shoe: '#2b2f3a'}),
	blogger: m('#d9a02a', {outfit: 'hoodie', hair: 'spiky', hairColor: '#1d1626', acc: ['glasses', 'headphones'], skin: '#f1c4a0', eye: '#3a2a1a', legColor: '#2b2f3a', shoe: '#f2f2f2'}),
	odalys: m('#fafafa', {outfit: 'coat', build: 'f', hair: 'bun', hairColor: '#3a2a22', age: 0.3, skin: '#e0a880', eye: '#4a3a2a', legColor: '#2b2f3a', shoe: '#222'}),
	tech: m('#eef3f2', {outfit: 'coat', build: 'f', hair: 'long', hairColor: '#2b1f3a', skin: '#8d5a3b', eye: '#3a2a1a', legColor: '#2c3a40', shoe: '#2c3a40'}),
	ludmila: m('#c0392b', {outfit: 'apron', build: 'f', hair: 'bun', hairColor: '#b0b0b8', age: 0.5, skin: '#f1c4a0', eye: '#6a4a3a', legColor: '#2b2f3a', shoe: '#222'}),
};
