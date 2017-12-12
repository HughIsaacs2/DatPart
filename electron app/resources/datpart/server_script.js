"use strict";

	// content of index.js
	const {shell} = require('electron');
	const http = require('http');
	const url = require("url");
	const path = require("path");
	const dat = require('dat-node');
	const fs = require('fs')

	var host = "127.0.0.1";
	var port = "9989";
	
	var mimeTypes = {
	//text formats
      "html": "text/html",
      "xhtml": "application/xhtml+xml",
	  "js": "text/javascript",
      "css": "text/css",
      "txt": "text/plain",
      "appcache": "text/cache-manifest",
      "htc": "text/x-component",
	//image formats
	  "svg": "image/svg+xml",
	  "svgz": "image/svg+xml",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "apng": "image/png",
      "webp": "image/webp",
      "gif": "image/gif",
      "ico": "image/x-icon",
	//font formats
      "woff": "application/font-woff",
      "woff2": "font/woff2",
      "ttf": "application/x-font-ttf",
      "ttc": "application/x-font-ttf",
      "otf": "font/opentype",
      "eot": "application/vnd.ms-fontobject",
	//video formats
      "webm": "video/webm",
      "mp4": "video/mp4",
      "m4v": "video/m4v",
      "ogv": "video/ogg",
	//audio formats
      "ogg": "audio/ogg",
      "oga": "audio/ogg",
      "aac": "audio/x-aac",
      "mp3": "audio/mpeg",
      "weba": "audio/webm",
	//application file formats
      "wasm": "application/wasm",
      "nexe": "application/x-nacl",
      "xml": "application/xml",
      "json": "application/json",
      "map": "application/json",
      "rss": "application/rss+xml",
      "atom": "application/atom+xml",
      "opensearchxml": "application/opensearchdescription+xml",
      "torrent": "application/x-bittorrent",
      "webmanifest": "application/manifest+json",
	//browser extension file formats
      "crx": "application/x-chrome-extension",
      "xpi": "application/x-xpinstall",
      "nex": "application/x-navigator-extension",
	//plugin file formats
      "swf": "application/x-shockwave-flash",
	  "xap": "application/x-silverlight-app",
	  "unity3d": "application/vnd.unity",
	  "jar": "application/java-archive",
	  "class": "application/x-java-applet",
	//random Misc
      "webapp": "application/x-web-app-manifest+json",
      "pdf": "application/pdf",
      "ics": "text/calendar",
      "pkpass": "application/vnd.apple.pkpass",
      "mobileconfig": "application/x-apple-aspen-config",
      "prs": "application/x-psp-radio-skin",
      "p3t": "application/x-ps3-theme",
      "ptf": "application/x-psp-theme",
      "pbp": "application/x-psp-game"
    };
		
	document.querySelectorAll("a.external-link").forEach(function (el) {
		el.onclick = function(){shell.openExternal(el.href);return false;};
	});
	
	if (!fs.existsSync(__dirname + '/../../dats/')) {
		fs.mkdirSync(__dirname + '/../../dats/');
	}

const requestHandler = (request, response) => {
  console.log(request.url);
  
	var currentURLRequest = document.createElement('a');
	currentURLRequest.href = request.url;
	
	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
	
	var fileSearch = currentURLRequest.pathname;
	
	console.log(fileSearch);
	
	console.log("TLD: " + currentTLD + " Hash: " + currentURLhostNoTLD);
	/*
	if(currentTLD == 'dat_site') {
		fileSearch = "/dats/" + currentURLhostNoTLD + currentURLRequest.pathname;
		console.log(fileSearch);
	}
*/
  var uri = url.parse(request.url).pathname, 
      filename = path.join(process.cwd(), uri);
	  
      var mimeType = mimeTypes[filename.split('.').pop()];
      
      if (!mimeType) {
        mimeType = 'text/plain';
      }

if(currentTLD == 'dat_site' && fs.existsSync(__dirname + "/../../dats/")) {

dat( __dirname + '/../../dats/'+currentURLhostNoTLD, {
  // 2. Tell Dat what link I want
  key: currentURLhostNoTLD, temp: false, sparse: true // (a 64 character hash from above)
}, function (err, dat) {
  if (err) {throw err;console.log(err)}
  
  var stats = dat.trackStats()

  // 3. Join the network & download (files are automatically downloaded)
  dat.joinNetwork();
  /*
  dat.archive.readFile(fileSearch+'/dat.json', function (err, content) {
    console.log(JSON.parse(content));
	if (err) {throw err;console.log(err)}
  });
  */
  var lastChar = request.url.substr(-1); // Selects the last character
if (lastChar == '/') {         // If the last character is not a slash
  
  dat.archive.readFile(fileSearch+'/index.html', function (err, content) {
    console.log(content);
	response.writeHead(200, { "Content-Type": "text/html" });
	response.end(content);
	if (err) {throw err;console.log(err)}
  });

} else {
	
  dat.archive.readFile(fileSearch, function (err, content) {
    console.log(content);
	response.writeHead(200, { "Content-Type": mimeType });
	response.end(content);
	if (err) {throw err;console.log(err)}
  });
  
}
  
});

} else if(fs.existsSync(__dirname + "/../../dats/")) { 

console.log(request.url);

	var currentURLRequest = document.createElement('a');
	currentURLRequest.href = request.url;
	
	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
	
	var fileSearch = currentURLRequest.pathname;
	
	console.log(fileSearch);
	
	console.log("TLD: " + currentTLD + " Hash: " + currentURLhostNoTLD);

} else {
	
	fs.mkdirSync(appPath + "/dats/");
	console.log(request.url);
	
}

};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
