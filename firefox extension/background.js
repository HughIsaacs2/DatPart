browser.proxy.register('pac.js');

browser.proxy.onProxyError.addListener(function (error) {
  console.error('BDNS: PAC error: ' + error.message);
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    console.log('inputChanged: ' + text);
    suggest([
      {content: text + " one", description: "the first one"},
      {content: text + " number two", description: "the second entry"}
    ]);
});

chrome.omnibox.onInputEntered.addListener(function(text) {
    console.log('inputEntered: ' + text);
	
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
	var currentURLRequest = document.createElement('a');
	currentURLRequest.href = details.url;
	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];

	if (currentTLD != 'dat_site') {
		//Do nothing
	  } else {
	    console.log('inputEntered: ' + details.url + "|" + currentTLD);
	  }
});
  
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    var currentURLRequest = document.createElement('a');
	currentURLRequest.href = details.url;
	console.log(details.url);
	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
	
	if (currentTLD != 'dat_site') {
		return;
	} else {

	};
	
	var dathost = currentURLRequest.hostname;
	var port = "9989";
	var access = "PROXY";
	var appip = "127.0.0.1";

	
	
}, {urls: ["*://*.dat_site/*"]}, ["blocking"]);

chrome.webRequest.onErrorOccurred.addListener(function(details)
{
    var currentURLRequest = document.createElement('a');
	currentURLRequest.href = details.url;
	var currentURLpage = currentURLRequest.pathname;
	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
	
	if (currentTLD != 'dat_site') {
		return;
	} else {
		chrome.tabs.update(details.tabId, {url: "/dat_error.html?datHash="+currentURLhostNoTLD+"&path="+currentURLpage});
	}
},
{urls: ["*://*.dat_site/*"], types: ["main_frame"]});

chrome.webRequest.onErrorOccurred.addListener(function(details)
{
    var currentURLRequest = document.createElement('a');
	currentURLRequest.href = details.url;
	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
	
	if (currentTLD != 'torrent_site') {
		return;
	} else {
		chrome.tabs.update(details.tabId, {url: "/torrent_error.html?torrentHash="+currentURLhostNoTLD});
	}
},
{urls: ["*://*.torrent_site/*"], types: ["main_frame"]});

chrome.webRequest.onErrorOccurred.addListener(function(details)
{
    console.log(details);
},
{urls: ["dat://*"], types: ["main_frame"]});

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});