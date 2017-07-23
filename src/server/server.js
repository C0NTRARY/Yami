const express = require('express');
const bodyParser= require('body-parser');
const localDynamo = require('local-dynamo');
const app = express();
const AWS = require('aws-sdk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./dist/public'));

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: './dist/public/'});
});

app.post('/sendMessage', function(req, res) {
  console.log(req.body);
});

AWS.config = new AWS.Config();
AWS.config.update({
  accessKeyId: "AccessKey",
  secretAccessKey: "SecretAccessKey",
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

localDynamo.launch({
  port: 8000,
  sharedDb: true,
  heap: '512m'
});

// example for using dynamodb
dynamoClient = new AWS.DynamoDB();

const tableParams = {
  TableName : "messages",
  KeySchema: [
    { AttributeName: "channelId", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "channelId", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
      ReadCapacityUnits: 5, 
      WriteCapacityUnits: 5
  }
};

dynamoClient.createTable(tableParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    const messageParams = {
      TableName:"messages",
      Item:{
        channelId : { S: "exampleChannelId"},
        messageText: { S: "example message text"}
      }
    };
    
    dynamoClient.putItem(messageParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        const getParams = {
          TableName: 'messages',
          Key: {
            'channelId' : {S: 'exampleChannelId'}
          }
        };

        dynamoClient.getItem(getParams, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data);
          }
        });
      }
    });
  }
});
