import { db } from "$lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function load(){
    let students = [];

    let studentDocs = await getDocs(collection(db, "students"));
    studentDocs.forEach((doc) => {
        students.push(doc.data());
    });

    return { 
        students
    }
}