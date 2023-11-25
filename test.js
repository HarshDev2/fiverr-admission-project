import fs from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';

const response = await fetch('http://localhost:5173/personal-record.pdf');
const existingPdfBytes = await response.arrayBuffer();

const pdfDoc = await PDFDocument.load(existingPdfBytes);

const pages = pdfDoc.getPages();
const firstPage = pages[0];

console.log(
	'https://firebasestorage.googleapis.com/v0/b/fiverr-pesco.appspot.com/o/students_pics%2F26008203916052600820245467test_pic_student.png?alt=media&token=57dee699-f7ab-4890-b55a-9a0476f73e36' ==
	'https://firebasestorage.googleapis.com/v0/b/fiverr-pesco.appspot.com/o/students_pics%2F17008203916051700820245467test_pic_student.png?alt=media&token=57dee699-f7ab-4890-b55a-9a0476f73e36'
);

const imgUrl =
	'https://firebasestorage.googleapis.com/v0/b/fiverr-pesco.appspot.com/o/students_pics%2F17008203916051700820245467test_pic_student.png?alt=media&token=57dee699-f7ab-4890-b55a-9a0476f73e36';
const imgResponse = await fetch(imgUrl);
const imgBytes = await imgResponse.arrayBuffer();

// Embed the image in the PDF
const image = await pdfDoc.embedPng(imgBytes); // Assuming the image is a PNG

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

let student = {
	name: 'Test Student',
	index: '260082039',
	programme: 'BSc. Computer Science',
	class: '4',
	gender: 'Male',
	status: 'Regular',
	house: 'Yellow',
	aggregate: '12',
	admissionNumber: '260082039'
};

let titles = [
	'Name',
	'Index Number',
	'Programme',
	'Class',
	'Gender',
	'Status',
	'House',
	'Aggregate',
	'Admission Number'
];

titles.forEach((title, index) => {
	firstPage.drawText(title, {
		x: 100,
		y: 551 - index * 15,
		size: 11,
		color: rgb(0, 0, 0)
	});
});

firstPage.drawText(student.name, {
	x: 260,
	y: 551,
	size: 11,
	color: rgb(0, 0, 0)
});

firstPage.drawText(student.index, {
	x: 260,
	y: 535,
	size: 11,
	color: rgb(0, 0, 0)
});

firstPage.drawText(student.programme, {
	x: 260,
	y: 520,
	size: 11,
	color: rgb(0, 0, 0)
});

firstPage.drawText(student.class, {
	x: 260,
	y: 505,
	size: 11,
	color: rgb(0, 0, 0)
});

firstPage.drawText(student.gender, {
	x: 260,
	y: 490,
	size: 11,
	color: rgb(0, 0, 0)
});

firstPage.drawText(student.status, {
	x: 260,
	y: 475,
	size: 11,
	color: rgb(0, 0, 0)
});

// Agretatte

firstPage.drawText(student.house, {
	x: 260,
	y: 460,
	size: 11,
	color: rgb(0, 0, 0)
});

firstPage.drawText(student.aggregate, {
	x: 260,
	y: 445,
	size: 11,
	color: rgb(0, 0, 0)
});

firstPage.drawText(student.admissionNumber, {
	x: 260,
	y: 429,
	size: 11,
	color: rgb(0, 0, 0)
});

const pdfBytes = await pdfDoc.save();

fs.writeFileSync('output.pdf', pdfBytes);
