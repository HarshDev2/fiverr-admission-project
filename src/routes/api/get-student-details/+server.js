import { json } from '@sveltejs/kit';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase.js';

export async function POST({ request }) {
	let requestData = await request.json();

	let studentDocs = await getDocs(
		query(collection(db, 'students'), where('index', '==', requestData.student))
	);

	if (!studentDocs.empty) {
		let student = studentDocs.docs[0].data();
        student.id = studentDocs.docs[0].id;
        
		return json({
			success: true,
			student
		});
	} else {
		return json({
			success: false
		});
	}
}
