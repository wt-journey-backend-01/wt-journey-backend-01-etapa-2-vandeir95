// agenteController.js

const agentesRepository = require('../repositories/agentesRepository');
const { agenteSchema } = require('../utils/agentesValidation');

class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

// GET /agentes
function listarAgentes(req, res, next) {
  try {
    const agentes = agentesRepository.listaAgentes(); // estava retornando `casos`, o que causaria erro
    res.status(200).json(agentes);
  } catch (erro) {
    next(new ApiError('Erro ao listar agentes.'));
  }
}

// GET /agentes/:id
function buscarPorId(req, res, next) {
  try {
    const { id } = req.params;
    const agente = agentesRepository.buscaPeloId(id); // Faltava passar o id
    if (!agente) return next(new ApiError('Agente não encontrado.', 404));
    res.status(200).json(agente);
  } catch (error) {
    next(new ApiError('Erro ao buscar agente por ID.'));
  }
}

// POST /agentes
function criarAgente(req, res, next) {
  try {
    const data = agenteSchema.omit({ id: true }).parse(req.body); // Corrigido para usar o schema sem 'id'
    const result = agentesRepository.criarAgente(data); // Nome do método correto
    res.status(201).json(result.data);
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
}

// PUT /agentes/:id
function atualizarAgente(req, res, next) {
  const { id } = req.params;
  try {
    const data = agenteSchema.parse({ id, ...req.body }); // Inclui o ID na validação
    const result = agentesRepository.update(id, data);
    res.status(200).json(result.data);
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
}


// PATCH /agentes/:id
function patchAgente(req, res, next) {
  const { id } = req.params;
  try {
    // Valida apenas os campos enviados (parcial)
    const partialSchema = agenteSchema.partial().omit({ id: true });
    const data = partialSchema.parse(req.body);

    const result = agentesRepository.update(id, data);

    res.status(200).json(result.data);
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
}


// DELETE /agentes/:id
function deletarAgente(req, res, next) {
  const { id } = req.params;
  try {
    agentesRepository.deletar(id); // Nome do método correto
    res.status(204).send();
  } catch (error) {
    next(new ApiError(error.message || 'Erro ao deletar agente.'));
  }
}

module.exports = {
  listarAgentes,
  buscarPorId,
  criarAgente,
  atualizarAgente,
  deletarAgente,
  patchAgente
};
