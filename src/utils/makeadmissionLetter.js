import fs from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../lib/firebase.js';

export async function makeAdmissionLetter(pdfPath, text, x, y) {

    const response = await fetch('http://localhost:5173/admission2.pdf');
    const existingPdfBytes = await response.arrayBuffer();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawText('Name', {
        x: 170,
        y: 611,
        size: 11,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText('Index Number', {
        x: 170,
        y: 595,
        size: 11,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText('Programme', {
        x: 170,
        y: 580,
        size: 11,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText('Class', {
        x: 170,
        y: 565,
        size: 11,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText('Gender', {
        x: 170,
        y: 550,
        size: 11,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText('Residence', {
        x: 170,
        y: 535,
        size: 11,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText('AGGRETATE', {
        x: 170,
        y: 520,
        size: 11,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText('RAW SCORE', {
        x: 170,
        y: 505,
        size: 11,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText('ADMISSION NO.', {
        x: 170,
        y: 489,
        size: 11,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    let storageRef = ref(storage, 'admissions/' + 'output.pdf');

    await uploadBytes(storageRef, pdfBytes).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    });

    await getDownloadURL(storageRef).then((url) => {
        console.log(url);
    });
}

makeAdmissionLetter()
