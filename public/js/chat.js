
var socket = io();

// username 
var pseudo = prompt('quel est votre pseudo ?');
socket.emit('nouveau', pseudo);
document.title = pseudo + ' - ' + document.title;
$('#username').html('la session de ' + pseudo);

// user state 
socket.on('arrivee', function(message) {
	getsound("/media/sound3.mp3");
	$('.container--chat__messages').append('<p class="arrivee">' + message + '</p>');
	gotToBottom();
});

socket.on('deconnect', function(message) {
	getsound("/media/sound2.mp3");
	$('.container--chat__messages').append('<p class="arrivee">' + message + '</p>');
	gotToBottom();
});

socket.on('deleted', function(pseudo) {
    deleteAll(pseudo);
});

// send message to server 
$('.form').submit(function(e) {
	e.preventDefault();
	var chat = $('input').val();
	socket.emit('chat', chat);
	insereMessage(chat, pseudo, 'left');
	$('input').val("").focus();
});

// delete button
$('#button--delete').click(function(e) {
	deleteAll(pseudo);
	socket.emit('delete');
	getsound("/media/sound2.mp3");
});

// broadcasts messages
socket.on('message', function(data) {
	getsound("/media/sound1.mp3");
	insereMessage(data.chat, data.message, 'right');
});

function deleteAll(pseudo) {
	$('.container--chat__messages').html('').append('<p class="arrivee">conversation supprimée par ' + pseudo + '</p>');
}

// display messages in real time 
function insereMessage(chat, pseudo, classe) {
	$('.container--chat__messages').append('<p class="message ' + classe + '"><span>' + pseudo + ' : </span><strong>' + chat + '</strong></p>');
	gotToBottom();
}

// go to bottom when message is sent 
function gotToBottom() {
	var height = $('.container--chat__messages')[0].scrollHeight;
	$("#chat").animate({ scrollTop: height }, 0);
}

// bruitages 
function getsound(file) {
	$('audio').attr('src', file);
}

// show chat list when connected 
(function() {
	fetch('/chat')
	.then(data => {
		return data.json();
	})
	.then(json => {
		json.map(data =>{
			$('.container--chat__messages').append('<p class="message"><span>' + data.sender + ' : </span><strong>' + data.message + '</strong></p>');
			gotToBottom();
		});
	});
})();

(function(){
	socket.on("message", data  =>  {
		$('.container--chat__messages').append('<p class="message"><span>' + data.sender + ' : </span><strong>' + data.message + '</strong></p>');
	});
});

