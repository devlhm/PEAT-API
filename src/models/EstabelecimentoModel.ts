import { GeoPoint } from "firebase-admin/firestore";
import {
	addDoc,
	deleteDoc,
	getDocById,
	getDocsFromCollection,
	updateDoc,
} from "../dbHandler";
import CollectionNames from "./CollectionNames";
import { Model } from "./Model";

const estabelecimentoConverter: FirebaseFirestore.FirestoreDataConverter<Estabelecimento> =
	{
		toFirestore(
			modelObject: FirebaseFirestore.WithFieldValue<Estabelecimento>
		): FirebaseFirestore.DocumentData {
			if (modelObject.coordenadas) {
				const coords = modelObject.coordenadas as {
					lat: number;
					long: number;
				};

				if(coords.lat && coords.long) {
					console.log("lat: " + coords.lat);
					modelObject.coordenadas = new GeoPoint(coords.lat, coords.long);
				}
			}

			return modelObject;
		},
		fromFirestore: function (
			snapshot: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
		): Estabelecimento {
			const data = snapshot.data() as Estabelecimento;
			const coords = data.coordenadas as GeoPoint;

			if (coords)
				data.coordenadas = {
					lat: coords.latitude,
					long: coords.longitude,
				};

			const avaliacoes = data.avaliacoes ?? [];
			const sumAvaliacoes = avaliacoes.reduce(
				(total, avaliacao) => total + avaliacao,
				0
			);
			const avaliacaoMedia = sumAvaliacoes / avaliacoes.length;

			data.avaliacao_media = avaliacaoMedia;
			delete data.avaliacoes;

			return data;
		},
	};

export interface Estabelecimento {
	id?: string;
	nome: string;
	avaliacoes?: number[];
	avaliacao_media?: number;
	descricao: string;

	estado: string;
	cidade: string;
	bairro: string;
	logradouro: string;
	complemento: string;
	numero: number;

	nome_imagens?: string[];
	coordenadas:
		| {
				lat: number;
				long: number;
		  }
		| FirebaseFirestore.GeoPoint;
}

export class EstabelecimentoModel implements Model<Estabelecimento> {
	getPath(): string {
		return CollectionNames.ESTABELECIMENTO;
	}

	find(id: string): Promise<Estabelecimento | null> {
		return getDocById(this.getPath(), id, estabelecimentoConverter);
	}

	findAll(
		limit: number = 0,
		offset: number = 0
	): Promise<Estabelecimento[] | null> {
		return getDocsFromCollection(
			this.getPath(),
			offset,
			limit,
			estabelecimentoConverter
		);
	}

	create(
		docData: Estabelecimento
	): Promise<
		FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
	> {
		return addDoc(this.getPath(), docData, estabelecimentoConverter);
	}

	update(docData: Estabelecimento, id: string): Promise<boolean> {
		return updateDoc(this.getPath(), docData, id, estabelecimentoConverter);
	}

	remove(id: string): Promise<boolean> {
		return deleteDoc(this.getPath(), id, estabelecimentoConverter);
	}
}
