import { db } from "$lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function load(){
    let students = [];

    let studentDocs = await getDocs(collection(db, "students"));
    studentDocs.forEach((doc) => {
        let student = doc.data();
        student.id = doc.id;
        students.push(student);
    });

    let counts = {
        maleStudents: 0,
        femaleStudents: 0,
        otherStudents: 0,
        totalStudents: 0
    }

    counts.totalStudents = students.length;

    students.forEach((student) => {
        if(student.formFilled && student.gender.toLowerCase() == "male"){
            counts.maleStudents++;
        } else if(student.formFilled && student.gender.toLowerCase() == "female"){
            counts.femaleStudents++;
        } else if(student.formFilled && student.gender.toLowerCase() == "other") {
            counts.otherStudents++;
        }
    });
    
    console.log(counts);

    return { 
        students,
        counts
    }
}