
const casosRepository = require("../repositories/casosRepository")


// GET /casos
function listarCasos(req, res) {
  const casos = casosRepository.listarCasos();
  res.status(200).json(casos);
}



module.exports = {
        listarCasos
}