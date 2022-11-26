import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg'

export const conectarMongoDB = (handler: NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
         

        // Verificar se o banco ja esta conectado, 
        //se não seguir para o endpoint 
        //ou proximo middleware.
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }
        //Já que não está conectado vamos conectar
        //Obter a variável de ambiente preenchida do env
        const {DB_CONEXAO_STRING} = process.env;
        //Se a env estiver vazia abortar o uso do sistema e avisa o programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro : 'ENV de configuração do banco não informado'})
        }

        mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
        mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar no banco: ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);

        // Agora posso seguir para o endpoint, pois estou conectado ao banco.
        return handler(req, res);
    }

