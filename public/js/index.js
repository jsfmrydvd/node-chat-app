var socket = io();
socket.on('connect', function() {
    console.log('Connected to server!');
    // socket.emit('createEmail', {
    //     to: 'youremail@gmail.com',
    //     text: 'Hey!'
    // });
    // socket.emit('createMessage', {
    //     from: 'testemail@gmail.com',
    //     text: 'something here'
    // })
});

socket.on('disconnect', function() {
    console.log('Disconnected from server.');
});

// socket.on('newEmail', function(email) {
//     console.log('New email', email);
// })
socket.on('newMessage', function(message) {
    console.log('newMessage', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);

    // console.log(message.from + message.text);
});
socket.on('newLocationMessage', function(message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});
//
// socket.emit('createMessage', {
//     from: 'josef',
//     text:'hey sdfsd'
// }, function(data) {
//     console.log('Got it', data);
// });
jQuery('#message-form').on('submit', function (e){
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function() {
    })
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        alert('Unable to fetch location.');
    });
});

// jQuery('#message-form').on('submit', function (e){
//     e.preventDefault();
//     socket.emit('createMessage', {
//         from: jQuery('[name=name]').val(),
//         text: jQuery('[name=message]').val()
//     }, function() {
//
//     })
// });
