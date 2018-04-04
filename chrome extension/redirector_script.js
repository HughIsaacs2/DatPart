"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

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
document.title = "Redirecting to "+datUrl;
document.body.textContent = "Redirecting to "+datUrl;

if (datUrl.substring(0, 4) == "web+") {
	datUrl = datUrl.substring(4, datUrl.length);
	document.title = "Redirecting to "+datUrl;
	document.body.textContent = "Redirecting to "+datUrl;
}

var datPartUrl = "http://"+datUrl.substring(6, 70)+".dat_site"+datUrl.substring(70, datUrl.length);

	document.body.appendChild(document.createElement('br'));
	document.body.appendChild(document.createElement('br'));
	
    var redirectLink = document.createElement('a');
	redirectLink.className = "button";
	redirectLink.textContent = "Redirect";
	redirectLink.title = "Click here to redirect to the site if it's not working.";
    redirectLink.href = "http://"+datUrl.substring(6, 70)+".dat_site"+datUrl.substring(70, datUrl.length);
	document.body.appendChild(redirectLink);
	
    var redirectMeta = document.createElement('meta');
	redirectMeta.setAttribute("http-equiv", "refresh");
	redirectMeta.setAttribute("content", "0; url="+"http://"+datUrl.substring(6, 70)+".dat_site"+datUrl.substring(70, datUrl.length));
	document.head.appendChild(redirectMeta);
	
	document.location.replace("http://"+datUrl.substring(6, 70)+".dat_site"+datUrl.substring(70, datUrl.length));
	window.location.replace("http://"+datUrl.substring(6, 70)+".dat_site"+datUrl.substring(70, datUrl.length));