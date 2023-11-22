import { db } from '$lib/firebase.js';
import { redirect } from '@sveltejs/kit';
import { getDocs, query, collection, where } from 'firebase/firestore';

export async function load({ cookies }){
    let token = cookies.get('token');

    if(!token) throw redirect(302, '/login');

    let adminDoc = await getDocs(query(collection(db, "admins"), where("token", "==", token)));
    if (adminDoc.empty) {
        throw redirect(302, '/login');
    }
    else return {
        admin: adminDoc.docs[0].data()
    }
}