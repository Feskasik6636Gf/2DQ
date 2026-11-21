import type {Base} from '../kit/actions';

/* Characters of this video. Key = id used in <Actor who="..."/>; `sp` = speaker code in
   lines.json (default: the id in upper case).
   THE HERO is always the same: glossy black head with white eyes and mouth (`hero: true`)
   and a red hoodie. The audience learns this silhouette in the first seconds and finds him
   in any crowd. Everyone else gets a real face and a look that fits the story.
   Look fields (all optional):
     color     hoodie / jacket / dress colour
     outfit    hoodie | tee | suit | coat | apron | dress
     build     m (broad shoulders) | f (waist, hips) | k (kid, smaller frame)
     hair      none | short | spiky | long | bob | bun | ponytail | cap | grey ; hairColor
     skin      skin tone, e.g. #f3cba8 light, #e2b48a, #c98d63, #8d5a3b dark
     eye       iris colour; lash (lashes, on by default for build f); beard; glasses via acc
     acc       [headphones | mustache | glasses]; bag = backpack colour
     legColor  trousers; shoe = sneakers; age 0..1 = wrinkles and eye bags
   Pick every look from the story: a teacher is older and wears a suit, a kid is build k,
   a doctor wears a white coat, a seller an apron. See references/world.md. */
export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#ff2540', hero: true, outfit: 'hoodie', legColor: '#1c1a26', shoe: '#f4f1ea', rim: '#ffd0d6', rimW: 2.4},
	theo: {color: '#3d6fe0', outfit: 'hoodie', hair: 'spiky', hairColor: '#8a3f1e', skin: '#e6b088', eye: '#6b4a2a', legColor: '#2b2f3a', rim: '#ffe0c8', rimW: 2.4, shoe: '#f2f2f2'},
	mom: {color: '#7a5cc4', outfit: 'tee', build: 'f', hair: 'bob', hairColor: '#4a2c22', skin: '#e9b58c', eye: '#8a5a2a', legColor: '#3a3f5c', rim: '#ffe6c8', rimW: 2.4, shoe: '#2c2540', age: 0.25},
	zoe: {color: '#f2b21c', outfit: 'dress', build: 'k', hair: 'ponytail', hairColor: '#8a4a22', skin: '#f6d2b4', eye: '#3aa0e0', legColor: '#7a5cc4', rim: '#fff0d0', rimW: 2.4, shoe: '#e0503a'},
	pizza: {color: '#f2d21c', outfit: 'tee', hair: 'cap', hairColor: '#d6403a', skin: '#c98d63', eye: '#4a3a2a', acc: ['mustache'], legColor: '#2b2f3a', rim: '#fff0c0', rimW: 2.4, shoe: '#222'},
	teacher: {color: '#8e3a4f', outfit: 'suit', build: 'f', hair: 'bun', hairColor: '#4a2c22', acc: ['glasses'], skin: '#f1c4a0', eye: '#6a4a3a', age: 0.35, legColor: '#2b1d24', rim: '#ffe6d6', rimW: 2.4, shoe: '#2b1d24'},
	lunch: {color: '#3aa37a', outfit: 'apron', build: 'f', hair: 'bun', hairColor: '#d9d9d9', skin: '#e8b48c', eye: '#5a7a6a', age: 0.5, legColor: '#1d2b24', rim: '#e8fff2', rimW: 2.4, shoe: '#1d2b24'},
	seller: {color: '#e0803a', outfit: 'tee', hair: 'short', hairColor: '#2a1c18', skin: '#d9a070', eye: '#4a3a2a', legColor: '#2b2f3a', rim: '#ffe6c8', rimW: 2.4, shoe: '#333'},
	kidA: {color: '#46a874', outfit: 'hoodie', build: 'f', hair: 'long', hairColor: '#2b1f3a', skin: '#8d5a3b', eye: '#3a2a1a', legColor: '#2d3a63', rim: '#d8fff2', rimW: 2.4, shoe: '#efe2ff'},
	gary: {color: '#6b7f8e', outfit: 'suit', hair: 'grey', hairColor: '#9a9a9a', acc: ['headphones', 'mustache'], skin: '#e8b48c', eye: '#6a7a8a', age: 0.5, legColor: '#3a3f4b', rim: '#eef4ff', rimW: 2.4, shoe: '#2b2f3a'},
	hired: {color: '#e0503a', outfit: 'tee', hair: 'spiky', hairColor: '#1d1626', skin: '#c98d63', eye: '#3a2a1a', legColor: '#2b2f3a', rim: '#ffd8c8', rimW: 2.4, shoe: '#f2f2f2'},
	aldridge: {color: '#4a4f5c', outfit: 'suit', hair: 'short', hairColor: '#8a8f9c', acc: ['glasses'], skin: '#e6b088', eye: '#3a4a5a', age: 0.45, legColor: '#2a2d36', rim: '#e6ecff', rimW: 2.4, shoe: '#111'},
	producer: {color: '#2c2f3a', outfit: 'tee', build: 'f', hair: 'ponytail', hairColor: '#d6403a', acc: ['headphones'], skin: '#f1c4a0', eye: '#4a3a2a', legColor: '#2b2f3a', rim: '#ffe0e0', rimW: 2.4, shoe: '#222'},
	reyes: {color: '#c9d8e8', outfit: 'tee', hair: 'grey', hairColor: '#d9d9d9', beard: true, skin: '#d9a070', eye: '#5a4a3a', age: 0.7, legColor: '#c9d8e8', rim: '#eef4ff', rimW: 2.4, shoe: '#c9d8e8'},
	nurse: {color: '#4ac0b0', outfit: 'coat', build: 'f', hair: 'bun', hairColor: '#2b1f3a', skin: '#e9b58c', eye: '#3a2a1a', legColor: '#4ac0b0', rim: '#d8fff2', rimW: 2.4, shoe: '#f2f2f2'},
	woman: {color: '#e86aa0', outfit: 'dress', build: 'f', hair: 'long', hairColor: '#c9803a', skin: '#f6d2b4', eye: '#3aa0e0', legColor: '#3a3f5c', rim: '#ffe0f0', rimW: 2.4, shoe: '#e86aa0'},
	man: {color: '#3a6a9a', outfit: 'coat', hair: 'short', hairColor: '#2a1c18', beard: true, skin: '#c98d63', eye: '#3a2a1a', legColor: '#2a2d36', rim: '#d8e8ff', rimW: 2.4, shoe: '#222'},
};
