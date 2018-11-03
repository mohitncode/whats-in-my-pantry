#!/bin/sh
stylus -u jeet -w style.styl -o css/ &> /dev/null &
pug -w index.pug -o js/ &> /dev/null &