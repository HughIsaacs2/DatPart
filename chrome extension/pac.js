// domain => [IPs].
var cache = {};
var debug = true;

//var dathost = currentURLRequest.hostname;
	var port = "9989";
	var access = "PROXY";
	var appip = "localhost";

function FindProxyForURL(url, host) {
	if (url.substring(0, 5) == "http:" && host.lastIndexOf('.dat_site', host.length)) { return "PROXY localhost:9989;"; } else { return "DIRECT"; }
}

/*

url.substring(0, 5) == "http:" && host.indexOf(".dat_site") > -1 && 

.lastIndexOf('.dat_site', host.length)

*/