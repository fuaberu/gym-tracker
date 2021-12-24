import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';

import { UserData } from '../../App';

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
//initialize real time db
const database = getDatabase();
//initialize auth
const auth = getAuth();

export const registerUserData = async (
	fullname: string,
	email: string,
	password: string
) => {
	try {
		const user = await createUserWithEmailAndPassword(auth, email, password);
		set(ref(database, 'users/' + user.user.uid), {
			fullname,
			email,
			createdAt: new Date().getTime(),
		});
	} catch (error) {
		console.log(error);
	}
};

export const loginUser = (email: string, password: string) => {
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			// ...
			const dbRef = ref(getDatabase());
			get(child(dbRef, `users/${user.uid}`))
				.then((snapshot) => {
					if (snapshot.exists()) {
						console.log(snapshot.val());
					} else {
						console.log('No data available');
					}
				})
				.catch((error) => {
					console.error(error);
				});
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(error);
		});
};
