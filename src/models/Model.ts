export interface Model<T> {
    find: (id: string, userId?: string | undefined) => Promise<T | null>,
    findAll: (userId?: string | undefined) => Promise<T[] | null>,
    create: (docData: T, userId?: string | undefined) => Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>>,
    update: (docData: T, id: string, userId?: string | undefined) => Promise<boolean>,
    remove: (id: string, userId?: string | undefined) => Promise<boolean>,
}