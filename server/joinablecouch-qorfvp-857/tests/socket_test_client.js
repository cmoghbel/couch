var server = 'https://joinablecouch-qorfvp-857.herokuapp.com'
var local = 'http://localhost:5000'

var socket = require('socket.io-client')(local);

socket.on('connect', function() { 
	console.log('Connected!');

	console.log("Calling join_channel...");
	socket.emit('join_channel', {channel_id: 'testChannel2', video_id: 'e-ORhEE9VVg'});

});

socket.on('join_channel', function(data){
	console.log(data);
	sleep(1000);
	console.log("Calling start_video...");
	socket.emit('start_video', {channel_id: 'testChannel2', video_id: '6ACl8s_tBzE'});
});

socket.on('start_video', function(data){
	console.log(data);
	sleep(1000);
	console.log("Calling seek...");
	socket.emit('seek', {channel_id: 'testChannel2', seconds: '60'});
});

socket.on('seek', function(data){
	console.log(data);
	sleep(1000);
	console.log("Calling disconnect...");
	socket.disconnect();
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