import {
	addDoc,
	deleteDoc,
	getDocById,
	getDocsFromCollection,
	updateDoc,
} from "../dbHandler";
import CollectionNames from "./CollectionNames";
import { Model } from "./Model";

export interface Pet {
	id?: string,
	nome: string,
	observacaoes: string,
	raca: string,
	tipo: string,
	nome_imagem?: string,
}

export class PetModel implements Model<Pet> {
	getPath(parentId?: string | undefined): string {
		return `${CollectionNames.USUARIO}/${parentId}/${CollectionNames.PET}`;
	}

	find(id: string, parentId?: string): Promise<Pet | null> {
		return getDocById(this.getPath(parentId), id);
	}

	findAll(
		limit: number = 0,
		offset: number = 0,
		parentId?: string
	): Promise<Pet[] | null> {
		return getDocsFromCollection(this.getPath(parentId), offset, limit);
	}

	create(
		docData: Pet,
		parentId?: string
	): Promise<
		FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
	> {
		return addDoc(this.getPath(parentId), docData);
	}

	update(docData: Pet, id: string, parentId?: string): Promise<boolean> {
		return updateDoc(this.getPath(parentId), docData, id);
	}

	remove(id: string, parentId?: string): Promise<boolean> {
		return deleteDoc(this.getPath(parentId), id);
	}
}

// TODO: ADICIONAR SERVIMENTO ESTÁTICO DAS IMAGENS DO PET E ESTABELECIMENTO
// TODO: SALVAR CAMINHO DA IMAGEM NO BANCO DE DADOS
// TODO: SALVAR IMAGEM NO SERVIDOR
