import type {NextApiRequest, NextApiResponse} from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import {validarTokenJwt} from '../../middlewares/validarTokenJwt'

const usuarioEndpoint = (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
    return res.status(200).json({erro : 'Usuário autenticado com sucesso.'})
}

export default validarTokenJwt(usuarioEndpoint);