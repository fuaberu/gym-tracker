import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
};

//initialize app
const app = initializeApp(firebaseConfig);
//initialize db
const db = getFirestore();
//initialize auth
const auth = getAuth();

export const registerUserData = async (
	fullname: string,
	email: string,
	password: string
) => {
	try {
		const user = await createUserWithEmailAndPassword(auth, email, password);
		const docRef = await setDoc(doc(db, 'users', user.user.uid), {
			userId: user.user.uid,
			fullname,
			email,
			createdAt: new Date().getTime(),
			profilePic: null,
			options: { weight: 'kg', length: 'cm' },
		});
	} catch (error) {
		console.log(error);
	}
};

export const loginUser = async (email: string, password: string) => {
	try {
		const user = await signInWithEmailAndPassword(auth, email, password);
		if (!user) return;
		// Signed in

		//get user info
		const docRef = doc(db, 'users', user.user.uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log('Document data:', docSnap.data());
			return docSnap.data();
		} else {
			// doc.data() will be undefined in this case
			console.log('No such document!');
		}
	} catch (error) {
		console.log(error);
	}
};

export const signOutUser = async () => {
	try {
		const response = await signOut(auth);
	} catch (error) {}
};

export const userLogged = async () => {
	const user = auth.currentUser;
	if (user) {
		//get user info
		const docRef = doc(db, 'users', user.uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log('Document data:', docSnap.data());
			return docSnap.data();
		} else {
			// doc.data() will be undefined in this case
			console.log('No such document!');
			return null;
		}
	} else {
		return null;
	}
};
