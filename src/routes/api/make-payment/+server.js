import { generateRandomToken } from '$utils/generateRandomToken.js';
import { json } from '@sveltejs/kit';
import api from 'api';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '$lib/firebase.js';

export async function POST({ request }) {

    let requestData = await request.json();
	let url = new URL(request.url);

	let payment = await addDoc(collection(db, 'payments'), {
		student: requestData.student
	});

	console.log(payment.id);

	let schoolDetailsDoc = await getDoc(doc(db, 'school', 'details'));
	let schoolDetails = schoolDetailsDoc.data();

	console.log(schoolDetails);

	let request1 = await fetch('https://payproxyapi.hubtel.com/items/initiate', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: 'Basic ' + btoa('2oyn1P' + ':' + '48fee06220b14464a56f33301be74eff'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			totalAmount: schoolDetails.ticketPrice,
			description: 'Payment for admission voucher.',
			callbackUrl: url.origin + '/api/payment/webhook',
			returnUrl: url.origin + '/placement/login',
			cancellationUrl: url.origin + '/placement',
			merchantAccountNumber: '2018421',
			clientReference: payment.id
		})
	});

    let data = await request1.json();

	return json({
		data: data.data
	});
}
