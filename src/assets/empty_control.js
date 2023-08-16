const getLocalStorageEmpty = localStorage.getItem('funcionario')
const emptyObject = JSON.parse(getLocalStorageEmpty)

const formEmpty = document.querySelector('#empty_data form')

const emptyControl = (e) => {
    e.preventDefault()
        if (e.target.empty_faltas.checked) {
            emptyObject.forEach(el => {
                el.faltas = []
            })
        }
        if (e.target.empty_hrs_extras.checked) {
            emptyObject.forEach(el => {
                el.horas_extras = []
            })
        }
        if (e.target.empty_descontos.checked) {
            emptyObject.forEach(el => {
                el.descontos = []
            })
        }
        localStorage.setItem('funcionario', JSON.stringify(emptyObject))
        setTimeout(() => location.reload(), 500)
}

const cancelEmpty = () => {
    document.querySelector('#background').classList.add('none')
    document.querySelector('#modal-confirm-empty').classList.toggle('none')
}
const modalconfirm = (e) => {
    e.preventDefault()
    controlModalEmpty()
    document.querySelector('#ok').onclick = () => emptyControl(e)
    document.querySelector('#cancel').onclick = cancelEmpty
    document.querySelector('#background').classList.toggle('none')
    document.querySelector('#modal-confirm-empty').classList.toggle('none')
}
formEmpty.addEventListener('submit', modalconfirm)

const controlModalEmpty = () => {
    document.querySelector('#background').classList.toggle('none')
    document.querySelector('#empty_data').classList.toggle('none')
}




