chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('/server_app.html?platform=chromeApp', {
    'innerBounds': {
      'width': 800,
      'height': 600
    },
	'minWidth': 800,
    'minHeight': 400,
	'frame': {
	'type': 'chrome',
	'color': '#424242',
	'activeColor': '#ffffff',
	'inactiveColor': '#424242'
	},
    id: 'datpart_server'
  });
});

chrome.runtime.onMessageExternal.addListener(function() {
if(chrome.app.window.get('datpart_server')){
	//Do Nothing
} else {
  chrome.app.window.create('/server_app.html?platform=chromeApp', {
    'innerBounds': {
      'width': 800,
      'height': 600
    },
	'minWidth': 800,
    'minHeight': 400,
	'state': 'minimized',
	'frame': {
	'type': 'chrome',
	'color': '#424242',
	'activeColor': '#ffffff',
	'inactiveColor': '#424242'
	},
    id: 'datpart_server'
  });
}
});