import fs from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';

const response = await fetch('http://localhost:5173/admission2.pdf');
const existingPdfBytes = await response.arrayBuffer();

const pdfDoc = await PDFDocument.load(existingPdfBytes);

const pages = pdfDoc.getPages();
const firstPage = pages[0];

const imgUrl =
	'https://firebasestorage.googleapis.com/v0/b/fiverr-pesco.appspot.com/o/students_pics%2F17008203916051700820245467test_pic_student.png?alt=media&token=57dee699-f7ab-4890-b55a-9a0476f73e36';
const imgResponse = await fetch(imgUrl);
const imgBytes = await imgResponse.arrayBuffer();

// Embed the image in the PDF
const image = await pdfDoc.embedPng(imgBytes); // Assuming the image is a PNG

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

let student = {
	name: 'Test Student',
	index: '170082039',
	programme: 'BSc. Computer Science',
	class: '4',
	gender: 'Male',
	status: 'Regular',
	house: 'Yellow',
	aggregate: '12',
	admissionNumber: '170082039'
};

firstPage.drawText(student.name, {
	x: 170,
	y: 611,
	size: 11,
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

firstPage.drawText(student.class, {
	x: 170,
	y: 565,
	size: 11,
	color: rgb(0, 0, 0)
});

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

firstPage.drawText(student.house, {
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

fs.writeFileSync('output.pdf', pdfBytes);
