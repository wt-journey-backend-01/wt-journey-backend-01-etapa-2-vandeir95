const { validate: validateUUID } = require('uuid');
const agentesRepository = require("../repositories/agentesRepository");
const casosRepository = require("../repositories/casosRepository");
const { casoSchema, casoCriacaoSchema } = require('../utils/casosValidation');

class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

function listarCasos(req, res, next) {
  try {
    const casos = casosRepository.listarCasos();
    res.status(200).json(casos);
  } catch (error) {
    next(new ApiError(`Erro ao listar casos: ${error.message}`));
  }
}

function buscarPeloId(req, res, next) {
  try {
    const { id } = req.params;
    const caso = casosRepository.buscaPeloId(id);
    if (!caso) return res.status(404).json({ erro: "Caso não encontrado" });
    res.status(200).json(caso);
  } catch (error) {
    next(new ApiError(`Erro ao buscar caso: ${error.message}`));
  }
}

async function buscarAgentePorCaso(req, res, next) {
  try {
    const { caso_id } = req.params;
    if (!validateUUID(caso_id)) {
      return res.status(400).json({ erro: "ID do caso inválido (UUID esperado)" });
    }
    const caso = casosRepository.buscaPeloId(caso_id);
    if (!caso) return res.status(404).json({ erro: "Caso não encontrado" });
    if (!caso.agente_id) return next(new ApiError("Caso sem agente associado", 500));

    const agente = agentesRepository.buscaPeloId(caso.agente_id);
    if (!agente) return res.status(404).json({ erro: "Agente responsável não encontrado" });

    return res.status(200).json(agente);
  } catch (error) {
    next(new ApiError(`Erro ao buscar agente pelo caso: ${error.message}`));
  }
}

function buscarCasosPorStatus(req, res, next) {
  try {
    const { status } = req.query;
    if (!status) return res.status(400).json({ erro: "status é obrigatório" });

    const casos = casosRepository.buscarPorStatus(status);
    res.status(200).json(casos);
  } catch (error) {
    next(new ApiError(`Erro ao buscar casos por status: ${error.message}`));
  }
}

function buscarCasosPorTexto(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ erro: 'Parâmetro de busca "q" é obrigatório' });
    }
    const casos = casosRepository.buscarPorTexto(q);
    res.status(200).json(casos);
  } catch (error) {
    next(new ApiError(`Erro ao buscar casos por texto: ${error.message}`));
  }
}

function buscarCasosPorAgente(req, res, next) {
  try {
    const { agente_id } = req.query;
    if (!agente_id) return res.status(400).json({ erro: "agente_id é obrigatório" });
    if (!validateUUID(agente_id)) return res.status(400).json({ erro: "agente_id inválido (UUID esperado)" });

    const casos = casosRepository.buscarPorAgenteId(agente_id);
    res.status(200).json(casos);
  } catch (error) {
    next(new ApiError(`Erro ao buscar casos por agente: ${error.message}`));
  }
}

const criarCaso = (req, res, next) => {
  try {
    const data = casoCriacaoSchema.parse(req.body);
    const casoCriado = casosRepository.criarCaso(data);
    res.status(201).json(casoCriado);
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const atualizarCaso = (req, res, next) => {
  const { id } = req.params;
  try {
    const data = casoSchema.parse(req.body);
    const updated = casosRepository.update(id, data);
    if (!updated) return next(new ApiError("caso não encontrado.", 404));
    res.status(200).json(updated.data);
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

function patchCaso(req, res, next) {
  const { id } = req.params;
  try {
    const parcialSchema = casoSchema.partial().omit({ id: true });
    const data = parcialSchema.parse(req.body);
    const result = casosRepository.update(id, data);
    res.status(200).json(result.data);
  } catch (erro) {
    next(new ApiError(erro.message, 400));
  }
}

const deletarCaso = (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = casosRepository.remove(id);
    if (!deleted) return next(new ApiError("casos não encontrado.", 404));
    res.status(204).send();
  } catch (error) {
    next(new ApiError("Erro ao deletar caso."));
  }
};

module.exports = {
  listarCasos,
  buscarPeloId,
  criarCaso,
  atualizarCaso,
  deletarCaso,
  patchCaso,
  buscarCasosPorAgente,
  buscarAgentePorCaso,
  buscarCasosPorStatus,
  buscarCasosPorTexto,
};
