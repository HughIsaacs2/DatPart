var appip = "127.0.0.1";
var port = "9989";
var commandPort = "9988";

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
						console.log("Server response: "+response);
						console.log(response);
					}).then(function(data) {
						console.log("Data: "+data);
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
						console.log("Server response: "+response);
						console.log(response);
					}).then(function(data) {
						console.log("Data: "+data);
					});
				
				}

      });
}

function checkPin() {
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
					myHeaders.append("Task", "checkpin");
					
					fetch("http://"+ appip +":" + commandPort + "/checkpin/", {
						method: "POST",
						headers: myHeaders
					}).then(function(response) {
						console.log("Server response: "+response);
						console.log(response);
					}).then(function(data) {
						console.log("Data: "+data);
					});
				
				}

      });
}

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
								siteTitle.innerText = data.title;}
								
								if(data.description != "undefined"){
								siteDescription.innerText = data.description;}else{
								siteDescription.innerText = data.title;}
								
								//if(activeTab.favIconUrl != "undefined"){faviconIMG.src = activeTab.favIconUrl;}
								//faviconIMG.title = data.title;
								
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
	  
	checkPin();
}

function checkDatAvailable() {
	
    chrome.permissions.contains({
        origins: ['https://*/']
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
					
				fetch("https://"+ currentURLhostNoTLD + "." + currentTLD + "/.well-known/dat").then(function(response) {
				console.log("Server response: "+response);
				console.log(response);
				console.log(response.body);
				
				if (response.status !== 200) {
					console.log('Looks like there was a problem. Status Code: ' + response.status);
					
					return;
				} else {
					document.getElementById("dat-version").href="dat://";
					response.text().then(function (text) {
						
				console.log(response.text);
					  // do something with the text response 
					});
					
				}
					  
				});
			});
        } else {
          
        }
      });
}

window.onload = function(){
	
    chrome.permissions.contains({
        origins: ['https://*/']
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

document.getElementById("pin").addEventListener("click",pinSite);

document.getElementById("unpin").addEventListener("click",unpinSite);

      document.getElementById("check-dat").addEventListener('click', function(event) {
        // Permissions must be requested from inside a user gesture, like a button's
        // click handler.
        chrome.permissions.request({
          origins: ['https://*/']
        }, function(granted) {
          // The callback argument will be true if the user granted the permissions.
          if (granted) {
            document.documentElement.setAttribute('check-dat', 'true');
          } else {
            document.documentElement.setAttribute('check-dat', 'false');
          }
        });
      });

};