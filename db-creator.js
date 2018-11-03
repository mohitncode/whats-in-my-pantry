const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'dudeimstaaarviing';

const client = new MongoClient(url);
const ingredientsList = [
  "beef",
  "bread",
  "butter",
  "cheese",
  "chicken",
  "eggs",
  "garlic",
  "green peppers",
  "mexican cheese",
  "milk",
  "mozarella",
  "onions",
  "peanut butter",
  "pepper",
  "pepperjack",
  "red peppers",
  "salt",
  "tomatoes",
];

let ingredients = []
for (let i = 0; i < ingredientsList.length; i++) {
  ingredients.push({
    id: i + 1,
    name: ingredientsList[i]
  });
}

const insertIngredients = function (db, callback) {
  const collection = db.collection('documents');
  collection.insertMany(ingredients, function (err, result) {
    console.log("Inserted 18 documents into the collection");
    callback(result);
  });
}

const findRecipes = function (db, callback) {
  const collection = db.collection('documents');
  collection.find({}).toArray(function (err, docs) {
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

client.connect(function(err) {
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  insertIngredients(db, function() {
    console.log("Inserted ingredients into the database successfully!");
    client.close();
  });
});