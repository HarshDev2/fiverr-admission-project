import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from './credentials.json';

let app;
if (getApps().length == 0) {
	app = initializeApp({
		credential: cert(serviceAccount),
		databaseURL: 'https://truthsager-84fa3.firebaseio.com'
	});
} else {
	app = getApp();
}

app.auth = () => getAuth();

export { app };