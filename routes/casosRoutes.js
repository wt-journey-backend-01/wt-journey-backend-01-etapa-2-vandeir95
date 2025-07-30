const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

router.get('/', casosController.listarCasos);
router.get('/por-agente', casosController.buscarCasosPorAgente);
router.get('/:caso_id/agente', casosController.buscarAgentePorCaso);

router.get('/status', casosController.buscarCasosPorStatus);
router.get('/search', casosController.buscarCasosPorTexto);


// Essa rota com ':id' deve vir por último para não "engolir" as rotas mais específicas acima
router.get('/:id', casosController.buscarPeloId);

router.post('/', casosController.criarCaso);
router.put('/:id', casosController.atualizarCaso);
router.patch('/:id', casosController.patchCaso);
router.delete('/:id', casosController.deletarCaso);

module.exports = router;

