import { getDoc, getDocs, doc, updateDoc, collection, where } from 'firebase/firestore';
import { db } from '$lib/firebase.js';

export async function POST({ cookies, request }) {
	let data = await request.json();

	if (data.Data.Status == 'Success') {
		console.log(data.Data.CheckoutId);

		let paymentDoc = await getDoc(doc(db, 'payments', data.Data.ClientReference));
		let payment = paymentDoc.data();
		payment.id = paymentDoc.id;

		if (payment) {
			let pin = Math.floor(1000 + Math.random() * 9000);

			function generateTenDigitNumber() {
				const part1 = Math.floor(1000 + Math.random() * 9000);
				const part2 = Math.floor(1000 + Math.random() * 9000);
				const part3 = Math.floor(10 + Math.random() * 90);

				return '' + part1 + part2 + part3;
			}

			let serialNo = generateTenDigitNumber();

			let studentDoc = await getDoc(doc(db, "students", payment.student));
			let student = studentDoc.data();

			console.log(student);

			await updateDoc(studentDoc.ref, {
				paymentCompleted: true,
				paymentId: payment.id,
				pin: pin,
				serial: serialNo
			});
		} else {
			console.log('Payment not found');
		}
	}
}
