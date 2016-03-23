var server = 'https://joinablecouch-qorfvp-857.herokuapp.com'
var local = 'http://localhost:5000'

var socket = require('socket.io-client')(local);

socket.on('connect', function() { 
	console.log('Connected!');
});

socket.on('join_channel', function(data){
	console.log('join_channel:');
	console.log(data);
});

socket.on('start_video', function(data){
	console.log('start_video:');
	console.log(data);
});

socket.on('seek', function(data){
	console.log('seek:');
	console.log(data);
});

socket.on('disconnect', function(){
	console.log('Disconnected!');
});

function sleep(millis) {
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); }
	while(curDate-date < millis);
}

console.log("Joining '1', emit commands to this channel to test...");
socket.emit('join_channel', {channel_id: '1', video_id: 'S73Nzksy6rU'});