"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

function saveProxySettings() {
	console.log(document.getElementById("proxyaccess").value + ' ' + document.getElementById("proxyurl").value);
	var theGate = {};
	theGate = {
		'proxyurl': document.getElementById("proxyurl").value,
		'proxyaccess': document.getElementById("proxyaccess").value
	};
	var gatewaySet = {};
	gatewaySet["gatewaySettings"] = theGate;
	chrome.storage.local.set(gatewaySet, function() {
		console.log('Gateway settings set to ' + theGate);
		console.log(theGate);
	});
	
	chrome.notifications.getPermissionLevel(function(granted){
		chrome.notifications.create("proxysettingssaved", {
		  type: "basic",
		  title: "Proxy setting saved!",
		  message: "Proxy setting successfully saved.",
		  contextMessage: "Set to: "+document.getElementById("proxyaccess").value + ' ' + document.getElementById("proxyurl").value,
		  iconUrl: "logo.svg"
		});
	});
	window.setTimeout(function(){ chrome.notifications.clear("proxysettingssaved"); }, 1800);

};

function defaultProxySettings() {
	document.getElementById("proxyurl").value = "localhost:9989";
	document.getElementById("proxyaccess").value = "PROXY";
	saveProxySettings();
};

window.onload = function(){
document.getElementById("version-notice").textContent="This is version "+chrome.runtime.getManifest().version+" of DatPart.";

    chrome.permissions.contains({
        origins: ['https://*/.well-known/dat']
      }, function(result) {
        if (result) {
		  document.documentElement.setAttribute('check-dat', 'true');
		  document.getElementById("check-dat").checked = true;
        } else {
          document.documentElement.setAttribute('check-dat', 'false');
		  document.getElementById("check-dat").checked = false;
        }
      });
	
    chrome.permissions.contains({
			permissions: ['notifications']
		}, function(result) {
        if (result) {
		  document.getElementById("check-notifications").checked = true;
        } else {
		  document.getElementById("check-notifications").checked = false;
        }
      });

document.getElementById("check-dat").addEventListener('change', function(event) {
// Permissions must be requested from inside a user gesture, like a button's
// click handler.
if (document.getElementById("check-dat").checked == true) {

chrome.permissions.request({
  origins: ['https://*/.well-known/dat']
}, function(granted) {
  // The callback argument will be true if the user granted the permissions.
  if (granted) {
	document.documentElement.setAttribute('check-dat', 'true');
  } else {
	document.documentElement.setAttribute('check-dat', 'false');
  }
});

} else if (document.getElementById("check-dat").checked == false) {
	
	chrome.permissions.remove({
  origins: ['https://*/.well-known/dat']
}, function(removed) {
  // The callback argument will be true if the user granted the permissions.
  if (removed) {
	document.documentElement.setAttribute('check-dat', 'true');
  } else {
	document.documentElement.setAttribute('check-dat', 'false');
  }
});
}

});

document.getElementById("proxydefault").addEventListener('click', defaultProxySettings);

document.getElementById("proxysave").addEventListener('click', saveProxySettings);

document.getElementById("check-notifications").addEventListener('change', function(event) {
// Permissions must be requested from inside a user gesture, like a button's
// click handler.
if (document.getElementById("check-notifications").checked == true) {

chrome.permissions.request({
	permissions: ['notifications']
}, function(granted) {
  // The callback argument will be true if the user granted the permissions.
  if (granted) {
	
  } else {
	
  }
});

} else if (document.getElementById("check-notifications").checked == false) {
	
	chrome.permissions.remove({
		permissions: ['notifications']
	}, function(removed) {
  // The callback argument will be true if the user granted the permissions.
  if (removed) {
	
  } else {
	
  }
});
}

});

}