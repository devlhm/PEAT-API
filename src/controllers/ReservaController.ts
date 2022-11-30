import { Request, Response } from "express";
import { Reserva, ReservaModel } from "../models/ReservaModel";
import { ResourceController } from "./ResourceController";
import { UsuarioModel } from '../models/UsuarioModel';
import CollectionNames from './../models/CollectionNames';

export class ReservaController extends ResourceController<Reserva> {
	protected model = new ReservaModel();

	protected async add(req: Request, res: Response): Promise<void> {
		const docData = req.body.data;
		docData.id_usuario = req.userId;

		try {
			const result = await this.model.create(docData, req.params.estabelecimento_id);
			if(result) {
				const ref = result as FirebaseFirestore.DocumentReference;
				await new UsuarioModel().addReserva(ref, req.userId);
			}
			res.sendStatus(200);
		} catch (err: any) {
			res.status(500).json({ message: err!.message, stack: err!.stack });
		}
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
		console.log(docs)

		if (docs) {
			res.status(200).json(docs);
		} else {
			res.status(404).json({ message: "Registros não encontrados" });
		}
	}

	protected async erase(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		const estabelecimentoId = req.params.estabelecimento_id;

		const result = await this.model.remove(
			id,
			estabelecimentoId
		);

		if (result) {
			await new UsuarioModel().removeReserva(`${CollectionNames.ESTABELECIMENTO}/${estabelecimentoId}/${CollectionNames.RESERVA}`, id, req.userId);
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
