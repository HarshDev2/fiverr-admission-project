<script>
	import { getDoc, getDocs, where, query, collection } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import Cookies from 'js-cookie';

	import {
		Button,
		Input,
		Modal,
		Alert,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	let serialNumber = '';
	let pin = '';

	let popupOpen = false;
	let restorePopupOpen = false;
	let infoOpen = false;

	let color = 'green';

	async function handlePayment() {
		let request = await fetch('/api/make-payment', {
			method: 'POST',
			body: JSON.stringify({
				clientReference: 'da' + Math.floor(Math.random() * 1000000)
			})
		});

		let response = await request.json();

		console.log(response);

		window.open(response.data.checkoutUrl, '_blank');
	}

	async function checkDetails() {
		let studentDocs = await getDocs(
			query(
				collection(db, 'students'),
				where('pin', '==', pin.toString()),
				where('serial', '==', serialNumber.toString())
			)
		);

		Cookies.set('serial', serialNumber);
		Cookies.set('pin', pin);

		if (studentDocs.empty) {
			popupOpen = true;
		} else {
			let student = studentDocs.docs[0].data();

			if (student.formFilled == true) {
				window.open('/placement/details');
				return;
			}
			window.open('/placement/form?serial=' + serialNumber + '&pin=' + pin);
		}
	}

	let index = '';

	async function sendPinAndSerial() {
		let studentDocs = await getDocs(
			query(collection(db, 'students'), where('index', '==', index.toString()))
		);

		console.log(studentDocs.docs.length)

		if (!studentDocs.empty) {
			let student = studentDocs.docs[0].data();

			if (student.pin && student.serial && student.guardian && student.guardian.phoneNumber) {
				await fetch('/api/send-message', {
					method: 'POST',
					body: JSON.stringify({
						phoneNumber: student.guardian.phoneNumber,
						content:
							'Your ward has requested for his/her serial number and pin. Serial: ' +
							student.serial +
							' Pin: ' +
							student.pin
					})
				});
			}
		}
	}
</script>

<div class="bg-background flex flex-col min-h-[100vh] items-center justify-center">
	<div
		class="flex flex-col min-h-[50vh] lg:min-h-[50vh] items-center p-8 rounded-md bg-muted-background"
	>
		{#if !infoOpen}
			<h1 class="text-2xl text-[#1aa841] font-semibold mb-4">PEKI SENIOR HIGH SCHOOL</h1>
			<img class="max-h-[20vh]" src={'/favicon.png'} alt="School Logo" />
			<h1 class="text-xl text-black mt-6 font-bold text-center">Applicant login</h1>
			<div class="w-4/5 mt-4 flex flex-col">
				<span class="text-[15px] my-1">Serial Number</span>
				<Input
					bind:value={serialNumber}
					color="green"
					defaultClass="w-full"
					placeholder="E.g. xxxxxxxx"
				/>
				<span class="text-[15px] mt-2">Pin</span>
				<Input
					type={'number'}
					bind:value={pin}
					color="green"
					defaultClass="w-full"
					placeholder="E.g. 1234"
				/>
			</div>
			<!-- <Alert color="green">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				slot="icon"
				class="shrink-0 w-4 h-4"
				role="img"
				aria-label="info circle solid"
				viewBox="0 0 20 20"
				><path
					fill="currentColor"
					d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
				></path></svg
			>

			Add the year you completed JHS.
		</Alert> -->
			<div class="mt-6 w-full flex flex-col items-center gap-2">
				<Button
					on:click={() => {
						restorePopupOpen = true;
					}}
					class="w-3/5"
					color="green">Restore Pin/Serial</Button
				>

				<Button
					on:click={() => {
						checkDetails();
					}}
					class="w-3/5"
					color="green">Login</Button
				>
			</div>
		{/if}

		<Modal title="Provide Index Number" bind:open={restorePopupOpen} size="sm" autoclose>
			<div class="text-base leading-relaxed">
				<span>Enter the index number.</span>
				<Input bind:value={index} color={'green'} />
			</div>
			<svelte:fragment slot="footer">
				<Button on:click={() => sendPinAndSerial()} color="green">Confirm</Button>
			</svelte:fragment>
		</Modal>

		<Modal title="Invalid Serial or Pin" bind:open={popupOpen} size="sm" autoclose>
			<div class="text-base leading-relaxed">
				The Serial number or PIN you entered is incorrect. Please check and try again.
			</div>
			<svelte:fragment slot="footer">
				<Button color="green">Confirm</Button>
			</svelte:fragment>
		</Modal>

		{#if infoOpen}
			<div class="flex flex-row">
				<div>
					<Table divClass="mt-4" hoverable={true}>
						<TableHead>
							<TableHeadCell>Name</TableHeadCell>
							<TableHeadCell>JOSEP GURDIOLA</TableHeadCell>
						</TableHead>

						<TableBody tableBodyClass="divide-y">
							<TableBodyRow>
								<TableBodyCell>Index Number</TableBodyCell>
								<TableBodyCell>908978/008</TableBodyCell>
							</TableBodyRow>
							<TableBodyRow>
								<TableBodyCell>PROGRAMME</TableBodyCell>
								<TableBodyCell>General Arts</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Gender</TableBodyCell>
								<TableBodyCell>Male</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Residence</TableBodyCell>
								<TableBodyCell>Boarding</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Aggretate</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>
						</TableBody>
					</Table>
				</div>
			</div>
			<Button on:click={handlePayment} class="w-fit mt-2 ml-2" color="green"
				>Buy Admission Voucher</Button
			>
			<Button class="w-fit mt-2 ml-2" color="green"
				>Login</Button
			>
		{/if}
	</div>
</div>
