import type {NextApiRequest, NextApiResponse} from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJwt } from '../../middlewares/validarTokenJwt';
import { SeguidorModel } from '../../models/SeguidorModel';
import { UsuarioModel } from '../../models/UsuarioModel';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'


const endpoitSeguir = 
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
   
    try {
        if(req.method === 'PUT'){

            const {userId, id} = req?.query;

            // usuario logado/autenticado = quem esta fazendo as acoes
            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro : 'Usuário logado não encontrado.'})
            }
            // id do usuário e do seguidor = query
            const usuarioASerSeguido = await UsuarioModel.findById(id)
            if(!usuarioASerSeguido){
                return res.status(400).json({erro : 'Usuário a ser seguido não encontrado.'})
            }

            // Buscar se 'EU LOGADO' sigo ou nao esse usuario
            const euJaSigoEsseUsuario = await SeguidorModel
                .find({usuarioId: usuarioLogado._id , usuarioSeguidoId : usuarioASerSeguido._id});
            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){

                // Deletar um usuario
                euJaSigoEsseUsuario.forEach( async (e : any) => 
                await SeguidorModel.findByIdAndDelete({_id : e._id}));

                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado);

                usuarioASerSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg : 'Deixou de seguir o usuário com sucesso'});
            }else{

                const seguidor = {
                    usuarioId: usuarioLogado._id,
                    usuarioSeguidoId: usuarioASerSeguido._id
                };
                await SeguidorModel.create(seguidor);

                // Adicionar um seguindo no usuario logado
                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado);

                // Adicionar um seguidor no usuario seguido
                usuarioASerSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg : 'Usuário seguido com sucesso'});
            }
        }
        return res.status(405).json({ erro: 'Método informado não existe'})
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Não foi possível seguir/desseguir o usuário informado.'})
    }




}
export default validarTokenJwt(conectarMongoDB(endpoitSeguir));