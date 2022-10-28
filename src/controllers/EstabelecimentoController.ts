import { Request, Response } from "express";
import {
	Estabelecimento,
	EstabelecimentoModel,
} from "../models/EstabelecimentoModel";
import { ResourceController } from "./ResourceController";
import { Model } from "../models/Model";
export class EstabelecimentoController extends ResourceController<Estabelecimento> {
	protected model: Model<Estabelecimento> = new EstabelecimentoModel();

	protected async add(req: Request, res: Response): Promise<void> {
		const docData = req.body.data;

		try {
			await this.model.create(docData);
			res.sendStatus(200);
		} catch (err) {
			res.status(400).json({ message: err });
		}
	}

	protected async getOne(req: Request, res: Response): Promise<void> {
		const doc = await this.model.find(req.params.id, req.userId);

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
		const result = await this.model.update(
			req.body.data,
			req.params.id,
		);

		if (result) {
			res.sendStatus(200);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	}
}
