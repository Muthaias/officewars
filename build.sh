#!/bin/bash

rm -rf build
mkdir -p build/cgi-bin

# Build server
gcc -lm -O0 -g src/common/*.c src/common/math/*.c src/server/*.c -o build/cgi-bin/server

# Build web client
# Don't use -s ALLOW_MEMORY_GROWTH=1 , it potentially invalidates pointers when it happens (transparent in wasm, but not when exporting pointers to js!
emcc src/client/*.c src/common/*.c src/common/math/*.c -s WASM=1 -s FETCH=1 -o client
cp src/client/web/index.html build/
cp src/client/web/rules.html build/
mv client.wasm build/
mv client build/client.js
