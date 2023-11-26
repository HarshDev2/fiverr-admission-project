import { redirect } from '@sveltejs/kit';
import { getDocs, query, collection, where, getDoc } from 'firebase/firestore';
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

    let houses = [];
    let housesDocs = await getDocs(collection(db, 'houses'));
    housesDocs.docs.forEach((doc) => {
        houses.push(doc.data());
    });
    
    let house1;

    houses.forEach((house) => {
        if(house.id == student.house) {
            house1 = house;
        }
    });

    console.log(houses, student.house);

    return {
        student,
        house: house1
    }
}
