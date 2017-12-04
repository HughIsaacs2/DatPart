"use strict";

  var start = document.getElementById("start");
  var stop = document.getElementById("stop");
  var hosts = document.getElementById("hosts");
  var port = document.getElementById("port");
  var directory = document.getElementById("directory");

  var tcpServer = chrome.sockets.tcpServer;
  var tcpSocket = chrome.sockets.tcp;
  
  var serverSocketId = null;
  var filesMap = {};
  
var torrentClient = new WebTorrent();
var torrentId = "";
  
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
	var fileSearch = currentURLRequest.pathname+currentURLRequest.search;
	
	var file = filesMap[fileSearch];
	
	console.log("URI: " + uri);
	console.log("URIEnd: " + uriEnd);
	console.log("FileSearch: " + fileSearch);
	console.log(filesMap);
	console.log(file);

	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
	
	if (currentTLD == 'torrent_site') {
		if (fileSearch == '/') {
			
			write200Response(socketId, filesMap["/torrent_site.html"], keepAlive);
	console.log("filesMap:"+filesMap["/loading.html"]);
		} else {
			    if (!!file == false) {
      console.warn("File does not exist..." + uri);
      writeErrorResponse(socketId, 404, keepAlive);
      return;
    } else {
		logToScreen("GET 200 " + uri);
    write200Response(socketId, file, keepAlive);
	}
		}
	} else if (currentTLD == 'dat_site') {
		if (fileSearch == '/') {
			write200Response(socketId, filesMap["/dat_site.html"], keepAlive);
		} else {
						    if (!!file == false) {
      console.warn("File does not exist..." + uri);
      writeErrorResponse(socketId, 404, keepAlive);
      return;
    } else {
		logToScreen("GET 200 " + uri);
    write200Response(socketId, file, keepAlive);
	}
		}
	}
	
    //logToScreen("GET 200 " + uri);
    //write200Response(socketId, file, keepAlive);

  };

  function startServer() {

    tcpServer.create({}, function(socketInfo) {
      serverSocketId = socketInfo.socketId;

      tcpServer.listen(serverSocketId, hosts.value, parseInt(port.value, 10), 50, function(result) {
        console.log("LISTENING:", result);

        tcpServer.onAccept.addListener(onAccept);
        tcpSocket.onReceive.addListener(onReceive);
      });
    });

    directory.disabled = true;
    stop.disabled = false;
    start.disabled = true;
  };

    chrome.runtime.getPackageDirectoryEntry(function(packageDirectory){
		console.log(packageDirectory);
		
	  closeServerSocket();
	  
		var dirReader = packageDirectory.createReader();
  dirReader.readEntries(function(entries) {
	  
	  entries.forEach(function(entry) {
		if (entry.isDirectory){
        console.log('Directory: ' + entry.fullPath);
      } else if (entry.isFile){
		  
		 
  packageDirectory.getFile(entry.name, {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(realFile) {
       //var reader = new FileReader();

       //reader.onloadend = function(e) {

	   	filesMap["/" + entry.name] = realFile;
		console.log('File: ' + entry.fullPath);
        console.log(entry.name);
        console.log(entry);
        console.log(entry.file);
		
        console.log(realFile);
		console.log("file:"+entry.name+" "+entry.size+" "+entry.name+"end");
	   
       //};
	   
    });
  }); 
		
	  }
	  });

  });

    start.disabled = false;
    stop.disabled = true;
    directory.disabled = true;
	startServer();
    });