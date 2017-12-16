// domain => [IPs].
var cache = {};
var debug = true;

//var dathost = currentURLRequest.hostname;
	var port = "9989";
	var access = "PROXY";
	var appip = "127.0.0.1";

function FindProxyForURL(url, host) {
	if (url.substring(0, 5) == "http:" && host.lastIndexOf('.dat_site', host.length)) { return "PROXY 127.0.0.1:9989;"; } else { return "DIRECT"; }
}

/*

url.substring(0, 5) == "http:" && host.indexOf(".dat_site") > -1 && 

.lastIndexOf('.dat_site', host.length)

*/