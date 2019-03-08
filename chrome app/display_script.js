"use strict";
	
	document.getElementById("version-number").textContent = chrome.runtime.getManifest().version;
	
	document.getElementById("app-user-agent").textContent = navigator.userAgent;