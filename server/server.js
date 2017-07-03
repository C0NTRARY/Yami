const express = require("express");
const bodyParser= require('body-parser');
const bodyParser= require('body-parser');
const localDynamo = require('local-dynamo');
const app = express();
const AWS = require("aws-sdk");

app.use(bodyParser.urlencoded({extended: true}))

app.listen(3000, function() {
    console.log('Listening on port 3000');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.post('/sendMessage', function(req, res) {
    console.log(req.body);
});

AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AccessKey";
AWS.config.secretAccessKey = "SecretAccessKey";
AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

localDynamo.launch({
  port: 8000,
  sharedDb: true,
  heap: '512m'
});