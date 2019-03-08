"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 0);
window.scrollTo(0, 1);

	var currentTLD = location.hostname.split(".").pop();
	var currentURLhostNoTLD = location.hostname.split(".")[0];
		
function loadDat(urlToLoad) {

document.documentElement.className=document.documentElement.className.replace("not-loading","loading");

document.getElementById("progress").remove();
document.getElementById("browser").remove();
document.getElementById("log").innerHTML = "Sorry, <a href='http://datproject.org/'>Dat protocol</a> support isn't ready yet for Chrome OS.<br/>";
  
  document.title = "Dat Site [" + urlToLoad + "]";

  document.getElementById("info").innerHTML+="<sub>dat://" + urlToLoad + "</sub><br/><br/><sub> </sub><br/>";

  		var a = document.createElement('a');
		a.href = "dat://" + urlToLoad;
		a.target = "_blank";
		a.textContent = 'Dat Link: ' + urlToLoad;
		a.className = "button download-link";
		document.getElementById("links").appendChild(a);
		
}
	
	if (currentTLD == 'dat_site') {
		loadDat(currentURLhostNoTLD);
	};