import type {NextApiRequest, NextApiResponse} from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { validarTokenJwt } from '../../middlewares/validarTokenJwt';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { UsuarioModel } from '../../models/UsuarioModel';


const likeEndpoint 
    = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    try {
        
        if(req.method === 'PUT'){
            // Id da publicação
            const {id} = req?.query;
            const publicacao =  await PublicacaoModel.findById(id);
                if(!publicacao){
                    return res.status(400).json({erro : 'Publicação não encontrada.'})
                }
            // Id do usuário que está curtindo a publicação
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuário não encontrada.'})
            }
            const indexDoUsuarioNoLike 
            = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString())
            
            // Se o index for -1 sinal que ele não curtiu a foto.
            if(indexDoUsuarioNoLike != -1){
                publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publicação descurtida com sucesso'});                
            } else {
                // Se o index for > -1 sinal que ele curtiu a foto.
             publicacao.likes.push(usuario._id)
             await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
             return res.status(200).json({msg : 'Publicação curtida com sucesso'});
            }





        }
        return res.status(405).json({erro : 'Método informado não é válido.'})









    } catch (e) {
        console.log(e);
        return res.status(500).json({erro : 'Não foi possível dar like. ' + e})
    }



}

export default validarTokenJwt(conectarMongoDB(likeEndpoint));