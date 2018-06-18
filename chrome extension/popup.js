var appip = "127.0.0.1";
var port = "9989";
var commandPort = "9988";

function checkDatJSON() {

	chrome.tabs.query (
                { currentWindow: true, active: true }, 
                function(tabs) {
                    var activeTab = tabs[0];
                    //console.log(JSON.stringify(activeTab));
					
					var currentURLRequest = document.createElement('a');
					currentURLRequest.href = activeTab.url;
					
					var currentTLD = currentURLRequest.hostname.split(".").pop();
					var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
					
					//console.log(currentTLD);
					
				if (currentTLD != 'dat_site') {
					document.documentElement.setAttribute('dat-site', 'false');

					return;
				} else {
					
					var siteURL = document.getElementById("site-url");
					siteURL.innerText = activeTab.url;
					
					var siteTitle = document.getElementById("site-title");
					siteTitle.innerText = activeTab.title;
					
					var siteDescription = document.getElementById("site-description");
					siteDescription.innerText = activeTab.title;
					
					var siteREADME = document.getElementById("site-readme");
					var siteREADMEsection = document.getElementById("site-readme-section");
					siteREADMEsection.setAttribute("hidden","");
					
					var donateLink = document.getElementById("donate-link");
					donateLink.setAttribute("hidden","");
					
					var faviconIMG = document.getElementById("site-favicon");
					if(activeTab.favIconUrl != "undefined"){faviconIMG.src = activeTab.favIconUrl;}
					
					var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
					console.log(currentURLhostNoTLD);
					/*
					var datHash = currentURLRequest.hostname;
					var datUrlPathname = currentURLRequest.pathname;
					var datUrlSearch = currentURLRequest.search;
					var datUrlHash = currentURLRequest.hash;
					*/
					siteURL.innerText = "dat://" + currentURLhostNoTLD + currentURLRequest.pathname + currentURLRequest.search + currentURLRequest.hash;
					document.getElementById("copy-link").href = "dat://" + currentURLhostNoTLD + currentURLRequest.pathname + currentURLRequest.search + currentURLRequest.hash;
					
					fetch("http://"+ currentURLhostNoTLD + "." + currentTLD + "/favicon.ico").then(function(response) {
						if (response.status !== 200) {
								console.log('Looks like there was a problem. Status Code: ' +
								  response.status);
								if(activeTab.favIconUrl != "undefined"){faviconIMG.src = activeTab.favIconUrl;}
								return;
							  }
						
						faviconIMG.src = "http://"+ currentURLhostNoTLD + "." + currentTLD + "/favicon.ico";
						
					});
					
					fetch("http://"+ currentURLhostNoTLD + "." + currentTLD + "/README.md").then(function(response) {
						if (response.status !== 200) {
								console.log('Looks like there was a problem. Status Code: ' +
								  response.status);
								siteREADMEsection.setAttribute("hidden","");
								return;
							}
							  
						response.text().then(function(data) {
							console.log(data);
							siteREADME.innerText = data;
							siteREADMEsection.removeAttribute("hidden"); 
						});
						
					});
					
					fetch("http://"+ currentURLhostNoTLD + "." + currentTLD + "/dat.json").then(function(response) {
						console.log("Server response: "+response);
						console.log(response);
						
						if (response.status !== 200) {
								console.log('Looks like there was a problem. Status Code: ' +
								  response.status);
								return;
							  }

							  // Examine the text in the response
							  response.json().then(function(data) {
								console.log(data);
								
								if(data.title != "undefined"){
								siteTitle.innerText = data.title;
								faviconIMG.title = data.title;
								donateLink.getElementsByTagName('span')[0].innerText = "Contribute to "+data.title;
								}
								
								if(data.description != "undefined"){
								siteDescription.innerText = data.description;}else{
								siteDescription.innerText = data.title;
								}
								
								if(data.links.payment[0].href != "undefined"){	
								donateLink.href = data.links.payment[0].href; 
								donateLink.removeAttribute("hidden"); 
								} else {
								donateLink.setAttribute("hidden","");
								}
								/*
								if(data.links.icon[0].href != "undefined"){	
								faviconIMG.src = data.links.icon[0].href;
								}
								*/
							  });
					
					});
				
				}

      });

}

function checkTab() {
	console.log("Checking tab");
	chrome.tabs.query (
                { currentWindow: true, active: true }, 
                function(tabs) {
                    var activeTab = tabs[0];
                    //console.log(JSON.stringify(activeTab));
					
					var currentURLRequest = document.createElement('a');
					currentURLRequest.href = activeTab.url;
					
					var currentTLD = currentURLRequest.hostname.split(".").pop();
					//console.log(currentTLD);
					
				if (currentTLD != 'dat_site') {
					document.documentElement.setAttribute('dat-site', 'false');

					return;
				} else {
					document.documentElement.setAttribute('dat-site', 'true');
					
					checkDatJSON();
				
				}

      });
}

function checkDatAvailable() {
	
    chrome.permissions.contains({
        origins: ['https://*/.well-known/dat']
      }, function(result) {
			if (result) {
			chrome.tabs.query (
				{ currentWindow: true, active: true }, 
				function(tabs) {
					var activeTab = tabs[0];
					
					var currentURLRequest = document.createElement('a');
					currentURLRequest.href = activeTab.url;
					
					var currentURLpage = currentURLRequest.pathname;
					var currentTLD = currentURLRequest.hostname.split(".").pop();
					var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
					var currentURLhost = currentURLRequest.hostname;
					
					chrome.storage.local.get([currentURLhost], function(result) {
						if (Object.keys(result).length != 0 && result.constructor == Object && result.dat != "") {
							console.log(currentURLhost);
							console.log('Value for '+currentURLhost+' currently is ' + result);
							console.log(result);
							console.log(result.constructor === Object);
							console.log(Object.keys(result).length);
							console.log(result[currentURLhost].dat);
							
							document.documentElement.setAttribute('dat-available', 'true');
							
							document.getElementById("dat-hash").textContent=currentURLRequest.hostname+" "+result[currentURLhost].dat;
							
							document.getElementById("dat-version").href="dat://";
							document.getElementById("dat-version").href="dat://"+result[currentURLhost].dat;
							document.getElementById("dat-version").href="http://"+result[currentURLhost].dat+".dat_site/";
							document.getElementById("dat-version-url").href="dat://"+result[currentURLhost].dat;
							
						} else {
						
							document.getElementById("dat-version").href="about:blank";
							document.getElementById("dat-version-url").href="about:blank";
							document.documentElement.setAttribute('dat-available', 'false');
						
						}
					});
			});
        } else {
          //document.documentElement.setAttribute('dat-available', 'false');
        }
      });
}

window.onload = function(){
	
    chrome.permissions.contains({
        origins: ['https://*/.well-known/dat']
      }, function(result) {
        if (result) {
		  document.documentElement.setAttribute('check-dat', 'true');
		  checkDatAvailable();
        } else {
          document.documentElement.setAttribute('check-dat', 'false');
        }
      });

checkDatJSON();

checkTab();

checkDatAvailable();

      document.getElementById("check-dat").addEventListener('click', function(event) {

		chrome.runtime.openOptionsPage();
	  
      });

};