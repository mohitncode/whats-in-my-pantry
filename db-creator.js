const assert = require('assert');
const request = require('request');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const wegmansAccessKey = process.env.WEGMAN;
const url = 'mongodb://localhost:27017';
const dbName = 'whatsinmypantry';

const client = new MongoClient(url);
const ingredientsList = ["beef", "bread", "butter", "cheese", "chicken", "eggs", "garlic",
                        "green peppers", "mexican cheese", "milk", "mozzarella", "onions",
                        "peanut butter", "pepper", "pepperjack", "red peppers", "salt",
                        "tomatoes", "olive oil", "pears", "sweet potato noodles", "chives", "lemon",
                        "basil", "ricotta", "lasagna sheets", "tomato sauce", "cauliflower", "asparagus",
                        "mushrooms", "spinach", "carrots", "pastry sheets", "mayonaisse", "bacon", "lettuce",
                        "pizza dough", "flour", "pizza sauce", "pepperoni", "italian sausage", "black olives"];

let ingredients = []
for (let i = 0; i < ingredientsList.length; i++) {
  ingredients.push({
    id: i + 1,
    name: ingredientsList[i]
  });
}

const requiredIngredients = {
  "Roasted Sweet Potato Noodles with Pears":  ["olive oil", "salt", "pepper", "pears", "sweet potato noodles", "butter", "chives", "lemon"],
  "Cheese Lasagna": ["ricotta", "basil", "salt", "lasagna sheets", "tomato sauce"],
  "Roasted Vegetable Wellington": ["cauliflower", "salt", "pepper", "asparagus", "carrots", "pastry sheets", "olive oil", "musthrooms", "spinach"],
  "BLT": ["bread", "lettuce", "bacon", "mayonnaise"],
  "Skillet Supreme Pizza": ["pizza dough", "flour", "olive oil", "pizza sauce", "mozzarella", "pepperoni", "italian sausage", "onion", "green peppers", "black olives"]
};

const fetchAllRecipes = function (callback) {
  let url = 'https://api.wegmans.io/meals/recipes?api-version=2018-10-18'
  const options = {
    method: 'GET',
    headers: {
      'Subscription-Key': wegmansAccessKey
    },
    gzip: true
  }
  console.log('Making request to ', url, ' with access key ', wegmansAccessKey);
  request.get(url, options, function (error, response, body) {
    let recipes = JSON.parse(body)["recipes"];
    callback(recipes);
  });
};

let recipes = []
fetchAllRecipes(function (recipesList) {
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

  console.log(recipes);
});

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