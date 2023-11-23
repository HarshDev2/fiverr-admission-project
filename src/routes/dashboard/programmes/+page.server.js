import { db } from '$lib/firebase';
import { collection, getDocs, where, query } from 'firebase/firestore';

export async function load() {
	let programmes = [];

	let programmeDocs = await getDocs(collection(db, 'programmes'));
	for (let i = 0; i < programmeDocs.size; i++) {
		let programme = programmeDocs.docs[i].data();

		let students = await getDocs(
			query(collection(db, 'students'), where('programme', '==', programme.id))
		);

		programme.noOfStudents = students.size;
		programmes.push(programme);
	}

	return {
		programmes
	};
}
