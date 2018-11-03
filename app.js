const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'dudeimstaaarviing';

const client = new MongoClient(url);

const findRecipes = function (filter, db, callback) {
  const collection = db.collection('recipes');
  const f = filter || {};
  collection.find(f).toArray(function (err, docs) {
    callback(docs);
  });
}

const findIngredients = function (filter, db, callback) {
  const collection = db.collection('ingredients');
  const f = filter || {};
  collection.find(f).toArray(function (err, docs) {
    callback(docs);
  });
}

client.connect(function(err) {
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  findIngredients({ name: "butter" }, db, function(docs) {
    console.log("Found the following recipes");
    console.log(docs)
    client.close();
  });

  let ingredientsOnHand = ["olive oil", "salt", "pepper", "pears", "sweet potato noodles", "butter", "chives", "lemon"];
  findRecipes({ ingredientsRequired: ingredientsOnHand }, db, function (docs) {
    console.log("Found the following recipes for the ingredients given");
    console.log(docs)
    client.close();
  });
});