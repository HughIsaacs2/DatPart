"use strict";

	const {shell} = require('electron');
	
	var versionNumber = require('electron').remote.getGlobal('sharedObject').appVersionNumber;
	
	document.getElementById("version-number").textContent = versionNumber;
	
	document.querySelectorAll("a.external-link").forEach(function (el) {
		el.onclick = function(){shell.openExternal(el.href);return false;};
	});