import { Request, Response } from "express";
import { Reserva, ReservaModel } from "../models/ReservaModel";
import { ResourceController } from "./ResourceController";

export class ReservaController extends ResourceController<Reserva> {
	protected model = new ReservaModel();

	protected async add(req: Request, res: Response): Promise<void> {
		const docData = req.body.data;
		docData.id_usuario = req.userId;

		await this.model.create(docData, req.params.estabelecimento_id);
		res.sendStatus(200);
	}

	protected async getOne(req: Request, res: Response): Promise<void> {
		const doc = await this.model.find(
			req.params.id,
			req.params.estabelecimento_id
		);
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

		const docs = await this.model.findAll(
			limit,
			offset,
			req.params.estabelecimento_id
		);

		if (docs) {
			res.status(200).json(docs);
		} else {
			res.status(404).json({ message: "Registros não encontrados" });
		}
	}

	protected async erase(req: Request, res: Response): Promise<void> {
		const result = await this.model.remove(
			req.params.id,
			req.params.estabelecimento_id
		);

		if (result) {
			res.sendStatus(200);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	}

	protected async edit(req: Request, res: Response): Promise<void> {
		const result = await this.model.update(
			req.body.data,
			req.params.id,
			req.params.estabelecimento_id
		);

		if (result) {
			res.sendStatus(200);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	}
}
