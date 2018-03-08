var appip = "127.0.0.1";
var port = "9989";
var commandPort = "9988";

function checkTab() {	
	chrome.tabs.query (
                { currentWindow: true, active: true }, 
                function(tabs) {
                    var activeTab = tabs[0];
                    console.log(JSON.stringify(activeTab));
					
					var currentURLRequest = document.createElement('a');
					currentURLRequest.href = activeTab.url;
					
					var currentTLD = currentURLRequest.hostname.split(".").pop();
					console.log(currentTLD);
					
				if (currentTLD != 'dat_site') {
					document.documentElement.setAttribute('dat-site', 'false');

					return;
				} else {
					document.documentElement.setAttribute('dat-site', 'true');

					var siteURL = document.getElementById("site-url");
					siteURL.innerText = activeTab.url;
					
					var siteTitle = document.getElementById("site-title");
					siteTitle.innerText = activeTab.title;
					
					var faviconIMG = document.getElementById("site-favicon");
					faviconIMG.src = activeTab.favIconUrl;
					faviconIMG.title = activeTab.title;
					
					var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
					console.log(currentURLhostNoTLD);
					/*
					var datHash = currentURLRequest.hostname;
					var datUrlPathname = currentURLRequest.pathname;
					var datUrlSearch = currentURLRequest.search;
					var datUrlHash = currentURLRequest.hash;
					*/
					siteURL.innerText = "dat://" + currentURLhostNoTLD + currentURLRequest.pathname + currentURLRequest.search + currentURLRequest.hash;
				
				}

      });
}

function pinSite() {
			chrome.tabs.query (
                { currentWindow: true, active: true }, 
                function(tabs) {
                    var activeTab = tabs[0];
                    console.log(JSON.stringify(activeTab));
					
					var currentURLRequest = document.createElement('a');
					currentURLRequest.href = activeTab.url;
					
					var currentTLD = currentURLRequest.hostname.split(".").pop();
					console.log(currentTLD);
					
				if (currentTLD != 'dat_site') {
					return;
				} else {
					
					var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
					console.log(currentURLhostNoTLD);

					var myHeaders = new Headers();
					myHeaders.append("Content-Type", "text/plain");
					myHeaders.append("Type", "dat");
					myHeaders.append("Dat", currentURLhostNoTLD);
					myHeaders.append("Task", "pin");
					
					fetch("http://"+ appip +":" + commandPort + "/pin/", {
						method: "POST",
						headers: myHeaders
					}).then(function(response) {
						console.log(response);
					}).then(function(data) {
						console.log(data);
					});
				
				}

      });
}

function unpinSite() {
			chrome.tabs.query (
                { currentWindow: true, active: true }, 
                function(tabs) {
                    var activeTab = tabs[0];
                    console.log(JSON.stringify(activeTab));
					
					var currentURLRequest = document.createElement('a');
					currentURLRequest.href = activeTab.url;
					
					var currentTLD = currentURLRequest.hostname.split(".").pop();
					console.log(currentTLD);
					
				if (currentTLD != 'dat_site') {
					return;
				} else {
					
					var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
					console.log(currentURLhostNoTLD);

					var myHeaders = new Headers();
					myHeaders.append("Content-Type", "text/plain");
					myHeaders.append("Type", "dat");
					myHeaders.append("Dat", currentURLhostNoTLD);
					myHeaders.append("Task", "unpin");
					
					fetch("http://"+ appip +":" + commandPort + "/unpin/", {
						method: "POST",
						headers: myHeaders
					}).then(function(response) {
						console.log(response);
					}).then(function(data) {
						console.log(data);
					});
				
				}

      });
}

window.onload = function(){

checkTab();

chrome.tabs.onUpdated.addListener(checkTab);

document.getElementById("pin").addEventListener("click",pinSite);

document.getElementById("unpin").addEventListener("click",unpinSite);

};