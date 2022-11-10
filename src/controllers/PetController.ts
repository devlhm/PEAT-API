import { ResourceController } from "./ResourceController";
import { Pet, PetModel } from "../models/PetModel";
import { Request, Response } from "express";
import { upload } from "../index";
export class PetController extends ResourceController<Pet> {
	protected model = new PetModel();

	protected async add(req: Request, res: Response): Promise<void> {
		const docData = req.body.data;

		try {
			await this.model.create(docData, req.userId);
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

		const docs = await this.model.findAll(limit, offset, req.userId);
		if (docs) {
			res.status(200).json(docs);
		} else {
			res.status(404).json({ message: "Registros não encontrados" });
		}
	}

	protected async erase(req: Request, res: Response): Promise<void> {
		const result = await this.model.remove(req.params.id, req.userId);

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
			req.userId
		);

		if (result) {
			res.sendStatus(200);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	}

	private async savePicturePath(req: Request, res: Response): Promise<void> {
		const result = await this.model.update(
			{ nome_imagem: req.file!.path } as Pet,
			req.params.id,
			req.userId
		);

		if (result) res.status(200).json({ message: "Imagem salva uploaded" });
		else res.status(404).json({ message: "Registro não encontrado" });
	}

	protected initializeRoutes(): void {
		super.initializeRoutes();

		this.router.post("/:id/imagem", upload.single("picture"), (req, res) =>
			this.savePicturePath(req, res)
		);
	}
}
