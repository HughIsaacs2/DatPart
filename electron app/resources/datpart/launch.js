var dev = false;

if (typeof process === 'object') {
  if (typeof process.versions === 'object') {
    if (typeof process.versions['electron'] !== 'undefined') {
	
const {app, BrowserWindow, Menu, Tray} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray = null

app.on('ready', () => {
  tray = new Tray(__dirname+'/logo_128.png')
  const contextMenu = Menu.buildFromTemplate([
    {role: 'quit'}
  ])
  tray.setToolTip(app.getName())
  tray.setContextMenu(contextMenu)
	tray.on('click', () => {
	  win.show()
	})
	
	if(app.isDefaultProtocolClient('dat')) {
		
	} else {
		app.setAsDefaultProtocolClient('dat')
	}
})

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

if (isSecondInstance) {
  app.quit()
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow(
  {
	  width: 800,
	  height: 600,
	  icon: __dirname+'/logo_128.png',
	  backgroundColor: '#424242'
  })
  
  win.setMenu(null)

  // and load the index.html of the app.
  win.loadURL('file://' + __dirname + '/server_app.html')
/* url.format({
    pathname: path.join(__dirname, 'server_app.html'),
    protocol: 'file:',
    slashes: true
  }) */
  
  
  // Open the DevTools.
  if(dev == true) {
  win.webContents.openDevTools({mode:'detach'})
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
	
}}} else if (window && window.chrome && chrome.runtime && chrome.runtime.id) {

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
    id: 'other_web_server'
  });
});

chrome.runtime.onMessageExternal.addListener(function() {
if(chrome.app.window.get('other_web_server')){
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
    id: 'other_web_server'
  });
}
});
}