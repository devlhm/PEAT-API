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
	) => Promise<
		| FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
		| boolean
	>;
	update: (
		docData: T,
		id: string,
		parentId?: string | undefined
	) => Promise<boolean>;
	remove: (id: string, parentId?: string | undefined) => Promise<boolean>;
}
