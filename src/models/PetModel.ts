import { db } from "../firestore";
import CollectionNames from "./CollectionNames";
import { Model } from "./Model";

export interface Pet {
	nome: string;
	observacaoes: string;
	raca: string;
	tipo: string;
}

export const petModel: Model<Pet> = {
	find: async function (
		id: string,
		userId?: string | undefined
	): Promise<Pet | null> {
		const doc = await db
			.collection(`${CollectionNames.USER}/${userId}/${CollectionNames.PET}`)
			.doc(id)
			.get();
		return doc.exists ? (doc.data() as Pet) : null;
	},
	findAll: async function (userId?: string | undefined): Promise<Pet[] | null> {
		const collec = await db
			.collection(`${CollectionNames.USER}/${userId}/${CollectionNames.PET}`)
			.get();
		const docs = collec.docs;
		if (docs.length > 0) {
			const docsData: Pet[] = [];
			docs.forEach((doc) => {
				docsData.push(doc.data() as Pet);
			});

			console.log(docsData);
			return docsData;
		}

		return null;
	},
	create: function (
		docData: Pet,
		userId?: string | undefined
	): Promise<
		FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
	> {
		return db
			.collection(`${CollectionNames.USER}/${userId}/${CollectionNames.PET}`)
			.add(docData);
	},
	update: async function (
		docData: Pet,
		id: string,
		userId?: string | undefined
	): Promise<boolean> {
		const ref = db
			.collection(`${CollectionNames.USER}/${userId}/${CollectionNames.PET}`)
			.doc(id);

		const doc = await ref.get();
		if (doc.exists) {
			ref.set(docData);
			return true;
		} else return false;
	},
	remove: async function (
		id: string,
		userId?: string | undefined
	): Promise<boolean> {
		const ref = db
			.collection(`${CollectionNames.USER}/${userId}/${CollectionNames.PET}`)
			.doc(id);

		const doc = await ref.get();
		if (doc.exists) {
			ref.delete(doc);
			return true;
		} else {
			return false;
		}
	},
};
