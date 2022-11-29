import type {NextApiRequest, NextApiResponse} from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import {validarTokenJwt} from '../../middlewares/validarTokenJwt'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from '../../models/UsuarioModel'
import nc from 'next-connect'
import {upload, uploadImageCosmic} from '../../services/uploadImageCosmic'

const handler = nc()
    .use(upload.single('file'))
    .put(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) =>{
        try {
            // Pegar o usuário no DB
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);

            if(!usuario){
                return res.status(400).json({erro : 'Usuário não encontrado.'})
            }
            const {nome} = req?.body;
            if(nome && nome.length > 2){
                usuario.nome = nome;
            }
           const {file} = req;
           if(file && file.originalname){
            const image = await uploadImageCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                }
           };
           // Alterar os dados no DB
           await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);
           return res.status(200).json({msg : 'Usuário atualizado com sucesso.'});

        } catch (e) {
            console.log(e);
            return res.status(400).json({erro : 'Não foi possível atualizar usuário.'});
        }

    })
    .get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) =>{
        try {
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId)
            usuario.senha = null;
            return res.status(200).json(usuario);
        } catch (e) {
            console.log(e);
        }
        return res.status(400).json({erro : 'Não foi possível obter dados do usuário.'})
    
    });

    export const config = {
        api: {
            bodyParser: false
        }
    }



    export default validarTokenJwt(conectarMongoDB(handler));