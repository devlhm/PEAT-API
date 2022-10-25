import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const PORT = process.env.PORT || 4000

const app = express();

//config middlewares
app.use(cors());
app.use(morgan("dev"))

//routes


//start server
app.listen(PORT, () => {
    console.log("Servidor rodando no port " + PORT)
})