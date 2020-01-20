var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    bodyParser = require("body-parser"),
    ent = require('ent'),
    chatRouter = require("./route/superchat"),
    MongoClient = require('mongodb').MongoClient;

//require the http module
const http = require("http").Server(app);

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use("/chat", chatRouter);

//set the express.static middleware for /js and /css 
app.use(express.static(__dirname + "/public"));

//database connection
const Chat = require("./models/schema");
const connect = require("./dbconnect");

// socket 
io.sockets.on('connection', function(socket, pseudo) {

    // provisoire 
    Chat.remove({}, function(err) { 
       console.log('collection removed'); 
    });
    // provisoire 

    console.log("user connected");
    socket.on("disconnect", () => {
        socket.broadcast.emit('deconnect', socket.pseudo + ' a quitté le chat');
        console.log(socket.pseudo + " est deconnecté");
    });

    // when someone comes into the chat
	socket.on('nouveau', function(pseudo) {
		pseudo = ent.encode(pseudo);
		socket.pseudo = pseudo;
		socket.broadcast.emit('arrivee', pseudo + ' a rejoint le chat');
	});

    // when someone send message
	socket.on('chat', function(chat) {
		chat = ent.encode(chat);
		socket.broadcast.emit('message', { chat: chat, message: socket.pseudo } );

        connect.then(db => {
            console.log("connected correctly to the server");
            let message = new Chat({message: chat, sender: socket.pseudo});
            message.save();
            console.log('saved !');
        });
	});

    // delete button broadcast
    socket.on('delete', function() {
        socket.broadcast.emit('deleted', socket.pseudo);

        Chat.remove({}, function(err) { 
           console.log('collection removed') 
        });
    });
});

// port 
server.listen(8080, function() {
    console.log('app started !');
});