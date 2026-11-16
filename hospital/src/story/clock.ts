import {L} from '../kit/core';

/* wall-clock time (minutes since 12:00 noon of the story day) tied to lines: the night is compressed */
const KEYS: [string, number][] = [
	['001', 23 * 60 + 30],
	['027', 23 * 60 + 48],
	['041', 23 * 60 + 59],
	['044', 24 * 60],
	['135', 24 * 60 + 62],
	['139', 24 * 60 + 192],
	['151', 24 * 60 + 200],
	['198', 24 * 60 + 240],
	['213', 24 * 60 + 300],
];
export const clockMin = (gf: number) => {
	let prev = {f: 0, m: KEYS[0][1]};
	for (const [id, m] of KEYS) {
		const fr = L(id).from;
		if (gf < fr) return prev.m + ((m - prev.m) * (gf - prev.f)) / Math.max(1, fr - prev.f);
		prev = {f: fr, m};
	}
	return prev.m;
};
