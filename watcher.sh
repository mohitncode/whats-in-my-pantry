#!/bin/sh
stylus -w style.styl -o public/css/ &> /dev/null
mkdir data
mongod --dbpath=./data/ &> /dev/null
nodemon -w app.js