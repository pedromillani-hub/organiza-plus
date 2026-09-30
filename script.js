// ===== Estrutura de dados =====
let tarefas = [];

// ===== Elementos do DOM =====
const form = document.getElementById('form-tarefa');
const inputTitulo = document.getElementById('titulo-tarefa');
const mensagemErro = document.getElementById('mensagem-erro');
const listaTarefas = document.getElementById('lista-tarefas');
const mensagemVazia = document.getElementById('mensagem-vazia');
const totalTarefas = document.getElementById('total-tarefas');
const tarefasPendentes = document.getElementById('tarefas-pendentes');
const tarefasConcluidas = document.getElementById('tarefas-concluidas');

// ===== Carregar tarefas do localStorage =====
function carregarTarefas() {
  const dadosSalvos = localStorage.getItem('organizaPlusTarefas');

  if (dadosSalvos) {
    tarefas = JSON.parse(dadosSalvos);
  } else {
    tarefas = [];
  }

  renderizarTarefas();
}

// ===== Salvar tarefas no localStorage =====
function salvarTarefas() {
  localStorage.setItem('organizaPlusTarefas', JSON.stringify(tarefas));
}

// ===== Adicionar nova tarefa =====
function adicionarTarefa(evento) {
  evento.preventDefault();

  const titulo = inputTitulo.value.trim();

  // Validação: campo não pode estar vazio
  if (titulo === '') {
    mensagemErro.classList.remove('hidden');
    inputTitulo.focus();
    return;
  }

  mensagemErro.classList.add('hidden');

  // Criar objeto da tarefa
  const novaTarefa = {
    id: Date.now(), // identificador único
    titulo: titulo,
    concluida: false
  };

  // Adicionar à estrutura de dados
  tarefas.push(novaTarefa);

  // Salvar e atualizar interface
  salvarTarefas();
  renderizarTarefas();

  // Limpar campo de digitação
  inputTitulo.value = '';
  inputTitulo.focus();
}

// ===== Alternar status da tarefa (pendente ↔ concluída) =====
function alternarStatusTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);

  if (tarefa) {
    tarefa.concluida = !tarefa.concluida;
    salvarTarefas();
    renderizarTarefas();
  }
}

// ===== Excluir tarefa =====
function excluirTarefa(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  salvarTarefas();
  renderizarTarefas();
}

// ===== Atualizar contadores =====
function atualizarContadores() {
  const total = tarefas.length;
  const concluidas = tarefas.filter(t => t.concluida).length;
  const pendentes = total - concluidas;

  totalTarefas.textContent = total;
  tarefasPendentes.textContent = pendentes;
  tarefasConcluidas.textContent = concluidas;
}

// ===== Renderizar tarefas na página =====
function renderizarTarefas() {
  // Limpar a lista atual
  listaTarefas.innerHTML = '';

  // Atualizar contadores
  atualizarContadores();

  // Verificar se há tarefas
  if (tarefas.length === 0) {
    mensagemVazia.classList.add('visivel');
    return;
  }

  mensagemVazia.classList.remove('visivel');

  // Percorrer o array de tarefas e criar os elementos HTML
  tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    li.className = `tarefa-item ${tarefa.concluida ? 'concluida' : ''}`;

    // Título
    const titulo = document.createElement('span');
    titulo.className = 'titulo-tarefa';
    titulo.textContent = tarefa.titulo;

    // Badge de status
    const badge = document.createElement('span');
    badge.className = `status-badge ${tarefa.concluida ? 'concluida' : 'pendente'}`;
    badge.textContent = tarefa.concluida ? 'Concluída' : 'Pendente';

    // Container de ações
    const acoes = document.createElement('div');
    acoes.className = 'acoes';

    // Botão concluir / reabrir
    const btnStatus = document.createElement('button');
    btnStatus.className = `btn-acao ${tarefa.concluida ? 'btn-reabrir' : 'btn-concluir'}`;
    btnStatus.title = tarefa.concluida ? 'Reabrir tarefa' : 'Marcar como concluída';
    btnStatus.innerHTML = tarefa.concluida
      ? '<i class="fas fa-undo"></i>'
      : '<i class="fas fa-check"></i>';
    btnStatus.addEventListener('click', () => alternarStatusTarefa(tarefa.id));

    // Botão excluir
    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'btn-acao btn-excluir';
    btnExcluir.title = 'Excluir tarefa';
    btnExcluir.innerHTML = '<i class="fas fa-trash"></i>';
    btnExcluir.addEventListener('click', () => excluirTarefa(tarefa.id));

    // Montar estrutura
    acoes.appendChild(btnStatus);
    acoes.appendChild(btnExcluir);

    li.appendChild(titulo);
    li.appendChild(badge);
    li.appendChild(acoes);

    listaTarefas.appendChild(li);
  });
}

// ===== Eventos =====
form.addEventListener('submit', adicionarTarefa);

// Esconder mensagem de erro ao digitar
inputTitulo.addEventListener('input', () => {
  if (inputTitulo.value.trim() !== '') {
    mensagemErro.classList.add('hidden');
  }
});

// ===== Inicialização =====
carregarTarefas();