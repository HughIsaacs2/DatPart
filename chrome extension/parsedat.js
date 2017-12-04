var parseDatUrl = require('parse-dat-url');

var started = false;

function startup() {
if (started == false) {
started = true;

Array.from(document.querySelectorAll('[href^="dat://"]')).forEach(function(link){
	console.log(parseDatUrl(link.href));
	//console.log(parseDatUrl("dat://2714774d6c464dd12d5f8533e28ffafd79eec23ab20990b5ac14de940680a6fe/rotonde.js"));
	//link.href="about:blank";
});

Array.from(document.querySelectorAll('[src^="dat://"]')).forEach(function(link){
	console.log(parseDatUrl(link.src));
	//console.log(link.src);
	//console.log(parseDatUrl("dat://2714774d6c464dd12d5f8533e28ffafd79eec23ab20990b5ac14de940680a6fe/rotonde.js"));
	//link.src="about:blank";
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