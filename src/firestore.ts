import firebase, { ServiceAccount } from "firebase-admin";

const serviceAccount =  require("../serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as ServiceAccount)
});

export const db = firebase.firestore();
