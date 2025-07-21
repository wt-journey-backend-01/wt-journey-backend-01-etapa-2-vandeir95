const { v4: uuidv4, validate: validateUUID } = require('uuid');

const agentes = [];

const cargosValidos = ['inspetor', 'delegado', 'escrivao', 'agente'];

function validarAgentes({ id, nome, dataDeIncorporacao, cargo }) {
  if (!id || !validateUUID(id)) return 'ID inválido ou ausente (UUID)';
  if (!nome || typeof nome !== 'string') return 'Nome é obrigatório';
  if (!dataDeIncorporacao || !/^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)) {
    return 'Data de incorporação deve estar no formato YYYY-MM-DD';
  }
  if (!cargo || !cargosValidos.includes(cargo)) {
    return `Cargo inválido. Cargos válidos: ${cargosValidos.join(', ')}`;
  }
  return null;
}

const agentesRepository = {

  criarAgente({ nome, dataDeIncorporacao, cargo }) {
    const id = uuidv4();
    const agente = { id, nome, dataDeIncorporacao, cargo };
    const erro = validarAgentes(agente);
    if (erro) return { erro };

    agentes.push(agente);
    return { data: agente };
  },

  // lista todos os agentes 

  listaAgentes() {
    return agentes;
  },



// busca usuario pelo id 

  buscaPeloId(id) {
    if (!validateUUID(id)) return null;
    return agentes.find(p => p.id === id) || null;
  },


  // atualiza dados do usuario 

  update(id, dadosAtualizados) {
    if (!validateUUID(id)) return { erro: 'ID inválido' };

    const index = agentes.findIndex(p => p.id === id);
    if (index === -1) return { erro: 'Policial não encontrado' };

    const policialAtual = agentes[index];
    const atualizado = { ...policialAtual, ...dadosAtualizados, id }; // mantém id

    const erro = validarAgentes(atualizado);
    if (erro) return { erro };

    agentes[index] = atualizado;
    return { data: atualizado };
  },

//deleta o usuario 

  delete(id) {
    if (!validateUUID(id)) return { erro: 'ID inválido' };

    const index = agentes.findIndex(p => p.id === id);
    if (index === -1) return { erro: 'Policial não encontrado' };

    agentes.splice(index, 1);
    return { data: true };
  },
};


module.exports = agentesRepository;
