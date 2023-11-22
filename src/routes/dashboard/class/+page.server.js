import { db } from "$lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { where } from "firebase/firestore";

export async function load(){
    let classes = [];
    let programmes = [];

    let classDocs = await getDocs(collection(db, "classes"));
    for (let i = 0; i < classDocs.size; i++) {
        let schoolClass = classDocs.docs[i].data();
        
        let students = await getDocs(query(collection(db, "students"), where("class", "==", schoolClass.id)));
        schoolClass.noOfStudents = students.size;

        classes.push(schoolClass);
    }



    let programmeDocs = await getDocs(collection(db, "programmes"));
    programmeDocs.forEach((doc) => {
        programmes.push(doc.data());
    });

    return { 
        classes,
        programmes
    }
}