const { ipcRenderer } = require("electron")

ipcRenderer.on('env-backup', (e, data) => {
    localStorage.setItem('funcionario', data)
    setTimeout(() => location.reload(), 500)
})