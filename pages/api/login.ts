import type {NextApiRequest, NextApiResponse} from 'next';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg'

import {conectarMongoDB} from '../../middlewares/conectarMongoDB'

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */

const endpointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<respostaPadraoMsg>
) => {
    if (req.method === 'POST'){
        const {login, senha} = req.body;

         if(login === 'teste@teste.com' && 
         senha === 'Teste@123'){
           return res.status(200).json({msg : 'Usuário autenticado com sucesso'})
        }
        return res.status(400).json({erro : 'Usuário ou senha não encontrado'})
    }
    return res.status(405).json({erro : 'Método informado não é válido'})
}

export default conectarMongoDB(endpointLogin);