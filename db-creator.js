const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'dudeimstaaarviing';

const client = new MongoClient(url);
const ingredientsList = ["beef", "bread", "butter", "cheese", "chicken", "eggs", "garlic",
                        "green peppers", "mexican cheese", "milk", "mozarella", "onions",
                        "peanut butter", "pepper", "pepperjack", "red peppers", "salt",
                        "tomatoes", "olive oil", "pears", "sweet potato noodles", "chives", "lemon"];

const recipesList = [{
  name: "Roasted Sweet Potato Noodles with Pears",
  ingredientsRequired: ["olive oil", "salt", "pepper", "pears", "sweet potato noodles", "butter", "chives", "lemon"]
}];

let ingredients = []
for (let i = 0; i < ingredientsList.length; i++) {
  ingredients.push({
    id: i + 1,
    name: ingredientsList[i]
  });
}

let recipes = []
for (let i = 0; i < recipesList.length; i++) {
  recipe = recipesList[i];
  recipe['id'] = i + 1;
  recipes.push(recipe);
}

const insertIngredients = function (db, callback) {
  const collection = db.collection('ingredients');
  collection.insertMany(ingredients, function (err, result) {
    callback(result);
  });
}

const insertRecipes = function (db, callback) {
  const collection = db.collection('recipes');
  collection.insertMany(recipes, function (err, result) {
    callback(result);
  });
}

client.connect(function(err) {
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  insertIngredients(db, function() {
    console.log("Inserted ingredients into the database successfully!");
    client.close();
  });

  insertRecipes(db, function() {
    console.log("Inserted recipes into the database successfully!");
    client.close();
  });
});