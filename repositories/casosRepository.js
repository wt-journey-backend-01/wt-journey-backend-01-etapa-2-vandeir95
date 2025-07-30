const { v4: uuidv4, validate: validateUUID } = require('uuid');
const agentesRepository = require('../repositories/agentesRepository');
const { validarCasoOuDispararErro } = require('../utils/casosValidation');




const casos = [
  {
    id: "4cbf82cd-e709-405c-bb95-c27d5a7c0ce3",
    titulo: 'Assalto à mão armada',
    descricao: 'Crime ocorreu por volta das 23h em frente a uma farmácia no centro da cidade.',
    status: 'aberto',
    agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
  },
  {
    id: "4cbf82cd-e709-405c-bb95-c27d5a7c0ce3",
    titulo: 'Furto de veículo',
    descricao: 'Veículo foi levado de um estacionamento próximo à estação de metrô.',
    status: 'solucionado',
    agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
  },
  {
    id: "6b5df8e6-fb2c-4f68-83c2-9d1d1bbdf1c0",
    titulo: 'Homicídio qualificado',
    descricao: 'Vítima foi encontrada em uma casa abandonada, com sinais de violência.',
    status: 'aberto',
    agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
  },
  {
    id: "88f2f927-03e4-4eb3-9a89-76e5c482c0d8",
    titulo: 'Tráfico de drogas',
    descricao: 'Polícia encontrou substâncias ilícitas durante uma batida em uma residência.',
    status: 'solucionado',
    agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
  },
  {
    id: "2c8c1167-5ad4-4ea3-9f2e-bf65dcf3587a ",
    titulo: 'Violência doméstica',
    descricao: 'Vítima procurou delegacia após agressão física do companheiro.',
    status: 'aberto',
    agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
  },
];



const casosRepository = {
  criarCaso({ titulo, descricao, status, agente_id }) {
    const id = uuidv4();
    const caso = { id, titulo, descricao, status, agente_id };

    validarCasoOuDispararErro(caso); // agora lança erro, não retorna erro

    const agenteExiste = agentesRepository.buscaPeloId(agente_id);
    if (!agenteExiste) {
      const erro = new Error('Agente não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    casos.push(caso);
    return { data: caso };
  },



  listarCasos() {
    return casos;
  },

  buscaPeloId(id) {
    if (!validateUUID(id)) return null;
    return casos.find(p => p.id === id) || null;
  },

  update(id, dadosAtualizados) {
    const index = casos.findIndex(p => p.id === id);
    if (index === -1) {
      const erro = new Error('Caso não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    const atualizado = { ...casos[index], ...dadosAtualizados, id };

    validarCasoOuDispararErro(atualizado);

    const agenteExiste = agentesRepository.buscaPeloId(atualizado.agente_id);
    if (!agenteExiste) {
      const erro = new Error('Agente não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    casos[index] = atualizado;
    return { data: atualizado };
  },


  // Em casosRepository
  remove(id) {
    const index = casos.findIndex(caso => caso.id === id);
    if (index === -1) return false;
    casos.splice(index, 1);
    return true;
  },


  // ✅ Função nova que filtra os casos por agente
  buscarPorAgenteId(agente_id) {
    return casos.filter(caso => caso.agente_id === agente_id);
  },

  buscarAgentePorCaso(caso) {
    // retorna o agente cujo id === caso.agente_id
    return agentesRepository.buscaPeloId(caso.agente_id);
  },


  // ✅ Buscar casos por status
  buscarPorStatus(status) {
    return casos.filter(caso => caso.status.toLowerCase() === status.toLowerCase());
  },

  // ✅ Busca full-text no título ou descrição (q)
  buscarPorTexto(q) {
    const termo = q.toLowerCase();
    return casos.filter(caso =>
      caso.titulo.toLowerCase().includes(termo) ||
      (caso.descricao && caso.descricao.toLowerCase().includes(termo))
    );
  }



};

module.exports = casosRepository;
