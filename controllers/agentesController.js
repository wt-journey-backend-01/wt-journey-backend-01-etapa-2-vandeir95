// agenteController.js

const agentesRepository = require('../repositories/agentesRepository');

// GET /agentes
function listarAgentes(req, res) {
  const agentes = agentesRepository.listaAgentes();
  res.status(200).json(agentes);
}

// GET /agentes/:id
function buscarPorId(req, res) {
  const { id } = req.params;
  const agente = agentesRepository.buscaPeloId(id);
  if (!agente) {
    return res.status(404).json({ erro: 'Agente não encontrado' });
  }
  res.status(200).json(agente);
}

// POST /agentes
function criarAgente(req, res) {
  const { nome, dataDeIncorporacao, cargo } = req.body;
  const resultado = agentesRepository.criarAgente({ nome, dataDeIncorporacao, cargo });

  if (resultado.erro) {
    return res.status(400).json({ erro: resultado.erro });
  }

  res.status(201).json(resultado.data);
}

// PUT /agentes/:id
function atualizarAgente(req, res) {
  const { id } = req.params;
  const dados = req.body;

  const resultado = agentesRepository.update(id, dados);

  if (resultado.erro) {
    return res.status(400).json({ erro: resultado.erro });
  }

  res.status(200).json(resultado.data);
}

// DELETE /agentes/:id
function deletarAgente(req, res) {
  const { id } = req.params;
  const resultado = agentesRepository.delete(id);

  if (resultado.erro) {
    return res.status(404).json({ erro: resultado.erro });
  }

  res.status(200).json({ mensagem: 'Agente removido com sucesso' });
}

module.exports = {
  listarAgentes,
  buscarPorId,
  criarAgente,
  atualizarAgente,
  deletarAgente,
};
