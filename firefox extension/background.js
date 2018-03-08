browser.proxy.register('pac.js');

var appip = "127.0.0.1";
var port = "9989";

function fakeDisable() {
	chrome.browserAction.setBadgeText({text: ""});
	chrome.browserAction.setBadgeBackgroundColor({color: ""});
	//chrome.browserAction.setPopup({popup: "other_popup.html"});
	//chrome.browserAction.disable();
}

function fakeEnable() {
	chrome.browserAction.setBadgeText({text: "Dat"});
	chrome.browserAction.setBadgeBackgroundColor({color: "#000000"});
	//chrome.browserAction.setPopup({popup: chrome.runtime.getManifest().browser_action.default_popup});
	//chrome.browserAction.enable();
}

function decideEnable(currentTLD) {
					
				if (currentTLD != 'dat_site') {
					fakeDisable();
				} else {
					fakeEnable();
				}

}


chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("First install.");
		chrome.tabs.create({url: chrome.runtime.getURL("/welcome.html")});
    }else if(details.reason == "update"){
        console.log("Updated from " + details.previousVersion + " to " + chrome.runtime.getManifest().version + ".");
    }
});

chrome.tabs.onActivated.addListener(function (tab) {
	console.log(tab);
	
		  chrome.tabs.query (
                { currentWindow: true, active: true }, 
                function(tabs) {
                    var activeTab = tabs[0];
                    console.log(JSON.stringify(activeTab));
					
					var currentURLRequest = document.createElement('a');
					currentURLRequest.href = activeTab.url;
					
					var currentTLD = currentURLRequest.hostname.split(".").pop();
					console.log(currentTLD);
					
				decideEnable(currentTLD);

      });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	console.log(changeInfo); console.log(changeInfo.url);
	
					var currentURLRequest = document.createElement('a');
					currentURLRequest.href = changeInfo.url;
					
					var currentTLD = currentURLRequest.hostname.split(".").pop();
					console.log(currentTLD);
					
				decideEnable(currentTLD);

});

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
	var access = "PROXY";
	
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

chrome.webRequest.onResponseStarted.addListener(function(details) {
console.log("Response Started");
console.log(details);
console.log(details.responseHeaders);
},
{urls: ["*://*.dat_site/*"], types: ["main_frame"]});

chrome.webRequest.onBeforeRedirect.addListener(function(details) {
console.log("Before Redirect");
console.log(details);
console.log(details.responseHeaders);
},
{urls: ["*://*.dat_site/*"], types: ["main_frame"]});

chrome.webRequest.onCompleted.addListener(function(details) {
console.log("Completed");
console.log(details);
console.log(details.responseHeaders);
},
{urls: ["*://*.dat_site/*"], types: ["main_frame"]});

chrome.webRequest.onHeadersReceived.addListener(function(details) {
console.log("Headers Received");
console.log(details);
console.log(details.responseHeaders);
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