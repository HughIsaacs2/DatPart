# DatPart
Proof of concept [Dat](https://datproject.org/) site viewer extension [and app] for Chrome.

Sites can be loaded via the .dat_site. top-level domain.

For example you can load the Acrylic Style Dat site at http://1c7639eedaf8f7533f92e7c34f5a6d2b43645347836ab5e9f2489e89d3b08306.dat_site/

Oh also, Chrome's Omnibar treats all non-standard TLDs as searches, so you'll have to type the inital HTTP:// or put a slash at the end of the URL for it to load the site.

(BitTorrent/WebTorrent support coming soon, it's already coded into the extension just not the server app. Also it'll load the same torrent sites as [PeerCloud](https://github.com/jhiesey/peercloud))

### Try it

[Get the Chrome extension here](https://chrome.google.com/webstore/detail/datpart-extension/hnblaajbillhajijlbaepnjglfgepdgm)

[Get the Desktop app here](https://github.com/HughIsaacs2/DatPart/releases)

Note: You need both for this to work.

### How this works

Basically all this does is use the Chrome Extension WebRequest API and Proxy API to intercept any requests to the top level domain .dat_site. When that TLD is requested, Chrome uses the Proxy API to redirect the request to the local Electron server at http://127.0.0.1:9989/ and from there the server loads the Dat (using sparse mode) and returns the page or file that was requested.

### To-Do

* Firefox support (this is trouble as [the Firefox WebExtension Proxy API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/proxy) is different).
  * Firefox for Android support.
* Opera support.
* Mac OS support.
* Linux support.
* Chrome OS support (aka a Chrome packaged app).
* dat:// link support.
  * This'll require coming up with a way to simply parse Dat URLs in a regular web browser, as [parse-dat-url](https://github.com/pfrazee/parse-dat-url "parse-dat-url") doesn't work very well on the web (there's likely a fix that can be done with regular expressions but I suck at them so... yeah).
* Provide the dat:// URL to the current site via the extension popup.
* Have the extension automatically open the app in the background when a .dat_site is requested via the [Native Messaging API](https://developer.chrome.com/apps/nativeMessaging).
* Polyfill [the Beaker Browser APIs](https://beakerbrowser.com/docs/apis/) (don't necessarily need all of them, just the ones to make sure the sites are viewable, e.g. Rotonde sites).
* Notifications! For everything possible (optional of course).
* Options! (A real options page)
  * Let the user set the port of the local server via options using the [Native Messaging API](https://developer.chrome.com/apps/nativeMessaging).
* Use the [omnibox API](https://developer.chrome.com/extensions/omnibox) to let users just type the dat:// URL or the hash itself as a search to load the site.
  * Come up with a fallback for when the dat can't be found (Maybe a "Did you mean?" page or something).
* Optional background functionality.
* WebRTC support (for Chrome OS and providing a web proxy).
* UDP support on Chrome OS.
* Maybe support regular domain names [the way Beaker Browser does](https://beakerbrowser.com/2017/02/22/beaker-0-6-1.html), I don't know how this would be done via a browser extension but I feel like it might be possible (if well executed this could be useful for easing bandwidth/data use on certain sites).
* Edge support? (Not possible yet, needs the Proxy API, if it ever gets it)
* Safari support? (I'm unsure if this is possible)
* Internet Explorer support? (I'm being ridiculous here, but again unsure if this is possible)

## To-Do [Short term + more specific list]
* ~~Dat URL for current tab in the extension pop up.~~
* ~~Support for 404 pages by reading “fallback_page” in dat.json.~~
* ~~An button in the extension pop up to tell the app to download the entire Dat.~~
* ~~A button in the extension pop up to tell the app to delete the entire Dat.~~
* ~~A landing page for introducing users to the extension/app.~~
* A page for deleting torrents/dats and other information.
* The ability to submit dat links or hashes as searches in the extension (needs Dat parse for web).
* Grey out extension icon when not on a Dat site (sort of done, I instead display a badge for Dat sites).

