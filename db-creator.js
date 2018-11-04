const assert = require('assert');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'whatsinmypantry';

const client = new MongoClient(url);
const ingredientsList = ["beef", "bread", "butter", "cheese", "chicken", "eggs", "garlic",
                        "green peppers", "mexican cheese", "milk", "mozarella", "onions",
                        "peanut butter", "pepper", "pepperjack", "red peppers", "salt",
                        "tomatoes", "olive oil", "pears", "sweet potato noodles", "chives", "lemon"];

let ingredients = []
for (let i = 0; i < ingredientsList.length; i++) {
  ingredients.push({
    id: i + 1,
    name: ingredientsList[i]
  });
}

const requiredIngredients = {
  "Roasted Sweet Potato Noodles with Pears":  ["olive oil", "salt", "pepper", "pears", "sweet potato noodles", "butter", "chives", "lemon"],
};

const recipesList = JSON.parse(fs.readFileSync('data.txt'))['recipes'];

let recipes = []
for (let i = 0; i < recipesList.length; i++) {
  recipe = recipesList[i];
  for (recipeName in requiredIngredients) {
    if (recipe['name'] == recipeName) {
      recipe['ingredientsRequired'] = requiredIngredients[recipeName];
      delete recipe['_links'];
      recipes.push(recipe);
      break;
    }
  }
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
  insertIngredients(db, function (result) {
    console.log("Inserted ingredients into the database successfully!");
    client.close();
  });

  insertRecipes(db, function (result) {
    console.log("Inserted recipes into the database successfully!");
    client.close();
  });
});