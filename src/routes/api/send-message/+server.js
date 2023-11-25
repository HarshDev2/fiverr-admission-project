import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	let requestData = await request.json();

	await fetch(
		'https://sms.hubtel.com/v1/messages/send?clientsecret=ulapfgeb&clientid=gukisadt&from=Pekisec&to=' +
			requestData.phoneNumber +
			'&content=' +
			requestData.message
	);

	return json({ success: true, message: 'Message sent successfully' });
}
