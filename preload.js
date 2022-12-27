const {contextBridge, ipcRenderer} = require('electron')
// import { contextBridge, IpcRenderer } from "electron";

console.log(`preload.js running in pid ${process.pid}`)

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('electronApi', {
    ping: () => ipcRenderer.invoke('ping'),
    setTitle: (title) => ipcRenderer.send('set-title', title),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),

    // ❌? ✅? https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation#%E5%AE%89%E5%85%A8%E4%BA%8B%E9%A1%B9
    send: ipcRenderer.send
});

contextBridge.exposeInMainWorld('debug', {
    pid: () => process.pid,
});

/*
沙盒中能访问的node.js API有
- electron
- Events
- timers
- url
- Buffer
- process
- clearImmediate
- setImmediate
*/