const { ipcRenderer } = require("electron")

ipcRenderer.on('save-backup', (e, data) => {
    let res = confirm('Se continuar vai subistituir os dados atuais pelo do arquivo escolhido!')
    if (res === true) {
        localStorage.setItem('funcionario', data)
        setTimeout(() => location.reload(), 500)
    }
})

function exportBackup() {
   return ipcRenderer.send('export-backup', localStorage.getItem('funcionario'))
}

// window.addEventListener('load', exportBackup)