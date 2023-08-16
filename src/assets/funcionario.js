const form = document.querySelector('form')
const getLocalStorage = localStorage.getItem('funcionario') || undefined
let getFuncionarios = getLocalStorage ? JSON.parse(getLocalStorage) : []

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const func = e.target.func.value

    const funcionario = {
        name,
        func,
        faltas: [],
        horas_extras: [],
        descontos: []
    }
    getFuncionarios.push(funcionario)
    localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
    setTimeout(() => location.reload(), 500)
})

const deleteFunc = (paramIndex) => {
    if (getFuncionarios.length > 1) {
        const arr = getFuncionarios
        arr.splice(paramIndex, 1);
        localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
        setTimeout(() => location.reload())
    } else {
        localStorage.setItem('funcionario', JSON.stringify([]))
        setTimeout(() => location.reload())
    }
}

const modalconfirm = (paramIndex) => {
    if (paramIndex >= 0) {
        const name = getFuncionarios[paramIndex].name
        const func = getFuncionarios[paramIndex].func
        document.querySelector('#nome').innerHTML = name
        document.querySelector('#funcao').innerHTML = func
    } else {
        document.querySelector('#nome').innerHTML = ''
        document.querySelector('#funcao').innerHTML = ''
    }
    document.querySelector('#ok').onclick = () => deleteFunc(paramIndex)
    document.querySelector('#cancel').onclick = modalconfirm
    document.querySelector('#background').classList.toggle('none')
    document.querySelector('.modal').classList.toggle('none')
}

const funcsAll = () => {
    const funcsAll = document.querySelector('#body_table')

    getFuncionarios.forEach((func, i) => {
        const index = i + 1
        const tr = document.createElement('tr')
        const tdIndex = document.createElement('td')
        tdIndex.innerHTML = index
        tr.append(tdIndex)
        const tdName = document.createElement('td')
        tdName.innerHTML = func.name
        tr.append(tdName)
        const tdFunc = document.createElement('td')
        tdFunc.innerHTML = func.func
        tr.append(tdFunc)
        const tdDel = document.createElement('td')
        const button = document.createElement('button')
        button.innerHTML = 'Delete'
        button.onclick = () => modalconfirm(i)
        tdDel.append(button)

        tr.append(tdDel)
        tr.append(tdDel)
        funcsAll.append(tr)
    })
}

window.addEventListener('load', () => {
    if (getFuncionarios.length > 0) {
        return funcsAll()
    }
})