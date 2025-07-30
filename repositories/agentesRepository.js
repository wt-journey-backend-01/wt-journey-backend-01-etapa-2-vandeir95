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
    id: "5dba2d82-e6e4-42c6-a786-2d86a170730b",
    nome: 'Maria Oliveira',
    dataDeIncorporacao: '2020-10-10',
    cargo: 'inspetor',
  },
  {
    id: "3f8e3d17-b8d3-4b5e-aed0-2fcf6f64a9c7",
    nome: 'Carlos Souza',
    dataDeIncorporacao: '2018-03-15',
    cargo: 'escrivao',
  },
  {
    id: "77f4aa3a-5d3b-49df-9c2a-f1bfc45d6a76",
    nome: 'Ana Pereira',
    dataDeIncorporacao: '2021-01-05',
    cargo: 'agente',
  },
  {
    id: "9922ab69-1c4d-464c-82a2-0ea2ddae6401",
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
