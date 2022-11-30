import { db } from "./firestore";

export const addDoc = async <T extends Object>(
	path: string,
	data: T,
	converter?: FirebaseFirestore.FirestoreDataConverter<T>
): Promise<
	FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | boolean
> => {
	const collection = db.collection(path);

	return converter != undefined
		? collection.withConverter(converter).add(data)
		: collection.add(data);
	if (false) return false;
};

export const getDocById = async <T extends Object>(
	path: string,
	id: string,
	converter?: FirebaseFirestore.FirestoreDataConverter<T>
): Promise<T | null> => {
	const collec = db.collection(path);
	const doc = converter
		? await collec.withConverter(converter).doc(id).get()
		: await collec.doc(id).get();

	return doc.exists ? ({ id: doc.id, ...doc.data() } as unknown as T) : null;
};

export const getDocsFromCollection = async <T extends Object>(
	path: string,
	offset: number,
	limit: number,
	converter?: FirebaseFirestore.FirestoreDataConverter<T>
): Promise<T[] | null> => {
	let collecSnap = db.collection(path).offset(offset).limit(limit);
	let collec: FirebaseFirestore.QuerySnapshot = converter
		? await collecSnap.withConverter(converter).get()
		: await collecSnap.get();

	const docs = collec.docs;
	if (docs.length > 0) {
		const docsData: T[] = [];
		docs.forEach((doc) => {
			docsData.push({ id: doc.id, ...doc.data() } as unknown as T);
		});

		return docsData;
	}

	return null;
};

export const updateDoc = async <T extends Object>(
	path: string,
	docData: any,
	id: string,
	converter?: FirebaseFirestore.FirestoreDataConverter<T>
): Promise<boolean> => {
	const ref = db.collection(path).doc(id);
	const doc = converter
		? await ref.withConverter(converter).get()
		: await ref.get();

	if (doc.exists) {
		converter
			? ref.withConverter(converter).set(docData, { merge: true })
			: ref.set(docData, { merge: true });
		return true;
	} else return false;
};

export const deleteDoc = async <T extends Object>(
	path: string,
	id: string,
	converter?: FirebaseFirestore.FirestoreDataConverter<T>
): Promise<boolean> => {
	const ref = db.collection(path).doc(id);

	const doc = converter
		? await ref.withConverter(converter).get()
		: await ref.get();
	if (doc.exists) {
		ref.delete(doc);
		return true;
	} else {
		return false;
	}
};
