"use strict";

	// content of index.js
	const {shell} = require('electron');
	const http = require('http');
	const url = require("url");
	const path = require("path");
	const dat = require('dat-node');
	const fs = require('fs')
	
	document.querySelectorAll("a.external-link").forEach(function (el) {
		el.onclick = function(){shell.openExternal(el.href);return false;};
	});

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
      "jxr": "image/vnd.ms-photo",
      "hdp": "image/vnd.ms-photo",
      "wdp": "image/vnd.ms-photo",
      "flif": "image/flif",
      "heif": "image/heif",
      "heic": "image/heic",
      "tiff": "image/tiff",
      "tif": "image/tiff",
      "mpo": "image/mpo",
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
	
	if (!fs.existsSync(__dirname + '/../../dats/')) {
		fs.mkdirSync(__dirname + '/../../dats/');
	}

const requestHandler = (request, response) => {
  console.log(request.url);
  
    var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);
	  
      var mimeType = mimeTypes[filename.split('.').pop()];
      
      if (!mimeType) {
        mimeType = 'text/plain';
      }
	
	var currentTLD = url.parse(request.url).hostname.split(".").pop();
	
	var currentURLhostNoTLD = url.parse(request.url).hostname.split(".")[0];
	
	var datPath = url.parse(request.url).pathname;
	
	console.log(datPath);
	
	console.log("TLD: " + currentTLD + " Hash: " + currentURLhostNoTLD);

	  /*
if (request.url.substr(1) == "/" && request.url == "/") {

	fs.readFile(__dirname + "/index.html", function(err, data){
if(err){
   response.writeHead(404, {'Content-type':'text/plain'});
   response.write('Page Was Not Found');
   response.end( );
}else{
   response.writeHead(200, {'Content-type':'text/html'});
   response.write(data);
   response.end( );
}
});
	
} else if (request.url.substr(1) == "/" && request.url.substr(-1) != "/") {
	
	var pathName = url.parse(request.url).pathname;
fs.readFile(__dirname  + "/../../dats/" + pathName, function(err, data){
if(err){
   response.writeHead(404, {'Content-type':'text/plain'});
   response.write('Page Was Not Found');
   response.end( );
}else{
   response.writeHead(200, {'Content-type':'text/plan'});
   response.write(data);
   response.end( );
}
});
	
} else */ if(currentTLD == 'dat_site' && fs.existsSync(__dirname + "/../../dats/")) {

dat( __dirname + '/../../dats/'+currentURLhostNoTLD, {
  // 2. Tell Dat what link I want
  key: currentURLhostNoTLD, temp: true, sparse: true // (a 64 character hash from above)
}, function (err, dat) {
  if (err) {throw err;console.log(err)}
  
  var stats = dat.trackStats()

  // 3. Join the network & download (files are automatically downloaded)
  dat.joinNetwork();
  
  var datJSON;

  dat.archive.readFile(datPath+'/dat.json', function (err, content) {
    console.log(JSON.parse(content));
	datJSON = JSON.parse(content);
	console.log(datJSON["fallback_page"]);
	if (err) {throw err;console.log(err)}
  });

  var lastChar = request.url.substr(-1); // Selects the last character
if (lastChar == '/') {         // If the last character is not a slash
  
  dat.archive.readFile(datPath+'/index.html', function (err, content) {
    console.log(content);
	response.writeHead(200, { "Content-Type": "text/html", "Alt-Svc": "dat='dat://"+currentURLhostNoTLD+datPath+"'", "Dat-Url": "dat://"+currentURLhostNoTLD+datPath });
	//response.setHeader('Alt-Svc', 'dat="'+currentURLhostNoTLD+datPath+'"');
	response.end(content);
	if (err) {throw err;console.log(err)}
  });

} else {
	
  dat.archive.readFile(datPath, function (err, content) {
    console.log(content);
	response.writeHead(200, { "Content-Type": mimeType, "Alt-Svc": "dat='dat://"+currentURLhostNoTLD+datPath+"'", "Dat-Url": "dat://"+currentURLhostNoTLD+datPath });
	//response.setHeader('Alt-Svc', 'dat="'+currentURLhostNoTLD+datPath+'"');
	response.end(content);
	if (err) {
		throw err;console.log(err)
		}
  });
  
}
  
});

} else if(fs.existsSync(__dirname + "/../../dats/")) {

console.log(request.url);

	var currentTLD = url.parse(request.url).hostname.split(".").pop();
	
	var currentURLhostNoTLD = url.parse(request.url).hostname.split(".")[0];
	
	var datPath = url.parse(request.url).pathname;
	
	console.log(datPath);
	
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
