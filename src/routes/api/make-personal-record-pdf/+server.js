import { json } from '@sveltejs/kit';
import { PDFDocument, rgb } from 'pdf-lib';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage, db } from '$lib/firebase.js';
import { getDoc, getDocs, collection, where, query, doc, updateDoc } from 'firebase/firestore';
import { generateRandomToken } from '$utils/generateRandomToken.js';

export async function POST({ request }) {
	let data = await request.json();
	let url = new URL(request.url);

	let downloadUrl;

	let studentDoc = await getDoc(doc(db, 'students', data.studentId));
	let student = studentDoc.data();

	if (student.personalRecordPdfUrl) {
		console.log(student.personalRecordPdfUrl);
		downloadUrl = student.personalRecordPdfUrl;
	} else {
		const response = await fetch('http://localhost:5173/personal-record.pdf');
		const existingPdfBytes = await response.arrayBuffer();

		let houses = [];
		let housesDocs = await getDocs(collection(db, 'houses'));
		housesDocs.docs.forEach((doc) => {
			houses.push(doc.data());
		});
		
		let house1;
	
		houses.forEach((house) => {
			if(house.id == student.house) {
				house1 = house;
			}
		});

		const pdfDoc = await PDFDocument.load(existingPdfBytes);

		const pages = pdfDoc.getPages();
		const firstPage = pages[0];

		const imgResponse = await fetch(student.pic);
		const imgBytes = await imgResponse.arrayBuffer();

		let image;

		try {
			image = await pdfDoc.embedPng(imgBytes);
		} catch (e) {
			image = await pdfDoc.embedJpg(imgBytes);
		}

		// Position and dimensions for the image
		const imageX = 305; // Adjust as needed
		const imageY = 665; // Adjust as needed
		const imageWidth = 70; // Adjust as needed
		const imageHeight = 80; // Adjust as needed

		firstPage.drawImage(image, {
			x: imageX,
			y: imageY,
			width: imageWidth,
			height: imageHeight
		});

		let titles = [
			'Name',
			'Index Number',
			'Programme',
			'Class',
			'Gender',
			'Religion',
			'Status',
			'House',
			'Aggregate',
			'Admission Date',
			'Admission Number',
			'Bece Year',
			"Guardian's Name",
			'Relation',
			'Occupation',
			'Nationality',
			'Residence',
		];

		let values = [
			student.name,
			student.index,
			student.programme,
			student.class,
			student.gender,
			student.religion,
			student.status,
			house1.name,
			student.aggregate,
			student.admissionDate,
			student.admissionNumber,
			student.beceYear,
			student.guardian.name,
			student.guardian.relation,
			student.guardian.occupation,
			student.nationality,
			student.presentAddress,
		];

		titles.forEach((title, index) => {
			if(!title){
				console.log(index)
			}
			firstPage.drawText(title.toString(), {
				x: 100,
				y: 551 - index * 15.2,
				size: 11,
				color: rgb(0, 0, 0)
			});
		});

		values.forEach((value, index) => {
			if(!value) {
				console.log(index)
			} else {
				firstPage.drawText(value.toString(), {
					x: 260,
					y: 551 - index * 15.2,
					size: 11,
					color: rgb(0, 0, 0)
				});
			}
		});

		const pdfBytes = await pdfDoc.save();

		let storageRef = ref(storage, 'admissions/' + generateRandomToken(24) + ".pdf");

		await uploadBytes(storageRef, pdfBytes).then((snapshot) => {
			console.log('Uploaded a blob or file!');
		});

		downloadUrl = await getDownloadURL(storageRef);

		await updateDoc(studentDoc.ref, {
			personalRecordPdfUrl: downloadUrl
		});
	}

	return json({ success: true, link: downloadUrl });
}
