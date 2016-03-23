var server = 'https://joinablecouch-qorfvp-857.herokuapp.com'
var local = 'http://localhost:5000'

var Client = require('node-rest-client').Client;
var client = new Client();

function sleep(millis) {
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); }
	while(curDate-date < millis);
}

var socket = require('socket.io-client')(local);

socket.on('connect', function() { 
	console.log('Connected!');
});

socket.on('join_channel', function(data){
	console.log('join_channel:');
	console.log(data);

	// socket.emit('start_video', {channel_id: 'edmBot', video_id: "S73Nzksy6rU"});
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


console.log("Creating EDM channel...");
socket.emit('join_channel', {channel_id: 'edmBot', video_id: 'S73Nzksy6rU'});

current_video_num = 0;
play_next_video = function () {
	var video_id = search_results[current_video_num].video_id;
	console.log('Starting Video (' + video_id + '): ' + search_results[current_video_num].title);
	socket.emit('start_video', {channel_id: 'edmBot', video_id: video_id});
	current_video_num  = (current_video_num + 1) % search_results.length;
}

var search_results = []
client.get(local + "/search_v1?query=edm", function(data, response) {

	console.log(JSON.parse(data).items);
	search_results = JSON.parse(data).items

	if (search_results.length == 0) { return; }	

	setInterval(play_next_video.bind(this), 1000 * 60 * 3);
});