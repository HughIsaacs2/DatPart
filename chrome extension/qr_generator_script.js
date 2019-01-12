"use strict";
function queryObj() {

    var result = {}, keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
}

var code_URL = queryObj()["code_URL"];

var qrUrl = unescape(code_URL);

window.onload = function() {
document.getElementById("code_image").src = "/qr_code.html?link="+ qrUrl;
document.getElementById("code_image").title = "QR Code for "+ qrUrl;
document.getElementById("code_link").href = qrUrl;
document.getElementById("code_link").textContent = qrUrl;
document.getElementById("version-notice").textContent="This is version "+chrome.runtime.getManifest().version+" of  "+chrome.runtime.getManifest().short_name+".";
}