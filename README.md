# DatPart
Proof of concept [Dat](https://datproject.org/) site viewer extension [and app] for Chrome.

Sites can be loaded via the .dat_site. top-level domain.

For example you can load the Acrylic Style Dat site at http://1c7639eedaf8f7533f92e7c34f5a6d2b43645347836ab5e9f2489e89d3b08306.dat_site/

Oh also, Chrome's Omnibar treats all non-standard TLDs as searches, so you'll have to type the inital HTTP:// or put a slash at the end of the URL for it to load the site.

(BitTorrent/WebTorrent support coming soon, it's already coded into the extension just not the server app. Also it'll load the same torrent sites as [PeerCloud](https://github.com/jhiesey/peercloud) and [BitTorrent Maelstrom](http://blog.bittorrent.com/2014/12/10/project-maelstrom-the-internet-we-build-next/))

### Try it

[Get the Chrome extension here](https://chrome.google.com/webstore/detail/datpart-extension/hnblaajbillhajijlbaepnjglfgepdgm)

[Get the Desktop app here](https://github.com/HughIsaacs2/DatPart/releases)

Note: You need both for this to work.

### How this works

Basically all this does is use the Chrome Extension WebRequest API and Proxy API to intercept any requests to the top level domain .dat_site. When that TLD is requested, Chrome uses the Proxy API to redirect the request to the local Electron server at http://127.0.0.1:9989/ and from there the server loads the Dat (using sparse mode) and returns the page or file that was requested.

### To-Do

* Firefox support (this is trouble as [the Firefox WebExtension Proxy API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/proxy) is different, I'm just being lazy here).
  * Firefox for Android support.
* Opera support.
* Mac OS support.
* Linux support.
* ~~Chrome OS support (aka a Chrome packaged app).~~ (In the works!)
* ~~WebRTC support (for Chrome OS and providing a web proxy).~~ (In the works!)
* UDP support on Chrome OS.
* dat:// link support.
  * This'll require coming up with a way to simply parse Dat URLs in a regular web browser, as [parse-dat-url](https://github.com/pfrazee/parse-dat-url "parse-dat-url") doesn't work very well on the web (there's likely a fix that can be done with regular expressions but I suck at them so... yeah).
* Provide the dat:// URL to the current site via the extension popup.
* Have the extension automatically open the app in the background when a .dat_site is requested via the [Native Messaging API](https://developer.chrome.com/apps/nativeMessaging).
* Polyfill [the Beaker Browser APIs](https://beakerbrowser.com/docs/apis/) (don't necessarily need all of them, just the ones to make sure certain sites are viewable, e.g. Rotonde sites).
* Notifications! For everything possible (optional of course).
* Options! (A real options page)
  * Let the user set the port of the local server via options using the [Native Messaging API](https://developer.chrome.com/apps/nativeMessaging).
* Use the [omnibox API](https://developer.chrome.com/extensions/omnibox) to let users just type the dat:// URL or the hash itself as a search to load the site.
  * Come up with a fallback for when the dat can't be found (Maybe a "Did you mean?" page or something).
* Optional background functionality.
* Maybe support regular domain names [the way Beaker Browser does](https://beakerbrowser.com/2017/02/22/beaker-0-6-1.html), I don't know how this would be done via a browser extension but I feel like it might be possible (if well executed this could be useful for easing bandwidth/data use on certain sites).
* Edge support? (Not possible yet, needs the Proxy API, if it ever gets it)
* Safari support? (I'm unsure if this is possible)
* Internet Explorer support? (I'm being ridiculous here, but again unsure if this is possible)

## To-Do [Short term + more specific list]
* ~~Dat URL for current tab in the extension pop up.~~
* ~~Support for 404 pages by reading “fallback_page” in dat.json (updated this further to work the same way it does in Beaker Browser).~~
* ~~An button in the extension pop up to tell the app to download the entire Dat.~~
* ~~A button in the extension pop up to tell the app to delete the entire Dat.~~
* ~~A landing page for introducing users to the extension/app.~~
* ~~Display a badge for Dat sites.~~
* ~~The ability to submit dat links or hashes as searches in the extension (needs [Dat parse](https://github.com/pfrazee/parse-dat-url "parse-dat-url") for web).~~ (Works via hacky method, needs lots of improving)
* Fix how much the server app checks for the dat.json file (it seriously goes nuts, checks the network for dat.json again on every HTTP request).
* Code something to let the extension know to hide the "Pin" or "Unpin" button (likely going to be more HTTP headers, for now).
* Build a web page that displays a list of the Dats stored offline for clarity (this is the last thing I need before building a Mac OS X and Linux version).
* A page for deleting dats and other information.
* Get Travis CI working with this repo to auto-build Mac OS X and Linux versions.
* Get AppVeyor working with this repo to auto-build Windows versions.
* Provide an optional feature to convert dat:// URLs that aren't anchor links to anchor links (Useful for sites like Twitter).
  * Provide an option to have said links either stay in the dat:// URL format for Beaker Browser or other Dat apps, or to have them switch to the .dat_site domain name format for DatPart to open them (consider providing a context menu item for letting users on the fly decide what should be done).

## Credits
* dat-node - https://github.com/datproject/dat-node (MIT License)
* dat-js - https://github.com/datproject/dat-js
* jsQR - https://github.com/cozmo/jsQR (Apache License 2.0)
* qrcode-svg - https://github.com/papnkukn/qrcode-svg (MIT License)
* Font Awesome v4.7.0 - https://fontawesome.com/v4.7.0/ (CC BY 4.0 License)

## Donate
Donate to the [Dat Project](https://donate.datproject.org/) and the [Beaker Browser](https://opencollective.com/beaker?referral=17298) teams, we're not affiliated but this relies on their work.
