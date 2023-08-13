const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require("electron")
const fs = require("fs")
const path = require("path")

// Janela principal
let mainWindow = null
const createWindow = async () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // webPreferences: {
        //     nodeIntegration: true,
        //     contextIsolation: false
        // },
        
    })

    await mainWindow.loadFile('src/pages/index.html')
    mainWindow.webContents.openDevTools()
    
    // createNewFile()
    // ipcMain.on('update-content', (e, data) =>{
    //     file.content = data
    // })
}
//arquivo
let file = {}

// //criar novo arquivo
// const createNewFile = () => {
//     file = {
//         name: 'novo-arquivo.txt',
//         content: '',
//         saved: false,
//         path: app.getPath('documents') + '/novo-arquivo.txt'
//     }
//     mainWindow.webContents.send('set-file', file)
// }

// // salvar no disco
// const writeFile = (filePath) => {
//     try {
//         fs.writeFile(filePath, file.content, (error) => {
//             if(error) throw error

//             //arquivo salvo
//             file.path = filePath
//             file.saved = true
//             file.name = path.basename(filePath)

//             mainWindow.webContents.send('set-file', file)
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }

// // salvar || editar
// const saveFile = () => {
//     if(file.saved) {
//         return writeFile(file.path)
//     } else {
//         return saveFileAs()
//     }
// }

// const saveFileAs = async () => {
//     let dialogFile = await dialog.showSaveDialog({
//         defaultPath: file.path
//     })
//     if(dialogFile.canceled) {
//         return false
//     }
//     // salvar
//     writeFile(dialogFile.filePath + '.txt')
// }

// const readyFile = (filePath) => {
//     try {
//         return fs.readFileSync(filePath, 'utf8')
//     } catch (error) {
//         console.log(error)
//         return
//     }
// }

// const openFile =async () => {
//     let dialogFile = await dialog.showOpenDialog({
//         defaultPath: file.path
//     })

//     if(dialogFile.canceled) return false

//     // open
//     file = {
//         name: path.basename(dialogFile.filePaths[0]),
//         content: readyFile(dialogFile.filePaths[0]),
//         saved: true,
//         path: dialogFile.filePaths[0]
//     }
//     mainWindow.webContents.send('set-file', file)
// }

// //template menu
// const templateMenu = [
//     {
//         label: "Arquivo",
//         submenu: [
//             {
//                 label: "Novo",
//                 accelerator: 'CmdOrCtrl+N',
//                 click() {
//                     createNewFile()
//                 }
//             }, {
//                 label: "Abrir",
//                 accelerator: 'CmdOrCtrl+O',
//                 click() {
//                     openFile()
//                 }
//             }, {
//                 label: "Salvar",
//                 accelerator: 'CmdOrCtrl+S',
//                 click() {
//                     saveFile()
//                 }
//             }, {
//                 label: "Salvar como",
//                 accelerator: 'CmdOrCtrl+Shift+S',
//                 click() {
//                     saveFileAs()
//                 }
//             }, {
//                 label: "Fechar",
//                 accelerator: 'CmdOrCtrl+Q',
//                 role: process.platform === "darwin" ? "close" : "quit"                
//             }

//         ]
//     },
//     {
//         label: 'Editar',
//         submenu: [
//             {
//                 label: 'Desfazer',
//                 role: 'undo'
//             },
//             {
//                 label: 'Refazer',
//                 role: 'redo'
//             },
//             {
//                 type: 'separator'
//             },
//             {
//                 label: 'Copiar',
//                 role: 'copy'
//             },
//             {
//                 label: 'Recortar',
//                 role: 'cut'
//             },
//             {
//                 label: 'Colar',
//                 role: 'paste'
//             }
//         ]
//     },{
//         label: 'Authors',
//         submenu: [{
//             label: "Marcelo",
//             click() {
//                 shell.openExternal('https://www.facebook.com/profile.php?id=100015225941991')
//             }
//         }]
 
//     }
// ]

// const menu = Menu.buildFromTemplate(templateMenu)
// Menu.setApplicationMenu(menu)
app.whenReady().then(createWindow)

//activate
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})