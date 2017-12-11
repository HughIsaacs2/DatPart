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

var datLink = document.createElement('a');
datLink.href = "dat://"+datHash+"/";
datLink.innerText = "dat://"+datHash+"/";
datLink.className = "button";
document.body.appendChild(datLink);