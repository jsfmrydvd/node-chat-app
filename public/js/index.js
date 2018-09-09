var socket = io();
socket.on('connect', function() {
    console.log('Connected to server!');
    // socket.emit('createEmail', {
    //     to: 'youremail@gmail.com',
    //     text: 'Hey!'
    // });
    socket.emit('createMessage', {
        from: 'testemail@gmail.com',
        text: 'something here'
    })
});

socket.on('disconnect', function() {
    console.log('Disconnected from server.');
});

// socket.on('newEmail', function(email) {
//     console.log('New email', email);
// })
socket.on('newMessage', function(message) {
    console.log('newMessage', message);
});
