var Dat = require('dat-js');
var concat = require('concat-stream');
var pump = require('pump');
var db = require('random-access-idb')('dats');

var dat = new Dat({
  signalhub: 'https://signalhubws.mauve.moe/',
  gateway: 'ws://gateway.mauve.moe:3000',
  db: db
});

  var host = "127.0.0.1";
  var port = "9989";
  
  var versionNumber = chrome.runtime.getManifest().version;
  
  logToScreen("DatPart Server Version "+versionNumber);
  
  var serverSocketId = null;
  var filesMap = {};
  
  var rootDir = null;
  var packDir = null;
  
  var tcpServer = chrome.sockets.tcpServer;
  var tcpSocket = chrome.sockets.tcp;

  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var mimeTypes = {
	//text formats
      "html": "text/html",
      "htm": "text/html",
      "xhtml": "application/xhtml+xml",
	  "js": "text/javascript",
	  "mjs": "text/javascript",
	  "ts": "application/typescript",
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
      "bpg": "image/bpg",
      "jp2": "image/jp2",
      "jpx": "image/jpx",
      "jpm": "image/jpm",
      "bmp": "image/bmp",
      "dib": "image/bmp",
      "flif": "image/flif",
      "heif": "image/heif",
      "heic": "image/heic",
      "tiff": "image/tiff",
      "tif": "image/tiff",
      "mpo": "image/mpo",
      "gif": "image/gif",
      "ico": "image/x-icon",
      "avif": "image/avif",
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
      "mj2": "image/mj2",
      "mjp2": "image/mj2",
      "mjp": "video/x-motion-jpeg",
      "mkv": "video/x-matroska",
      "mk3d": "video/x-matroska",
      "flv": "video/x-flv",
      "mng": "video/x-mng",
      "avi": "video/x-msvideo",
      "wmv": "video/x-ms-wmv",
      "asf": "video/x-ms-asf",
      "3gp": "video/3gpp",
      "3g2": "video/3gpp2",
      "mov": "video/quicktime",
      "tsv": "video/MP2T",
      "asx": "video/x-ms-asf",
	//audio formats
      "ogg": "audio/ogg",
      "oga": "audio/ogg",
      "aac": "audio/x-aac",
      "mp3": "audio/mpeg",
      "weba": "audio/webm",
      "flac": "audio/flac",
      "spx": "audio/speex",
      "opus": "audio/opus",
      "aiff": "audio/aiff",
      "wma": "audio/x-ms-wma",
      "mka": "audio/x-matroska",
      "mid": "audio/midi",
      "midi": "audio/midi",
      "wav": "audio/wav",
      "pls": "audio/x-scpls",
	//application file formats
      "sxg": "application/signed-exchange",
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
      "pbp": "application/x-psp-game",
      "epub": "application/epub+zip",
      "zip": "application/zip",
      "wpl": "application/vnd.ms-wpl",
      "m3u": "application/x-mpegURL",
      "m3u8": "application/x-mpegURL",
      "xspf": "application/xspf+xml"
    };

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
            logToScreen("WRITE", writeInfo);

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

    logToScreen("ACCEPT", acceptInfo);
  };
  
  var onReceive = function(receiveInfo) {
    logToScreen("READ", receiveInfo);
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
	
	logToScreen("TLD: " + currentTLD + " Hash: " + currentURLhostNoTLD);
	
	var file = filesMap[fileSearch];
	
	logToScreen("URI: " + uri);
	logToScreen("URIEnd: " + uriEnd);
	logToScreen("File: " + fileSearch);
	
	if (currentTLD == 'dat_site') {
		
		var repo = dat.get('dat://'+currentURLhostNoTLD, { db: db });
		
		var datPath = currentURLRequest.pathname;
		
		var lastChar = uri.substr(-1); // Selects the last character
		if (lastChar == '/') {
			logToScreen(datPath);
			var readStream = repo.archive.createReadStream(datPath+'index.html');
		} else {
			var readStream = repo.archive.createReadStream(datPath);
		}
		
		pump(readStream, concat(function (data) {
				
		  console.log("webdat data:");
		  console.log(data);
		  
		  var mimeType = mimeTypes[fileSearch.split('.').pop()];
		  
		  if (!mimeType) {
			mimeType = 'text/plain';
		  }
		  
		  if (lastChar == '/') {
			mimeType = 'text/html';
		  }
		  
	      var datFile = new Blob(data, {type : mimeType});
		  
		  if (mimeType == 'text/plain'||'text/html'||'text/html') {
			console.log(data.toString());
			datFile = new Blob([data.toString()], {type : mimeType});
		  }
		  
		  logToScreen('Name: ' + datFile.name);
		  logToScreen('Path: ' + datPath);
		  logToScreen('Size: ' + datFile.size);
		  logToScreen('Type: ' + datFile.type);
		  logToScreen('Designated MIMEType: ' + mimeType);
		  
		  logToScreen("GET 200 " + uri);
		  write200Response(socketId, datFile, keepAlive);
		}));
		
	} else if (currentTLD == 'torrent_site') {
		
	} else {
		write200Response(socketId, filesMap["/crxfs/nothing.html"], keepAlive);
	}

  };

  function startServer(dir) {

    tcpServer.create({}, function(socketInfo) {
      serverSocketId = socketInfo.socketId;

      tcpServer.listen(serverSocketId, host, parseInt(port, 10), 50, function(result) {
		
        logToScreen('server is listening on '+port);
        logToScreen("LISTENING:", result);

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

logToScreen(fs);
logToScreen(fs.root);
logToScreen(rootDir);

readDirectory(rootDir);

	startServer();
});