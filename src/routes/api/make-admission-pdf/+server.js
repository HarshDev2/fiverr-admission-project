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

	if (student.admissionPdfUrl) {
		console.log(student.admissionPdfUrl);
		downloadUrl = student.admissionPdfUrl;
	} else {
		const response = await fetch(url.origin + '/admission2.pdf');
		const existingPdfBytes = await response.arrayBuffer();

		let houses = [];
		let housesDocs = await getDocs(collection(db, 'houses'));
		housesDocs.docs.forEach((doc) => {
			houses.push(doc.data());
		});

		let classes = [];
		let classesDocs = await getDocs(collection(db, 'classes'));
		classesDocs.docs.forEach((doc) => {
			classes.push(doc.data());
		});

		let class1;
		let house1;
	
		houses.forEach((house) => {
			if(house.id == student.house) {
				house1 = house;
			}
		});

		classes.forEach((class2) => {
			if(class2.id == student.class) {
				class1 = class2;
			}
		});

		console.log(house1);
		console.log(class1);

		const pdfDoc = await PDFDocument.load(existingPdfBytes);

		const pages = pdfDoc.getPages();
		const firstPage = pages[0];

		const imgUrl = student.pic;
		const imgResponse = await fetch(imgUrl);
		const imgBytes = await imgResponse.arrayBuffer();

		let image;

		try {
			image = await pdfDoc.embedPng(imgBytes);
		} catch (e) {
			image = await pdfDoc.embedJpg(imgBytes);
		}

		// Position and dimensions for the image
		const imageX = 420; // Adjust as needed
		const imageY = 520; // Adjust as needed
		const imageWidth = 100; // Adjust as needed
		const imageHeight = 110; // Adjust as needed

		// Draw the image on the first page
		firstPage.drawImage(image, {
			x: imageX,
			y: imageY,
			width: imageWidth,
			height: imageHeight
		});

		firstPage.drawText(student.name, {
			x: 170,
			y: 611,
			size: student.name.length > 15 ? 9 : 11,
			color: rgb(0, 0, 0)
		});

		firstPage.drawText(student.index, {
			x: 170,
			y: 595,
			size: 11,
			color: rgb(0, 0, 0)
		});

		firstPage.drawText(student.programme, {
			x: 170,
			y: 580,
			size: 11,
			color: rgb(0, 0, 0)
		});

		if(class1){
			firstPage.drawText(class1.name, {
				x: 170,
				y: 565,
				size: 11,
				color: rgb(0, 0, 0)
			});
		}

		firstPage.drawText(student.gender, {
			x: 170,
			y: 550,
			size: 11,
			color: rgb(0, 0, 0)
		});

		firstPage.drawText(student.status, {
			x: 170,
			y: 535,
			size: 11,
			color: rgb(0, 0, 0)
		});

		// Agretatte

		firstPage.drawText(house1.name, {
			x: 170,
			y: 520,
			size: 11,
			color: rgb(0, 0, 0)
		});

		firstPage.drawText(student.aggregate, {
			x: 170,
			y: 505,
			size: 11,
			color: rgb(0, 0, 0)
		});

		firstPage.drawText(student.admissionNumber, {
			x: 170,
			y: 489,
			size: 11,
			color: rgb(0, 0, 0)
		});

		const pdfBytes = await pdfDoc.save();

		let storageRef = ref(storage, 'admissions/' + generateRandomToken(24) + ".pdf");

		await uploadBytes(storageRef, pdfBytes).then((snapshot) => {
			console.log('Uploaded a blob or file!');
		});

		downloadUrl = await getDownloadURL(storageRef);

		await updateDoc(studentDoc.ref, {
			admissionPdfUrl: downloadUrl
		});
	}

	return json({ success: true, link: downloadUrl });
}
