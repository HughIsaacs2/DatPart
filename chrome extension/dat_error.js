"use strict";

function queryObj() {

    var result = {}, keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
}

var datLink = queryObj()["dat"];

var datUrl = unescape(datLink);

if (datUrl.substring(0, 4) == "web+") {
	datUrl = datUrl.substring(4, datUrl.length);
}

var siteInfo = document.createElement('span');
siteInfo.id = "error-site-info";
siteInfo.innerText = datUrl;
document.body.appendChild(siteInfo);

document.body.appendChild(document.createElement('br'));
document.body.appendChild(document.createElement('br'));

var retryLink = document.createElement('a');
retryLink.href = "http://"+datUrl.substring(6, 70)+".dat_site"+datUrl.substring(70, datUrl.length);
retryLink.innerText = "Retry";
retryLink.title = "Try loading the page again";
retryLink.className = "button";
document.body.appendChild(retryLink);

document.body.appendChild(document.createElement('br'));
document.body.appendChild(document.createElement('br'));

var datLink = document.createElement('a');
datLink.href = datUrl;
datLink.title = datUrl;
datLink.innerText = "dat:// link";
datLink.className = "button";
document.body.appendChild(datLink);