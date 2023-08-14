const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require("electron")
const fs = require("fs")
const path = require("path")

// Janela principal
let mainWindow = null
const createWindow = async () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    await mainWindow.loadFile('src/pages/index.html')
    mainWindow.webContents.openDevTools()

    createNewFile()
   
}
//arquivo
let file = {}

// //criar novo arquivo
const createNewFile = () => {
    const date = new Date()
    const arquive = `\\backup-RH-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
        + `-${date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}`
        + `-${date.getFullYear()}.txt`
    file = {
        name: 'backup-RH.txt',
        content: '',
        saved: false,
        path: app.getPath('documents') + arquive
    }
}

// salvar backup no disco
const writeFile = (filePath) => {
    try {
        fs.writeFile(filePath, file.content, (error) => {
            if (error) throw error

            //arquivo salvo
            file.path = filePath
            file.saved = true
            file.name = path.basename(filePath)
        })

    } catch (err) {
        console.log(err)
    }
}

const saveFileAs = async () => {
    let dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
    })
    if (dialogFile.canceled) {
        return false
    }
    // salvar
   
    ipcMain.on('export-backup', (e, data) => {
        file.content = data
        console.log(file)
        // saveFileAs()
    })
    writeFile(dialogFile.filePath)
    createNewFile()
}
// ler arquivo
const readFile = (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf-8')
    } catch (error) {
        console.log(error)
        return ''
    }
}

// importar backup
const openBackup = async () => {
    let dialogFile = await dialog.showOpenDialog({
        defaultPath: file.path
    })
    if (dialogFile.canceled) {
        return false
    }

    // abrir arquivo
    file = {
        name: path.basename(dialogFile.filePaths[0]),
        content: readFile(dialogFile.filePaths[0]),
        saved: true,
        path: dialogFile.filePaths[0]
    }
    mainWindow.webContents.send('save-backup', file)
}

//template menu
const templateMenu = [
    {
        label: "Backup",
        submenu: [
             {
                label: "Importar",
                click() {
                    openBackup()
                }
            }, {
                label: "Exportar",
                click() {
                    saveFileAs()
                }
            },{
                type: 'separator'
            },{
                label: "Fechar App",
                accelerator: 'CmdOrCtrl+Q',
                role: process.platform === "darwin" ? "close" : "quit"
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: "Site",
                click() {
                    shell.openExternal('https://www.facebook.com/profile.php?id=100015225941991')
                }
            }
        ]
    }, {
        label: 'Authors',
        submenu: [{
            label: "Marcelo",
            click() {
                shell.openExternal('https://www.facebook.com/profile.php?id=100015225941991')
            }
        }]

    }
]

const menu = Menu.buildFromTemplate(templateMenu)
Menu.setApplicationMenu(menu)
app.whenReady().then(createWindow)

//activate
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})