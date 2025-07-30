const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

router.get('/', casosController.listarCasos);
router.get('/por-agente', casosController.buscarCasosPorAgente);
router.get('/:caso_id/agente', casosController.buscarAgentePorCaso);

router.get('status', casosController.buscarCasosPorStatus);
router.get('/search', casosController.buscarCasosPorTexto);


// Essa rota com ':id' deve vir por último para não "engolir" as rotas mais específicas acima
router.get('/:id', casosController.buscarPeloId);

router.post('/', casosController.criarCasos);
router.put('/:id', casosController.atualizarCasos);
router.patch('/:id', casosController.patchCasos);
router.delete('/:id', casosController.deletarCasos);

module.exports = router;

