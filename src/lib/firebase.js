import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
	apiKey: "AIzaSyCL9xXhWmBG1wo6oJ2elWMNacd3cKh6pUM",
	authDomain: "fiverr-pesco.firebaseapp.com",
	projectId: "fiverr-pesco",
	storageBucket: "fiverr-pesco.appspot.com",
	messagingSenderId: "825614341525",
	appId: "1:825614341525:web:ddc27488a15081eb66d29c"
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
