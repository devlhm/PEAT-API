import firebase from "firebase-admin";

const firebaseConfig = {
	apiKey: "AIzaSyDbdngozElYBEYdk98Qei3BlalFR3P1h8I",
	authDomain: "peat-f2f94.firebaseapp.com",
	projectId: "peat-f2f94",
	storageBucket: "peat-f2f94.appspot.com",
	messagingSenderId: "346964342472",
	appId: "1:346964342472:web:519a149657fd9e95c817fd",
};

firebase.initializeApp({
	credential: firebase.credential.cert(firebaseConfig),
});

export const db = firebase.firestore();
