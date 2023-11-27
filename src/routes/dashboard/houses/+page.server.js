import { db } from '$lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { where } from 'firebase/firestore';

export async function load() {
	let houses = [];
	let programmes = [];

	let houseDocs = await getDocs(collection(db, 'houses'));

	for (let i = 0; i < houseDocs.size; i++) {
		let house = houseDocs.docs[i].data();
		house._id = houseDocs.docs[i].id;

		let students = await getDocs(query(collection(db, 'students'), where('house', '==', house.id)));
		house.noOfStudents = students.size;

		houses.push(house);
	}

	return {
		houses
	};
}
