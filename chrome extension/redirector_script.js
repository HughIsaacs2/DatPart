"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

navigator.registerProtocolHandler("web+dat", "/redirector.html#%s", "Web Dat");
navigator.registerProtocolHandler("dat", "/redirector.html#%s", "Dat");

var datInURL = window.location.hash.split('#')[1];

function getTorrent(datHash) {

console.log('Redirecting to torrent ' + datHash);
document.title = "Dat Site [" + datHash + "]";
window.setTimeout( top.location.replace('http://' + datHash + '.torrent_site/'), 1 );

}
	
if(window.location.hash){
	getTorrent(datInURL);
}