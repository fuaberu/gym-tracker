import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	doc,
	setDoc,
	getDoc,
	query,
	collection,
	where,
	getDocs,
	orderBy,
	addDoc,
	writeBatch,
	startAt,
	endAt,
	updateDoc,
	deleteDoc,
} from 'firebase/firestore';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	browserLocalPersistence,
} from 'firebase/auth';
import { Exercise } from '../components/ExerciseTable';

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
// auth.setPersistence(browserLocalPersistence);

// ----------- AUTH ----------- //

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
		return docRef;
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
			console.log(docSnap.data(), 'login');
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
		return response;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const updateUser = async (uid: string, updateInfo: any) => {
	try {
		const userRef = doc(db, 'users', uid);
		await updateDoc(userRef, updateInfo);
		return 'Updated';
	} catch (error) {
		console.log(error);
		return 'Error to update, please try again later';
	}
};
export const deleteUser = async (uid: string) => {
	try {
		const userRef = doc(db, 'users', uid);
		return 'deleted';
	} catch (error) {
		console.log(error);
		return 'Error to delete account, please try again later';
	}
};

export const userLogged = async () => {
	const user = auth.currentUser;
	try {
		if (user) {
			//get user data
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
		}
	} catch (error) {
		console.log(error);
	}
};

// ----------- EXERCISES ----------- //
export type Workout = {
	workoutId: string;
	name: string | null;
	userId: string;
	createdAt: number;
	exercises: Exercise[];
};

export const saveWorkout = async (
	exercises: Exercise[],
	createdAt: number,
	userId: string,
	name: string
) => {
	try {
		const batch = writeBatch(db);
		//set exercises
		exercises.forEach((exercise) => {
			const exerciseRef = doc(collection(db, 'exercises'));
			batch.set(exerciseRef, exercise);
		});
		//set workout
		const workoutRef = doc(collection(db, 'workouts'));
		const workoutObj: Workout = {
			exercises,
			createdAt,
			userId,
			name,
			workoutId: workoutRef.id,
		};
		batch.set(workoutRef, workoutObj);
		await batch.commit();
		return 'Data stored succesfully';
	} catch (error) {
		console.log(error);
		return 'Data couldnt be stored succesfully';
	}
};

export const updateDbWorkouts = async (workout: Workout) => {
	try {
		const workoutRef = doc(db, 'workouts', workout.workoutId);

		await updateDoc(workoutRef, workout);
		return 'Workout updated successfully';
	} catch (error) {
		console.log(error);
		return 'Error to updated';
	}
};

export const deleteDbWorkouts = async (workoutId: string) => {
	try {
		const workoutRef = doc(db, 'workouts', workoutId);

		await deleteDoc(workoutRef);
		return 'Workout deleted successfully';
	} catch (error) {
		console.log(error);
		return 'Error to delete';
	}
};

export const getUserWorkouts = async (userId: string) => {
	try {
		const workouts: Workout[] = [];
		const q = query(collection(db, 'workouts'), where('userId', '==', userId));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			workouts.push({
				name: doc.data().name,
				userId: doc.data().userId,
				createdAt: doc.data().createdAt,
				exercises: doc.data().exercises,
				workoutId: doc.data().workoutId,
			});
		});
		return workouts;
	} catch (error) {
		console.log(error);
	}
};

export type Suggestions = Exercise[];
export const getSuggestions = async (userId: string, exerciseName: string) => {
	if (!exerciseName) return [];
	try {
		const q = query(
			collection(db, 'exercises'),
			orderBy('name'),
			startAt(exerciseName),
			endAt(exerciseName + 'uf8ff')
		);

		const querySnapshot = await getDocs(q);
		const suggestions: Suggestions = [];

		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			const docData = {
				userId: doc.data().userId,
				name: doc.data().name,
				createdAt: doc.data().createdAt,
				sets: doc.data().sets,
				exerciseId: doc.data().exerciseId,
			};
			if (suggestions.some((el) => el.name === doc.data().name)) return;

			suggestions.push(docData);
		});
		return suggestions;
	} catch (error) {
		console.log(error);
	}
};

export const getExercise = async (userId: string, exerciseName: string) => {
	//get all exercises from the userId with the same name
	try {
		const q = query(
			collection(db, 'exercises'),
			where('userId', '==', userId),
			where('name', '==', exerciseName),
			orderBy('createdAt')
		);
		const exercises: Exercise[] = [];

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			exercises.push({
				name: doc.data().name,
				userId: doc.data().userId,
				createdAt: doc.data().createdAt,
				sets: doc.data().sets,
				exerciseId: doc.data().exerciseId,
			});
		});
		return exercises;
	} catch (error) {
		console.log(error);
	}
};
