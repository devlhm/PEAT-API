import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser';

//router imports
import { router as petRouter } from './routes/pet.route';

const PORT = process.env.PORT || 4000;

const app = express();

//config middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
app.use('/pet', petRouter);

//start server
app.listen(PORT, () => {
    console.log("Servidor rodando no port: " + PORT)
});