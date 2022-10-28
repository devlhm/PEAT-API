import { Model } from "../models/Model";
import { Request, Response, Router, NextFunction } from "express";

export abstract class ResourceController<T extends Object> {
	protected abstract model: Model<T>;

	public router = Router({ mergeParams: true });

	constructor() {
		this.initializeRoutes();
	}

	protected abstract add(req: Request, res: Response): Promise<void>;
	protected abstract getOne(req: Request, res: Response): Promise<void>;
	protected abstract getAll(req: Request, res: Response): Promise<void>;
	protected abstract edit(req: Request, res: Response): Promise<void>;
	protected abstract erase(req: Request, res: Response): Promise<void>;

	protected initializeRoutes(): void {
		this.router.get("/", (req: Request, res: Response) =>
			this.getAll(req, res)
		);

		this.router.get("/:id", (req: Request, res: Response) => {
			this.getOne(req, res);
		});

		this.router.post("/", (req: Request, res: Response) => {
			this.add(req, res);
		});

		this.router.post("/:id", (req: Request, res: Response) => {
			this.edit(req, res);
		});

		this.router.delete("/:id", (req: Request, res: Response) => {
			this.erase(req, res);
		});
	}
}
