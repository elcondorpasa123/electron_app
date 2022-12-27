const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const path = require('path')

async function handleOpenFile() {
    const {canceled, filePaths} = await dialog.showOpenDialog()
    if (canceled){
        return
    } else {
        return filePaths[0]
    }
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800*1.5,
        height: 600*1.5,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => mainWindow.webContents.send('update-counter', 1),
                    label: 'Increment',
                },
                {
                    click: () => mainWindow.webContents.send('update-counter', -1),
                    label: 'Decrement',
                }
            ]
        }
    ])
    // https://www.electronjs.org/docs/latest/api/menu#menugetapplicationmenu
    // The returned Menu instance doesn't support dynamic addition or removal of menu items
    Menu.getApplicationMenu().append(menu.items[0])
    // Menu.setApplicationMenu(menu)

    ipcMain.handle('ping', ()=>'pong')
    ipcMain.handle('dialog:openFile', handleOpenFile)
    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.setTitle(title)
    })
    ipcMain.on('counter-value', (event, value) => {
        console.log(value)
    })
    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(()=>{
    createWindow()

    app.on('active', ()=>{
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })
})

app.on('window-all-closed', ()=>{
    if (process.platform != 'darwin')
        app.quit()
})

/*
  submenu?: (MenuItemConstructorOptions[]) | (Menu);

    interface MenuItemConstructorOptions {
    click?: (menuItem: MenuItem, browserWindow: (BrowserWindow) | (undefined), event: KeyboardEvent) => void;
    role?: ('undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'pasteAndMatchStyle' | 'delete' | 'selectAll' | 'reload' | 'forceReload' | 'toggleDevTools' | 'resetZoom' | 'zoomIn' | 'zoomOut' | 'toggleSpellChecker' | 'togglefullscreen' | 'window' | 'minimize' | 'close' | 'help' | 'about' | 'services' | 'hide' | 'hideOthers' | 'unhide' | 'quit' | 'showSubstitutions' | 'toggleSmartQuotes' | 'toggleSmartDashes' | 'toggleTextReplacement' | 'startSpeaking' | 'stopSpeaking' | 'zoom' | 'front' | 'appMenu' | 'fileMenu' | 'editMenu' | 'viewMenu' | 'shareMenu' | 'recentDocuments' | 'toggleTabBar' | 'selectNextTab' | 'selectPreviousTab' | 'mergeAllWindows' | 'clearRecentDocuments' | 'moveTabToNewWindow' | 'windowMenu');
    type?: ('normal' | 'separator' | 'submenu' | 'checkbox' | 'radio');
    label?: string;
    sublabel?: string;

submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement',
        }
    ]
*/