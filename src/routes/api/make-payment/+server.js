import { json } from '@sveltejs/kit';
import api from 'api';

export async function POST({ request }) {

    let requestData = await request.json();

	// let hubtle = api('@hubtel/v1.0#15dkgclna41gzg');

	// hubtle.auth('2oyn1P', '48fee06220b14464a56f33301be74eff');
	// hubtle
	// 	.onlineCheckout({
	// 		totalAmount: 100,
	// 		description: 'hello',
	// 		callbackUrl: 'http://localhost:5173/placement',
	// 		returnUrl: 'http://localhost:5173/placement',
	// 		cancellationUrl: 'http://localhost:5173/placement',
	// 		merchantAccountNumber: 'dwadwdwaa',
	// 		clientReference: 'dwa'
	// 	})
	// 	.then(({ data }) => console.log(data))
	// 	.catch((err) => console.error(err));

    console.log(requestData);

	let request1 = await fetch('https://payproxyapi.hubtel.com/items/initiate', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: 'Basic ' + btoa('2oyn1P' + ':' + '48fee06220b14464a56f33301be74eff'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			totalAmount: 0.1,
			description: 'hello',
			callbackUrl: 'http://localhost:5173/placement',
			returnUrl: 'http://localhost:5173/placement',
			cancellationUrl: 'http://localhost:5173/placement',
			merchantAccountNumber: '2018421',
			clientReference: requestData.clientReference
		})
	});

    let data = await request1.json();

	return json({
		data: data.data
	});
}
