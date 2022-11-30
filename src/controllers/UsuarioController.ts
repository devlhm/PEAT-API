import { Request, Response } from "express";
import checkAuth from "../middlewares/checkAuth";
import { Model } from "../models/Model";
import { Usuario, UsuarioModel } from "../models/UsuarioModel";
import { ResourceController } from "./ResourceController";

export class UsuarioController extends ResourceController<Usuario> {
	protected model: UsuarioModel = new UsuarioModel();

	protected async add(req: Request, res: Response): Promise<void> {
		const docData = req.body.data;

		try {
			await this.model.create(docData, req.userId);
			res.sendStatus(200);
		} catch (err: any) {
			res.status(500).json({ message: err!.message, stack: err!.stack });
		}
	}

	protected async getOne(req: Request, res: Response): Promise<void> {
		const doc = await this.model.find(req.params.id);

		if (doc) {
			res.status(200).json(doc);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	}

	protected async getAll(req: Request, res: Response): Promise<void> {
		let limit: number;
		let offset: number;

		try {
			limit = req.query.limit ? parseInt(req.query.limit as string) : 0;
			offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
		} catch (err) {
			res.status(400).json({ message: err });
			return;
		}

		const docs = await this.model.findAll(limit, offset);
		if (docs) {
			res.status(200).json(docs);
		} else {
			res.status(404).json({ message: "Registros não encontrados" });
		}
	}

	protected async erase(req: Request, res: Response): Promise<void> {
		const result = await this.model.remove(req.params.id);

		if (result) {
			res.sendStatus(200);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	}

	protected async edit(req: Request, res: Response): Promise<void> {
		const result = await this.model.update(req.body.data, req.params.id);

		if (result) {
			res.sendStatus(200);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	}

	private async getReservasFromUsuario(req: Request, res: Response): Promise<void> {
		const reservas = await this.model.getReservas(req.userId);
		console.log(reservas);
		res.status(200).json({reservas});
	}

	protected initializeRoutes(): void {
		this.router.get("/reservas", (req, res) => {
			this.getReservasFromUsuario(req, res);
		});

		super.initializeRoutes();
	}
}
