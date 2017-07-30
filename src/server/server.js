const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketClient = require('./socketClient');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./dist/public'));


http.listen(3000, function(){
  console.log('listening on *:3000');
});

socketClient.initSocket(io);