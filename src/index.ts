import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import dotenv from "dotenv";

//controller imports
import { PetController } from "./controllers/PetController";

//middleware imports
import checkAuth from "./middlewares/checkAuth";
import { EstabelecimentoController } from "./controllers/EstabelecimentoController";
import { ServicoController } from "./controllers/ServicoController";
import { ReservaController } from "./controllers/ReservaController";
import { UsuarioController } from "./controllers/UsuarioController";
import swaggerDocs from "./swagger.json";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const PORT = process.env.PORT || 4000;

const app = express();

//config middlewares
dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload = multer({
	storage: new CloudinaryStorage({ cloudinary }),
});

//routes
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads/")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/pet", checkAuth, new PetController().router);
app.use("/estabelecimento", new EstabelecimentoController().router);
app.use("/usuario", checkAuth, new UsuarioController().router);
app.use(
	"/estabelecimento/:estabelecimento_id/servico/",
	new ServicoController().router
);
app.use(
	"/estabelecimento/:estabelecimento_id/reserva/", checkAuth,
	new ReservaController().router
);

//start server
app.listen(PORT, () => {
	console.log("Servidor rodando no port: " + PORT);
});
