var appip = "127.0.0.1";
var port = "9989";

const cachedFetch = (url, options) => {
  let expiry = 5 * 60 // 5 min default
  if (typeof options === 'number') {
    expiry = options
    options = undefined
  } else if (typeof options === 'object') {
    // I hope you didn't set it to 0 seconds
    expiry = options.seconds || expiry
  }
  // Use the URL as the cache key to sessionStorage
  let cacheKey = url
  let cached = localStorage.getItem(cacheKey)
  let whenCached = localStorage.getItem(cacheKey + ':ts')
  if (cached !== null && whenCached !== null) {
    // it was in sessionStorage! Yay!
    // Even though 'whenCached' is a string, this operation
    // works because the minus sign converts the
    // string to an integer and it will work.
    let age = (Date.now() - whenCached) / 1000
    if (age < expiry) {
      let response = new Response(new Blob([cached]))
      return Promise.resolve(response)
    } else {
      // We need to clean up this old key
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(cacheKey + ':ts')
    }
  }

  return fetch(url, options).then(response => {
    // let's only store in cache if the content-type is
    // JSON or something non-binary
    if (response.status === 200) {
      let ct = response.headers.get('Content-Type')
      if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
        // There is a .json() instead of .text() but
        // we're going to store it in sessionStorage as
        // string anyway.
        // If we don't clone the response, it will be
        // consumed by the time it's returned. This
        // way we're being un-intrusive.
        response.clone().text().then(content => {
          localStorage.setItem(cacheKey, content)
          localStorage.setItem(cacheKey+':ts', Date.now())
        })
      }
    }
    return response
  })
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
					
					var siteAuthorName = document.getElementById("author-name");
					var siteAuthorEmail = document.getElementById("author-email");
					var siteAuthorWeb = document.getElementById("author-web");
					var siteAuthorSection = document.getElementById("site-author-section");
					siteAuthorSection.setAttribute("hidden","");
					
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
					
					document.getElementById("qr-iframe").src="/qr_generator.html?link=" + "dat://" + currentURLhostNoTLD + currentURLRequest.pathname + currentURLRequest.search + currentURLRequest.hash;
					document.getElementById("qr-link").href="/qr_generator.html?link=" + "dat://" + currentURLhostNoTLD + currentURLRequest.pathname + currentURLRequest.search + currentURLRequest.hash;
					
					fetch("http://"+ currentURLhostNoTLD + "." + currentTLD + "/favicon.ico").then(function(response) {
						if (response.status !== 200) {
								console.log('Looks like there was a problem getting favicon.ico. Status Code: ' +
								  response.status);
								  
									fetch("http://"+ currentURLhostNoTLD + "." + currentTLD + "/favicon.png").then(function(response) {
										console.log("Trying for favicon.png now.");
										
										if (response.status !== 200) {
												console.log('Looks like there was a problem getting favicon.png. Status Code: ' +
												  response.status);
												  if(activeTab.favIconUrl != "undefined"){faviconIMG.src = activeTab.favIconUrl;}
												return;
											  } else { faviconIMG.src = "http://"+ currentURLhostNoTLD + "." + currentTLD + "/favicon.png"; }
										
									});

								return;
							  } else { faviconIMG.src = "http://"+ currentURLhostNoTLD + "." + currentTLD + "/favicon.ico"; }
						
					});
					
					cachedFetch("http://"+ currentURLhostNoTLD + "." + currentTLD + "/README.md").then(function(response) {
						if (response.status !== 200) {
								console.log('Looks like there was a problem. Status Code: ' +
								  response.status);
								siteREADMEsection.setAttribute("hidden","");
								return;
							}
							  
						response.text().then(function(data) {
							if (data !== "") {
								console.log(data);
								siteREADME.innerText = data;
								siteREADMEsection.removeAttribute("hidden"); 
							} else {
								siteREADMEsection.setAttribute("hidden","");
							}
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
								
								if (data.author != "undefined" && typeof data.author == 'string' || data.author != "undefined" && data.author instanceof String) {
									siteAuthorName.innerText = data.author;
									siteAuthorSection.removeAttribute("hidden"); 
								} else if (data.author != "undefined") {
									if(data.author.name != "undefined"){
										siteAuthorName.innerText = data.author.name;
										
										siteAuthorSection.removeAttribute("hidden"); 
									}
									
									if(data.author.email != "undefined"){
										siteAuthorEmail.innerText = "";
										
										siteAuthorEmail.href = "mailto:" + data.author.email;
										siteAuthorEmail.innerText = data.author.email;
										
										siteAuthorSection.removeAttribute("hidden"); 
									}
									
									if(data.author.web != "undefined"){
										siteAuthorWeb.innerText = "";
										
										siteAuthorWeb.href = data.author.web;
										siteAuthorWeb.innerText = data.author.web;
										
										siteAuthorSection.removeAttribute("hidden"); 
									}
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
						if (Object.keys(result).length != 0 && result.constructor == Object && result.dat != "" && result[currentURLhost].dat != "") {
							console.log(currentURLhost);
							console.log('Value for '+currentURLhost+' currently is ' + result);
							console.log(result);
							console.log(result.constructor === Object);
							console.log(Object.keys(result).length);
							console.log(result[currentURLhost].dat);
							
							document.documentElement.setAttribute('dat-available', 'true');
							
							document.getElementById("https-url").textContent=currentURLRequest.hostname;
							document.getElementById("dat-hash").textContent="dat://"+result[currentURLhost].dat;
							
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