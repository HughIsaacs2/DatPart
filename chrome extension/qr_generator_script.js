"use strict";
function queryObj() {

    var result = {}, keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
}

var qrLink = queryObj()["link"];

var qrUrl = unescape(qrLink);

if (qrUrl.substring(0, 10) == "web+dat://") {
	qrUrl = qrUrl.substring(4, qrUrl.length);
}

window.onload = function() {

var qrcode = new QRCode({
  content: qrUrl,
  padding: 1,
  width: 512,
  height: 512,
  color: "#000000",
  background: "#ffffff",
  ecl: "M"
});
var svg = qrcode.svg();
document.getElementById("qrcode").innerHTML = svg;
document.querySelector("#qrcode > svg").setAttribute("viewBox","0 0 512 512");
document.getElementById("qrcode").title = "QR Code for "+qrUrl;
document.querySelector("#qrcode > svg").appendChild(document.createElement("title"));
document.querySelector("#qrcode > svg > title").innerText = "QR Code for "+qrUrl;
document.title = "QR Code for "+qrUrl;
}