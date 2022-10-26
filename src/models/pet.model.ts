import { db } from "./../firestore";
import CollectionNames from "./CollectionNames";

export interface Pet {
	nome: string;
	observacaoes: string;
	raca: string;
	tipo: string;
}

export const find = async (userId: string, id: string) => {
	const petDoc = await db.collection(`${CollectionNames.USER}/${userId}/${CollectionNames.PET}`).doc(id).get()
	return petDoc.exists ? (petDoc.data() as Pet) : null;
}

export const create = (userId: string, pet: Pet) => {
	return db.collection("user").doc(userId).collection("pet").add(pet);
}

export const findAll = async (userId: string) => {
	const petCollec = await db.collection(`${CollectionNames.USER}/${userId}/${CollectionNames.PET}`)
		.get();
	const petDocs = petCollec.docs;
	return petDocs.length > 0 ? petDocs : null;
}

export const update = async (userId: string, id: string, pet: Pet) => {
	const petRef = db.collection(`${CollectionNames.USER}/${userId}/${CollectionNames.PET}`).doc(id)

	const petDoc = await petRef
		.get();
	if (petDoc.exists) {
		petRef.set(petDoc);
		return true;
	} else {
		return false;
	}
}

export const remove = async (userId: string, id: string) => {
	const petRef = db.collection(`${CollectionNames.USER}/${userId}/${CollectionNames.PET}`).doc(id)

	const petDoc = await petRef
		.get();
	if (petDoc.exists) {
		petRef.delete(petDoc);
		return true;
	} else {
		return false;
	}
}

//TODO: tentar transformar em classe que herda uma generica