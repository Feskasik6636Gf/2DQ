# Builds src/story/timeline.json from the single voiceover (public/vo/voice.mp3) and the
# whisper sentence split (src/story/asr-lines.json). Every line keeps its real position in
# the recording, so the voice is never cut or moved.
import json, subprocess, numpy as np, math
FPS = 30
SP = {  # quoted lines spoken "by" a character (mouth flaps on them)
 '004':'HERO','022':'HERO','023':'HERO','030':'HERO','034':'HERO','043':'HERO','046':'ZOE','051':'HERO','055':'HERO','058':'HERO',
 '065':'HERO','074':'PLAYER','076':'HERO','081':'HERO','082':'HERO','085':'HERO','115':'KAI','116':'KAI','117':'KAI','120':'KAI',
 '122':'HERO','125':'KAI','126':'KAI','133':'HERO','143':'HERO','166':'HERO','167':'HOLLIS','001':'HOLLIS','174':'HERO','175':'HERO','176':'HERO',
 '178':'HOLLIS','179':'HOLLIS','180':'KAI','182':'HERO','183':'KAI','200':'HERO','201':'HERO','202':'ZOE','207':'CLERK','209':'HERO','010':'MOM','029':'EMMA'}
raw = subprocess.run(['ffmpeg','-v','error','-i','public/vo/voice.mp3','-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
s = np.frombuffer(raw, dtype=np.int16).astype(np.float32)/32768
per = 16000/FPS
n = int(math.ceil(len(s)/per))
env = np.array([math.sqrt(float(np.mean(s[int(i*per):int((i+1)*per)]**2)) if int((i+1)*per)>int(i*per) else 0) for i in range(n)])
peak = float(np.percentile(env, 99)) or 1
L = json.load(open('src/story/asr-lines.json'))
W = [w for seg in json.load(open('src/story/asr-words.json')) for w in seg['words']]
out = []
for l in L:
    a = max(0, int(round(l['s']*FPS)) - 2); b = min(n-1, int(round(l['e']*FPS)) + 3)
    out.append({'id': f"{l['n']}_{SP.get(l['n'],'N')}", 'sp': SP.get(l['n'],'N'), 'text': l['t'], 'file': 'vo/voice.mp3', 'trimStart': a,
                'from': a, 'dur': b-a+1, 'words': [[w['w'].strip().strip('.,?!"').lower(), int(round(w['s']*FPS))-a] for w in W if w['s']>=l['s']-0.01 and w['e']<=l['e']+0.01],
                'env': [round(min(1, float(v)/peak),2) for v in env[a:b+1]]})
total = n + 8
json.dump({'fps': FPS, 'total': total, 'lines': out}, open('src/story/timeline.json','w'))
print(len(out), 'lines', total, 'frames', total/FPS, 's')
