"use strict";

	// content of index.js
	const {shell} = require('electron');
	const http = require('http');
	const dat = require('dat-node');
	const fs = require('fs')

	var host = "127.0.0.1";
	var port = "9989";
		
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
	response.end(content);
	if (err) {throw err;console.log(err)}
  });

} else {
	
  dat.archive.readFile(fileSearch, function (err, content) {
    console.log(content);
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
