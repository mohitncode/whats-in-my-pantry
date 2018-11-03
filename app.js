const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'dudeimstaaarviing';

const client = new MongoClient(url);

const findRecipes = function (db, callback) {
  const collection = db.collection('documents');
  collection.find({}).toArray(function (err, docs) {
    callback(docs);
  });
}

client.connect(function(err) {
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  findRecipes(db, function(docs) {
    console.log("Found the following recipes");
    console.log(docs)
    client.close();
  })
});