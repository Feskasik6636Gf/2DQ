import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';

/* Holds a frame until the embedded fonts are usable; always releases (also on error / after 10 s). */
export const useFontGate = () => {
	const [h] = useState(() => delayRender('fonts', {timeoutInMilliseconds: 30000}));
	useEffect(() => {
		let done = false;
		const go = () => {
			if (done) return;
			done = true;
			continueRender(h);
		};
		const t = setTimeout(go, 10000);
		Promise.all([document.fonts.load("800 40px 'Rubik'"), document.fonts.load("400 40px 'Caveat'")]).then(go, go);
		return () => clearTimeout(t);
	}, [h]);
};
