var chromeos_server_app_id = chrome.runtime.getManifest().externally_connectable.ids[0]; //Chrome specific

var appip = "127.0.0.1";
var port = "9989";

function fakeDisable() {
    chrome.browserAction.setBadgeText({
        text: ""
    });
    chrome.browserAction.setBadgeBackgroundColor({color: "#000000"});
    //chrome.browserAction.setPopup({popup: "other_popup.html"});
}

function fakeEnable() {
    chrome.browserAction.setBadgeText({
        text: "Dat"
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: "#2aca4b"
    }); //Dat logo color
    //chrome.browserAction.setPopup({popup: chrome.runtime.getManifest().browser_action.default_popup});
}

function datAvailable() {
    chrome.browserAction.setBadgeText({
        text: "1"
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: "#006fdf"
    }); //Beaker logo color
}

function getDatSite(currentURLhost) {

                                   fetch("https://" + currentURLhost + "/.well-known/dat").then(function(response) {
                                        console.log(currentURLhost+" server response: " + response);
                                        console.log(response);
                                        console.log(response.body);

                                        if (response.status !== 200 || response.status == 404) {
                                            console.log(currentURLhost +'Looks like there was a problem. Status Code: ' + response.status);
											
											console.log("No dat:// at this URL "+currentURLhost);
                                            fakeDisable();
											var theHereAndNow = new Date().getTime() / 1000;
											var backupDate = theHereAndNow + 3600;
											var itExists = {};
											itExists = {
												'dat': "",
												'ttl': backupDate
											};
											var thatNewOne = {};
											thatNewOne[currentURLhost] = itExists;
											/* See: https://stackoverflow.com/questions/17664312/using-a-url-as-a-key-in-chromes-local-storage-dictionary and https://stackoverflow.com/questions/12925770/how-to-use-chrome-storage-in-a-chrome-extension-using-a-variables-value-as-the for the above */
											chrome.storage.local.set(thatNewOne, function() {
												console.log(currentURLhost + ' value was set to ' + itExists);
												console.log(itExists);
											});
											
                                            return;
                                        } else {
                                            response.text().then(function(text) {
                                                // do something with the text response
                                                console.log(text);

                                                console.log(text.split('\n')[0]);
                                                console.log(text.split('\n')[1]);
                                                console.log(text.split('\n').shift().substring(0, 6));
                                                console.log("Dat hash: " + text.split('\n').shift().substring(6, 70));
                                                console.log("TTL: " + text.split('\n')[1].substring(4, text.length));
                                                console.log(text.split('\n').shift().substring(0, 6));
                                                console.log(text.split('\n').shift().substring(0, 6) == "dat://");
												if (text.split('\n').shift().substring(0, 6) == "dat://") {

													datAvailable();
													
													var theHereAndNow = new Date().getTime() / 1000;
													console.log("Date Now: " + theHereAndNow);
													var TTLtext = parseInt(text.split('\n')[1].substring(4, text.length));
													var TTLDate = theHereAndNow + TTLtext;
													var backupDate = theHereAndNow + 3600;
													console.log("TTL Date: " + TTLDate);
													var itExists = {};
													if (TTLtext != null && TTLtext != undefined && TTLtext != 0) {
														itExists = {
															'dat': text.split('\n')[0].substring(6, 70),
															'ttl': TTLDate
														};
													} else {
														itExists = {
															'dat': "",
															'ttl': backupDate
														};
													}
													var thatNewOne = {};
													thatNewOne[currentURLhost] = itExists;
													/* See: https://stackoverflow.com/questions/17664312/using-a-url-as-a-key-in-chromes-local-storage-dictionary and https://stackoverflow.com/questions/12925770/how-to-use-chrome-storage-in-a-chrome-extension-using-a-variables-value-as-the for the above */
													chrome.storage.local.set(thatNewOne, function() {
														console.log(currentURLhost + ' value was set to ' + itExists);
														console.log(itExists);
													});
												} else {
													console.log("No dat:// at this URL "+currentURLhost);
													var theHereAndNow = new Date().getTime() / 1000;
													var backupDate = theHereAndNow + 3600;
													var itExists = {};
													itExists = {
														'dat': "",
														'ttl': backupDate
													};
													var thatNewOne = {};
													thatNewOne[currentURLhost] = itExists;
													/* See: https://stackoverflow.com/questions/17664312/using-a-url-as-a-key-in-chromes-local-storage-dictionary and https://stackoverflow.com/questions/12925770/how-to-use-chrome-storage-in-a-chrome-extension-using-a-variables-value-as-the for the above */
													chrome.storage.local.set(thatNewOne, function() {
														console.log(currentURLhost + ' value was set to ' + itExists);
														console.log(itExists);
													});
												}
                                            });
                                        }
                                    });
}

function decideEnable(currentTLD) {

    if (currentTLD != 'dat_site') {
        fakeDisable();

        chrome.permissions.contains({
            origins: ['https://*/.well-known/dat']
        }, function(result) {
            if (result) {

                chrome.tabs.query({
                        currentWindow: true,
                        active: true
                    },
                    function(tabs) {
                        var activeTab = tabs[0];

                        var currentURLRequest = document.createElement('a');
                        currentURLRequest.href = activeTab.url;
                        if (currentURLRequest.protocol == "https:") {
							var currentURLhost = currentURLRequest.hostname;

                            chrome.storage.local.get([currentURLhost], function(result) {
                                console.log(currentURLhost);
                                console.log('Value for '+currentURLhost+' currently is ' + result);
                                console.log(result);
                                console.log(result.constructor === Object);
                                console.log(Object.keys(result).length);
                                
                                if (Object.keys(result).length != 0 && result.constructor == Object) {
									if (result[currentURLhost].dat != "") { datAvailable(); }
									//console.log('');
                                    var theHereAndNow = new Date().getTime() / 1000;
                                    var TTLtext = result[currentURLhost].ttl;
                                    console.log("Now: "+theHereAndNow);
                                    console.log("TTL: "+TTLtext);
                                    console.log(TTLtext > theHereAndNow);
                                    if (TTLtext > theHereAndNow) {
                                        console.log(currentURLhost+" Not Expired");
                                    } else {
                                        console.log(currentURLhost+" Expired");
										getDatSite(currentURLhost);
                                    }
                                } else {
										getDatSite(currentURLhost);
                                }
                            });
                        }
                    });
            }
            else {
                fakeDisable();
            }
        });

    }
    else {
        fakeEnable();
    }
}

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        console.log("First install.");
        chrome.tabs.create({
            url: chrome.runtime.getURL("/welcome.html")
        });
    }
    else if (details.reason == "update") {
        console.log("Updated from " + details.previousVersion + " to " + chrome.runtime.getManifest().version + ".");
    }
});

chrome.tabs.onActivated.addListener(function(tab) {
    console.log(tab);

    chrome.tabs.query({
            currentWindow: true,
            active: true
        },
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log(changeInfo);
    console.log(changeInfo.url);

    var currentURLRequest = document.createElement('a');
    currentURLRequest.href = changeInfo.url;

    var currentTLD = currentURLRequest.hostname.split(".").pop();
    console.log(currentTLD);

    decideEnable(currentTLD);
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    console.log('inputChanged: ' + text);
    suggest([{
            content: text + " one",
            description: "the first one"
        },
        {
            content: text + " number two",
            description: "the second entry"
        }
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
console.log("Before Navigate "+currentURLRequest.hostname);
    console.log(details);
    if (currentTLD != 'dat_site') {
        //Do nothing
    }
    else {
        chrome.runtime.sendMessage(chromeos_server_app_id, {
            launch: true
        });
        console.log('inputEntered: ' + details.url + "|" + currentTLD);
    }
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {  //Chrome specific
    var currentURLRequest = document.createElement('a');
    currentURLRequest.href = details.url;
    console.log(details.url);
    var currentTLD = currentURLRequest.hostname.split(".").pop();
    var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
    console.log("Before Request "+currentURLRequest.hostname);
    console.log(details);

    if (currentTLD != 'dat_site') {
        return;
    }
    else {
        //chrome.runtime.sendMessage(chromeos_server_app_id, { launch: true });
    };

    var dathost = currentURLRequest.hostname;
    var access = "PROXY";

    var config = {
        mode: "pac_script",
        pacScript: {
            data: "function FindProxyForURL(url, host) {\n" +
                "  if (dnsDomainIs(host, '" + dathost + "'))\n" +
                "    return '" + access + " " + appip + ":" + port + "';\n" +
                "  return 'DIRECT';\n" +
                "}"
        }
    };

    chrome.proxy.settings.set({
        value: config,
        scope: 'regular'
    }, function() {});
    console.log('IP ' + appip + ' for ' + dathost + ' found, config is changed: ' + JSON.stringify(config));

    //var redirectBackup = "redirect.html#"+currentURLhostNoTLD;
    //return {cancel: true, redirectUrl: "redirect.html"};
}, {
    urls: ["http://*.dat_site/*"]
}, ["blocking"]);

chrome.webRequest.onErrorOccurred.addListener(function(details) {
    var currentURLRequest = document.createElement('a');
    currentURLRequest.href = details.url;
    var currentURLpage = currentURLRequest.pathname;
    var currentTLD = currentURLRequest.hostname.split(".").pop();
    var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
    console.log("Error Occurred "+currentURLRequest.hostname);
    console.log(details);
    
    if (currentTLD != 'dat_site') {
        return;
    }
    else {
        chrome.tabs.update(details.tabId, {
            url: "/dat_error.html?datHash=" + currentURLhostNoTLD + "&path=" + currentURLpage
        });
    }
}, {
    urls: ["http://*.dat_site/*"],
    types: ["main_frame"]
});

chrome.webRequest.onResponseStarted.addListener(function(details) {
    console.log(details.url+" Response Started");
    console.log(details);
    console.log(details.responseHeaders);
	
	var currentURLRequest = document.createElement('a');
    currentURLRequest.href = details.url;

    var currentTLD = currentURLRequest.hostname.split(".").pop();
    console.log(currentTLD);

    decideEnable(currentTLD);
}, {
    urls: ["http://*.dat_site/*"],
    types: ["main_frame"]
});

chrome.webRequest.onBeforeRedirect.addListener(function(details) {
    console.log(details.url+" Before Redirect");
    console.log(details);
    console.log(details.responseHeaders);
}, {
    urls: ["http://*.dat_site/*"],
    types: ["main_frame"]
});

chrome.webRequest.onCompleted.addListener(function(details) {
    console.log(details.url+" Completed");
    console.log(details);
    console.log(details.responseHeaders);
    console.log("HTTP Headers: " + details.responseHeaders);
	
	var currentURLRequest = document.createElement('a');
    currentURLRequest.href = details.url;

    var currentTLD = currentURLRequest.hostname.split(".").pop();
    console.log(currentTLD);

    decideEnable(currentTLD);
}, {
    urls: ["http://*.dat_site/*"],
    types: ["main_frame"]
});

chrome.webRequest.onHeadersReceived.addListener(function(details) {
    console.log(details.url+" Headers Received");
    console.log(details);
    console.log(details.responseHeaders);
    console.log("HTTP Headers: " + details.responseHeaders);
	
	if (details.responseHeaders['Site-Pinned'] == "true") {
		var views = chrome.extension.getViews({
			type: "popup"
		});
		for (var i = 0; i < views.length; i++) {
			views[i].document.documentElement.setAttribute('dat-site-pinned', 'true');
		}
	} else {
		var views = chrome.extension.getViews({
			type: "popup"
		});
		for (var i = 0; i < views.length; i++) {
			views[i].document.documentElement.setAttribute('dat-site-pinned', 'false');
		}
	}
	
	var currentURLRequest = document.createElement('a');
    currentURLRequest.href = details.url;

    var currentTLD = currentURLRequest.hostname.split(".").pop();
    console.log(currentTLD);

    decideEnable(currentTLD);
}, {
    urls: ["http://*.dat_site/*"],
    types: ["main_frame"]
});

chrome.webRequest.onErrorOccurred.addListener(function(details) {
    var currentURLRequest = document.createElement('a');
    currentURLRequest.href = details.url;
    var currentTLD = currentURLRequest.hostname.split(".").pop();
    var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];

    if (currentTLD != 'torrent_site') {
        return;
    }
    else {
        chrome.tabs.update(details.tabId, {
            url: "/torrent_error.html?torrentHash=" + currentURLhostNoTLD
        });
    }
}, {
    urls: ["http://*.torrent_site/*"],
    types: ["main_frame"]
});

/*

Array.from(document.querySelectorAll('[href^="dat://"],[src^="dat://"]')).forEach(function(link){
});

*/