#!/bin/bash
# usage: ./still.sh t_seconds [out]
f=$(python3 -c "print(round($1*30))")
npx remotion still src/index.ts Dyatlov ${2:-/tmp/st_$f.png} --frame=$f --gl=angle 2>&1 | tail -3
