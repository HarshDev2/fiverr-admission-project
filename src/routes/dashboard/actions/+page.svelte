<script lang="ts">
	import { db } from '$lib/firebase.js';
	import {
		updateDoc,
		doc,
		addDoc,
		collection,
		setDoc,
		getDocs,
		query,
		where
	} from 'firebase/firestore';
	import { Button, Fileupload, Input, Label } from 'flowbite-svelte';
	import { Modal } from 'flowbite-svelte';

	export let data;

	let oldPassword: string;
	let newPassword: string;
	let confirmPassword: string;

	let errorModalOpened = false;
	let error = '';

	async function updatePassword() {
		if (oldPassword !== data.admin.password) {
			errorModalOpened = true;
			error = 'Incorrect old password';
		} else if (
			!newPassword ||
			!confirmPassword ||
			newPassword.length <= 0 ||
			confirmPassword.length <= 0
		) {
			errorModalOpened = true;
			error = 'Password cannot be empty';
		} else if (newPassword !== confirmPassword) {
			errorModalOpened = true;
			error = 'Passwords do not match';
		}

		await updateDoc(doc(db, 'admins', data.admin.id), {
			password: newPassword
		});
	}

	function parseCSV(csvData: any) {
		const lines = csvData.split('\n');
		const result = [];
		const headers: any = lines[0].split(',');

		for (let i = 1; i < lines.length; i++) {
			let obj: any = {};
			let currentline = lines[i].split(',');

			for (let j = 0; j < headers.length; j++) {
				obj[headers[j]] = currentline[j];
			}

			result.push(obj);
		}

		return result; // This returns an array of objects
	}

	function handleFileUpload(event: any) {
		console.log(event);
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = async function (e) {
			const text = e.target.result;
			const data = parseCSV(text); // Use the parseCSV function from above
			console.log(data);
			for (let i = 0; i < data.length; i++) {
				console.log(
					data[i].Aggregate,
					data[i].Name,
					data[i].Index,
					data[i].Programme,
					data[i].Status,
					data[i].Track
				);

				await addDoc(collection(db, 'students'), {
					aggregate: data[i].Aggregate,
					name: data[i].Name,
					index: data[i].Index,
					programme: data[i].Programme,
					status: data[i].Status,
					track: data[i].Track,
				});

				await fetch("/send-message", {
					method: "POST",
					body: JSON.stringify({
						message: "Your ward has been admitted to Peki Senior High School. His/Her index number is" + data[i].Index + ". Please visit https://admission.pekishs.com/placement to continue the admission process.",
						phoneNumber: data[i].Contact
					})
				})
			}
		};

		reader.readAsText(file);
	}

	let ticketPrice = 0;

	async function setNewPrice() {
		await setDoc(doc(db, 'school', 'details'), {
			ticketPrice
		});
	}

	let messageToSend;

	async function sendMessagesToApplicants() {
		const students = await getDocs(query(collection(db, 'students')));
		students.docs.forEach(async (student) => {
			student = student.data();

			if (!student.paymentStatus && student.guardian && student.guardian.phoneNumber) {
				await fetch('/api/send-message', {
					method: 'POST',
					body: JSON.stringify({
						message: messageToSend,
						phoneNumber: student.guardian.phoneNumber
					})
				});
			}
		});
	}
</script>

<div class="px-12 py-8">
	<div class="bg-white p-4 rounded-md">
		<h1 class="text-xl font-semibold">Actions</h1>

		<div class="mt-2">
			<Label class="block mb-2">Upload Index Numbers</Label>
			<Fileupload on:change={handleFileUpload} />
		</div>
	</div>

	<div class="bg-white p-4 mt-4 rounded-md">
		<h2 class="text-xl font-semibold">Details</h2>

		<div class="mt-2">
			<Label class="block mb-2">Admission Ticket Price</Label>
			<Input bind:value={ticketPrice} type="number" color="green" />
		</div>

		<Button class="mt-2" on:click={setNewPrice} color="green">Save Price</Button>

		<div class="mt-4">
			<Label class="block mb-2">Message</Label>
			<Input color="green" />
		</div>

		<Button class="mt-2" on:click={updatePassword} color="green">Save Message</Button>

		<div class="mt-4">
			<Label class="block mb-2">Message to send to applicants.</Label>
			<Input bind:value={messageToSend} color="green" />
		</div>

		<div class="">
			<Button class="mt-2" on:click={sendMessagesToApplicants} color="green">Send</Button>
		</div>
	</div>
</div>
<Modal title="Incorrect Details" bind:open={errorModalOpened} autoclose outsideclose>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{error}</p>
	<svelte:fragment slot="footer">
		<Button
			color={'green'}
			on:click={() => {
				errorModalOpened = false;
				error = '';
			}}>Confirm</Button
		>
	</svelte:fragment>
</Modal>
