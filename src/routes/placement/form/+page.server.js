import { redirect } from '@sveltejs/kit';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '$lib/firebase.js';

export async function load({ params, url }) {
	let id = params.id;
	let classes = [];
	let student;

	let serial = url.searchParams.get('serial');
	let pin = url.searchParams.get('pin');

	if (!serial || !pin) throw redirect(302, '/placement');

	console.log(serial, pin);

	let serialDoc = await getDocs(query(collection(db, 'students'), where('serial', '==', serial), where('pin', '==', pin)));

    if(serialDoc.empty){
		throw redirect(302, '/placement/login');
	} else {
		student = serialDoc.docs[0].data();
		student.id = serialDoc.docs[0].id;
	}

	let classDocs = await getDocs(collection(db, 'classes'));
	for (let i = 0; i < classDocs.size; i++) {
		let schoolClass = classDocs.docs[i].data();

		let students = await getDocs(
			query(collection(db, 'students'), where('class', '==', schoolClass.id))
		);
		schoolClass.noOfStudents = students.size;

		classes.push(schoolClass);
	}

	let houses = [];
	let houseDocs = await getDocs(collection(db, 'houses'));
	houseDocs.forEach((doc) => {
		houses.push(doc.data());
	});

	return {
		student,
		classes,
		houses
	};
}
