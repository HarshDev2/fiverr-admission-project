import { getDoc, getDocs, doc, updateDoc, collection, where } from 'firebase/firestore';
import { db } from '$lib/firebase.js';

export async function POST({ cookies, request }) {
	let data = await request.json();

	let url = new URL(request.url);

	if (data.Data.Status == 'Success') {
		console.log(data.Data.CheckoutId);

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

			console.log(student);

			await updateDoc(studentDoc.ref, {
				paymentCompleted: true,
				paymentId: payment.id,
				pin: pin.toString(),
				serial: serialNo
			});

			await fetch("https://admission.pekishs.com/api/send-message", {
				method: "POST",
				body: JSON.stringify({
					phoneNumber: student.guardian.phoneNumber.toString(),
					message: `Your admission fee payment was successful. Your PIN is ${pin} and your serial number is ${serialNo}.`
				})
			});

		} else {
			console.log('Payment not found');
		}
	}
}
