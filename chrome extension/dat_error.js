"use strict";

function queryObj() {

    var result = {}, keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
}

var datHash = queryObj()["datHash"];
var datPath = queryObj()["path"];

var retryLink = document.createElement('a');
retryLink.href = "http://"+datHash+".dat_site"+datPath;
retryLink.innerText = "Retry";
retryLink.className = "button";
document.body.appendChild(retryLink);

var thaBr = document.createElement('br');
document.body.appendChild(thaBr);

var onx = document.createElement('br');
document.body.appendChild(onx);

var datLink = document.createElement('a');
datLink.href = "dat://"+datHash+datPath;
datLink.innerText = "dat:// link";
datLink.className = "button";
document.body.appendChild(datLink);