"use strict";
	
	document.getElementById("version-number").textContent = chrome.runtime.getManifest().version;
	
	document.getElementById("app-user-agent").textContent = navigator.userAgent;
	
	var logToScreen = function(log) {
		console.log(log);
		var printLog = log;
		if (typeof log == 'object') {
			printLog = JSON.stringify(log);
		}
		var logger = document.getElementById("logger");
		logger.textContent += printLog + "\n" + "\r\n";
		logger.scrollTop = logger.scrollHeight;
	};