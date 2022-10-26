import firebase from "firebase-admin";

var serviceAccount = require("../config/serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

export const db = firebase.firestore();
