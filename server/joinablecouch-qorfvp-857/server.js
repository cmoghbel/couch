// Require Node Modules
var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Parse = require('parse/node'),
    ParseCloud = require('parse-cloud-express');

var google = require('googleapis');
var youtubedl = require('youtube-dl');
var Promise = require("node-promise").Promise;
var when = require("node-promise").when;

var youtube_api_key = 'AIzaSyCM3E6ir_giadOaPa_5REQAwXRcfcjvuk8';
var youtube = google.youtube({ version: 'v3', auth: youtube_api_key });
var youtube_video_url_prefix = 'https://www.youtube.com/watch?v=';

var app = express();

// console.log("Sighhhh");

// var channels = []

// Import your cloud code (which configures the routes)
require('./cloud/main.js');
// Mount the webhooks app to a specific path (must match what is used in scripts/register-webhooks.js)
app.use('/webhooks', ParseCloud.app);

// Host static files from public/
app.use(express.static(__dirname + '/public'));

// Catch all unknown routes.
app.all('/', function(request, response) {
  response.status(404).send('Page not found.');
});

app.get("/search_v1", function(request, response) {
  // TODO: Add a reasonable default that's not T-Swift
  // TODO: Handle error cases gracefully
  console.log('Called search_v1');

  var query = 'Taylor Swift';
  if (request.query.query) {
    query = request.query.query;
  }
  var type = 'video';
  if (request.query.query_type) {
    type = request.query.query_type;
  }
  var max_results = 50;

  youtube.search.list({
    q: query,
    part: 'snippet',
    type: type,
    maxResults: max_results,
  }, function(error, result) {
    if (result) {
      var json = {};
      if (result.nextPageToken) {
        json.nextPageToken = result.nextPageToken;
      }
      if (result.prevPageToken) {
        json.prevPageToken = result.prevPageToken;
      }
      var items = []
      var videos = []
      for (var i = 0; i < result.items.length; ++i) {
      	var video = new Video(result.items[i].id.videoId, result.items[i].snippet.title, result.items[i].snippet.thumbnails.high.url);
        // TODO: Remove dictionary when verified that video object is working.
        var item = {
          video_id: result.items[i].id.videoId,
          video_url: youtube_video_url_prefix + result.items[i].id.videoId,
          title: result.items[i].snippet.title,
          thumbnal_url: result.items[i].snippet.thumbnails.high.url
        };
        items.push(item);
        item = result.items[i];
        videos.push(video);
      }
      // json.items = items;
      json.items = videos;
      response.status(200).send(json);
    }
  });
});

app.get('/getChannels_v1', function(request, response) {
	response.status(200).send(channels);
})

// app.get('/createChannel_v1', function(request, response) {
// 	console.log("Called createChannel_v1 on heroku");
// 	console.log(request.query.channel_id);
// 	console.log(request.query.video_id);
// 	channels[request.query.channel_id] = new Channel(request.query.channel_id, request.query.video_id, 0, Date.now());
// 	response.status(200).send(channels);
// })

app.get('/getNumOnlineUsers_v1', function(request, response) {
	// response.status(200);
	response.json(users.length);
})

/*
 * Launch the HTTP server
 */
var port = process.env.PORT || 5000;
var server = http.createServer(app);
server.listen(port, function() {
  console.log('[LOG] Cloud Code Webhooks server running on port ' + port + '.');
});

var users = {};   // user_id : user
var videos = {}   // video_id : video
var channels = {} // channel_id : channel
var io = require('socket.io')(server)

console.log('[LOG] Starting up socket server');
console.log('[LOG] Adding testChannel');
var channel2 = new Channel('rob', 'rob_id', new Video('QcIy9NiNbmo', 'Taylor Swift - Bad Blood ft. Kendrick Lamar', 'https://i.ytimg.com/vi/QcIy9NiNbmo/maxresdefault.jpg'), 0, Date.now());
channels[channel2.channel_id] = channel2;
// ROB YOU CAN'T DO THIS
// channel2.video.playback_url = channel2.video.getPlaybackUrl();
// YOU HAVE TO DO THIS
when(channel2.video.getPlaybackUrl(), function(result) {
	channel2.video.playback_url = result;	  
  	videos[channel2.video.video_id] = channel2.video;
},
function(error){
   console.log("[ERROR] Failed when calling getPlaybackUrl: " + error);
});


io.on('connection', function(socket){

	// The user it's added to the array if it doesn't exist
    // if(users.indexOf(socket.id) === -1) {
    if (!(socket.id in users)) {
        users[socket.id] = new User(socket.id, null);
    }

    // Log
    logConnectedUsers();


	console.log("[LOG] Client (" + socket.id + ") connected");

	// socket.on('join_channel', function(data){
	// 	// param: channel_id - Name of the channel to join
	// 	console.log("[LOG] Client (" + socket.id + ") called join_channel with data: " + JSON.stringify(data));
	// 	var channel_id = data.channel_id		
	// 	var channel = channels[channel_id];
	// 	if (!channel) {
	// 		// If no channel exists already, create it and join. It should have a video id.
	// 		// If not, we fail completely.
	// 		if (!data.video_id) {
	// 			console.log("[ERROR] seek - Channel (" + data.channel_id + ") does not exist and no video_id was passed");
	// 			io.to(socket.id).emit('join_channel', {error: "ERROR: No channel existed and no video_id was passed"});
	// 		}
	// 		console.log("[LOG] Channel: " + channel_id + " did not exist, creating!");
	// 		channel = new Channel(channel_id, data.video_id, 0, Date.now());
	// 		channels[channel_id] = channel;
	// 		socket.join(channel_id);
	// 		io.to(socket.id).emit('join_channel', channel);
	// 	} else {
	// 		// If a channel already exists, send the client a channel info object unique to them
	// 		// that specifies where they should join in to the stream.
	// 		console.log("[LOG] Channel: " + channel_id + " exists!");
	// 		socket.join(channel_id);
	// 		var updated_seek = ((Date.now() - channel.last_update_time) / 1000) + channel.seek;
	// 		var channel_info = new Channel(channel_id, channel.video_id, updated_seek, channel.last_update_time);
	// 		io.to(socket.id).emit('join_channel', channel_info);
	// 	}				
	// });
	
	socket.on('join_channel', function(data){
		// param: channel_id - Name of the channel to join
		// optional param: video_id - ID of the video to start the channel with (if you're creating)
		// optional param: title- Title of the video to start the channel with (if you're creating)
		// optional param: thumbnail_url - Thumbnail URL of the video to start the channel with (if you're creating)
		
		console.log("[LOG] Client (" + socket.id + ") called join_channel with data: " + JSON.stringify(data));
		var channel_id = data.channel_id		
		var channel = channels[channel_id];
		var user = users[socket.id];
		if (!channel) {
			// If no channel exists already, create it and join. It should have a video id.
			// If not, we fail completely.
			if (!data.video_id) {
				console.log("[ERROR] seek - Channel (" + data.channel_id + ") does not exist and no video_id was passed");
				io.to(socket.id).emit('join_channel', {error: "ERROR: No channel existed and no video_id was passed"});
				return;
			}
			console.log("[LOG] Channel: " + channel_id + " did not exist, creating!");			
			var video = new Video(data.video_id, data.title, data.thumbnail_url);
			when(video.getPlaybackUrl(), function(result) {
				socket.join(channel_id);
				user.current_channel_id = channel_id;
				video.playback_url = result;	  
			  	videos[video.video_id] = video;
				channel = new Channel(channel_id, user, video, 0, Date.now());
				channels[channel_id] = channel;
				io.to(socket.id).emit('join_channel', channel);
			},
			function(error){
			   console.log("[ERROR] Failed when calling getPlaybackUrl!");
			});
			
		} else {
			// If a channel already exists, send the client a channel info object unique to them
			// that specifies where they should join in to the stream.
			console.log("[LOG] Channel: " + channel_id + " exists!");
			socket.join(channel_id);
			user.current_channel_id = channel_id;
			channel.users.push(user);
			var updated_seek = ((Date.now() - channel.last_update_time) / 1000) + channel.seek;
			var channel_info = new Channel(channel_id, channel.broadcaster_id, videos[data.video_id], updated_seek, channel.last_update_time);
			channel_info.users = channel.users;	// need to do this to account for some ctor weirdness		
			io.to(channel.channel_id).emit('join_channel', channel_info);
		}				
	});

	socket.on('start_video', function(data){
		console.log("[LOG] Client (" + socket.id + ") called start_video with data: " + JSON.stringify(data));
		// param: channel_id
		// param: video_id - the YouTube video id
		console.log(channels);
		var channel = channels[data.channel_id];
		if (!channel) {
			console.log("[ERROR] start_video - Channel (" + data.channel_id + ") does not exist!");
			io.to(socket.id).emit('start_video', {error: "ERROR: Channel " + channels[data.channel_id] + " does not exist!"});
			return;
		}
		console.log('((' + videos + '))');
		var video = new Video(data.video_id, data.title, data.thumbnail_url);
		when(video.getPlaybackUrl(), function(result) {
			video.playback_url = result;	  
		  	videos[video.video_id] = video;

		  	channel.video = video;
			channel.last_update_time = Date.now();
			channel.seek = 0
			io.to(data.channel_id).emit('start_video', channel);

			// channel = new Channel(channel_id, video, 0, Date.now());
			// channels[channel_id] = channel;
			// socket.join(channel_id);
			// io.to(socket.id).emit('join_channel', channel);
		},
		function(error){
		   console.log("[ERROR] Failed when calling getPlaybackUrl!");
		});
			
		// channel.video = videos[data.video_id];
		// channel.last_update_time = Date.now();
		// channel.seek = 0
		// io.to(data.channel_id).emit('start_video', channel);
	});

	socket.on('seek', function(data){
		console.log("[LOG] Client (" + socket.id + ") called seek with data: " + JSON.stringify(data));
		// param: channel_id
		// param: seconds - Seconds into the video
		var channel = channels[data.channel_id];
		if (!channel) {
			console.log("[ERROR] seek - Channel (" + data.channel_id + ") does not exist!");
			io.to(socket.id).emit('seek', {error: "ERROR: Channel " + data.channel_id + " does not exist!"});
			return;
		}
		var now = Date.now();
		channel.seek = ((now - channel.last_update_time) / 1000) + parseInt(data.seconds);
		// channel.seek = ((now - channel.last_update_time) / 1000);
		// channel.seek = data.seconds;
		channel.last_update_time = now;
		io.to(data.channel_id).emit('seek', channel);
	});

	socket.on('chat_message', function(data){
		console.log("[LOG] Client (" + socket.id + ") called chat_message with data: " + JSON.stringify(data));
		// param: channel_id
		// param: message
		var channel = channels[data.channel_id];
		if (!channel) {
			console.log("[ERROR] chat_message - Channel (" + data.channel_id + ") does not exist!");
			io.to(socket.id).emit('chat_message', {error: "ERROR: Channel " + channels[data.channel_id] + " does not exist!"});
			return;
		}
		io.to(data.channel_id).emit('chat_message', data);
	});

 	socket.on('disconnect', function(){
 		console.log("[LOG] Client (" + socket.id + ") called disconnect!");
 		// find the user in the array        
        if (users[socket.id]) {
        	console.log("[LOG] User (" + socket.id + ") found.")
        	var user = users[socket.id];
        	var channel = channels[user.current_channel_id];
        	if (channel) {
        		console.log("[LOG] Channel Found.");
        		channel.removeUser(user);
        	}
        	console.log("[LOG] Deleting (" + socket.id + ") from object.")
        	delete users[socket.id];
        }
        logConnectedUsers();
 	});

});

function logConnectedUsers() {
    console.log("[LOG] Connected Users = " + Object.keys(users).length);
}

// function getPlaybackUrl (video_id) {
//   console.log("Called getPlaybackUrl!");
//   var promise = new Promise();

//   var url = youtube_video_url_prefix + video_id
//   var options = [];

//   youtubedl.getInfo(url, options, function(error, info) {
//     if (error) {
//       console.log("get youtube info ERROR");
//       promise.reject(error); //GETTING AN ERROR HERE
//     } else {
// 	    console.log("get youtube info SUCCESS");
// 	    console.log(info);
// 	    if (info) {
// 		    promise.resolve(info.url);
// 	    } else {
// 	    	promise.reject("sighhh");
// 	    }
// 	}
//     // return response.success({url: info.url});
//   });
//   return promise;
// }

function Video(video_id, title, thumbnail_url) {
	this.video_id = video_id;
	if (title == null) {
		this.title = "Placeholder Title";
	} else {
		this.title = title;
	}
	if (thumbnail_url == null) {
		this.thumbnail_url = 'https://i.ytimg.com/vi/i8rYQLGnWHQ/hqdefault.jpg';
	}
	else {
		this.thumbnail_url = thumbnail_url;
	}
	this.playback_url = null;

	// This function must be called using when() because it is variable sync/async
	// depending on whether we have already cached the playback url
	this.getPlaybackUrl = function getPlaybackUrl () {

        if (this.playback_url != null) { return this.playback_url; }

        var promise = new Promise();

        var url = youtube_video_url_prefix + video_id
        console.log('[LOG] Calling Playback Url for video: ' + url);
        var options = [];

        youtubedl.getInfo(url, options, function(error, info) {
          if (error || info == null) {
            promise.reject(error);
            return;
          }
          console.log('[LOG] Got Playback Url: ' + info.url);
          promise.resolve(info.url);
        });
        return promise;
    }
}

function Channel(channel_id, broadcaster, video, seek, last_update_time) {
	this.channel_id = channel_id;
	this.broadcaster = broadcaster;
	this.video = video;
	this.seek = seek;
	this.last_update_time = last_update_time;
	this.users = [broadcaster];

	this.removeUser = function (user) {
		var index = this.users.indexOf(user);
        if(index != -1) {
            // Eliminates the user from the array
            this.users.splice(index, 1);
        }
	}
}

function User(user_id, current_channel_id) {
	this.user_id = user_id;
	this.current_channel_id = current_channel_id;
}