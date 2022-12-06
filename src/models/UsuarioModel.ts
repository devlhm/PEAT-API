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
import { Reserva, ReservaModel } from "./ReservaModel";
import firebase from "firebase-admin";
import { Servico } from "./ServicoModel";

export interface Usuario {
	nome_completo: string;
	cpf: string;

	estado: string;
	cidade: string;
	bairro: string;
	logradouro: string;
	complemento: string;
	numero: number;
	reservas: FirebaseFirestore.DocumentReference[];
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

	async create(docData: Usuario, id?: string): Promise<boolean> {
		const ref = db.collection(`${CollectionNames.USUARIO}`).doc(id!);

		if ((await ref.get()).exists) return false;

		ref.set(docData);
		return true;
	}

	update(docData: object, id: string): Promise<boolean> {
		return updateDoc(this.getPath(), docData, id);
	}

	remove(id: string): Promise<boolean> {
		return deleteDoc(this.getPath(), id);
	}

	public async getReservas(id: string) {
		const userDoc = await db.collection(this.getPath()).doc(id).get();
		const userData = userDoc.data()! as Usuario;
		const reservaModel = new ReservaModel();

		if(!userData.reservas) return [];

		const reservaArray = await Promise.all(
			userData.reservas.map(
				async (reserva: FirebaseFirestore.DocumentReference) => {
					const reservaData = (await reserva.get()).data() as Reserva;
					console.log(reservaData.servicos)
					reservaData.servicos = await reservaModel.getServicos(
						reservaData.servicos as FirebaseFirestore.DocumentReference[]
					);
					console.log(reservaData.servicos)
					return reservaData;
				}
			)
		);

		return reservaArray;
	}

	public async addReserva(
		reserva: FirebaseFirestore.DocumentReference,
		id: string
	) {
		await this.update(
			{ reservas: firebase.firestore.FieldValue.arrayUnion(reserva) },
			id
		);
	}

	public async removeReserva(reservaCollection: string, reservaId: string, id: string) {
		const reservaRef = db.collection(reservaCollection).doc(reservaId);
		await this.update(
			{ reservas: firebase.firestore.FieldValue.arrayRemove(reservaRef) },
			id
		);
	}
}
