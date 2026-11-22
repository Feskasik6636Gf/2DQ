import type {Base} from '../kit/actions';

export type CastMember = Base & {sp?: string};

const R = '#ffe6c8';
export const CAST: Record<string, CastMember> = {
	hero: {color: '#ff2540', hero: true, outfit: 'hoodie', legColor: '#1c1a26', shoe: '#f4f1ea', rim: '#ffd0d6', rimW: 2.4, sp: 'HERO'},
	marisol: {color: '#f5a524', outfit: 'tee', build: 'f', hair: 'ponytail', hairColor: '#2b1a14', skin: '#c98d63', eye: '#4a2c1a', legColor: '#2d3a63', rim: R, rimW: 2.4, shoe: '#efe2ff'},
	peterson: {color: '#2f8f5b', outfit: 'tee', hair: 'none', skin: '#e8b48c', eye: '#5a4a3a', acc: ['mustache'], age: 0.45, legColor: '#4b4a55', rim: R, rimW: 2.4, shoe: '#2b2f3a'},
	mrsp: {color: '#4a86d8', outfit: 'dress', build: 'f', hair: 'bun', hairColor: '#7a4a2a', skin: '#f1c4a0', eye: '#6a4a3a', age: 0.35, legColor: '#3a3f5c', rim: R, rimW: 2.4, shoe: '#2c2540'},
	mom: {color: '#7a5cc4', outfit: 'tee', build: 'f', hair: 'bob', hairColor: '#4a2c22', skin: '#e9b58c', eye: '#8a5a2a', legColor: '#3a3f5c', rim: R, rimW: 2.4, shoe: '#2c2540'},
	dex: {color: '#2fb0c8', outfit: 'hoodie', build: 'k', hair: 'cap', hairColor: '#28304a', skin: '#e6b088', eye: '#4a5a2a', legColor: '#2b2f3a', rim: R, rimW: 2.4, shoe: '#f2f2f2'},
	lindquist: {color: '#a85c8a', outfit: 'dress', build: 'f', hair: 'grey', hairColor: '#e4e4ea', skin: '#f1c4a0', eye: '#6a7a8a', age: 0.85, acc: ['glasses'], legColor: '#4a3a4a', rim: R, rimW: 2.4, shoe: '#4a3a4a'},
	kowalski: {color: '#6b3fa0', outfit: 'coat', build: 'f', hair: 'bob', hairColor: '#3a2a3a', skin: '#e8b48c', eye: '#3a2a1a', age: 0.5, legColor: '#2b2330', rim: R, rimW: 2.4, shoe: '#2b2330'},
	chen: {color: '#6b7f8e', outfit: 'coat', hair: 'grey', hairColor: '#cfd3d8', skin: '#e2b48a', eye: '#2a2a2a', age: 0.7, acc: ['glasses'], legColor: '#3a3f4b', rim: R, rimW: 2.4, shoe: '#2b2f3a'},
	vet: {color: '#eef3f2', outfit: 'coat', build: 'f', hair: 'long', hairColor: '#2b1f3a', skin: '#8d5a3b', eye: '#3a2a1a', legColor: '#2c3a40', rim: '#d8fff2', rimW: 2.4, shoe: '#2c3a40'},
	bee: {color: '#3aa37a', outfit: 'apron', build: 'f', hair: 'cap', hairColor: '#f2f2f2', skin: '#e8b48c', eye: '#5a7a6a', age: 0.5, legColor: '#1d2b24', rim: R, rimW: 2.4, shoe: '#1d2b24'},
	sgt: {color: '#3a4256', outfit: 'suit', hair: 'cap', hairColor: '#28304a', acc: ['mustache'], skin: '#c98d63', eye: '#4a3a2a', legColor: '#22262e', rim: '#e6ecff', rimW: 2.4, shoe: '#111'},
	fire: {color: '#e8741a', outfit: 'coat', hair: 'cap', hairColor: '#f2c230', skin: '#e0ac86', eye: '#3a2a1a', legColor: '#2b2f3a', rim: '#ffe0b0', rimW: 2.4, shoe: '#111'},
	rep: {color: '#c0392b', outfit: 'suit', build: 'f', hair: 'long', hairColor: '#b8742a', skin: '#f6d2b4', eye: '#3aa0e0', legColor: '#2b2f3a', rim: R, rimW: 2.4, shoe: '#2b2f3a'},
	robe: {color: '#8a6bd0', outfit: 'tee', hair: 'spiky', hairColor: '#3a2a1a', skin: '#c98d63', eye: '#3a2a1a', legColor: '#6a5aa0', rim: R, rimW: 2.4, shoe: '#d8c8a0'},
};
