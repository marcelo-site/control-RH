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
    ipcMain.on('export-backup', (e, data) => {
        file.content = data
        saveFileAs()
    })
}

const file = {}
// //criar novo arquivo
const createNewFile = () => {
        file.name = 'backup-RH.txt',
        file.path = app.getPath('documents') + '/backup-RH.txt'
        return file
}

// salvar backup no disco
const writeFile = (filePath) => {
    try {
        fs.writeFile(filePath, file.content, (error) => {
            if (error) throw error

            //arquivo salvo
            file.path = filePath
            file.name = path.basename(filePath)
        })
    } catch (err) {
        console.log(err)
    }
}

const saveFileAs = async () => {
    createNewFile()
    let dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
    })
    if (dialogFile.canceled) {
        return false
    }
    // salvar
    writeFile(dialogFile.filePath)
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
    file.name = path.basename(dialogFile.filePaths[0])
    file.content = readFile(dialogFile.filePaths[0])
    file.path = dialogFile.filePaths[0]
    // salvar no frontend
    mainWindow.webContents.send('save-backup', file.content)
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
                type: 'separator'
            }, {
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
                    shell.openExternal('https://marcelo-site.github.io/landing-page/')
                }
            }, {
                label: "Facebook",
                click() {
                    shell.openExternal('https://www.facebook.com/profile.php?id=100015225941991')
                }
            }, {
                label: "Instagram",
                click() {
                    shell.openExternal('https://www.instagram.com/marcelosouza5224/')
                }
            }
        ]
    }, {
        label: 'Autor',
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