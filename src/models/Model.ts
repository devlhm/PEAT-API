export interface Model<T> {
	getPath(parentId?: string | undefined): string;
	find: (id: string, parentId?: string | undefined) => Promise<T | null>;
	findAll: (
		limit?: number,
		offset?: number,
		parentId?: string | undefined
	) => Promise<T[] | null>;
	create: (
		docData: T,
		id?: string,
		parentId?: string | undefined
	) =>
		| Promise<
				FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
		  >
		| Promise<Boolean>;
	update: (
		docData: T,
		id: string,
		parentId?: string | undefined
	) => Promise<boolean>;
	remove: (id: string, parentId?: string | undefined) => Promise<boolean>;
}

// export abstract class Model<T extends Object> {
//     protected abstract getPath(parentId?: string): string;

// 	public find = async (
//         id: string,
// 		parentId?: string | undefined,
// 	): Promise<T | null> => {
// 		return await getDocById(this.getPath(parentId), id);
// 	};

// 	public findAll = async  (parentId?: string | undefined, limit: number = 0, offset: number = 0): Promise<T[] | null> => {
//         console.log({limit, offset})
// 		return await getDocsFromCollection(this.getPath(parentId), offset, limit);
// 	};

// 	public create = (
// 		docData: T,
// 		parentId?: string | undefined
// 	): Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>> => {
// 		return addDoc(this.getPath(parentId), docData);
// 	}

// 	public update = async  (
// 		docData: T,
// 		id: string,
// 		parentId?: string | undefined
// 	): Promise<boolean> => {
// 		return updateDoc(docData, id, this.getPath(parentId));
// 	}
// 	public remove = async  (
// 		id: string,
// 		parentId?: string | undefined
// 	): Promise<boolean> => {
// 		return deleteDoc(this.getPath(parentId), id);
// 	}
// }
