#!/usr/bin/env python3
"""Build corpus_fingerprints.bin from a folder of *.txt reference scripts.

Only 4-byte hashes of 6-word shingles are stored, never the text itself, so the
repo does not hold competitor scripts but lint_script.py can still detect
verbatim reuse.  Usage:  build_fingerprints.py <folder_with_txt> [out.bin]
"""
import sys, re, hashlib, struct, pathlib

N = 6

def words(t):
    t = re.sub(r"\[[^\]]*\]", " ", t)
    return re.findall(r"[a-z0-9']+", t.lower())

def h(gram):
    return struct.unpack("<I", hashlib.blake2b(" ".join(gram).encode(), digest_size=4).digest())[0]

def main():
    src = pathlib.Path(sys.argv[1])
    out = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else pathlib.Path(__file__).resolve().parent.parent / "corpus_fingerprints.bin"
    hs = set()
    files = sorted(src.glob("*.txt"))
    for f in files:
        w = words(f.read_text(encoding="utf8"))
        hs.update(h(w[i:i + N]) for i in range(len(w) - N + 1))
    out.write_bytes(b"".join(struct.pack("<I", x) for x in sorted(hs)))
    print(f"{len(files)} files, {len(hs)} unique {N}-grams -> {out} ({out.stat().st_size} bytes)")

if __name__ == "__main__":
    main()
