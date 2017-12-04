"use strict";

  var host = "127.0.0.1";
  var port = "9989";
  
  var serverSocketId = null;
  var filesMap = {};
  
  var rootDir = null;
  var packDir = null;
  
  if (typeof process === 'object') {
	if (typeof process.versions === 'object') {
		if (typeof process.versions['electron'] !== 'undefined') {
		
		// content of index.js
		const http = require('http');
		var dat = require('dat-node');

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
		fileSearch = "/dat/" + currentURLhostNoTLD + currentURLRequest.pathname;
		console.log(fileSearch);
	}
*/
   
dat( __dirname + '/dats/'+currentURLhostNoTLD, {
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

};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});

  }}} 
  /* Chrome OS app below */
  else if (window && window.chrome && chrome.runtime && chrome.runtime.id) {
  
  var tcpServer = chrome.sockets.tcpServer;
  var tcpSocket = chrome.sockets.tcp;

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

function errorHandler () {
//Does nothing
}

function readDirectory(insertDir) {
		var dirReader = insertDir.createReader();
		dirReader.readEntries(function(entries) {
	  
	  entries.forEach(function(entry) {
		if (entry.isDirectory){
        
		console.log("Folder: "+entry.name);
		console.log(entry);
		
			readDirectory(entry);
		
      } else if (entry.isFile){
		 
  insertDir.getFile(entry.name, {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(realFile) {

	   	filesMap[entry.fullPath] = realFile;
		console.log('Path: ' + entry.fullPath);
        console.log('Name: ' + entry.name);
        console.log('Size: ' + realFile.size);
        console.log('Type: ' + realFile.type);
        console.log(entry);
        console.log(entry.file);
        console.log(realFile);
		console.log('filesMap location: '+ entry.fullPath);
	   
    });
  }); 
		
	  }
	  });

  });
}

chrome.runtime.getPackageDirectoryEntry(function(packageDirectory){
	  
	packDir = packageDirectory;
	readDirectory(packDir);

});
  
  var stringToUint8Array = function(string) {
    var buffer = new ArrayBuffer(string.length);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < string.length; i++) {
      view[i] = string.charCodeAt(i);
    }
    return view;
  };
  
  var arrayBufferToString = function(buffer) {
    var str = '';
    var uArrayVal = new Uint8Array(buffer);
    for (var s = 0; s < uArrayVal.length; s++) {
      str += String.fromCharCode(uArrayVal[s]);
    }
    return str;
  };
  
  var logToScreen = function(log) {
    logger.textContent += log + "\n";
    logger.scrollTop = logger.scrollHeight;
  };
  
  var destroySocketById = function(socketId) {
    tcpSocket.disconnect(socketId, function() {
      tcpSocket.close(socketId);
    });
  };
  
  var closeServerSocket = function() {
    if (serverSocketId) {
      tcpServer.close(serverSocketId, function() {
        if (chrome.runtime.lastError) {
          console.warn("chrome.sockets.tcpServer.close:", chrome.runtime.lastError);
        }
      });
    }

    tcpServer.onAccept.removeListener(onAccept);
    tcpSocket.onReceive.removeListener(onReceive);
  };
  
  var sendReplyToSocket = function(socketId, buffer, keepAlive) {
    // verify that socket is still connected before trying to send data
    tcpSocket.getInfo(socketId, function(socketInfo) {
      if (!socketInfo.connected) {
        destroySocketById(socketId);
        return;
      }

      tcpSocket.setKeepAlive(socketId, keepAlive, 1, function() {
        if (!chrome.runtime.lastError) {
          tcpSocket.send(socketId, buffer, function(writeInfo) {
            console.log("WRITE", writeInfo);

            if (!keepAlive || chrome.runtime.lastError) {
              destroySocketById(socketId);
            }
          });
        }
        else {
          console.warn("chrome.sockets.tcp.setKeepAlive:", chrome.runtime.lastError);
          destroySocketById(socketId);
        }
      });
    });
  };
  
  var getResponseHeader = function(file, errorCode, keepAlive) {
    var httpStatus = "HTTP/1.0 200 OK";
    var contentType = "text/plain";
    var contentLength = 0;

    if (!file || errorCode) {
      httpStatus = "HTTP/1.0 " + (errorCode || 404) + " Not Found";
    }
    else {
      contentType = file.type || contentType;
      contentLength = file.size;
    }

    var lines = [
      httpStatus,
      "Content-length: " + contentLength,
      "Content-type:" + contentType
    ];

    if (keepAlive) {
      lines.push("Connection: keep-alive");
    }

    return stringToUint8Array(lines.join("\n") + "\n\n");
  };
  
  var getErrorHeader = function(errorCode, keepAlive) {
    return getResponseHeader(null, errorCode, keepAlive);
  };
  
  var getSuccessHeader = function(file, keepAlive) {
    return getResponseHeader(file, null, keepAlive);
  };
  
  var writeErrorResponse = function(socketId, errorCode, keepAlive) {
    console.info("writeErrorResponse:: begin... ");

    var header = getErrorHeader(errorCode, keepAlive);
    console.info("writeErrorResponse:: Done setting header...");
    var outputBuffer = new ArrayBuffer(header.byteLength);
    var view = new Uint8Array(outputBuffer);
    view.set(header, 0);
    console.info("writeErrorResponse:: Done setting view...");

    sendReplyToSocket(socketId, outputBuffer, keepAlive);

    console.info("writeErrorResponse::filereader:: end onload...");
    console.info("writeErrorResponse:: end...");
  };
  
  var write200Response = function(socketId, file, keepAlive) {
    var header = getSuccessHeader(file, keepAlive);
    var outputBuffer = new ArrayBuffer(header.byteLength + file.size);
    var view = new Uint8Array(outputBuffer);
    view.set(header, 0);

    var fileReader = new FileReader();
    fileReader.onload = function(e) {
      view.set(new Uint8Array(e.target.result), header.byteLength);
      sendReplyToSocket(socketId, outputBuffer, keepAlive);
    };

    fileReader.readAsArrayBuffer(file);
  };
  
  var onAccept = function(acceptInfo) {
    tcpSocket.setPaused(acceptInfo.clientSocketId, false);

    if (acceptInfo.socketId != serverSocketId)
      return;

    console.log("ACCEPT", acceptInfo);
  };
  
  var onReceive = function(receiveInfo) {
    console.log("READ", receiveInfo);
    var socketId = receiveInfo.socketId;

    // Parse the request.
    var data = arrayBufferToString(receiveInfo.data);
    // we can only deal with GET requests
    if (data.indexOf("GET ") !== 0) {
      // close socket and exit handler
      destroySocketById(socketId);
      return;
    }

    var keepAlive = false;
    if (data.indexOf("Connection: keep-alive") != -1) {
      keepAlive = true;
    }

    var uriEnd = data.indexOf(" ", 4);
    if (uriEnd < 0) { /* throw a wobbler */ return; }
    var uri = data.substring(4, uriEnd);
    // strip query string
    var q = uri.indexOf("?");
    if (q != -1) {
      uri = uri.substring(0, q);
    }
	
	var currentURLRequest = document.createElement('a');
	currentURLRequest.href = uri;
	
	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
	
	var fileSearch = currentURLRequest.pathname + currentURLRequest.search;
	
	console.log("TLD: " + currentTLD + " Hash: " + currentURLhostNoTLD);
	
	if(currentTLD == 'dat_site') {
		fileSearch = "/dat/" + currentURLhostNoTLD + currentURLRequest.pathname;
		console.log(fileSearch);
	}
	
	var file = filesMap[fileSearch];
	
	console.log("URI: " + uri);
	console.log("URIEnd: " + uriEnd);
	console.log("FileSearch: " + fileSearch);
	console.log(filesMap);
	console.log(file);
	
	if (currentTLD == 'dat_site') {
		logToScreen("GET 200 " + uri);
		write200Response(socketId, filesMap["/crxfs/dat_site.html"], keepAlive);
		
	} else {
		write200Response(socketId, filesMap["/crxfs/nothing.html"], keepAlive);
	}

  };

  function startServer(dir) {

    tcpServer.create({}, function(socketInfo) {
      serverSocketId = socketInfo.socketId;

      tcpServer.listen(serverSocketId, host, parseInt(port, 10), 50, function(result) {
        console.log("LISTENING:", result);

        tcpServer.onAccept.addListener(onAccept);
        tcpSocket.onReceive.addListener(onReceive);
      });
    });

  };
	
window.requestFileSystem(window.TEMPORARY, 50*1024*1024 /*50MB*/, function(fs){
/* window.PERSISTENT */	
	
	closeServerSocket();

rootDir = fs.root;

rootDir.getDirectory('dat', {create: true}, function(dirEntry) {

  }, errorHandler);
  
rootDir.getDirectory('torrent', {create: true}, function(dirEntry) {

  }, errorHandler);

console.log(fs);
console.log(fs.root);
console.log(rootDir);

readDirectory(rootDir);

	startServer();
});

  }