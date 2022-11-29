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
		this.router.get("/", (req: Request, res: Response) => {
			try {
				this.getAll(req, res);
			}  catch (err: any) {
			res.status(500).json({message: err!.message, stack: err!.stack});
		}
		});

		this.router.get("/:id", (req: Request, res: Response) => {
			try {
				this.getOne(req, res);
			}  catch (err: any) {
			res.status(500).json({message: err!.message, stack: err!.stack});
		}
		});

		this.router.post("/", (req: Request, res: Response) => {
			try {
				this.add(req, res);
			}  catch (err: any) {
			res.status(500).json({message: err!.message, stack: err!.stack});
		}
		});

		this.router.post("/:id", (req: Request, res: Response) => {
			try {
				this.edit(req, res);
			}  catch (err: any) {
			res.status(500).json({message: err!.message, stack: err!.stack});
		}
		});

		this.router.delete("/:id", (req: Request, res: Response) => {
			try {
				this.erase(req, res);
			}  catch (err: any) {
			res.status(500).json({message: err!.message, stack: err!.stack});
		}
		});
	}
}
