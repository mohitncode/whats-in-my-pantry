const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const request = require('request');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const url = 'mongodb://localhost:27017/';
const dbName = 'whatsinmypantry';
const wegmansAccessKey = process.env.WEGMAN;
const client = new MongoClient(url);
let db = null;

const findRecipes = function (filter, db, callback) {
  const collection = db.collection('recipes');
  collection.find({}).toArray(function (err, docs) {
    let recipes = [];
    for (let i = 0; i < docs.length; i++) {
      const recipe = docs[i];
      const ingredients = filter['ingredientsRequired'];
      const required = recipe['ingredientsRequired'];
      if (canMakeRecipe(required, ingredients)) {
        recipes.push(recipe);
      }
    }
    callback(recipes);
  });
}

const canMakeRecipe = function (required, ingredients) {
  let canMakeRecipe = true;

  for (let i = 0; i < required.length; i++) {
    let ingredient = required[i];
    if (ingredients.indexOf(ingredient) == -1) {
      canMakeRecipe = false;
      break;
    }
  }

  return canMakeRecipe;
}

const findIngredients = function (filter, db, callback) {
  const collection = db.collection('ingredients');
  const f = filter || {};
  collection.find(f).toArray(function (err, docs) {
    db.close();
    callback(docs);
  });
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});

client.connect(function (err) {
  console.log('Connected to the database!');
  db = client.db(dbName);
});

app.post('/', function (req, res) {
  let ingredients = req.body.ingredients;
  findRecipes({ ingredientsRequired : ingredients }, db, function (docs) {
    res.send(docs);
  });
});

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))