import { redirect } from '@sveltejs/kit';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '$lib/firebase.js';

export async function load({ params }){
    let id = params.id;
    let classes = [];

    if(id != "99") throw redirect(302, '/placement');

    let classDocs = await getDocs(collection(db, "classes"));
    for (let i = 0; i < classDocs.size; i++) {
        let schoolClass = classDocs.docs[i].data();
        
        let students = await getDocs(query(collection(db, "students"), where("class", "==", schoolClass.id)));
        schoolClass.noOfStudents = students.size;

        classes.push(schoolClass);
    };

    let houses = [];
    let houseDocs = await getDocs(collection(db, "houses"));
    houseDocs.forEach((doc) => {
        houses.push(doc.data());
    });



    return {
        classes,
        houses
    }
}