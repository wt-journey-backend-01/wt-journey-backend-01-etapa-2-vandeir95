const { z } = require('zod');

const statusValidos = ['aberto', 'solucionado'];

const casoSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido (UUID)' }),
  titulo: z.string().min(5, { message: 'Título deve ter pelo menos 5 caracteres' }),
  descricao: z.string().min(20, { message: 'Descrição deve ter pelo menos 20 caracteres' }),
  status: z.enum(statusValidos, {
    errorMap: () => ({ message: `Status deve ser: ${statusValidos.join(', ')}` }),
  }),
  agente_id: z.string().uuid({ message: 'Agente ID inválido (UUID)' }),
});



const casoCriacaoSchema = casoSchema.omit({ id: true });


function validarCasoOuDispararErro(caso) {

     if ('id' in caso) {
        casoSchema.parse(caso);
      } else {
        casoCriacaoSchema.parse(caso);
      }
  
}

module.exports = {
  validarCasoOuDispararErro,
  casoCriacaoSchema,
  casoSchema,
};
