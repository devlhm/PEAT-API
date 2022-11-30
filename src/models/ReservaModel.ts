import {
	addDoc,
	deleteDoc,
	getDocById,
	getDocsFromCollection,
	updateDoc,
} from "../dbHandler";
import CollectionNames from "./CollectionNames";
import { Model } from "./Model";
import { Servico } from "./ServicoModel";
import { db } from "./../firestore";

export interface Reserva {
	id?: string;
	data_horario: string;
	id_usuario: string;
	servicos: Servico[] | FirebaseFirestore.DocumentReference[] | string[];
}

export class ReservaModel implements Model<Reserva> {
	setServicos(
		servicos: string[],
		parentId: string
	): FirebaseFirestore.DocumentReference[] {
		return servicos.map((id) => {
			const doc = db
				.collection(
					`${CollectionNames.ESTABELECIMENTO}/${parentId!}/${
						CollectionNames.SERVICO
					}`
				)
				.doc(id);

			return doc;
		});
	}

	async getServicos(
		servicos: FirebaseFirestore.DocumentReference[]
	): Promise<Servico[]> {
		const arr: Servico[] = [];


		for await (const ref of servicos) {
			console.log("ref: ");
			console.log(ref.id)
			arr.push((await ref.get()).data() as Servico);
		}

		return arr;
	}

	getPath(parentId?: string | undefined): string {
		return `${CollectionNames.ESTABELECIMENTO}/${parentId}/${CollectionNames.RESERVA}`;
	}

	async find(id: string, parentId?: string): Promise<Reserva | null> {
		let doc = (await getDocById(this.getPath(parentId), id)) as Reserva;

		if (doc) {
			const reserva = doc as Reserva;
			const refs = reserva.servicos as FirebaseFirestore.DocumentReference[];

			doc.servicos = await this.getServicos(refs);
			console.log(doc);

			return doc;
		} else return null;
	}

	async findAll(
		limit: number = 0,
		offset: number = 0,
		parentId?: string
	): Promise<Reserva[] | null> {
		let docs = (await getDocsFromCollection(
			this.getPath(parentId),
			offset,
			limit
		)) as Reserva[];

		if (docs) {
			await Promise.all(docs.map(async (doc) => {
				const reserva = doc as Reserva;
				const refs = reserva.servicos as FirebaseFirestore.DocumentReference[];

				console.log(await this.getServicos(refs));

				doc.servicos = await this.getServicos(refs);
				console.log(doc);
				return doc;
			}));

			console.log(docs[0].servicos);
			return docs;
		} else return null;
	}

	async create(
		docData: Reserva,
		parentId?: string
	): Promise<
		| FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
		| boolean
	> {
		docData.servicos = this.setServicos(
			docData.servicos as string[],
			parentId!
		);
		console.log(docData);

		return addDoc(this.getPath(parentId), docData);
	}

	update(docData: Reserva, id: string, parentId?: string): Promise<boolean> {
		if (docData.servicos)
			docData.servicos = this.setServicos(
				docData.servicos as string[],
				parentId!
			);

		return updateDoc(this.getPath(parentId), docData, id);
	}

	remove(id: string, parentId?: string): Promise<boolean> {
		return deleteDoc(this.getPath(parentId), id);
	}
}
