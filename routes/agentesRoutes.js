// agenteRoutes.js

const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');

router.get('/agentes', agentesController.listarAgentes);
router.get('/agentes/:id', agentesController.buscarPorId);
router.post('/agentes', agentesController.criarAgente);
router.put('/agentes/:id', agentesController.atualizarAgente);
router.patch('/agentes/:id', agentesController.patchAgente);




router.delete('/agentes/:id', agentesController.deletarAgente);

module.exports = router;

