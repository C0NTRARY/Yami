const express = require("express");
const DynamoDbLocal = require('dynamodb-local');
const dynamoLocalPort = 8000;
const bodyParser= require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended: true}))

DynamoDbLocal.launch(dynamoLocalPort, null, ['-sharedDb'])
    .then(function () {
        DynamoDbLocal.stop(dynamoLocalPort);
    });

app.listen(3000, function() {
    console.log('Listening on port 3000');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.post('/sendMessage', function(req, res) {
    console.log(req.body);
});