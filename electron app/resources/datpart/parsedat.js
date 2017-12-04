var parseDatUrl = require('parse-dat-url');

var started = false;

function startup() {
if (started == false) {
started = true;

Array.from(document.querySelectorAll('[href^="dat://"]')).forEach(function(link){
	console.log(parseDatUrl(link.href));
	link.href="about:blank";
});

Array.from(document.querySelectorAll('[src^="dat://"]')).forEach(function(link){
	console.log(parseDatUrl(link.href));
	link.src="about:blank";
});

}}

window.setTimeout(function() {
if (document.readyState === "complete") {
startup();
} else {
document.addEventListener("DOMContentLoaded", startup, false);
document.addEventListener("load", startup, false);
window.addEventListener("load", startup, false);
}

}, 0);