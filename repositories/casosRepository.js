const { v4: uuidv4, validate: validateUUID } = require('uuid');

const agentesRepository = require('./agentesRepository');

const casos  = [];

const statusValidos = ['aberto','solucionado']


function validarCasos({id, titulo,descricao,status, agente_id}){

    if(!id || !validateUUID(id)) return {erro:"id invalido ou ausente (uuid)"}

    if (!titulo || typeof titulo !== 'string') return   "Titulo obrigatorios" 
    if (titulo.length < 5) return {erro :"Título deve ter ao menos 5 caracteres"}
    
    if (!descricao || typeof descricao !== 'string') return   {erro :"descricao obrigatoria"}
    if (descricao.length < 20) return {erro: "Descrição muito curta"}

    const agenteExiste = agentesRepository.buscaPeloId(agente_id)
    if (!agenteExiste) return { erro: "Agente não encontrado" }

    if (!status || !statusValidos.includes(status)) {
    return {erro :`status inválido. status válidos: ${statusValidos.join(', ')}`};
  }
  return null;
}


const casosRepository ={
    criarCasos({titulo,descricao,status, agente_id}){

        const id = uuidv4()
        const caso = {id,titulo,descricao,status, agente_id}

        const erro = validarCasos(caso)

        if (erro) return {erro}


        casos.push(caso)
        return {data : caso}




    },

    // liatar casos 

    listarCasos(){
        return casos
    },

    // busca caso PeloId

    buscaPeloId(id){
        if(!validateUUID(id)) return null
            return casos.find(p => p.id === id ) || null
    },

    update(id, dadosAtualizados){
          const index = casos.findIndex(p => p.id === id);
    if (index === -1) return { erro: 'Caso não encontrado' };

    const casoAtual = casos[index];
    const atualizado = { ...casoAtual, ...dadosAtualizados, id }; // mantém id

    const erro = validarCasos(atualizado);
    if (erro) return { erro };

    casos[index] = atualizado;
    return { data: atualizado };

    }


}


module.exports = casosRepository;


// id: string (UUID) obrigatório.
// titulo: string obrigatório.
// descricao: string obrigatório.
// status: deve ser "aberto" ou "solucionado" obrigatório.
// agente_id: string (UUID), id do agente responsável obrigatório Exemplo:

// {
//     "id": "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
//     "titulo": "homicidio",
//     "descricao": "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
//     "status": "aberto",
//     "agente_id": "401bccf5-cf9e-489d-8412-446cd169a0f1" 

