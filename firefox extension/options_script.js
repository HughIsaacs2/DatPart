"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

window.onload = function(){
document.getElementById("version-notice").textContent="This is version "+chrome.runtime.getManifest().version+" of DatPart.";

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

document.getElementById("check-dat").addEventListener('click', function(event) {
// Permissions must be requested from inside a user gesture, like a button's
// click handler.
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
});

}