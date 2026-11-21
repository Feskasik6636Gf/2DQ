#!/usr/bin/env python3
"""Mechanical QA for narration scripts (part of the viral-script system).

Checks the things a machine can check; the 12 judgement criteria live in
QA_CHECKLIST.md.  Usage:

    lint_script.py script.md [--mode L|XL|S] [--no-plagiarism] [--json]

Exit code 1 if any FAIL, else 0.  Bands come from the 46-story corpus
(see ANALYSIS.md); they are guard rails, not targets.
"""
import argparse, hashlib, json, pathlib, re, statistics as st, struct, sys
from collections import Counter

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
N = 6

MODES = {"S": (1000, 1450), "L": (1500, 1950), "M": (2100, 2500), "XL": (3000, 3900)}

# Signature structure phrases of the competitor channels. Verbatim reuse = FAIL:
# each of these appeared in 20-30 of 31 long scripts, i.e. it is a template tic,
# not a technique.  Use the function (see DNA), not the words.
HARD = [
    r"and there'?s a cost", r"then it gets bigger", r"but where it gets crazy",
    r"it gets crazy is", r"see, (a|when a) normal person", r"at first,? it'?s amazing",
    r"but right now", r"that'?s when it stops being fun", r"tell us in the comments",
    r"hit like and subscribe", r"for more what\s?-?ifs", r"if you'?d have .{3,50}\btoo\b",
    r"so,? would you want", r"woman in a gray suit", r"black card,? just a phone number",
    r"since this morning,? you can", r"nobody else can (make|see|do|get)", r"only you\b",
    r"it'?s a scoreboard", r"scoreboard for",
]
# Overused props/names. Reuse = WARN (rotate them).
SOFT = [r"\b20 bucks\b", r"\bbest friend\b", r"\bJake\b", r"\bMaya\b", r"\bOliver\b",
        r"\bRiley\b", r"\bblack car\b", r"\bgray suit\b", r"\bpick ?up basketball\b",
        r"\bskate ?park\b", r"\bmillion views\b"]
AI_TELLS = [
    r"\bdelve\b", r"\btapestry\b", r"\bin a world where\b", r"\blittle did (you|they) know\b",
    r"\bbuckle up\b", r"\blet'?s dive\b", r"\bit'?s not just\b.{0,40}\bit'?s\b",
    r"\ba testament\b", r"\bsend a shiver\b", r"\bshiver down\b", r"\bimagine (a|if|this)\b",
    r"\bin today'?s video\b", r"\bwithout further ado\b", r"\bunbelievabl[ey]\b",
    r"\bincredibl[ey]\b", r"\bunimaginable\b", r"\bjourney\b", r"\bultimately\b",
    r"\bat the end of the day\b", r"\bgame[- ]changer\b", r"\bwhat if i told you\b",
    r"\bnot (only|just) .{3,40}, but (also )?\b", r"\bheart (pounded|raced|skipped)\b",
    r"—",  # em dash: strongest single AI tell in English VO
]
FACT_RE = re.compile(r"(?i)scientist|\bstudy\b|studies|research|experiment|according to|percent|%|"
                     r"\brecord\b|on average|\bit'?s called\b|known as|only about|about \d|"
                     r"every year|\bin (19|20)\d\d\b|doctors? (say|found)|experts? (say|teach)|about (a|one) (third|half|quarter)|times (faster|more)|\bcan (knock|float|carry)\b|famous experiment")
STOP = set("the a an and or but of to in on at for with is are was were be it its it's you your i he she they we this that as by from so not no do does did".split())


def load_fp():
    p = ROOT / "corpus_fingerprints.bin"
    if not p.exists():
        return None
    b = p.read_bytes()
    return set(struct.unpack("<%dI" % (len(b) // 4), b))


def load_cfg():
    p = ROOT / "channel_config.json"
    try:
        return json.loads(p.read_text(encoding="utf8"))
    except Exception:
        return {}


def words(t):
    return re.findall(r"[a-z0-9']+", t.lower())


def h(gram):
    return struct.unpack("<I", hashlib.blake2b(" ".join(gram).encode(), digest_size=4).digest())[0]


def clean(raw):
    raw = re.sub(r"(?s)^---.*?---\s*", "", raw)
    raw = re.sub(r"(?s)<!--.*?-->", " ", raw)
    raw = re.sub(r"\[[^\]]*\]", " ", raw)
    lines = [l for l in raw.splitlines() if not l.lstrip().startswith("#")]
    return re.sub(r"\s+", " ", " ".join(lines)).strip()


def sentences(t):
    return [s for s in re.split(r"(?<=[.!?])[\"”']?\s+", t) if s.strip()]


def analyse(text, mode, plag):
    res, add = [], lambda lvl, name, msg: res.append((lvl, name, msg))
    S = sentences(text)
    W = text.split()
    if not S:
        return {"words": 0}, [("FAIL", "empty", "no text found")]
    nw, ns = len(W), len(S)
    sl = [len(s.split()) for s in S]
    lo, hi = MODES[mode]
    m = dict(words=nw, sentences=ns, avg_sent=round(sum(sl) / ns, 1),
             short_pct=round(100 * sum(x <= 5 for x in sl) / ns),
             long_pct=round(100 * sum(x >= 20 for x in sl) / ns, 1),
             you_per100=round(100 * len(re.findall(r"\byou(r|rs|rself)?\b", text, re.I)) / nw, 1),
             digits_per100=round(100 * len(re.findall(r"\d", text)) / nw, 1),
             question_pct=round(100 * text.count("?") / ns, 1))

    # --- length / rhythm -------------------------------------------------
    if not lo <= nw <= hi:
        add("WARN" if lo * 0.85 <= nw <= hi * 1.15 else "FAIL", "length", f"{nw} words, mode {mode} wants {lo}-{hi}")
    if not 5.0 <= m["avg_sent"] <= 8.5:
        add("WARN", "rhythm", f"avg sentence {m['avg_sent']} words (corpus 6-7.5)")
    if m["short_pct"] < 35:
        add("WARN", "rhythm", f"only {m['short_pct']}% sentences <=5 words (corpus ~48%): too fluent/essay-like")
    if m["long_pct"] > 4:
        add("WARN", "rhythm", f"{m['long_pct']}% sentences >=20 words (corpus ~1%)")
    if m["you_per100"] < 4.5:
        add("WARN", "voice", f"'you' density {m['you_per100']}/100 words (corpus ~8): drifting out of second person")
    if not 3.5 <= m["digits_per100"] <= 9.5:
        add("WARN", "specifics", f"digit density {m['digits_per100']}/100 words (corpus 4-8): too vague or too number-stuffed")
    if m["question_pct"] > 5:
        add("WARN", "voice", f"{m['question_pct']}% sentences are questions (corpus ~2%): rhetorical questions weaken narration")

    # --- hook ------------------------------------------------------------
    first = sl[0] if sl else 0
    if first > 14:
        add("WARN", "hook", f"first sentence is {first} words; open with a short concrete action")
    if not re.search(r"\d", " ".join(W[:60])):
        add("WARN", "hook", "no number in the first 60 words (24/31 corpus hooks have one)")
    if re.match(r"(?i)(imagine|in a world|today|welcome|have you ever|what if)", text):
        add("FAIL", "hook", "opens with an intro/question formula instead of a scene")

    # --- facts -----------------------------------------------------------
    facts = [i for i, s in enumerate(S) if FACT_RE.search(s)]
    need = 4 if mode == "S" else 6 if mode in ("L", "M") else 12
    if len(facts) < need:
        add("WARN", "facts", f"{len(facts)} fact-like sentences, expect >= {need} for mode {mode}")
    # fact dumps: 4+ fact sentences within 5 sentences
    for i in range(len(S) - 5):
        if sum(1 for j in range(i, i + 6) if j in facts) >= 4:
            add("WARN", "facts", f"fact dump around sentence {i}: '{S[i][:60]}...'"); break

    # --- banned / overused phrases --------------------------------------
    low = text.lower()
    allowed = [a_.lower() for a_ in load_cfg().get("brand_phrases_allowed", [])]
    for p in HARD:
        for mm in re.finditer(p, low):
            if any(a_ in mm.group(0) or mm.group(0) in a_ for a_ in allowed):
                continue  # user's own brand phrase (channel_config.json)
            add("FAIL", "template-phrase", f"competitor signature phrase: '{mm.group(0)}'")
    for p in AI_TELLS:
        c = len(re.findall(p, low))
        if c:
            add("WARN", "ai-tell", f"'{p}' x{c}")
    for p in SOFT:
        c = len(re.findall(p, text, re.I))
        if c:
            add("WARN", "overused-prop", f"{p} x{c} (rotate props/names; overused in the corpus)")

    # --- repetition ------------------------------------------------------
    ws = words(text)
    grams = Counter(tuple(ws[i:i + 4]) for i in range(len(ws) - 3))
    for g, c in grams.most_common(40):
        if c >= 3 and sum(1 for x in g if x not in STOP) >= 2:
            add("WARN", "repetition", f"4-gram repeated x{c}: '{' '.join(g)}'")
    starters = Counter(s.split()[0].strip('"“,').lower() for s in S)
    for w_, c in starters.most_common(3):
        share = 100 * c / ns
        lim = 22 if w_ == "you" else 7
        if share > lim:
            add("WARN", "repetition", f"{share:.0f}% of sentences start with '{w_}'")
    dup = [s for s, c in Counter(x.lower() for x in S).items() if c > 1 and len(s.split()) > 3]
    for s in dup[:5]:
        add("WARN", "repetition", f"duplicate sentence: '{s[:60]}'")

    # --- flat windows: lexical novelty per 100 words ---------------------
    seen, nov = set(), []
    for i in range(0, len(ws) - 99, 100):
        seg = ws[i:i + 100]
        new = [x for x in seg if x not in seen and x not in STOP]
        seen.update(seg)
        nov.append((i, len(new)))
    if len(nov) > 4:
        base = st.median(n for _, n in nov[2:])
        for i, n in nov[2:]:
            if n < 0.55 * base:
                add("WARN", "flat-window", f"words {i}-{i+100}: only {n} new words (median {base:.0f}) - nothing new happens here?")

    # --- ending ----------------------------------------------------------
    tail = " ".join(W[-60:])
    if "?" not in tail:
        add("WARN", "ending", "no closing question in the last 60 words (28/31 corpus scripts end on one)")

    # --- plagiarism ------------------------------------------------------
    if plag:
        fp = load_fp()
        if fp is None:
            add("WARN", "originality", "corpus_fingerprints.bin missing; copy check skipped")
        else:
            hits = [h(ws[i:i + N]) in fp for i in range(len(ws) - N + 1)]
            run = best = 0
            for x in hits:
                run = run + 1 if x else 0
                best = max(best, run)
            pct = 100 * sum(hits) / max(1, len(hits))
            m["copied_6gram_pct"], m["longest_copied_run_words"] = round(pct, 2), best + N - 1 if best else 0
            if best >= 5:
                add("FAIL", "originality", f"verbatim run of ~{best + N - 1} words from the reference corpus")
            elif best >= 2 or pct > 1.5:
                add("WARN", "originality", f"overlap with corpus: {pct:.1f}% of 6-grams, longest run ~{best + N - 1 if best else 0} words")
    return m, res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--mode", default="L", choices=MODES)
    ap.add_argument("--no-plagiarism", action="store_true")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    text = clean(pathlib.Path(a.file).read_text(encoding="utf8"))
    m, res = analyse(text, a.mode, not a.no_plagiarism)
    if a.json:
        print(json.dumps(dict(metrics=m, findings=res), ensure_ascii=False, indent=1)); sys.exit(any(r[0] == "FAIL" for r in res))
    print("METRICS", json.dumps(m))
    for lvl in ("FAIL", "WARN"):
        for r in res:
            if r[0] == lvl:
                print(f"{lvl:4} [{r[1]}] {r[2]}")
    fails = sum(r[0] == "FAIL" for r in res); warns = sum(r[0] == "WARN" for r in res)
    print(f"RESULT: {'FAIL' if fails else 'PASS'}  ({fails} fail, {warns} warn)")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
