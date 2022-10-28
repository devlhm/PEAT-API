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
	data_horario: Date;
	id_usuario: string;
	servicos: Servico[] | FirebaseFirestore.DocumentReference[];
}

const reservaConverter: FirebaseFirestore.FirestoreDataConverter<Reserva> = {
	toFirestore(
		modelObject: FirebaseFirestore.WithFieldValue<Reserva>
	): FirebaseFirestore.DocumentData {
		return {
			data_horario: FirebaseFirestore.Timestamp.fromDate(
				modelObject.data_horario as Date
			),
			id_usuario: modelObject.id_usuario,
			servicos: modelObject.servicos,
		};
	},
	fromFirestore: function (
		snapshot: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
	): Reserva {
		const data = snapshot.data();

		const arr: Servico[] = [];

		(data.servicos as FirebaseFirestore.DocumentReference[]).forEach(
			async (ref) => {
				arr.push((await ref.get()).data() as Servico);
			}
		);

		return {
			data_horario: (data.data_horario as FirebaseFirestore.Timestamp).toDate(),
			id_usuario: data.id_usuario,
			servicos: data.servicos,
		} as Reserva;
	},
};

export class ReservaModel implements Model<Reserva> {
	setServicos(
		servicos: Servico[],
		parentId: string
	): FirebaseFirestore.DocumentReference[] {
		return servicos.map((ref) =>
			db
				.collection(
					`${CollectionNames.ESTABELECIMENTO}/${parentId!}/${
						CollectionNames.SERVICO
					}`
				)
				.doc(ref.id!)
		);
	}

	async getServicos(
		servicos: FirebaseFirestore.DocumentReference[]
	): Promise<Servico[]> {
		const arr: Servico[] = [];

		for await (const ref of servicos)
			arr.push((await ref.get()).data() as Servico);

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
			limit,
			reservaConverter
		)) as Reserva[];

		if (docs) {
			docs.forEach(async (doc) => {
				const reserva = doc as Reserva;
				const refs = reserva.servicos as FirebaseFirestore.DocumentReference[];

				doc.servicos = await this.getServicos(refs);
				return doc;
			});

			return docs;
		} else return null;
	}

	async create(
		docData: Reserva,
		parentId?: string
	): Promise<
		FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
	> {
		docData.servicos = this.setServicos(
			docData.servicos as Servico[],
			parentId!
		);

		return addDoc(this.getPath(parentId), docData, reservaConverter);
	}

	update(docData: Reserva, id: string, parentId?: string): Promise<boolean> {
		docData.servicos = this.setServicos(
			docData.servicos as Servico[],
			parentId!
		);

		return updateDoc(this.getPath(parentId), docData, id, reservaConverter);
	}

	remove(id: string, parentId?: string): Promise<boolean> {
		return deleteDoc(this.getPath(parentId), id, reservaConverter);
	}
}
