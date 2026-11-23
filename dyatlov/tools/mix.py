# Procedural sound design: voice + dark ambient music + wind + SFX (all synthesized, no external samples)
import numpy as np, subprocess, sys, json, re, os
SR = 48000
D = 95.05
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
subprocess.run(['ffmpeg','-v','error','-y','-i','public/audio/vo.mp3','-ar',str(SR),'-ac','1','-f','f32le','/tmp/vo.f32'],check=True)
vo = np.fromfile('/tmp/vo.f32', dtype=np.float32)
N = int(D * SR)
vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
rng = np.random.default_rng(7)
t = np.arange(N) / SR

def lp(x, fc, order=2):
    # one-pole lowpass cascade
    a = np.exp(-2 * np.pi * fc / SR); y = x.copy()
    from scipy.signal import lfilter
    for _ in range(order): y = lfilter([1 - a], [1, -a], y)
    return y
def hp(x, fc): return x - lp(x, fc, 1)
def env_at(t0, dur, a=0.01, d=0.3):
    e = np.zeros(N); i0 = int(t0 * SR); n = int(dur * SR); n = min(n, N - i0)
    if n <= 0: return e
    tt = np.arange(n) / SR
    e[i0:i0 + n] = np.minimum(1, tt / a) * np.exp(-tt / d)
    return e
def gate(t0, t1, fade=0.4):
    return np.clip((t - t0) / fade, 0, 1) * np.clip((t1 - t) / fade, 0, 1)

# voice envelope for ducking
v_env = lp(np.abs(vo), 6, 2); v_env = np.clip(v_env / (v_env.max() + 1e-9) * 3, 0, 1)
duck = 1 - 0.55 * v_env

# --- music: dark drone + slow pulse, tension grows to the final questions
f0 = 55.0
m = np.zeros(N)
for k, (mul, amp) in enumerate([(1, 1.0), (1.5, 0.5), (2.0, 0.4), (2.38, 0.25), (3.0, 0.15)]):
    det = 1 + 0.003 * np.sin(2 * np.pi * (0.05 + 0.02 * k) * t + k)
    m += amp * np.sin(2 * np.pi * f0 * mul * np.cumsum(det) / SR)
m *= 0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t + 1) ** 2
tension = np.clip((t - 60) / 15, 0, 1) * np.clip((78 - t) / 3, 0, 1)
pulse = (np.sin(2 * np.pi * 1.1 * t) > 0.92).astype(float); pulse = lp(pulse, 30)
m += tension * (np.sin(2 * np.pi * 110 * t) * pulse * 2.2 + 0.4 * np.sin(2 * np.pi * (220 + 40 * tension * t / 30) * t) * tension)
# eerie high pad
pad = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * r * t)) for f, r in [(440, .03), (659.3, .04), (554.4, .05)])
m += 0.12 * pad
m = lp(m, 1800, 1)
music = m / (np.abs(m).max() + 1e-9) * 0.30 * duck
music *= np.clip(t / 2, 0, 1) * np.clip((D - t) / 3, 0, 1)

# --- wind
wn = rng.standard_normal(N)
w1 = lp(wn, 500, 2); w1 = w1 / np.abs(w1).max()
gust = 0.6 + 0.4 * np.sin(2 * np.pi * 0.23 * t) * np.sin(2 * np.pi * 0.11 * t + 2)
storm = np.clip(0.18 + 0.0 * t, 0, 1)
for a, b, lvl in [(0, 10, .25), (10, 20, .5), (20, 34, 1.0), (34, 39, .5), (39, 62, 1.0), (62, 68, .45), (68, 78, .9), (78, 95, .6)]:
    storm = np.where((t >= a) & (t < b), lvl, storm)
storm = lp(storm, 1.5, 1)
wind = (w1 * (0.6 + 0.9 * storm) * gust * storm * 0.22 + hp(lp(wn, 2500), 900) * storm * 0.035 * gust) * duck
interior = np.where(((t > 16) & (t < 29.5)) | ((t > 33.9) & (t < 39)), 1, 0).astype(float)
wind *= (1 - 0.55 * lp(interior, 8, 1))

# --- sfx
sfx = np.zeros(N)
def add(x, t0, g=1.0):
    i0 = int(t0 * SR)
    if i0 < 0: x = x[-i0:]; i0 = 0
    if i0 >= N or len(x) == 0: return
    x = x[:N - i0]; sfx[i0:i0 + len(x)] += x * g
def whoosh(dur=0.55, f_from=300, f_to=3000):
    n = int(dur * SR); tt = np.arange(n) / SR; nn = rng.standard_normal(n)
    out = np.zeros(n); blocks = 24
    for b in range(blocks):
        a = b * n // blocks; e = (b + 1) * n // blocks
        fc = f_from * (f_to / f_from) ** (b / blocks)
        out[a:e] = lp(nn[a:e], fc, 2)
    e = np.sin(np.pi * tt / dur) ** 2
    return out / (np.abs(out).max() + 1e-9) * e
def impact(dur=1.2, f=55, g=1.0):
    n = int(dur * SR); tt = np.arange(n) / SR
    body = np.sin(2 * np.pi * (f + 70 * np.exp(-tt * 14)) * tt) * np.exp(-tt * 3.5)
    click = lp(rng.standard_normal(n), 4000, 1) * np.exp(-tt * 40) * 0.5
    return (body + click) * g
def crunch(n_steps_t):
    for ts in n_steps_t:
        n = int(0.12 * SR); tt = np.arange(n) / SR
        x = hp(lp(rng.standard_normal(n), 3500, 1), 700) * np.exp(-tt * 38)
        add(x, ts, 0.12 + 0.05 * rng.random())
def ring(f, dur, g):
    n = int(dur * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 2.76 * tt)) * np.exp(-tt * 5) * g

# camera moves: whooshes on whip shots / big cuts
shots = json.load(open('tools/shots_fx.json'))
for s in shots:
    a, fx = s['a'], s['fx']
    if 'whip' in fx: add(whoosh(0.5, 250, 5000), a - 0.18, 0.55)
    elif 'punch' in fx or 'flash' in fx: add(whoosh(0.35, 500, 2500), a - 0.1, 0.3)
    else: add(whoosh(0.7, 150, 1200), a - 0.3, 0.22)
    if 'punch' in fx or 'flash' in fx: add(impact(0.9, 60, 0.9), a, 0.9)
    if 'dark' in fx: add(lp(rng.standard_normal(int(2 * SR)), 300, 2) * np.linspace(0, 1, int(2 * SR)) * 0.8, s['b'] - 2.0, 0.5)
# footsteps
crunch([3.0 + 0.27 * i for i in range(int((7.0 - 3.0) / 0.27))])
crunch([30.9 + 0.17 * i for i in range(int((44.0 - 30.9) / 0.17))])
crunch([44.2 + 0.5 * i for i in range(int((52 - 44.2) / 0.5))])
crunch([54 + 0.7 * i for i in range(int((59 - 54) / 0.7))])
crunch([75.8 + 0.17 * i for i in range(int(2 / 0.17))])
# tent cloth, slashes
for ts in (29.5, 73.9):
    n = int(0.5 * SR); tt = np.arange(n) / SR
    cut = hp(rng.standard_normal(n), 2500) * np.exp(-tt * 7) * np.minimum(1, tt * 80)
    add(cut, ts, 0.9); add(ring(3200, 0.4, 0.2), ts, 1)
    add(impact(1.0, 70, 1.0), ts + 0.05, 0.7)
# heartbeat around 'что-то не так' and red scenes
for a, b in [(26.8, 29.5), (64.6, 68.6), (88.5, 92)]:
    for k in np.arange(a, b, 0.62 if a < 60 else 0.55):
        add(impact(0.35, 48, 0.8), k, 0.8); add(impact(0.3, 44, 0.6), k + 0.17, 0.6)
# lantern creak / tent flapping in storm
for k in np.arange(20.9, 26.5, 0.38):
    n = int(0.18 * SR); tt = np.arange(n) / SR
    add(lp(rng.standard_normal(n), 450, 1) * np.exp(-tt * 18) * 0.6, k, 0.35 + 0.2 * rng.random())
# fire crackle 53–62
for k in np.sort(rng.uniform(53, 62, 60)):
    n = int(0.03 * SR); add(hp(rng.standard_normal(n), 1800) * np.exp(-np.arange(n) / SR * 120) * 0.8, k, 0.25 + 0.3 * rng.random())
fire_bed = hp(lp(rng.standard_normal(N), 3000, 1), 300) * gate(53, 62, 0.8) * 0.03 * (0.6 + 0.4 * np.sin(t * 17) ** 2)
# stamp, avalanche rumble, riser
add(impact(1.4, 58, 1.2), 80.35, 1.0); add(whoosh(0.2, 4000, 900), 80.2, 0.4)
rum = lp(rng.standard_normal(N), 160, 2) * gate(81.4, 88.8, 0.8) * np.clip(1 - (t - 84) / 6, 0.15, 1)
rum = rum / (np.abs(rum).max() + 1e-9) * 0.55
riser = lp(rng.standard_normal(N), 2200, 1) * np.clip((t - 66) / 3.0, 0, 1) * np.clip((68.5 - t) / 0.2, 0, 1) * 0.0
add(whoosh(2.8, 200, 7000), 65.7, 0.45)
add(impact(1.8, 50, 1.2), 68.6, 1.0)
add(impact(2.0, 46, 1.2), 9.95, 1.1)  # "Но одна ночь"
add(impact(2.5, 42, 1.0), 77.9, 0.8)
# final fade-out rumble swell
add(whoosh(3.0, 100, 600), 91.4, 0.4)

sfx = sfx / (np.abs(sfx).max() + 1e-9) * 0.9
bed = wind + fire_bed * duck + rum * 0.0
mix = vo * 1.0 + music * 0.8 + bed * 0.9 + (rum * 0.5 * duck) + sfx * 0.30 * (1 - 0.35 * v_env)
mix = np.tanh(mix * 0.95)
np.asarray(mix, dtype=np.float32).tofile('/tmp/mix.f32')
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','/tmp/mix.f32','-af','loudnorm=I=-15:TP=-1.5:LRA=7,aresample=48000,pan=stereo|c0=c0|c1=c0','-c:a','aac','-b:a','192k','public/audio/mix.m4a'],check=True)
print('mix ok')
