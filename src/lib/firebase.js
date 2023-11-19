import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
	apiKey: 'AIzaSyAFdciWOnyOk-TItJW9E-jpCwpJ7vFqMCA',
	authDomain: 'truthsager-84fa3.firebaseapp.com',
	projectId: 'truthsager-84fa3',
	storageBucket: 'truthsager-84fa3.appspot.com',
	messagingSenderId: '379810349352',
	appId: '1:379810349352:web:c15d6180755ed04436901d',
	measurementId: 'G-D5B4GT070P'
};

let app;

if (getApps().length == 0) {
	app = initializeApp(firebaseConfig);
} else {
	app = getApp();
}

export { app };
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
