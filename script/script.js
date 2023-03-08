const campoTexto = document.querySelector('.novaTarefaInput')
const btAdicionar = document.querySelector('.novaTarefaAdicionar')
const containerTarefas = document.getElementById('tarefas')

const validarInput = () =>  campoTexto.value.trim() != ''

const adicionarTarefa = () => {
    const inputValido = validarInput()

    if (!inputValido) {
        return campoTexto.classList.add('erro')
    }
    
    criarTarefa(campoTexto.value)
    campoTexto.value = ''
    updateLocalStorage()
}

const criarTarefa = (texto, tarefaCompleta=false) => {
     // criar a tarefa, cria respectivamente uma div, um paragrafo e um icone
    const containerItemTarefa = document.createElement('div')
    containerItemTarefa.classList.add('itemTarefa')

    const tarefaConteudo = document.createElement('p')
    tarefaConteudo.innerText = texto
    tarefaConteudo.addEventListener('click', () => handleClick(tarefaConteudo))

    const deletarIcone = document.createElement('i')
    deletarIcone.classList.add('bi')
    deletarIcone.classList.add('bi-trash')
    deletarIcone.addEventListener('click', () => handleClickDelete(containerItemTarefa, tarefaConteudo))

     // juntos eles nas devidas posições
    containerItemTarefa.appendChild(tarefaConteudo)
    containerItemTarefa.appendChild(deletarIcone)

     //adiciona a div pronta no container de tarefas
    if (tarefaCompleta) {
        tarefaConteudo.classList.add('completa')
    }

    return containerTarefas.appendChild(containerItemTarefa)
}

const handleClick = (tarefaConteudo) => {
    const tarefas = containerTarefas.childNodes /* pega todos os filhos do elemento */

    for (const tarefa of tarefas) {
        const textoAtualClicado = tarefa.firstChild.isSameNode(tarefaConteudo)
        if (textoAtualClicado) {
            tarefa.firstChild.classList.toggle('completa')
        }
    }
    updateLocalStorage()
}

const handleClickDelete = (containerItemTarefa, tarefaConteudo) => {
    const tarefas = containerTarefas.childNodes

    for (const tarefa of tarefas) {
        const clickTarefaAtual = tarefa.firstChild.isSameNode(tarefaConteudo)
        if (clickTarefaAtual) {
            containerItemTarefa.remove()
        }
    }
    updateLocalStorage()
}

const mudarInputValido = () => {
    const inputValido = validarInput()

    if (inputValido) {
        return campoTexto.classList.remove('erro')
    }
}

const updateLocalStorage = () => {
    /* pega os elementos do container de tarefas */
    const tarefas = containerTarefas.childNodes

    const LocalStorageTarefas= [...tarefas].map(tarefa => {

        const conteudo = tarefa.firstChild
        const estaCompleta = conteudo.classList.contains('completa')

        return { texto: conteudo.innerText, estaCompleta }
    })

    localStorage.setItem('tarefas', JSON.stringify(LocalStorageTarefas))
}

const carregarLocalStorage = () => {
    const tarefasLocalStorage =  JSON.parse(localStorage.getItem('tarefas'))
    if (!tarefasLocalStorage) return
    
    for (const tarefa of tarefasLocalStorage) {
        criarTarefa(tarefa.texto, tarefa.estaCompleta)
    }
}
carregarLocalStorage()

btAdicionar.addEventListener('click', () => adicionarTarefa())
campoTexto.addEventListener('change', () => mudarInputValido())
