import { Model } from "../models/Model";
import { Request, Response, Router, NextFunction } from "express";

export abstract class ResourceController<T extends Object> {
	protected abstract model: Model<T>;
	public router = Router();

	constructor() {
		this.initializeRoutes();
	}

	public add = async (req: Request, res: Response) => {
		const docData = req.body.data;
		try {
			await this.model.create(docData);
			res.sendStatus(200);
		} catch (err) {
			res.status(400).json({ message: err });
		}
	};

	public getOne = async (req: Request, res: Response) => {
		const doc = await this.model.find(req.params.id, req.userId);

		if (doc) {
			res.status(200).json(doc);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	};

	public getAllFromUser = async (req: Request, res: Response) => {
		console.log("bateu no controller")
		const docs = await this.model.findAll(req.userId);

		if (docs) {
			res.status(200).json(docs);
		} else {
			res.status(404).json({ message: "Registros não encontrados" });
		}
	};

	public edit = async (req: Request, res: Response) => {
		const result = await this.model.update(req.body.pet, req.params.id);

		if (result) {
			res.sendStatus(200);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	};

	public erase = async (req: Request, res: Response) => {
		const result = await this.model.remove(req.params.id);

		if (result) {
			res.sendStatus(200);
		} else {
			res.status(404).json({ message: "Registro não encontrado" });
		}
	};

	public initializeRoutes = () => {
		this.router.get("/", this.getAllFromUser);
		this.router.get("/:id", this.getOne);
		this.router.post("/", this.add);
		this.router.post("/:id", this.edit);
		this.router.delete("/:id", this.erase);
	};
}
