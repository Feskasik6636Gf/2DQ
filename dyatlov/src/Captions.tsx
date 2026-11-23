import React, { useMemo } from 'react';
import { WORDS } from './words';

interface Card { text: string; a: number; b: number }
const END = /[.,?!–—:;]$/;

function buildCards(): Card[] {
  const cards: Card[] = [];
  let i = 0;
  while (i < WORDS.length) {
    const [w, a, e] = WORDS[i];
    let text = w.replace(/[–—]/g, '').trim(), end = e;
    const nx = WORDS[i + 1];
    if (nx && !END.test(w) && (w.length + nx[0].length) <= 14 && nx[1] - e < 0.35) {
      text += ' ' + nx[0]; end = nx[2]; i += 2;
    } else i += 1;
    cards.push({ text: text.replace(/[.,]$/, '').toUpperCase(), a, b: end });
  }
  for (let k = 0; k < cards.length; k++) {
    const nextA = cards[k + 1] ? cards[k + 1].a : cards[k].b + 0.5;
    cards[k].b = Math.min(nextA, cards[k].b + 0.45);
    if (cards[k].b <= cards[k].a) cards[k].b = cards[k].a + 0.2;
  }
  return cards;
}

export const Captions: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const cards = useMemo(buildCards, []);
  const k = cards.findIndex(c => t >= c.a - 1e-4 && t < c.b);
  if (k < 0) return null;
  const c = cards[k];
  const f = (t - c.a) * fps;
  const pop = f < 5 ? 0.82 + 0.28 * Math.sin((f / 5) * Math.PI * 0.5) : f < 9 ? 1.1 - 0.1 * ((f - 5) / 4) : 1;
  const rot = ((k * 37) % 5 - 2) * 0.7;
  const long = c.text.length > 9;
  const size = long ? 58 : 66;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1290, height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        fontFamily: '"TitanOneX", "RubikBlack"', fontSize: size, lineHeight: 1.05, color: '#ffffff', textAlign: 'center', whiteSpace: 'nowrap',
        transform: `scale(${pop}) rotate(${rot}deg)`, letterSpacing: 1,
        WebkitTextStroke: '11px #000', paintOrder: 'stroke fill',
        textShadow: '0 6px 0 #000, 0 10px 14px rgba(0,0,0,0.45)',
      }}>{c.text}</div>
    </div>
  );
};
