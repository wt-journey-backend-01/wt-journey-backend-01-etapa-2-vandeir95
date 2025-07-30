const { v4: uuidv4, validate: validateUUID } = require('uuid')
const { validarAgenteOuLancarErro } = require('../utils/agentesValidation')
const agentes = [
  {
    id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
    nome: 'João Silva',
    dataDeIncorporacao: '2019-05-20',
    cargo: 'delegado',
  },
  {
    id: uuidv4(),
    nome: 'Maria Oliveira',
    dataDeIncorporacao: '2020-10-10',
    cargo: 'inspetor',
  },
  {
    id: uuidv4(),
    nome: 'Carlos Souza',
    dataDeIncorporacao: '2018-03-15',
    cargo: 'escrivao',
  },
  {
    id: uuidv4(),
    nome: 'Ana Pereira',
    dataDeIncorporacao: '2021-01-05',
    cargo: 'agente',
  },
  {
    id: uuidv4(),
    nome: 'Pedro Santos',
    dataDeIncorporacao: '2017-12-12',
    cargo: 'delegado',
  },
];

const agentesRepository = {
criarAgente({ nome, dataDeIncorporacao, cargo }) {
    const id = uuidv4();
    const agente = { id, nome, dataDeIncorporacao, cargo }

    validarAgenteOuLancarErro(agente); // lança erro se inválido

    agentes.push(agente)
    return { data: agente }
 },

  listaAgentes() {
    return agentes;
},

  buscaPeloId(id) {
    if (!validateUUID(id)) return null
    return agentes.find(p => p.id === id) || null;
  },

 update(id, dadosAtualizados) {
    if (!validateUUID(id)) {
      const erro = new Error('ID inválido');
      erro.statusCode = 400;
      throw erro
    }

    const index = agentes.findIndex(p => p.id === id)
    if (index === -1) {
      const erro = new Error('Policial não encontrado')
      erro.statusCode = 404;
      throw erro;
    }

    const atualizado = { ...agentes[index], ...dadosAtualizados, id }

    validarAgenteOuLancarErro(atualizado); // valida agente atualizado

    agentes[index] = atualizado
    return { data: atualizado }
},

  deletar(id) {
    if (!validateUUID(id)) {
      const erro = new Error('ID inválido')
      erro.statusCode = 400;
      throw erro;
    }

    const index = agentes.findIndex(p => p.id === id)
    if (index === -1) {
      const erro = new Error('Policial não encontrado')
      erro.statusCode = 404;
      throw erro;
    }

    agentes.splice(index, 1)
    return { data: true }
  },
}

module.exports = agentesRepository;
