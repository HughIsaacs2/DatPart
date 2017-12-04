# DatPart
Proof of concept Dat site viewer for Chrome.

Sites can be loaded via the .dat_site. top-level domain.

For example you can load the Acrylic Style Dat site at http://1c7639eedaf8f7533f92e7c34f5a6d2b43645347836ab5e9f2489e89d3b08306.dat_site/

Oh also, Chrome's Omnibar treats all non-standard TLDs as searches, so you'll have to type the inital HTTP:// or put a slash at the end of the URL for it to load the site.

(BitTorrent/WebTorrent support coming soon, it's already coded into the extension just not the server app. Also it'll load the same torrent sites as [PeerCloud](https://github.com/jhiesey/peercloud))

### To-Do

* dat:// link support.
  * This'll require coming up with a way to simply parse Dat URLs in a regular web browser, as [parse-dat-url](https://github.com/pfrazee/parse-dat-url "parse-dat-url") doesn't work very well on the web (there's likely a fix that can be done with regular expressions but I suck at them so... yeah).
* Provide the dat:// URL to the current site via the extension popup.
* Polyfill the Beaker Browser APIs (don't necessarily need all of them, just the ones to make sure the sites are viewable, e.g. Rotonde sites).
* Notifications! For everything possible (optional of course).
* Options! (A real options page)
* Optional background functionality.
* WebRTC support (for Chrome OS and providing a web proxy).
* UDP support on Chrome OS.
