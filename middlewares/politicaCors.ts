import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next'
import { RespostaPadraoMsg} from '../types/RespostaPadraoMsg'
import NextCors from 'nextjs-cors';



export const politicaCors = (handler : NextApiHandler) => 
    async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) =>{

    try {
        await NextCors(req, res, {
            // Options
            origin: '*',
            methods: ['GET','PUT','POST'],
            header: ['x-api-token'],
            optionsSuccessStatus: 200, 
         });

         return handler(req, res);
        
    } catch (e) {
        console.log('Erro ao tratar politica de Cors '+ e);
        return res.status(500).json({erro : 'Ocorreu ao tratar politica de Cors '})
    }










}
