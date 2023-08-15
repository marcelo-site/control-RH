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
    // setTimeout(() => location.reload(), 500)
})

const deleteFunc = async (paramIndex) => {

    if (getFuncionarios.length > 1) {
            const arr = await getFuncionarios
            arr.splice(paramIndex, 1);
            localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
            setTimeout(() => location.reload())
    } else {
            localStorage.setItem('funcionario', JSON.stringify([]))
            setTimeout(() => location.reload())
    }
}

const funcsAll = () => {
    const funcsAll = document.querySelector('#body_table')

    getFuncionarios.forEach((func, i) => {
        const tr = document.createElement('tr')
        const tdIndex = document.createElement('td')
        tdIndex.innerHTML = ++i
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
        button.onclick = () => deleteFunc(i)
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