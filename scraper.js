var request = require('request');
var cheerio = require('cheerio');
var youtubedl = require('youtube-dl');

var url = 'https://www.youtube.com/watch?v=QcIy9NiNbmo';
var options = [];

youtubedl.getInfo(url, options, function(err, info) {
  if (err) throw err;

  console.log('id:', info.id);
  console.log('title:', info.title);
  console.log('url:', info.url);
  console.log('thumbnail:', info.thumbnail);
  console.log('description:', info.description);
  console.log('filename:', info._filename);
  console.log('format id:', info.format_id);
});

// request('https://www.youtube.com/watch?v=IdneKLhsWOQ', function (error, response, html) {
//   if(!error){
//   		// console.log(html);
//       var $ = cheerio.load(html);

//       var json = { video_url : ""};

//       $('script').each(function(i, element){
//       	console.log(i);
//       	if (i==10) {
//       		console.log($(this).text());
//       	}
//       	// console.log(element);
//       	// console.log($this);
//        //  var data = $(this);
//       });
//     }
// })