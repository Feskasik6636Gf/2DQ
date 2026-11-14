"""Original upbeat bed (numpy): kick, hat, bass, plucky arpeggio. python tools/gen_music.py out.wav seconds"""
import sys, numpy as np, wave
SR=44100; dur=float(sys.argv[2]); bpm=124; beat=60/bpm
n=int(dur*SR); L=np.zeros(n); R=np.zeros(n)
def add(buf,sig,t):
    a=int(t*SR); 
    if a>=n: return
    sig=sig[:n-a]; buf[a:a+len(sig)]+=sig
def tone(f,d,kind="saw",amp=1.0,dec=6.0):
    t=np.arange(int(d*SR))/SR; ph=(f*t)%1.0
    w=(2*ph-1) if kind=="saw" else np.sign(np.sin(2*np.pi*f*t))*0.7 if kind=="sq" else np.sin(2*np.pi*f*t)
    return w*np.exp(-dec*t)*amp
def kick():
    t=np.arange(int(0.25*SR))/SR; f=120*np.exp(-t*25)+45
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*12)
rng=np.random.default_rng(1)
def hat(): 
    t=np.arange(int(0.05*SR))/SR; return rng.standard_normal(len(t))*np.exp(-t*90)*0.25
def snare():
    t=np.arange(int(0.18*SR))/SR; return (rng.standard_normal(len(t))*0.5+np.sin(2*np.pi*190*t)*0.4)*np.exp(-t*22)
hz=lambda m:440*2**((m-69)/12)
prog=[(57,[69,72,76]),(53,[65,69,72]),(48,[67,72,76]),(55,[67,71,74])]  # Am F C G
bars=int(dur/(beat*4))+1
for b in range(bars):
    root,ch=prog[b%4]; t0=b*beat*4
    for k in range(4):
        add(L,kick()*0.9,t0+k*beat); add(R,kick()*0.9,t0+k*beat)
        add(L,hat(),t0+k*beat+beat/2); add(R,hat(),t0+k*beat+beat/2)
        if k in (1,3): add(L,snare()*0.6,t0+k*beat); add(R,snare()*0.6,t0+k*beat)
    for k in range(8):
        tb=t0+k*beat/2; s=tone(hz(root-12),beat/2,"sq",0.5,5)
        add(L,s,tb); add(R,s,tb)
    for k in range(16):
        note=ch[[0,1,2,1][k%4]]+(12 if (k//4)%2 else 0)
        s=tone(hz(note),beat/2,"saw",0.28,9); tb=t0+k*beat/4
        add(L,s*(0.8+0.2*(k%2)),tb); add(R,s*(1.0-0.2*(k%2)),tb)
m=np.stack([L,R],1); m/=np.abs(m).max()*1.05
with wave.open(sys.argv[1],"wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m*32767).astype("<i2").tobytes())
