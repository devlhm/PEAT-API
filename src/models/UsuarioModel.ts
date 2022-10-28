import {
	getDocById,
	getDocsFromCollection,
	addDoc,
	updateDoc,
	deleteDoc,
} from "../dbHandler";
import { db } from "../firestore";
import CollectionNames from "./CollectionNames";
import { Model } from "./Model";

export interface Usuario {
	nome_completo: string;
	cpf: string;

	estado: string;
	cidade: string;
	bairro: string;
	logradouro: string;
	complemento: string;
	numero: number;
}

export class UsuarioModel implements Model<Usuario> {
	getPath(): string {
		return CollectionNames.USUARIO;
	}

	find(id: string): Promise<Usuario | null> {
		return getDocById(this.getPath(), id);
	}

	findAll(limit: number = 0, offset: number = 0): Promise<Usuario[] | null> {
		return getDocsFromCollection(this.getPath(), offset, limit);
	}

	async create(docData: Usuario, id?: string): Promise<Boolean> {
		const ref = db.collection(`${CollectionNames.USUARIO}`).doc(id!);

		if ((await ref.get()).exists) return false;
        
		ref.set(docData);
		return true;
	}

	update(docData: Usuario, id: string): Promise<boolean> {
		return updateDoc(this.getPath(), docData, id);
	}

	remove(id: string): Promise<boolean> {
		return deleteDoc(this.getPath(), id);
	}
}
