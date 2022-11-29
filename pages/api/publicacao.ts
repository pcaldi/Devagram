import type {NextApiResponse} from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';;
import nc from 'next-connect';
import {upload, uploadImageCosmic} from '../../services/uploadImageCosmic';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJwt } from '../../middlewares/validarTokenJwt';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { UsuarioModel } from '../../models/UsuarioModel';



const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {

            const {userId} = req.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuário não informado.'})
            }

            if(!req || !req.body){
                return res.status(400).json({erro : 'Parâmetros de entrada não informados'})
            }
            const {descricao} = req?.body;

            if (!descricao || descricao.length < 2) {
            return res.status(400).json({erro : 'Descrição não é válida'})
            };
            if (!req.file || !req.file.originalname){
            return res.status(400).json({erro : 'Imagem obrigatória'})
            };
            
            const image = await uploadImageCosmic(req);
            const publicacao = {
                idUsuario: usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date()
            }

            await PublicacaoModel.create(publicacao);
            return res.status(200).json({msg : 'Publicação criada com seucesso'})

        } catch (e) {
            console.log(e)
            return res.status(400).json({erro : 'Erro ao cadastrar publicação'})
        }

        
    });
export const config = {
    api: {
        bodyParser: false
    }
}

export default validarTokenJwt(conectarMongoDB(handler))
