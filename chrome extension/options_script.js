"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

navigator.registerProtocolHandler("magnet", "/redirector.html#torrent=%s", "Magnet");
//navigator.registerProtocolHandler("web+magnet", "/redirector.html#%s", "Magnet");
navigator.registerProtocolHandler("web+dat", "/redirector.html#dat=%s", "Dat");