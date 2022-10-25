import { db } from "./../firestore";

export interface Pet {
	nome: string;
	observacaoes: string;
	raca: string;
	tipo: string;
}

export const find = async (userId: string, id: string) => {
	const petDoc = await db
		.collection("user")
		.doc(userId)
		.collection("pet")
		.doc(id)
		.get();

	return petDoc.exists ? (petDoc.data() as Pet) : null;
};

export const create = async (userId: string, pet: Pet) => {
	await db.collection("user").doc(userId).collection("pet").add(pet);
};

//TODO: terminar esse model, lembrando que o front vai mandar o id do usuario
