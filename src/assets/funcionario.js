const form = document.querySelector('form')
const getLocalStorage =  localStorage.getItem('funcionario')|| undefined
let getFuncionarios = getLocalStorage ? JSON.parse(getLocalStorage) : []

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = form.name.value
    const func = form.func.value

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
        const tdFunc= document.createElement('td')
        tdFunc.innerHTML = func.func
        tr.append(tdFunc)
        funcsAll.append(tr) 
    })
}

window.addEventListener('load',() => {
    console.log(getFuncionarios.length)
    if(getFuncionarios.length > 0) {
        return funcsAll()
    }
} )