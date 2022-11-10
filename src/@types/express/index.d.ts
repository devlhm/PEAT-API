import { Estabelecimento } from '../../models/EstabelecimentoModel';
export {};

declare global {
	namespace Express {
		interface Request {
			userId: string;
			picture: Multer.File;
			estabelecimento: Estabelecimento
		}
	}
}
