import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser';

//controller imports
import { PetController } from './controllers/PetController';

//middleware imports
import checkAuth from './middlewares/checkAuth';

const PORT = process.env.PORT || 4000;

const app = express();

//config middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
app.use('/pet', checkAuth, new PetController().router);

//start server
app.listen(PORT, () => {
    console.log("Servidor rodando no port: " + PORT)
});