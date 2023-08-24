const dataRelatrio = localStorage.getItem('funcionario')
const contentRealtorio = document.querySelector('#relatorio')
const pdf = document.querySelector('#pdf')
const dateDom =document.querySelector('#date')

const date = new Date()
dateDom.innerHTML = date.toLocaleDateString('pt-br')

const renderRelatorio = async () => {
    const getRelatorio = await JSON.parse(dataRelatrio)
    getRelatorio.forEach(func => {
        const div = document.createElement('div')
        div.classList.add('content')
        const nameFunc = document.createElement('div')
        const name = document.createElement('p')
        name.innerHTML = `<span class="bold">Nome: </span>${func.name}` 
        nameFunc.append(name)
        const funcao = document.createElement('p')
        funcao.innerHTML = `<span class="bold">Função: </span>${func.func}` 
        nameFunc.append(funcao)
        div.append(nameFunc)
        const faltas = document.createElement('div')
        const qtyFaltas = document.createElement('p')
        qtyFaltas.innerHTML = `<span class="bold">Faltas: </span>${func.faltas.length} registro(s)`
        faltas.append(qtyFaltas)
        func.faltas.forEach((falta) => {
            const p = document.createElement('p')
            p.classList.add('isactive')
            p.innerHTML = `<span class="bold">Data:</span> ${falta.date}` +
                `<span class="bold">De: </span> ${falta.init}` +
                `<span class="bold">à: </span> ${falta.end}` +
                `<span class="bold">Observação: </span> ${falta.obs}`
            faltas.append(p)
        })
        div.append(faltas)
        const hrsExtras = document.createElement('div')
        const qtyHrsExtras = document.createElement('p')
        qtyHrsExtras.innerHTML = `<span class="bold">Horas extras: </span>${func.horas_extras.length} registro(s)`
        hrsExtras.append(qtyHrsExtras)
        func.horas_extras.forEach(hrsExtra => {
            const p = document.createElement('p')
            p.classList.add('isactive')
            p.innerHTML = `<span class="bold">Data:</span> ${hrsExtra.date}` +
                `<span class="bold">De: </span> ${hrsExtra.init}` +
                `<span class="bold">à: </span> ${hrsExtra.end}`
            hrsExtras.append(p)
        })
        div.append(hrsExtras)
        const descontos = document.createElement('div')
        const totDescontos = document.createElement('p')
        const valueDescontos = func.descontos.reduce((acc, cur) => acc + parseFloat(cur.value.replace('.', '').replace(',', '.')), 0)
        console.log(func.descontos)
        const descontosBRL = valueDescontos.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        totDescontos.innerHTML = `<span class="bold">Descontos: </span>${descontosBRL}`
        descontos.append(totDescontos)
        func.descontos.forEach(desc => {
            const value = parseFloat(desc.value.replace('.', '').replace(',', '.'))
            const valueBRL = value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            const p = document.createElement('p')
            p.classList.add('isactive')
            p.classList.add('desconto')
            p.innerHTML = `<span class="bold">Valor:</span> ${valueBRL}` +
                `<span class="bold">Descrição:</span> ${desc.description}`
            descontos.append(p)
        })
        div.append(descontos)
        div.style = 'border-bottom: none;'
        contentRealtorio.append(div)
    });
}

window.addEventListener('load', renderRelatorio)