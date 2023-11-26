import { getDoc, getDocs, doc, updateDoc, collection, where } from 'firebase/firestore';
import { db } from '$lib/firebase.js';
import { json } from '@sveltejs/kit';

export async function POST({ cookies, request }) {
	let data = await request.json();

	let url = new URL(request.url);

	if (data.Data.Status == 'Success') {
		

		let paymentDoc = await getDoc(doc(db, 'payments', data.Data.ClientReference));
		let payment = paymentDoc.data();
		payment.id = paymentDoc.id;

		if (payment) {
			let pin = Math.floor(10000 + Math.random() * 90000);

			function generateSevenDigitNumber() {
				const part1 = Math.floor(1000 + Math.random() * 9000);
				const part2 = Math.floor(100 + Math.random() * 900);

				return '' + part1 + part2;
			}

			let serialNo = generateSevenDigitNumber();

			let studentDoc = await getDoc(doc(db, 'students', payment.student));
			let student = studentDoc.data();

			
			await updateDoc(studentDoc.ref, {
				paymentCompleted: true,
				paymentId: payment.id,
				pin: pin.toString(),
				serial: serialNo
			});

			let request2 = await fetch(
				'https://sms.hubtel.com/v1/messages/send?clientsecret=ulapfgeb&clientid=gukisadt&from=PekiSHS&to=' +
					student.guardian.phoneNumber +
					'&content=' +
					`Your online application payment was successful. Your PIN is ${pin} and your serial number is ${serialNo}.`
			);

		} else {
			console.log('Payment not found');
		}
	}

	return json({
		success: true
	})
}
