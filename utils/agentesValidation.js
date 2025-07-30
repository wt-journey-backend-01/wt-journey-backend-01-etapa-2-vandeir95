const { z } = require('zod');
const { validate: validateUUID } = require('uuid');

const cargosValidos = ['inspetor', 'delegado', 'escrivao', 'agente'];

const agenteSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  dataDeIncorporacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  }),
  cargo: z.enum(cargosValidos),
});


const agenteCriacaoSchema = agenteSchema.omit({ id: true });

function validarAgenteOuLancarErro(agente) {
  // Se o agente tem um ID válido, valida com o schema completo
  if ('id' in agente) {
    agenteSchema.parse(agente);
  } else {
    agenteCriacaoSchema.parse(agente);
  }
}

module.exports = {
  validarAgenteOuLancarErro,
  agenteSchema,
  agenteCriacaoSchema,
};
