const version_info = document.getElementById('version_info')
version_info.innerText = `This app is using 
Chrome(v${versions.chrome()}), 
Node.js(v${versions.node()}), 
Electron(v${versions.electron()}).`

const debug_info = document.getElementById('debug_info')
debug_info.innerText = `This js running in pid ${debug.pid()}.`

const setTitleButton = document.getElementById('btn_set_title')
const titleInput = document.getElementById('title')
setTitleButton.addEventListener('click', () => {
    const title = titleInput.value
    electronApi.send('set-title', title)
    // or
    // window.electronApi.setTitle(title)
});

const openFileButton = document.getElementById('btn_open_file')
const filePathElement = document.getElementById('filePath')
openFileButton.addEventListener('click', async () => {
    const filePath = await window.electronApi.openFile()
    filePathElement.innerText = filePath
});

const counter = document.getElementById('counter')
window.electronApi.onUpdateCounter( (event, value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue
    event.sender.send('counter-value', newValue)
})

const func = async ()=>{
    const response = await window.electronApi.ping()
    console.log(response)
}

func()


/*
预加载脚本(preload.js)与浏览器(index.html/renderer.js)
1. 同处render进程中
2. 共享一个全局window对象，但是
不能附加到window上任何变动，因为contextIsolation是默认的，即这两这的运行环境是隔离的。

通过contextBridge进行交互。
*/

/*  
*
** 进程树
* 
-node
    C:\Program Files\nodejs\node.exe "E:\git2\electron_app\node_modules\.bin\\..\electron\cli.js" . --remote-debugging-port=9222
    -node
        C:\Program Files\nodejs\node.exe" "c:\Users\Administrator\AppData\Local\Programs\Microsoft VS Code\resources\app\extensions\ms-vscode.js-debug\src\watchdog.bundle.js"
    -electron.exe
        E:\git2\electron_app\node_modules\electron\dist\electron.exe . --remote-debugging-port=9222
        -node
            "C:\Program Files\nodejs\node.exe" "c:\Users\Administrator\AppData\Local\Programs\Microsoft VS Code\resources\app\extensions\ms-vscode.js-debug\src\watchdog.bundle.js"
        -gpu-process 
            "E:\git2\electron_app\node_modules\electron\dist\electron.exe" 
            --type=gpu-process 
            --user-data-dir="C:\Users\Administrator\AppData\Roaming\my-electron-app" 
            --gpu-preferences=UAAAAAAAAADgAAAYAAAAAAAAAAAAAAAAAABgAAAAAAAwAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAEgAAAAAAAAASAAAAAAAAAAYAAAAAgAAABAAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAOAAAAEAAAAAAAAAABAAAADgAAAAgAAAAAAAAACAAAAAAAAAA= 
            --mojo-platform-channel-handle=1796 
            --field-trial-handle=1920,i,15268208480316489020,10182810800039575727,131072 
            --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:2
        -unity
            👉https://www.electronjs.org/zh/docs/latest/tutorial/process-model
            untrusted services/cpu intensive tasks/crash prone components.
            using  MessagePort to communicate with renderer
            "E:\git2\electron_app\node_modules\electron\dist\electron.exe" 
            --type=utility 
            --utility-sub-type=network.mojom.NetworkService 
            --lang=zh-CN 
            --service-sandbox-type=none 
            --user-data-dir="C:\Users\Administrator\AppData\Roaming\my-electron-app" 
            --mojo-platform-channel-handle=2072 
            --field-trial-handle=1920,i,15268208480316489020,10182810800039575727,131072 
            --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:8
        -render
            "E:\git2\electron_app\node_modules\electron\dist\electron.exe" 
            --type=renderer 
            --user-data-dir="C:\Users\Administrator\AppData\Roaming\my-electron-app" 
            --app-path="E:\git2\electron_app" 
            --enable-sandbox 
            --first-renderer-process 
            --remote-debugging-port=9222 
            --lang=zh-CN 
            --device-scale-factor=1 
            --num-raster-threads=4 
            --enable-main-frame-before-activation -
            -renderer-client-id=4 
            --time-ticks-at-unix-epoch=-1671854964431727 
            --launch-time-ticks=289429197335 
            --mojo-platform-channel-handle=2680 
            --field-trial-handle=1920,i,15268208480316489020,10182810800039575727,131072 
            --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1
*/