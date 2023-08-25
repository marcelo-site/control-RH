const { info } = require("console")
const { app, BrowserWindow, Menu, dialog, ipcMain, shell, webContents } = require("electron")
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
    
    createNewFile()
}

const pathDate = (paramName, paramExtension) => {
    const date = new Date()
    const pathDateAdd = date.toLocaleDateString('pt-br').replace(/\//g, '-')
    return `/${paramName}-${pathDateAdd}.${paramExtension}`
}

const file = {}
// //criar novo arquivo
const createNewFile = () => {
    const arquive = pathDate('backup-RH', 'txt')
    file.name = arquive,
        file.path = app.getPath('documents') + arquive
    return file
}

const savePDF = async () => {
    try {
        const location = await mainWindow.webContents.executeJavaScript('window.location.pathname')
        const path = location.split('/').pop().split('.')[0]
        const pathEnd = pathDate(path + '-RH', 'pdf')
        let dialogFile = await dialog.showSaveDialog({
            title: "Salvando PDF",
            buttonLabel: "Salvar PDF",
            defaultPath: pathEnd
        })
        if (dialogFile.canceled) {
            return false
        }
        const existsExtension = dialogFile.filePath.split('.')
        if (existsExtension.length !== 2) {
            dialogFile.filePath = dialogFile.filePath + '.pdf'
        }
        const pdf = await mainWindow.webContents.printToPDF({
            // margins: ['100', '0', '0', '0'],
            printBackground: true
        })
        fs.writeFile(dialogFile.filePath, pdf, (error) => {
            if (error) throw error
        })
    } catch (error) {
        console.log(error)
    }
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
    let dialogFile = await dialog.showSaveDialog({
        title: "Fazendo backup",
        buttonLabel: "Salvar backup",
        defaultPath: file.path 
    })
    if (dialogFile.canceled) {
        return false
    }
    const existsExtension = dialogFile.filePath.split('.')
    if (existsExtension.length !== 2) {
        dialogFile.filePath = dialogFile.filePath + '.txt'
    }
    const content = await mainWindow.webContents.executeJavaScript('localStorage.getItem("funcionario");', true)
    file.content = content
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
        title: "Procurando backup",
        buttonLabel: "Importar backup",
        message: "mensagem",
        properties: ['openFile'],
        filters: [
            {
                name: 'All',
                extensions: ["*"]
            }, {
                name: 'Arquivos .txt',
                extensions: ['txt']
            }
        ]
    })
    if (dialogFile.canceled) {
        return false
    }
    const res = await dialog.showMessageBox({
        title: "Atenção!",
        message: "Tem certeza que deseja atualizar, toda a base de dados?",
        detail: "Se continuar vai subistituir os dados atuais pelo do arquivo escolhido!",
        icon: './src/assets/img/warning.png',
        buttons: ['ok', 'cancel']
    })

    if (res.response === 0) {
        // abrir arquivo
        file.name = path.basename(dialogFile.filePaths[0])
        file.content = readFile(dialogFile.filePaths[0])
        file.path = dialogFile.filePaths[0]
        // salvar no frontend
        mainWindow.webContents.send('env-backup', file.content)
    }
}

//template menu
const templateMenu = [
    {
        label: "Salvar",
        submenu: [
            {
                label: "PDF da Página atual",
                accelerator: 'CmdOrCtrl+shift+P',
                click() {
                    savePDF()
                }
            }, {
                label: "Fazer backup",
                accelerator: 'CmdOrCtrl+shift+B',
                click() {
                    saveFileAs()
                }
            }, {
                label: "Importar backup",
                accelerator: 'CmdOrCtrl+shift+S',
                click() {
                    openBackup()
                }
            }
        ]
    }, {
        label: 'Vizualizar',
        submenu: [
            {
                label: 'zoom +',
                accelerator: 'CmdOrCtrl+=',
                role: 'zoomin'
            }, {
                label: 'zoom -',
                role: 'zoomout'
            }, {
                label: 'Tamanho padrão',
                role: 'resetzoom'
            }, {
                label: 'Alternar tela cheia',
                role: 'togglefullscreen'
            }, {
                label: "Fechar app",
                role: process.platform === "darwin" ? "close" : "quit",
                accelerator: 'CmdOrCtrl+Shift+X',
            }
        ]
    }, {
        label: 'Ajuda',
        submenu: [
            {
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
        submenu: [
            {
                label: "Marcelo-Site",

                click() {
                    shell.openExternal('https://marcelo-site.github.io/landing-page/')
                }
            }, {
                label: "Marcelo-Facebook",
                click() {
                    shell.openExternal('https://www.facebook.com/profile.php?id=100015225941991')
                }
            }, {
                label: "Marcelo-Instagram",
                click() {
                    shell.openExternal('https://www.instagram.com/marcelosouza5224/')
                }
            }
        ]
    },
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