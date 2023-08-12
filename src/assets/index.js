const table = document.querySelector('table')
const modal = document.querySelector('.modal')
const modalContent = document.querySelector('#modal-content')

const getFuncionarios = JSON.parse(localStorage.getItem('funcionario')) || undefined

const controlModal = () => {
    modal.classList.toggle('none')
    const node = document.querySelector('#modal-content div')
    if (node) {
        modalContent.removeChild(node)
    }
}

const setNameFunc = (param) => {
    const div = document.createElement('div')
    div.classList.add('info')
    const name = document.createElement('p')
    name.innerHTML = '<span class="bold">Nome: <span style="color: #40409f" >' + param.name + "</span></span>"
    const funcao = document.createElement('p')
    funcao.innerHTML = '<span class="bold">Função: <span style="color: #40409f">' + param.funcao + "</span></span>"
    div.append(name)
    div.append(funcao)

    return div
}

const setInfoFuncionario = () => {
    const div = document.createElement('div')
    const name = getFuncionarios[0].name
    const funcao = getFuncionarios[0].funcao
    const infoFuncionario = setNameFunc({ name, funcao })
    div.append(infoFuncionario)
    return div
}

const input = (param) => {
    const div = document.createElement('div')
    div.classList.add(param?.class || 'form-control')
    const label = document.createElement('label')
    label.for = param.text
    label.innerHTML = param.text + ': '
    const input = document.createElement('input')
    input.name = param.name
    input.type = param?.type || 'text'
    input.id = param.text
    input.required = param.required ? false : true
    input.value = param?.value || ""

    div.append(label)
    div.append(input)
    return div
}
const submit = (param) => {
    const submit = document.createElement('input')
    submit.type = 'submit'
    submit.classList.add('btn')
    submit.value = param || 'Cadastrar'
    return submit
}

const form = (param) => {
    const div = document.createElement('div')
    const className = param.class
    div.classList.add(className)
    const form = document.createElement('form')
    const h3 = document.createElement('h3')
    h3.innerHTML = param.title
    const inputHidden = document.createElement('input')
    inputHidden.type = 'hidden'
    inputHidden.name = 'id'
    inputHidden.value = param.hidden

    const name = {
        text: param.name.text,
        name: param.name.name
    }
    const funcao = {
        text: param.funcao.text,
        name: param.funcao.name
    }
    if (param?.name?.value && param?.funcao?.value) {
        name.value = param.name.value
        funcao.value = param.funcao.value
    }
    form.append(h3)
    form.append(inputHidden)
    form.append(input(name))
    form.append(input(funcao))
    form.append(submit(param?.submit))
    div.append(form)
    console.log(div)
    return div
}

const renderEditFuncionario = (param) => {
    const func = {
        title: 'Editar funcionário',
        name: {
            name: 'name',
            text: 'Nome',
            value: getFuncionarios[param].name
        }, funcao: {
            name: 'funcao',
            text: 'Função',
            value: getFuncionarios[param].func
        },
        hidden: param,
        submit: 'Editar'
    }
    const formEdit = form(func, "editar")
    formEdit.addEventListener('submit', editFuncionario)
    controlModal()
    modalContent.append(formEdit)
}

const editFuncionario = (e) => {
    e.preventDefault()
    const id = e.target.id.value
    const name = e.target.name.value
    const funcao = e.target.funcao.value
    getFuncionarios[id].name = name
    getFuncionarios[id].func = funcao
    localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))

    setTimeout(() => location.reload(), 500)
}
const inputDate = {
    date: {
        class: 'container-date',
        type: 'date',
        text: 'Data',
        name: 'date'
    }, init: {
        class: 'container-time',
        type: 'time',
        text: 'De',
        value: '07:00',
        name: 'init'
    }, end: {
        class: 'container-time',
        type: 'time',
        text: 'à',
        value: '11:30',
        name: 'end'
    }, motivo: {
        text: 'Motivo',
        name: 'motivo'
    }
}

const valuesInputDate = (e) => {
    const inputDate = e.target.date.value
    const date = inputDate.split('-')
    const init = e.target.init.value
    const end = e.target.end.value

    const formatDate = `${date[1]}-${date[2]}-${date[0]}`
    const options = { year: 'numeric', weekday: 'long', month: 'long', day: 'numeric' };
    const description = {
        date: new Date(formatDate).toLocaleString('pt-br', options),
        inputDate, init, end
    }
    return description
}

const renderFaltasOrHorasextras = (param, param2) => {
    const getFuncionarios = localStorage.getItem('funcionario')
    const data = JSON.parse(getFuncionarios)
    controlModal()
    const div =document.createElement('div')
    const date = data[param][param2].forEach(el => {
        const p = document.createElement('p')
        const content = `${el.date} de ${el.init} à ${el.end}, motivo: ${el.motivo}`
        p.append(content)
        div.append(p)
        return p
    })
    modalContent.append(div)
}

// horas extras
const formHorasExtras = (param) => {
    const form = document.createElement('form')
    const h3 = document.createElement('h3')
    h3.innerHTML = param?.title || 'Horas extras'
    const div = document.createElement('div')
    const date = inputDate.date
    const init = inputDate.init
    const end = inputDate.end

    if (param) {
        date.value = param.date
        init.value = param.init
        end.value = param.end
    }
    form.append(h3)
    form.append(input(date))
    form.append(input(init))
    form.append(input(end))

    form.append(submit(param?.submit))
    div.append(form)
    return div
}

const setFaltasOrhorasextras = (e, obj) => {
    e.preventDefault()
    const index = parseInt(e.target?.idFuncionario?.value) || 0
    const description = valuesInputDate(e)

    if (e.target.hasOwnProperty('motivo')) {
        description.motivo = e.target.motivo.value
    }
    if (getFuncionarios[index].hasOwnProperty(obj)) {
        getFuncionarios[index][obj].push(description)
    }
    else {
        getFuncionarios[index][obj] = [description]
    }
    localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
}

const editFaltasOrhorasextras = (e, obj) => {
    e.preventDefault()
    const edit = e.target?.edit || 0
    const index = parseInt(e.target?.idFuncionario?.value) || 0
    const description = valuesInputDate(e)

    if (e.target.hasOwnProperty('motivo')) {
        description.motivo = e.target.motivo.value
    }
    if (getFuncionarios[index].hasOwnProperty(obj)) {
        const i = parseInt(edit)
        getFuncionarios[index][obj][i] = description
    }
    localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
    setTimeout(() => location.reload(), 500)
}

const renderRegisterHorasExtras = () => {
    const prepend = setInfoFuncionario()
    modalContent.prepend(prepend)
    const register = formHorasExtras()
    register.addEventListener('submit', (e) => setFaltasOrhorasextras(e, 'horas_extras'))
    return register
}

const renderEditHorasExtras = () => {
    const prepend = setInfoFuncionario()
    modalContent.prepend(prepend)
    const faltas = getFuncionarios[0].horas_extras[0]
    const data = {
        date: faltas.inputDate,
        init: faltas.init,
        end: faltas.end,
        submit: 'Editar'
    }
    const register = formHorasExtras(data)
    register.addEventListener('submit', (e) => editFaltasOrhorasextras(e, 'horas_extras'))
    return register
}

// faltas
const formFaltas = (param) => {
    const form = document.createElement('form')
    const div = document.createElement('div')
    const date = inputDate.date
    const init = inputDate.init
    const end = inputDate.end
    const motivo = inputDate.motivo

    if (param) {
        date.value = param.date
        init.value = param.init
        end.value = param.end
        motivo.value = param.motivo
    }
    form.append(input(date))
    form.append(input(init))
    form.append(input(end))

    form.append(input(motivo))
    form.append(submit(param?.submit))
    div.append(form)
    return div
}

const renderRegisterFaltas = () => {
    const prepend = setInfoFuncionario()
    modalContent.prepend(prepend)
    const register = formFaltas()
    register.addEventListener('submit', (e) => setFaltasOrhorasextras(e, 'faltas'))
    return register
}

const RenderEditFaltas = () => {
    const prepend = setInfoFuncionario()
    modalContent.prepend(prepend)
    const faltas = getFuncionarios[0].faltas[0]
    const data = {
        date: faltas.inputDate,
        init: faltas.init,
        end: faltas.end,
        motivo: faltas.motivo,
        submit: 'Editar'
    }
    const register = formFaltas(data)
    register.addEventListener('submit', (e) => editFaltasOrhorasextras(e, 'faltas'))
    return register
}

// descontos
const formDescontos = (param) => {
    const div = document.createElement('div')
    div.classList.add('grid_value')
    // const form = document.createElement('form')
    const h3 = document.createElement('h3')
    h3.innerHTML = param.title
    const inputHidden = document.createElement('input')
    inputHidden.type = 'hidden'
    inputHidden.name = 'id'
    inputHidden.value = param.hidden

    const description = {
        text: param.description.text,
        name: param.description.name
    }
    const value = {
        text: param.value.text,
        name: param.value.name
    }
    if (param?.description?.value && param?.value?.value) {
        description.value = param.value.value
        value.value = param.value.value
    }
    form.append(h3)
    form.append(inputHidden)
    form.append(input(description))
    form.append(input(value))
    form.append(submit(param?.submit))
    div.append(form)
    return div
}

const renderEditDescontos = (param) => {
    const index = 0
    const data = {
        title: 'Edit Descontos',
        name: {
            name: 'description',
            text: 'Descição',
            value: getFuncionarios[param].descontos[index].description
        }, funcao: {
            name: 'value',
            text: 'Valor',
            value: getFuncionarios[param].descontos[index].value
        },
        hidden: param,
    }
    controlModal()
    const formEdit = form(data)
    formEdit.addEventListener('submit', editDescontos)
    modalContent.append(formEdit)
}

const editDescontos = (e) => {
    e.preventDefault()
    const index = e.target.id.value
    const indexDescontos = 0
    const description = e.target.description.value
    const value = e.target.value.value
    const desconto = {
        description, value
    }
    getFuncionarios[index].descontos[indexDescontos] = desconto
    localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
    setTimeout(() => location.reload(), 500)
}

const renderAddDescontos = (param) => {
    const data = {
        title: 'Add Descontos',
        name: {
            name: 'desconto',
            text: 'Desconto',
        }, funcao: {
            name: 'value',
            text: 'Valor'
        },
        hidden: param,
    }
    controlModal()
    const formEdit = form(data)
    formEdit.addEventListener('submit', addDescontos)
    modalContent.append(formEdit)
}

const addDescontos = (e) => {
    e.preventDefault()
    const index = e.target.id.value
    const description = e.target.desconto.value
    const value = e.target.value.value
    const desconto = {
        description, value
    }
    getFuncionarios[index].descontos.push(desconto)
    localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
    setTimeout(() => location.reload(), 500)
}

const renderDescontosAll = (param, param2) => {
    const getFuncionarios = localStorage.getItem('funcionario')
    const data = JSON.parse(getFuncionarios)
    controlModal()
    data[param][param2].forEach(el => {
        const p = document.createElement('p')
        content = `${el.description}, ${el.value}`
        p.append(content)
        modalContent.append(p)
    })
}

const renderTable = () => {
    getFuncionarios.forEach((func, index) => {
        const tdNome = document.createElement('td')
        const buttonNome = document.createElement('button')
        buttonNome.innerHTML = 'Edit'
        buttonNome.onclick = () => renderEditFuncionario(index)
        const tdFunc = document.createElement('td')
        const tdFaltas = document.createElement('td')
        const tdAddFaltas = document.createElement('td')
        const tdHorasExtras = document.createElement('td')
        const buttonHorasExtras = document.createElement('button')
        const tdDescontos = document.createElement('td')
        const a = document.createElement('a')

        tdNome.append(func.name)
        tdNome.append(buttonNome)
        const fQty = document.createElement('a')
        fQty.id = index

        a.id = index + 1
        a.innerText = 'add'
        // a.onclick = addFaltasButton
        a.style.padding = '0 2px'
        tdAddFaltas.append(a)
        const tr = document.createElement('tr')

        tr.append(tdNome)
        tdFunc.append(func.func)
        tr.append(tdFunc)

        if (func?.faltas && func.faltas.length !== 0) {
            // fQty.onclick = showFaltas
            fQty.innerHTML = func.faltas.length
            tdFaltas.append(fQty)
        } else {
            tdFaltas.append('0')
        }
        if (func?.horas_extras && func.horas_extras.length !== 0) {
            const value = func.horas_extras.length
            buttonHorasExtras.innerHTML = `${value} registros`
            tdHorasExtras.append(buttonHorasExtras)
        } else {
            buttonHorasExtras.innerHTML = `Registrar`
            tdHorasExtras.append(buttonHorasExtras)
        }
        if (func?.descontos && func.descontos.length !== 0) {
            const value = Array.from(func.descontos)
                .reduce((acc, cur) => acc + parseFloat(cur.value), 0)
            tdDescontos.append(`R$ ${value} `)

            const a = document.createElement('a')
            // a.onclick = showDescontosButton
            a.id = index
            a.innerHTML += 'ver'
            tdDescontos.append(a)
        } else {
            const a = document.createElement('a')
            // a.onclick = addDescontosButton
            a.innerHTML = 'add'
            a.id = index
            tdDescontos.append(a)
        }

        tr.append(tdFaltas)
        tr.append(tdAddFaltas)
        tr.append(tdHorasExtras)
        tr.append(tdDescontos)
        table.appendChild(tr)
    });
}

window.addEventListener('load', renderTable)
