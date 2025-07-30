// agenteRoutes.js

const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');

router.get('/', agentesController.listarAgentes);
router.get('/:id', agentesController.buscarPorId);
router.post('/', agentesController.criarAgente);
router.put('/:id', agentesController.atualizarAgente);
router.patch('/:id', agentesController.patchAgente);




router.delete('/:id', agentesController.deletarAgente);

module.exports = router;

