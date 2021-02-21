const isNode = typeof window === 'undefined'
const parse = isNode ? require('url').parse : browserParse

const SCHEME_REGEX = /^[a-z]+:\/\//i
//                   1          2      3        4
const VERSION_REGEX = /^(dat:\/\/)?([^/]+)(\+[^/]+)(.*)$/i

function parseDatURL (str, parseQS) {
  // prepend the scheme if it's missing
  if (!SCHEME_REGEX.test(str)) {
    str = 'dat://' + str
  }

  var parsed, version = null, match = VERSION_REGEX.exec(str)
  if (match) {
    // run typical parse with version segment removed
    parsed = parse((match[1] || '') + (match[2] || '') + (match[4] || ''), parseQS)
    version = match[3].slice(1)
  } else {
    parsed = parse(str, parseQS)
  }
  if (isNode) parsed.href = str // overwrite href to include actual original
  parsed.version = version // add version segment
  console.log(parsed);
  return parsed
}

function browserParse (str) {
  return new URL(str)
}

var started = false;

function startup() {
if (started == false) {
started = true;

Array.from(document.querySelectorAll('[href^="dat://"]')).forEach(function(link){
	console.log(parseDatURL(link.href));
	//console.log(parseDatURL("dat://2714774d6c464dd12d5f8533e28ffafd79eec23ab20990b5ac14de940680a6fe/rotonde.js"));
	//link.href="about:blank";
});

Array.from(document.querySelectorAll('[src^="dat://"]')).forEach(function(link){
	console.log(parseDatURL(link.src));
	console.log("separator");
	console.log(parseDatURL("dat://2714774d6c464dd12d5f8533e28ffafd79eec23ab20990b5ac14de940680a6fe+1/rotonde.js?lol#ten"));
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
