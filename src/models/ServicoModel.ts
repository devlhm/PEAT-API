import {
	addDoc,
	deleteDoc,
	getDocById,
	getDocsFromCollection,
	updateDoc,
} from "../dbHandler";
import CollectionNames from "./CollectionNames";
import { Model } from "./Model";

export interface Servico {
	id?: string,
	nome: string;
	preco: number;
}

export class ServicoModel implements Model<Servico> {
	getPath(parentId?: string | undefined): string {
		return `${CollectionNames.ESTABELECIMENTO}/${parentId}/${CollectionNames.SERVICO}`;
	}

	find(id: string, parentId?: string): Promise<Servico | null> {
		return getDocById(this.getPath(parentId), id);
	}

	findAll(
		limit: number = 0,
		offset: number = 0,
		parentId?: string
	): Promise<Servico[] | null> {
		return getDocsFromCollection(this.getPath(parentId), offset, limit);
	}

	create(
		docData: Servico,
		parentId?: string
	): Promise<
		FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | boolean
	> {
		return addDoc(this.getPath(parentId), docData);
	}

	update(docData: Servico, id: string, parentId?: string): Promise<boolean> {
		return updateDoc(this.getPath(parentId), docData, id);
	}

	remove(id: string, parentId?: string): Promise<boolean> {
		return deleteDoc(this.getPath(parentId), id);
	}
}
