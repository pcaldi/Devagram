import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { politicaCors } from '../../middlewares/politicaCors';
import { validarTokenJwt } from '../../middlewares/validarTokenJwt';
import { UsuarioModel } from '../../models/UsuarioModel';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';


const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {

    try {
        if (req.method === 'GET'){
            if(req?.query?.id){
                const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id);
                if(!usuarioEncontrado){
                    return res.status(400).json({erro : 'Usuário não encontrado. '})
                }
                usuarioEncontrado.senha = null;
                return res.status(200).json(usuarioEncontrado)
            }else{

                const {filtro} = req.query;
                if(!filtro || filtro.length < 2){
                    return res.status(400).json({erro : 'Informar pelo menos dois caracteres na pesquisa. '})
                }
                
                const usuariosEncontrados = await UsuarioModel.find({
                    $or: [{ nome : {$regex : filtro, $options : 'i'}},
                    { email : {$regex : filtro, $options : 'i'}}]
                })
                return res.status(500).json(usuariosEncontrados)
            }

            
        }
        return res.status(500).json({erro : 'Não foi possível buscar os usuários. '})




    } catch (e) {
        console.log(e);
        return res.status(500).json({erro : 'Não foi possível buscar os usuários. ' + e})
    }


}

export default politicaCors(validarTokenJwt(conectarMongoDB(pesquisaEndpoint)));