import React from 'react';
import type { Shot } from './shots';

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pop = (lt: number, d = 0.0) => { const x = clamp((lt - d) * 6); return x < 1 ? 0.5 + 0.7 * Math.sin(x * Math.PI * 0.5) - (x > 0.7 ? 0.2 * (x - 0.7) / 0.3 : 0) : 1; };

const base: React.CSSProperties = {
  position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: '"TitanOneX", "RubikBlack"', color: '#fff',
  WebkitTextStroke: '10px #0b0f1a', paintOrder: 'stroke fill', textShadow: '0 7px 0 #0b0f1a, 0 12px 18px rgba(0,0,0,.45)', lineHeight: 1.0,
};
const Txt: React.FC<{ y: number; size: number; lt: number; children: React.ReactNode; color?: string; rot?: number; delay?: number; stroke?: string }> = ({ y, size, lt, children, color = '#fff', rot = 0, delay = 0, stroke }) => (
  <div style={{ ...base, top: y, fontSize: size, color, transform: `scale(${pop(lt, delay)}) rotate(${rot}deg)`, opacity: clamp((lt - delay) * 10), WebkitTextStroke: `10px ${stroke || '#0b0f1a'}` }}>{children}</div>
);

const COLORS = ['#e0562a', '#2f7fd0', '#e8c230', '#3aa56a', '#c23b6e', '#7a4fc4', '#e07b2a', '#35b8c8', '#d9d9d9'];

export const Hud: React.FC<{ t: number; shot: Shot; lt: number }> = ({ t, shot, lt }) => {
  const k = shot.hud;
  if (!k) return null;
  const dur = shot.b - shot.a;
  const out = clamp((shot.b - t) * 8);
  const wrap = (el: React.ReactNode) => <div style={{ position: 'absolute', inset: 0, opacity: out }}>{el}</div>;
  switch (k) {
    case 'date': return wrap(<><Txt y={250} size={104} lt={lt}>ФЕВРАЛЬ</Txt><Txt y={370} size={150} lt={lt} delay={0.15} color="#ffd24a">1959</Txt></>);
    case 'urals': return wrap(<Txt y={250} size={78} lt={lt}>СЕВЕРНЫЙ УРАЛ</Txt>);
    case 'nine': return wrap(<>
      <Txt y={230} size={170} lt={lt} color="#ffd24a">9</Txt>
      <Txt y={400} size={70} lt={lt} delay={0.1}>ТУРИСТОВ</Txt>
      <div style={{ position: 'absolute', top: 500, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14 }}>
        {COLORS.map((c, i) => <div key={i} style={{ width: 44, height: 44, borderRadius: 22, background: c, border: '5px solid #0b0f1a', transform: `scale(${pop(lt, 0.15 + i * 0.07)})` }} />)}
      </div></>);
    case 'expert': return wrap(<><Txt y={230} size={84} lt={lt}>ОПЫТНЫЕ</Txt><Txt y={330} size={84} lt={lt} delay={0.12} color="#7dffa0">ТУРИСТЫ ✓</Txt></>);
    case 'night': return wrap(<><Txt y={240} size={130} lt={lt} rot={-3}>ОДНА</Txt><Txt y={380} size={150} lt={lt} delay={0.2} rot={2} color="#9cc0ff">НОЧЬ</Txt></>);
    case 'tragedy': return wrap(<Txt y={260} size={90} lt={lt} color="#ff6a5a" rot={-2}>ЗАГАДКА</Txt>);
    case 'wrong': return wrap(<Txt y={330} size={260} lt={lt} color="#ff4a3a">?!</Txt>);
    case 'boots': return wrap(<Txt y={260} size={100} lt={lt} rot={-3}>ОБУВЬ</Txt>);
    case 'clothes': return wrap(<Txt y={260} size={86} lt={lt} rot={2}>ТЁПЛАЯ ОДЕЖДА</Txt>);
    case 'food': return wrap(<Txt y={260} size={110} lt={lt} rot={-2}>ЕДА</Txt>);
    case 'gear': return wrap(<Txt y={260} size={86} lt={lt} rot={2}>СНАРЯЖЕНИЕ</Txt>);
    case 'temp': {
      const v = Math.round(-5 - 20 * clamp(lt / 1.4));
      return wrap(<>
        <Txt y={240} size={150} lt={lt} color="#9ee0ff">{v}°C</Txt>
        <div style={{ position: 'absolute', left: 90, top: 250, width: 56, height: 360, borderRadius: 30, background: '#e8f4ff', border: '8px solid #0b0f1a' }}>
          <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, height: `${60 - 50 * clamp(lt / 1.4)}%`, background: '#35b8ff', borderRadius: 18 }} />
        </div></>);
    }
    case 'km': return wrap(<><Txt y={240} size={170} lt={lt} color="#ffd24a">1 КМ</Txt><Txt y={440} size={64} lt={lt} delay={0.2}>ДО ЛЕСА</Txt></>);
    case 'fear': return wrap(<Txt y={300} size={240} lt={lt} color="#ff4a3a" rot={-4}>!</Txt>);
    case 'short': return wrap(<Txt y={260} size={70} lt={lt} rot={-2}>НЕ ДОБРАЛИСЬ</Txt>);
    case 'rescue': return wrap(<Txt y={250} size={96} lt={lt} color="#ffd24a">СПАСАТЕЛИ</Txt>);
    case 'trauma': return wrap(<Txt y={260} size={90} lt={lt} color="#ff5a4a" rot={-3}>ТЯЖЁЛЫЕ ТРАВМЫ</Txt>);
    case 'why1': return wrap(<><Txt y={240} size={200} lt={lt} color="#ffd24a">9 ?</Txt></>);
    case 'why2': return wrap(<Txt y={260} size={96} lt={lt} rot={-2}>ПОЧЕМУ БЕЖАЛИ?</Txt>);
    case 'y2020': return wrap(<><Txt y={220} size={190} lt={lt} color="#ffd24a">2020</Txt><Txt y={440} size={64} lt={lt} delay={0.2}>ВЛАСТИ РОССИИ</Txt></>);
    case 'avalanche': return wrap(<Txt y={250} size={130} lt={lt} color="#9ee0ff" rot={-3}>ЛАВИНА?</Txt>);
    case 'disputes': return wrap(<Txt y={250} size={140} lt={lt} color="#ffd24a" rot={2}>СПОРЫ</Txt>);
    case 'nobody': return wrap(<Txt y={250} size={96} lt={lt}>НИКТО НЕ ОСТАВИЛ</Txt>);
    case 'end': return wrap(<><Txt y={240} size={96} lt={lt} delay={0.2}>ПЕРЕВАЛ</Txt><Txt y={360} size={118} lt={lt} delay={0.5} color="#9cc0ff">ДЯТЛОВА</Txt></>);
  }
  return null;
};
