"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

//navigator.registerProtocolHandler("web+magnet", "/redirector.html?torrent=%s", "Web Magnet");
//navigator.registerProtocolHandler("magnet", "/redirector.html?torrent=%s", "Magnet");
navigator.registerProtocolHandler("web+dat", "/redirector.html?dat=%s", "Web Dat");
navigator.registerProtocolHandler("dat", "/redirector.html?dat=%s", "Dat");

function queryObj() {

    var result = {}, keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
}

var datLink = queryObj()["dat"];

var datInURL = window.location.hash.split('#')[1];

document.title = "";