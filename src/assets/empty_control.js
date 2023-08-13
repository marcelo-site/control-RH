const getLocalStorageEmpty = localStorage.getItem('funcionario')
const emptyObject = JSON.parse(getLocalStorageEmpty)

const formEmpty = document.querySelector('#empty_data form')

const emptyControl = (e) => {
    e.preventDefault()
    const res = confirm('Tem certeza que apagar esse(s) dado(s)?')
    console.log(e.target)
    if (res === true) {
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
}
formEmpty.addEventListener('submit', emptyControl)

const controlModalEmpty = () => {
    document.querySelector('#background').classList.toggle('none')
    document.querySelector('#empty_data').classList.toggle('none')
}


