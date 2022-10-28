import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser';

//controller imports
import { PetController } from './controllers/PetController';

//middleware imports
import checkAuth from './middlewares/checkAuth';
import { EstabelecimentoController } from './controllers/EstabelecimentoController';
import { ServicoController } from './controllers/ServicoController';
import { ReservaController } from './controllers/ReservaController';
import { AppCheck } from 'firebase-admin/lib/app-check/app-check';
import { UsuarioController } from './controllers/UsuarioController';

const PORT = process.env.PORT || 4000;

const app = express();

//config middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
app.use('/pet', checkAuth, new PetController().router);
app.use('/estabelecimento', checkAuth, new EstabelecimentoController().router);
app.use('/usuario', checkAuth, new UsuarioController().router)
app.use('/servico/:estabelecimento_id', checkAuth, new ServicoController().router)
app.use('/reserva/:estabelecimento_id', checkAuth, new ReservaController().router)

//start server
app.listen(PORT, () => {
    console.log("Servidor rodando no port: " + PORT)
});