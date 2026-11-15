// Joins out/chunks_Long/c*.mp4 (rendered on GitHub Actions), rebuilds the sound bed, mixes voice + bed, -16 LUFS.
//   node tools/assemble.mjs [Long]
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT, ffbin, say} from './lib.mjs';

const id = process.argv[2] ?? 'Long';
const dir = path.join(ROOT, 'out', `chunks_${id}`);
const files = fs.readdirSync(dir).filter((f) => /^c\d+\.mp4$/.test(f)).sort();
if (!files.length) throw new Error('no chunks in ' + dir);
say(`joining ${files.length} chunks`);
const ff = ffbin();
const list = path.join(dir, 'list.txt');
fs.writeFileSync(list, files.map((f) => `file '${f}'`).join('\n'));
const silent = path.join(dir, 'video.mp4');
let r = spawnSync(ff, ['-hide_banner', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent], {stdio: 'inherit'});
if (r.status !== 0) process.exit(1);
const tl = 'src/story/timeline.json';
const mix = path.join(dir, 'mix.wav');
r = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'mix-audio.mjs'), tl, 'public/sfx/bed.wav', '1', mix], {stdio: 'inherit', cwd: ROOT});
if (r.status !== 0) process.exit(1);
const out = path.join(ROOT, 'out', `${id}.mp4`);
r = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'loudness.mjs'), mix, silent, out, '-16'], {stdio: 'inherit', cwd: ROOT});
if (r.status !== 0) process.exit(1);
say(`DONE ${path.relative(ROOT, out)}`);
