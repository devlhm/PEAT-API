import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import swaggerUi from "swagger-ui-express";
import cloudinary from "cloudinary";
import formidable from "formidable";

//controller imports
import { PetController } from "./controllers/PetController";

//middleware imports
import checkAuth from "./middlewares/checkAuth";
import { EstabelecimentoController } from "./controllers/EstabelecimentoController";
import { ServicoController } from "./controllers/ServicoController";
import { ReservaController } from "./controllers/ReservaController";
import { UsuarioController } from "./controllers/UsuarioController";
import swaggerDocs from './swagger.json'

const PORT = process.env.PORT || 4000;

const app = express();

//config middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

cloudinary.v2.config()

export const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "uploads/");
		},
		filename: function (req, file, cb) {
			cb(null, Date.now() + path.extname(file.originalname));
		},
	}),
	dest: "uploads/",
	fileFilter: function (req, file, callback) {
		var ext = path.extname(file.originalname);
		if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
			return callback(new Error("Only images are allowed"));
		}
		callback(null, true);
	},
});

//routes
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads/')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use("/pet", checkAuth, new PetController().router);
app.use("/estabelecimento", new EstabelecimentoController().router);
app.use("/usuario", checkAuth, new UsuarioController().router);
app.use(
	"/estabelecimento/:estabelecimento_id/servico/",
	checkAuth,
	new ServicoController().router
);
app.use(
	"/estabelecimento/:estabelecimento_id/reserva/",
	checkAuth,
	new ReservaController().router
);

//start server
app.listen(PORT, () => {
	console.log("Servidor rodando no port: " + PORT);
});