#!/bin/sh
stylus -u jeet -w style.styl -o css/ &> /dev/null/
pug -w index.pug -o js/ &> /dev/null/
mkdir data
mongod --dbpath=./data/ &> /dev/null/