import {
	addDoc,
	deleteDoc,
	getDocById,
	getDocsFromCollection,
	updateDoc,
} from "../dbHandler";
import CollectionNames from "./CollectionNames";
import { Model } from "./Model";

export interface Estabelecimento {
	id?: string,
	nome: string;
	avaliacoes: number[];
	descricao: string;

	estado: string;
	cidade: string;
	bairro: string;
	logradouro: string;
	complemento: string;
	numero: number;

	nome_imagens?: string[];
}

export class EstabelecimentoModel implements Model<Estabelecimento> {
    getPath(): string {
        return CollectionNames.ESTABELECIMENTO;
    }

	find(id: string): Promise<Estabelecimento | null> {
		return getDocById(this.getPath(), id);
	}

	findAll(
		limit: number = 0,
		offset: number = 0
	): Promise<Estabelecimento[] | null> {
		return getDocsFromCollection(this.getPath(), offset, limit);
	}

	create(
		docData: Estabelecimento
	): Promise<
		FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
	> {
		return addDoc(this.getPath(), docData);
	}

	update(docData: Estabelecimento, id: string): Promise<boolean> {
		return updateDoc(this.getPath(), docData, id);
	}

	remove(id: string): Promise<boolean> {
		return deleteDoc(this.getPath(), id);
	}
}
