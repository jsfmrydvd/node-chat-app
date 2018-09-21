const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

//npm i express@4.14.0 --save
// console.log(__dirname + '/../public');
// console.log(publicPath);

var app = express();
// var server = http.createServer((req, res) => {
//
//
// })
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit('newEmail', {
    //     from: 'email@example.com',
    //     text: 'Hey. asdasfas',
    //     createAt: 123
    // });

    // socket.emit('newMessage', {
    //     from: 'Josef',
    //     text: 'Hey!!!',
    //     createdAt: 123
    // });

    // socket.on('createEmail', (newEmail) => {
    //     console.log('createEmail', newEmail);
    // })

    //socket.emit from Admin text "welcome to the app"

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Name and room name are required");
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        // socket.leave('The Office Fans');
        // io.emit (emits every user) -> io-to().emit;
        //socket.broadcast.emit = this send message to all except for user
        //socket.emit one user

        socket.emit('newMessage', generateMessage('Admin', `Welcome ${params.name} to port ${port}`));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));
        // socket.emit('newMe1

        callback();
    });
    socket.on('createMessage', (message, callback) => {
        console.log('Create message', message);
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback('This is from the server.');
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });

    });
    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        var user = users.removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
