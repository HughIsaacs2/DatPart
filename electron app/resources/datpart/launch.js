var dev = false;
	
const {app, BrowserWindow, Menu, Tray} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray = null

var versionNumber = app.getVersion();
var appName = app.getName();
var appIcon = __dirname+'/logo_128.png';
var appPath = app.getAppPath();

  global.sharedObject = {
    appVersionNumber: versionNumber
  }

if (fs.existsSync(__dirname + '/../../dev.hta')) {
	dev = true;
}

if (!fs.existsSync(__dirname + '/../../dats/')) {
	fs.mkdirSync(__dirname + '/../../dats/');
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
	  width: 800,
	  height: 600,
	  icon: appIcon,
	  backgroundColor: '#424242',
	  show: false
  })
  
  	const devTopMenu = Menu.buildFromTemplate([
		{label: appName + " v" + versionNumber + " dev mode"},
		{label: 'Quit for real', click: function() {app.isQuiting = true; app.quit();}}
	])
  
  // Open the DevTools if dev is true.
  if(dev == true) {
  	  win.setMenu(devTopMenu)
	  win.setThumbnailToolTip(appName + " v" + versionNumber + " dev mode")
	  win.setTitle(appName + " v" + versionNumber + " dev mode")
	  win.webContents.openDevTools({mode:'detach'})
  } else if (dev != true) {
	  win.setMenu(null)
	  win.setThumbnailToolTip(appName + " v" + versionNumber)
	  win.setTitle(appName + " v" + versionNumber)
  }
  
  win.on('show', () => {
		if(dev == true) {
    	  win.webContents.openDevTools({mode:'detach'})
		}
	})
  
    // and load the index.html of the app.
    win.loadURL('file://' + __dirname + '/server_app.html')
  
    win.on('close', function (event) {
        if( !app.isQuiting){
            event.preventDefault()
            win.hide();
        }
        return false;
    });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

}
app.requestSingleInstanceLock()
app.on('second-instance', (event, argv, cwd) => {
  app.quit()
})
/*
  const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
	  if (win) {
		if (win.isMinimized()) win.restore()
		win.show()
		win.focus()
	  }
  })

	if (isSecondInstance) {
	  app.quit()
	}
*/
app.on('ready', () => {
	if (!fs.existsSync(__dirname + '/../../dats/')) {
		fs.mkdirSync(__dirname + '/../../dats/');
	}
	
  tray = new Tray(appIcon)
  
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Show', click: function() {win.show();}},
		{label: 'Quit', click: function() {app.isQuiting = true; app.quit();}}
	])
	
	const devContextMenu = Menu.buildFromTemplate([
		{label: 'Show', click: function() {win.show();}},
		{label: 'Quit', click: function() {app.isQuiting = true; app.quit();}},
		{label: appName + " v" + versionNumber + " dev mode"}
	])
  
    if(dev == true) {
		  tray.setContextMenu(devContextMenu)
		  tray.setToolTip(appName + " v" + versionNumber + " dev mode")
	} else if (dev != true) {
		  tray.setContextMenu(contextMenu)
		  tray.setToolTip(appName + " v" + versionNumber)
	}

	tray.on('click', () => {
	  win.show()
	})
	
	if(app.isDefaultProtocolClient(appName)) {
		
	} else {
		app.setAsDefaultProtocolClient(appName)
	}
	
	//var openingNotification = new Notification({title: "ggggggggo", body: "lol"})
	//openingNotification.show()
	
	createWindow();
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})