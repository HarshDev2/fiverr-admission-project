import { redirect } from '@sveltejs/kit';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '$lib/firebase.js';

export async function load({ cookies }) {
	let serialNo = cookies.get('serial');
	let pin = cookies.get('pin');

    if(!serialNo || !pin) {
        throw redirect(302, '/placement/login');
    }

	let studentDocs = await getDocs(
		query(
			collection(db, 'students'),
			where('serial', '==', serialNo.toString()),
			where('pin', '==', pin.toString())
		)
	);

    if(studentDocs.empty) {
        throw redirect(302, '/placement/login');
    }

    let student = studentDocs.docs[0].data();
    student.id = studentDocs.docs[0].id;

    if(!student.formFilled) {
        throw redirect(302, `/placement/form?pin=${student.pin}&serial=${student.serial}`);
    }

    console.log(student);

    return {
        student
    }
}
