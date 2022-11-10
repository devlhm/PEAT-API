import { NextFunction, Request, Response } from "express";
import firebase from "firebase-admin";

export default (req: Request, res: Response, next: NextFunction) => {
	//TODO: REMOVER ISSO QUANDO NÃO PRECISAR MAIS
	// if(req.body.userId) {
	// req.userId = req.body.userId;

	if (req.headers.authorization) {
		req.userId = req.headers.authorization as string;
		next();
	} else {
		res.status(403).send("Unauthorized");
	}

	// if (req.headers.authorization) {
	// 	firebase
	// 		.auth()
	// 		.verifyIdToken(req.headers.authorization)
	// 		.then((decodedToken) => {
	// 			req.userId = decodedToken.uid;
	// 			next();
	// 		})
	// 		.catch(() => {
	// 			res.status(403).send("Unauthorized");
	// 		});
	// } else {
	// 	res.status(403).send("Unauthorized");
	// }
};
