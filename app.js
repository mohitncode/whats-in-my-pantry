const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'dudeimstaaarviing';

const client = new MongoClient(url);

client.connect(function(err) {
  console.log("Hello World!")
});