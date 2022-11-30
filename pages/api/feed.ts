import type {NextApiRequest, NextApiResponse, } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import {validarTokenJwt} from '../../middlewares/validarTokenJwt'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from '../../models/UsuarioModel'
import { PublicacaoModel } from '../../models/PublicacaoModel'
import { SeguidorModel } from '../../models/SeguidorModel'

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuario = await UsuarioModel.findById(req?.query?.id);
                    if(!usuario){
                        return res.status(405).json({erro: 'Usuário não encontrado.'}) 
                    }
                const publicacoes = await PublicacaoModel
                    .find({idUsuario : usuario._id})    
                    .sort({data : -1})
                return res.status(200).json(publicacoes);
           } else {
                const {userId} = req.query;
                const usuarioLogado = await UsuarioModel.findById(userId);
                if(!usuarioLogado){
                    return res.status(400).json({erro : ' Usuário não encontrado.'});
                }

                const seguidores = await SeguidorModel.find({usuarioId : usuarioLogado._id});
                const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId)

                const publicacoes = await PublicacaoModel.find({
                    $or : [
                        {idUsuario : usuarioLogado._id},
                        {idUsuario : seguidoresIds }
                    ]
                })
                .sort({data : -1});

                const result = [];
                for (const publicacao of publicacoes) {
                    const usarioDaPublicacao = await  UsuarioModel.findById(publicacao.idUsuario);
                    if (usarioDaPublicacao){
                        const final = {...publicacao._doc, usuario : {
                            nome : usarioDaPublicacao.nome, 
                            avatar: usarioDaPublicacao.avatar
                        }}
                        result.push(final);
                    }
                }
                    return res.status(200).json(result);
                }


        }
        return res.status(405).json({erro: 'Método informado não é válido.'}) 
    } catch (e) {
        console.log(e);    
    }
    return res.status(400).json({erro: 'Não foi possível obter o feed.'})
}

export default validarTokenJwt(conectarMongoDB(feedEndpoint));

function sort(arg0: { data: number }) {
    throw new Error('Function not implemented.')
}
