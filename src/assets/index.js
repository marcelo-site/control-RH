if (!localStorage.hasOwnProperty('funcionario')) {
    localStorage.setItem('funcionario', JSON.stringify([]))
}

const table = document.querySelector('table')
const modalContent = document.querySelector('#modal-content')
const modalInfo = document.querySelector('#info')
const getFuncionarios = JSON.parse(localStorage.getItem('funcionario'))

const controlModal = (param) => {
    const node = document.querySelector('#modal-content div')
    if (node) { modalContent.removeChild(node) }
    const nodeInfo = document.querySelector('#info > div')
    if (nodeInfo) { modalInfo.removeChild(nodeInfo) }
    const modal = document.querySelector('.modal')
    const background = document.querySelector('#background')
    // controle se nescessário renderizar novamente
    if (param) {
        modal.classList.remove('none')
        background.classList.remove('none')
    } else {
        modal.classList.toggle('none')
        background.classList.toggle('none')
    }
}

const setNameFunc = (param) => {
    const div = document.createElement('div')
    div.classList.add('info')
    const name = document.createElement('p')
    name.innerHTML = '<span class="bold">Nome: <span>' + param.name + "</span></span>"
    const funcao = document.createElement('p')
    funcao.innerHTML = '<span class="bold">Função: <span>' + param.funcao + "</span></span>"
    div.append(name)
    div.append(funcao)
    return div
}

const setInfoFuncionario = async (param) => {
    const data = await getFuncionarios
    const div = document.createElement('div')
    const name = data[param].name
    const funcao = data[param].func
    const infoFuncionario = setNameFunc({ name, funcao })
    div.append(infoFuncionario)
    modalInfo.append(div)
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
    return div
}

const renderEditFuncionario = async (paramUser) => {
    const func = {
        title: 'Editar Funcionário',
        name: {
            name: 'name',
            text: 'Nome',
            value: getFuncionarios[paramUser].name
        }, funcao: {
            name: 'funcao',
            text: 'Função',
            value: getFuncionarios[paramUser].func
        },
        hidden: paramUser,
        submit: 'Editar'
    }

    const formEdit = form(func, "editar")
    formEdit.addEventListener('submit', editFuncionario)
    controlModal()
    await setInfoFuncionario(paramUser)
    modalContent.append(formEdit)
}

const editFuncionario = async (e) => {
    e.preventDefault()
    const index = e.target.id.value
    const name = e.target.name.value
    const funcao = e.target.funcao.value
    getFuncionarios[index].name = name
    getFuncionarios[index].func = funcao
    localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
    setTimeout(() => location.reload(), 500)
}
const inputSetDate = () => {
    return {
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
        }, obs: {
            text: 'Observação',
            name: 'obs'
        }
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

const renderFaltasOrHorasextras = async (paramUser, paramObj) => {
    controlModal()
    const data = await getFuncionarios[paramUser][paramObj]
    await setInfoFuncionario(paramUser)
    const div = document.createElement('div')
    div.classList.add('loop_info')
    const h3 = document.createElement('h3')
    if (paramObj === 'faltas') {
        h3.innerHTML = paramObj
        data.forEach((el, i) => {
            const p = document.createElement('p')
            const content = `<span class="bold">Data: </span>${el.date} de ${el.init} à ${el.end}, <span class="bold">Observação: </span> ${el.obs}`
            p.innerHTML = content
            const divContext = document.createElement('div')
            divContext.append(p)
            const divButons = document.createElement('div')
            divButons.style = 'display: flex; gap: 400px;'
            const buttonEdit = document.createElement('button')
            buttonEdit.innerHTML = 'Editar'
            buttonEdit.classList.add('btn')
            buttonEdit.onclick = () => renderEditFaltas(paramUser, i)
            divButons.appendChild(buttonEdit)
            const buttonDel = document.createElement('button')
            buttonDel.classList.add('btn')
            buttonDel.innerHTML = 'Delete'
            buttonDel.onclick = () => deleteUnique(paramUser, i, paramObj)
            divButons.append(buttonDel)
            divContext.append(divButons)
            div.append(divContext)
            return
        })
    } else if (paramObj === 'horas_extras') {
        h3.innerHTML = paramObj
        data.forEach((el, i) => {
            const p = document.createElement('p')
            const content = `<span class="bold">Data: </span>${el.date} de ${el.init} à ${el.end}`
            p.innerHTML = content
            const divContext = document.createElement('div')
            divContext.append(p)
            const divButons = document.createElement('div')
            divButons.style = 'display: flex; gap: 300px;'
            const buttonEdit = document.createElement('button')
            buttonEdit.innerHTML = 'Editar'
            buttonEdit.classList.add('btn')
            divButons.appendChild(buttonEdit)
            buttonEdit.onclick = () => renderEditHorasExtras(paramUser, i)
            const buttonDel = document.createElement('button')
            buttonDel.classList.add('btn')
            buttonDel.innerHTML = 'Delete'
            buttonDel.onclick = () => deleteUnique(paramUser, i, paramObj)
            divButons.append(buttonDel)
            divContext.append(divButons)
            div.append(divContext)
            return
        })
    }
    div.prepend(h3)
    modalContent.append(div)
}

// horas extras
const formHorasExtras = (paramUser, param) => {
    const form = document.createElement('form')
    const inputHidden = document.createElement('input')
    inputHidden.type = 'hidden'
    inputHidden.name = 'id'
    const inputDate = inputSetDate()
    const h3 = document.createElement('h3')
    h3.innerHTML = param?.title || 'Horas extras'
    const div = document.createElement('div')
    const date = inputDate.date
    date.value = param?.date || ''
    const init = inputDate.init
    init.value = param?.init || '05:30'
    const end = inputDate.end
    end.value = param?.end || '09:00'
    if (paramUser !== undefined) {
        inputHidden.value = paramUser
    }
    // if (param !== undefined) {
    //     date.value = param.date
    //     init.value = param.init
    //     end.value = param.end
    // }
    form.append(h3)
    form.append(inputHidden)
    form.append(input(date))
    form.append(input(init))
    form.append(input(end))

    form.append(submit(param?.submit))
    div.append(form)
    return div
}

const setFaltasOrhorasextras = (e, obj, param) => {
    e.preventDefault()
    const index = param
    const description = valuesInputDate(e)

    if (e.target.hasOwnProperty('obs')) {
        description.obs = e.target.obs.value
    }
    if (getFuncionarios[index].hasOwnProperty(obj)) {
        getFuncionarios[index][obj].push(description)
    }
    else {
        getFuncionarios[index][obj] = [description]
    }
    localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
    setTimeout(() => location.reload(), 500)
}

const editFaltasOrhorasExtras = (e, paramObj, paramIndex) => {
    e.preventDefault()
    const index = parseInt(e.target?.id?.value)
    const description = valuesInputDate(e)
    if (e.target.hasOwnProperty('obs')) {
        description.obs = e.target.obs.value
    }
    if (getFuncionarios[index].hasOwnProperty(paramObj)) {
        getFuncionarios[index][paramObj][paramIndex] = description
    }
    localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
    setTimeout(() => location.reload(), 500)
}

const renderRegisterHorasExtras = async (paramUser) => {
    await setInfoFuncionario(paramUser)
    controlModal()
    await setInfoFuncionario(paramUser)
    const register = formHorasExtras(paramUser)
    register.addEventListener('submit', (e) =>
        setFaltasOrhorasextras(e, 'horas_extras', paramUser))
    modalContent.append(register)
    return register
}

const renderEditHorasExtras = async (paramUser, paramIndex) => {
    await setInfoFuncionario(paramUser)
    const faltas = await getFuncionarios[paramUser].horas_extras[paramIndex]
    const data = {
        id: paramUser,
        title: 'Editar Hora-extra',
        date: faltas.inputDate,
        init: faltas.init,
        end: faltas.end,
        submit: 'Editar'
    }
    controlModal(true)
    const register = formHorasExtras(paramUser, data)
    register.addEventListener('submit', (e) =>
        editFaltasOrhorasExtras(e, 'horas_extras', paramIndex))
    modalContent.append(register)
    return register
}
// faltas
const formFaltas = (param) => {
    const form = document.createElement('form')
    const h3 = document.createElement('h3')
    h3.innerHTML = param?.title || 'Add Falta'
    const inputHidden = document.createElement('input')
    inputHidden.type = 'hidden'
    inputHidden.name = 'id'
    const div = document.createElement('div')
    const inputDate = inputSetDate()
    const date = inputDate.date
    const init = inputDate.init
    const end = inputDate.end
    const obs = inputDate.obs

    if (param) {
        inputHidden.value = param.id
        date.value = param.date
        init.value = param.init
        end.value = param.end
        obs.value = param.obs
    }
    form.append(h3)
    form.append(inputHidden)
    form.append(input(date))
    form.append(input(init))
    form.append(input(end))

    form.append(input(obs))
    form.append(submit(param?.submit))
    div.append(form)
    return div
}

const renderRegisterFaltas = async (param) => {
    controlModal()
    await setInfoFuncionario(param)
    const register = formFaltas()
    modalContent.append(register)
    register.addEventListener('submit', (e) => setFaltasOrhorasextras(e, 'faltas', param))
    return register
}

const renderEditFaltas = async (paramUser, paramIndex) => {
    await setInfoFuncionario(paramUser)
    const faltas = getFuncionarios[paramUser].faltas[paramIndex]
    const data = {
        id: paramUser,
        title: "Editar Falta",
        date: faltas.inputDate,
        init: faltas.init,
        end: faltas.end,
        obs: faltas.obs,
        submit: 'Editar'
    }
    controlModal(true)
    const register = formFaltas(data)
    register.addEventListener('submit', (e) =>
        editFaltasOrhorasExtras(e, 'faltas', paramIndex))
    modalContent.append(register)
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

const renderEditDescontos = (paramUser, paramIndex) => {
    const data = {
        title: 'Editar Descontos',
        name: {
            name: 'description',
            text: 'Descição',
            value: getFuncionarios[paramUser].descontos[paramIndex].description
        }, funcao: {
            name: 'value',
            text: 'Valor',
            value: getFuncionarios[paramUser].descontos[paramIndex].value
        },
        hidden: paramUser,
        submit: 'Editar'
    }
    controlModal(true)
    setInfoFuncionario(paramUser)
    const formEdit = form(data)
    formEdit.addEventListener('submit', editDescontos)
    modalContent.append(formEdit)
}

const editDescontos = (e) => {
    e.preventDefault()
        const index = e.target.id.value
        const indexDescontos = e.target.id.value
        const description = e.target.description.value
        const value = e.target.value.value
        const desconto = {
            description, value
        }
        getFuncionarios[index].descontos[indexDescontos] = desconto
        localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
        setTimeout(() => location.reload(), 500)
}

const renderAddDescontos = async (param, paramTitle) => {
    const data = {
        title: paramTitle,
        name: {
            name: 'desconto',
            text: 'Decriçao',
        }, funcao: {
            name: 'value',
            text: 'Valor'
        },
        hidden: param,
    }
    controlModal()
    await setInfoFuncionario(param)
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

const renderDescontosAll = async (paramUser, paramIndex) => {
    const data = await getFuncionarios[paramUser][paramIndex]
    controlModal()
    await setInfoFuncionario(paramUser)
    const div = document.createElement('div')
    div.classList.add('loop_info')
    const h3 = document.createElement('h3')
    h3.innerHTML = paramIndex
    data.forEach((el, i) => {
        const p = document.createElement('p')
        p.innerHTML = `<span class="bold">Descrição: </span>${el.description}, <span class="bold">Valor: </span> ${el.value}`
        const divContext = document.createElement('div')
        divContext.append(p)
        const buttonEdit = document.createElement('button')
        buttonEdit.classList.add('btn')
        buttonEdit.innerHTML = 'Editar'
        buttonEdit.onclick = () => renderEditDescontos(paramUser, i)
        divContext.appendChild(buttonEdit)
        const buttonDel = document.createElement('button')
        buttonDel.classList.add('btn')
        buttonDel.innerHTML = 'Delete'
        buttonDel.onclick = () => deleteUnique(paramUser, i, 'descontos')
        divContext.append(buttonDel)
        div.append(divContext)
    })
    div.prepend(h3)
    modalContent.append(div)
}

// delete funcionario
const deleteFunc = async (paramIndex) => {
        const arr = await getFuncionarios
        arr.splice(paramIndex, 1);
        localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
        setTimeout(() => location.reload())
}

// deletar um registro em uma coleção
const deleteUnique = async (paramUser, paramIndex, paramObj) => {
        if (getFuncionarios[paramUser].hasOwnProperty(paramObj)) {
            const arr = await getFuncionarios[paramUser][paramObj]
            arr.splice(paramIndex, 1);
            localStorage.setItem('funcionario', JSON.stringify(getFuncionarios))
            setTimeout(() => location.reload(), 500)
        }
}

const renderTable = () => {
    const tbody = document.createElement('tbody')
    getFuncionarios.forEach((func, index) => {
        const tdNome = document.createElement('td')
        const buttonNome = document.createElement('button')
        buttonNome.innerHTML = 'Editar'
        const tdButtonName = document.createElement('td')
        buttonNome.onclick = () => renderEditFuncionario(index)
        const tdFunc = document.createElement('td')
        const tdFaltas = document.createElement('td')
        const tdAddFaltas = document.createElement('td')
        const buttonAddFaltas = document.createElement('a')
        const tdHorasExtras = document.createElement('td')
        const buttonHorasExtras = document.createElement('button')
        const tdHorasExtras2 = document.createElement('td')
        const buttonHorasExtras2 = document.createElement('button')
        const tdDescontos = document.createElement('td')
        const tdDescontos2 = document.createElement('td')

        tdNome.append(func.name + " ")
        tdButtonName.append(buttonNome)
        // tdNome.append(buttonNome)

        buttonAddFaltas.id = index
        buttonAddFaltas.innerText = 'Add'
        buttonAddFaltas.onclick = () => renderRegisterFaltas(index)
        buttonAddFaltas.style.padding = '0 2px'
        tdAddFaltas.append(buttonAddFaltas)
        const tr = document.createElement('tr')

        tr.append(tdNome)
        tdFunc.append(func.func)
        tr.append(tdFunc)
        tr.append(tdButtonName)

        if (func.hasOwnProperty('faltas') && func.faltas.length !== 0) {
            const button = document.createElement('button')
            button.onclick = (e) => renderFaltasOrHorasextras(index, 'faltas')
            button.innerHTML = func.faltas.length
            tdFaltas.append(button)
        } else {
            tdFaltas.append('0')
        }
        if (func.hasOwnProperty('horas_extras') && func.horas_extras.length !== 0) {
            const value = func.horas_extras.length
            buttonHorasExtras.innerHTML = `${value} registro(s)`
            buttonHorasExtras.onclick = (e) => renderFaltasOrHorasextras(index, 'horas_extras')
            tdHorasExtras.append(buttonHorasExtras)
        } else {
            tdHorasExtras.append('0 registro')
        }
        buttonHorasExtras2.innerHTML = 'Registrar'
        buttonHorasExtras2.onclick = () => renderRegisterHorasExtras(index)
        tdHorasExtras2.append(buttonHorasExtras2)

        if (func?.descontos && func.descontos.length !== 0) {
            const value = Array.from(func.descontos)
                .reduce((acc, cur) => acc + parseFloat(cur.value), 0)
            tdDescontos.append(`R$ ${parseFloat(value).toFixed(2)} `)

            const button = document.createElement('button')
            button.onclick = () => renderDescontosAll(index, 'descontos')
            button.id = index
            button.innerHTML += 'Detalhes'
            tdDescontos.append(button)
        } else {
            tdDescontos.append('R$ 00.00')

        }
        const buttonAddDescontos2 = document.createElement('button')
        buttonAddDescontos2.onclick = () => renderAddDescontos(index, 'Add Descontos')
        buttonAddDescontos2.innerHTML = 'Add'
        tdDescontos2.append(buttonAddDescontos2)

        tr.append(tdFaltas)
        tr.append(tdAddFaltas)
        tr.append(tdHorasExtras)
        tr.append(tdHorasExtras2)
        tr.append(tdDescontos)
        tr.append(tdDescontos2)
        tbody.append(tr)

    });
    table.appendChild(tbody)
}

window.addEventListener('load', renderTable)
