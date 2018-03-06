"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

//navigator.registerProtocolHandler("web+magnet", "/redirector.html?torrent=%s", "Web Magnet");
//navigator.registerProtocolHandler("magnet", "/redirector.html?torrent=%s", "Magnet");
navigator.registerProtocolHandler("web+dat", "/redirector.html?dat=%s", "Web Dat");
navigator.registerProtocolHandler("dat", "/redirector.html?dat=%s", "Dat");