

var Parse = require('parse-cloud-express').Parse;
var request = require('request');
var cheerio = require('cheerio');
var google = require('googleapis');
// var youtubedl = require('youtube-dl');

var youtube_api_key = 'AIzaSyCM3E6ir_giadOaPa_5REQAwXRcfcjvuk8';
var youtube = google.youtube({ version: 'v3', auth: youtube_api_key });
var youtube_video_url_prefix = 'https://www.youtube.com/watch?v=';


Parse.Cloud.define("hello", function(request, response) {
  console.log('Called hello');
  // As with Parse-hosted Cloud Code, the user is available at: request.user
  // You can get the users session token with: request.user.getSessionToken()
  // Use the session token to run other Parse Query methods as that user, because
  //   the concept of a 'current' user does not fit in a Node environment.
  //   i.e.  query.find({ sessionToken: request.user.getSessionToken() })...
  response.success("Hello world! " + (request.params.a + request.params.b));
});

// SECTION - search

// Parse.Cloud.define("search_mock", function(request, response) {
//   console.log('Called search_mock');
//   var search_results = [
//     {video_id: "sGbxmsDFVnE", thumbnail_url: "https://i.ytimg.com/vi/sGbxmsDFVnE/hqdefault.jpg"},
//     {video_id: "d8kCTPPwfpM", thumbnail_url: "https://i.ytimg.com/vi/d8kCTPPwfpM/hqdefault.jpg"},
//     {video_id: "RzhAS_GnJIc", thumbnail_url: "https://i.ytimg.com/vi/RzhAS_GnJIc/hqdefault.jpg"},
//     {video_id: "w1oM3kQpXRo", thumbnail_url: "https://i.ytimg.com/vi/w1oM3kQpXRo/hqdefault.jpg"},
//     {video_id: "IdneKLhsWOQ", thumbnail_url: "https://i.ytimg.com/vi/IdneKLhsWOQ/hqdefault.jpg"},
//     {video_id: "sGbxmsDFVnE", thumbnail_url: "https://i.ytimg.com/vi/sGbxmsDFVnE/hqdefault.jpg"},
//     {video_id: "d8kCTPPwfpM", thumbnail_url: "https://i.ytimg.com/vi/d8kCTPPwfpM/hqdefault.jpg"},
//     {video_id: "RzhAS_GnJIc", thumbnail_url: "https://i.ytimg.com/vi/RzhAS_GnJIc/hqdefault.jpg"},
//     {video_id: "w1oM3kQpXRo", thumbnail_url: "https://i.ytimg.com/vi/w1oM3kQpXRo/hqdefault.jpg"},
//     {video_id: "IdneKLhsWOQ", thumbnail_url: "https://i.ytimg.com/vi/IdneKLhsWOQ/hqdefault.jpg"}
//   ];
//   response.success(search_results);
// });

// Parse.Cloud.define("search_v1", function(request, response) {
//   // TODO: Add a reasonable default that's not T-Swift
//   // TODO: Handle error cases gracefully
//   console.log('Called search_v1');

//   var query = 'Taylor Swift';
//   if (request.params.query) {
//     query = request.params.query;
//   }
//   var type = 'video';
//   if (request.params.query_type) {
//     type = request.params.query_type;
//   }
//   var max_results = 50;

//   youtube.search.list({
//     q: query,
//     part: 'snippet',
//     type: type,
//     maxResults: max_results,
//   }, function(error, result) {
//     if (result) {
//       var json = {};
//       if (result.nextPageToken) {
//         json.nextPageToken = result.nextPageToken;
//       }
//       if (result.prevPageToken) {
//         json.prevPageToken = result.prevPageToken;
//       }
//       var items = []
//       for (var i = 0; i < result.items.length; ++i) {
//         var item = {
//           video_id: result.items[i].id.videoId,
//           video_url: youtube_video_url_prefix + result.items[i].id.videoId,
//           title: result.items[i].snippet.title,
//           thumbnal_url: result.items[i].snippet.thumbnails.high.url
//         };
//         items.push(item);
//         item = result.items[i];
//       }
//       json.items = items;
//       response.success(json);
//     }
//   });
// });

// SECTION - getPlaybackUrl

// Parse.Cloud.define('getPlaybackUrl_mock', function(request, response) {
//   console.log("Called getPlaybackUrl_v1!");
//   response.success("https://r5---sn-nx57ynez.googlevideo.com/videoplayback?lmt=1441448818674033&mt=1445817260&mv=m&ms=au&mm=31&mn=sn-nx57ynez&dur=234.707&itag=22&expire=1445838925&sparams=dur%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cnh%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cupn%2Cexpire&fexp=9408710%2C9414764%2C9416126%2C9417707&source=youtube&mime=video%2Fmp4&requiressl=yes&sver=3&pl=23&nh=IgpwcjAxLnNlYTA5KgkxMjcuMC4wLjE&initcwndbps=225000&ratebypass=yes&id=o-AJy22o66w9Sc58fC3uaH3Qjrsj2UeTtv_s21aFMNzp1M&upn=7yfjENaI_Zc&ip=104.238.162.170&key=yt6&ipbits=0&title=Taylor+Swift+-+Wildest+Dreams&keepalive=no&signature=C73601EDF3C20A0A185A4C5F8B1D46799C980E24.DAB1240A6BAF0E119E729884372EA63C52C0940C");
// });

// Parse.Cloud.define('getPlaybackUrl_v1', function(request, response) {
//   console.log("Called getPlaybackUrl_v1!");
//   if (!request.params.video_id) {
//     return response.success({error: "Required paramater video_id not passed"});
//   }
//   var url = youtube_video_url_prefix + request.params.video_id
//   var options = [];

//   youtubedl.getInfo(url, options, function(error, info) {
//     if (error) {
//       return response.success({error: error});
//     }
//     console.log(info.url);
//     return response.success({url: info.url});
//   });
// });

// Parse.Cloud.define('createChannel_v1', function(request, response) {
//   console.log("Called createChannel_v1");
//   // console.log("Creating channel: " + request.params.channel_name)
//   // channels.push(request.params.channel_name)
//   response.success("success");
// });

// Parse.Cloud.define('getChannels_v1', function(request, response) {
//   console.log("Called getChannels_v1");
//   response.success(channels);
// });

Parse.Cloud.beforeSave('TestObject', function(request, response) {
  console.log('Ran beforeSave on objectId: ' + request.object.id);
  response.success();
});

Parse.Cloud.afterSave('TestObject', function(request, response) {
  console.log('Ran afterSave on objectId: ' + request.object.id);
});

Parse.Cloud.beforeDelete('TestObject', function(request, response) {
  console.log('Ran beforeDelete on objectId: ' + request.object.id);
  response.success();
});

Parse.Cloud.afterDelete('TestObject', function(request, response) {
  console.log('Ran afterDelete on objectId: ' + request.object.id);
});

