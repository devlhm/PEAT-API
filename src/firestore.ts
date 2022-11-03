import firebase, { ServiceAccount } from "firebase-admin";

import * as serviceAccount from "./serviceAccountKey.json";

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as ServiceAccount)
});

export const db = firebase.firestore();
