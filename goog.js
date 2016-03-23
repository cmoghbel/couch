var google = require('googleapis');
var api_key = 'AIzaSyCM3E6ir_giadOaPa_5REQAwXRcfcjvuk8';
var youtube = google.youtube({ version: 'v3', auth: api_key });

var query = 'Taylor Swift';
var type = 'video';
var pageToken = '1';
var video_id = 'i8rYQLGnWHQ';
var maxResults = 1;

youtube.videos.list({
	part: 'snippet',
	id: video_id,
	maxResults: maxResults,
}, function(error, result) {
	// console.log(error);
	// console.log(result);
	console.log(result.items);
	if (result.items.length == 0) { return; }
	console.log(result.items[0].snippet.thumbnails);
	// var json = {};
	// if (result.nextPageToken) {
	// 	json.nextPageToken = result.nextPageToken;
	// }
	// if (result.prevPageToken) {
	// 	json.prevPageToken = result.prevPageToken;
	// }
	// var items = []
	// for (var i = 0; i < result.items.length; ++i) {
	// 	var item = {
	// 		video_id: result.items[i].id.videoId,
	// 	 	video_url: 'https://www.youtube.com/watch?v=' + result.items[i].id.videoId,
	// 	 	title: result.items[i].snippet.title,
	// 	 	thumbnal_url: result.items[i].snippet.thumbnails.high.url
	// 	};
	// 	items.push(item);
	// 	item = result.items[i];
	// 	// console.log(item.id.videoId);
	// 	// console.log(item.snippet.title);
	// 	// console.log(item.snippet.thumbnails.high.url);
	// }
	// json.items = items;
	// console.log(json);
});

// youtube.search.list({
// 	q: query,
// 	part: 'snippet',
// 	type: type,
// 	maxResults: maxResults,
// }, function(error, result) {
// 	console.log(error);
// 	console.log(result);
// 	console.log(result.items);
// 	var json = {};
// 	if (result.nextPageToken) {
// 		json.nextPageToken = result.nextPageToken;
// 	}
// 	if (result.prevPageToken) {
// 		json.prevPageToken = result.prevPageToken;
// 	}
// 	var items = []
// 	for (var i = 0; i < result.items.length; ++i) {
// 		var item = {
// 			video_id: result.items[i].id.videoId,
// 		 	video_url: 'https://www.youtube.com/watch?v=' + result.items[i].id.videoId,
// 		 	title: result.items[i].snippet.title,
// 		 	thumbnal_url: result.items[i].snippet.thumbnails.high.url
// 		};
// 		items.push(item);
// 		item = result.items[i];
// 		// console.log(item.id.videoId);
// 		// console.log(item.snippet.title);
// 		// console.log(item.snippet.thumbnails.high.url);
// 	}
// 	json.items = items;
// 	console.log(json);
// });