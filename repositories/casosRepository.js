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
    id: "70ae574a-3f01-4953-8026-714f1956fc8b", // novo ID
    titulo: 'Furto de veículo',
    descricao: 'Veículo foi levado de um estacionamento próximo à estação de metrô.',
    status: 'solucionado',
    agente_id: "5dba2d82-e6e4-42c6-a786-2d86a170730b",
  },
  {
    id: "6b5df8e6-fb2c-4f68-83c2-9d1d1bbdf1c0",
    titulo: 'Homicídio qualificado',
    descricao: 'Vítima foi encontrada em uma casa abandonada, com sinais de violência.',
    status: 'aberto',
    agente_id: "3f8e3d17-b8d3-4b5e-aed0-2fcf6f64a9c7",
  },
  {
    id: "88f2f927-03e4-4eb3-9a89-76e5c482c0d8",
    titulo: 'Tráfico de drogas',
    descricao: 'Polícia encontrou substâncias ilícitas durante uma batida em uma residência.',
    status: 'solucionado',
    agente_id: "77f4aa3a-5d3b-49df-9c2a-f1bfc45d6a76",
  },
  {
    id: "2c8c1167-5ad4-4ea3-9f2e-bf65dcf3587a", // espaço removido
    titulo: 'Violência doméstica',
    descricao: 'Vítima procurou delegacia após agressão física do companheiro.',
    status: 'aberto',
    agente_id: "9922ab69-1c4d-464c-82a2-0ea2ddae6401",
  },
 ];
 
const casosRepository = {
  criarCaso({ titulo, descricao, status, agente_id }) {
    let id;
    do {
      id = uuidv4(); // evita possíveis colisões
    } while (casos.some(c => c.id === id));

    const caso = { id, titulo, descricao, status, agente_id };

    validarCasoOuDispararErro(caso);

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
    const uuid = id?.trim();
    if (!validateUUID(uuid)) {
      throw new Error(`UUID inválido: ${id}`);
    }
    return casos.find(p => p.id === uuid) || null;
  },

  update(id, dadosAtualizados) {
    const uuid = id?.trim();
    if (!validateUUID(uuid)) {
      throw new Error(`UUID inválido: ${id}`);
    }

    const index = casos.findIndex(p => p.id === uuid);
    if (index === -1) {
      const erro = new Error('Caso não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    const atualizado = { ...casos[index], ...dadosAtualizados, id: uuid };

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

   remove(id) {
  const uuid = id?.trim();
  if (!validateUUID(uuid)) {
    const erro = new Error('ID inválido');
    erro.statusCode = 400;
    throw erro;
  }

  const index = casos.findIndex(caso => caso.id === uuid);
  if (index === -1) {
    const erro = new Error('Caso não encontrado');
    erro.statusCode = 404;
    throw erro;
  }

  casos.splice(index, 1);
  return true;
}
,

   buscarPorAgenteId(agente_id) {
    return casos.filter(caso => caso.agente_id === agente_id);
  },

   buscarAgentePorCaso(caso) {
    return agentesRepository.buscaPeloId(caso.agente_id);
  },

   buscarPorStatus(status) {
    return casos.filter(caso => caso.status.toLowerCase() === status.toLowerCase());
  },

   buscarPorTexto(q) {
    const termo = q.toLowerCase();
    return casos.filter(caso =>
      caso.titulo.toLowerCase().includes(termo) ||
      (caso.descricao && caso.descricao.toLowerCase().includes(termo))
    );
   }
};

module.exports = casosRepository;
