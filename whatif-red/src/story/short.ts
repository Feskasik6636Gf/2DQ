import type React from 'react';
export type Seg = {line: string; at?: number; ep?: string; off?: number; cont?: boolean; hold?: boolean; a?: {cx?: number; cy?: number; z?: number}; b?: {cx?: number; cy?: number; z?: number}; C?: React.FC<{f: number; dur: number}>};
export const SHORT: {mode: 'crop'; hook?: string[]; bed?: string} | {mode: 'recut'; segs: Seg[]; hook?: string[]; bed?: string} = {
	mode: 'crop',
	hook: ['WHAT IF', 'EVERY LIE CAME TRUE?'],
};
