const form = document.querySelector('form')

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
    let funcs = JSON.parse(localStorage.getItem('funcionario')) || undefined

    if (funcs) {
        funcs.push(funcionario)
    } else {
        funcs = [funcionario]
    }
    localStorage.setItem('funcionario', JSON.stringify(funcs))
    history.back();
})