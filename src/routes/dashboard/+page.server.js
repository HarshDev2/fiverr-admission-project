import { db } from "$lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function load(){
    let students = [];

    let studentDocs = await getDocs(collection(db, "students"));
    studentDocs.forEach((doc) => {
        students.push(doc.data());
    });

    let counts = {
        maleStudents: 0,
        femaleStudents: 0,
        otherStudents: 0,
        totalStudents: 0
    }

    counts.totalStudents = students.length;

    students.forEach((student) => {
        if(student.gender == "male"){
            counts.maleStudents++;
        } else if(student.gender == "female"){
            counts.femaleStudents++;
        } else {
            counts.otherStudents++;
        }
    });
    
    console.log(counts);

    return { 
        students,
        counts
    }
}