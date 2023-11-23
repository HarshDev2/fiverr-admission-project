<script>
	import {
		Button,
		Input,
		Modal,
		Select,
		Alert,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		Label,
		TableHeadCell,
		Checkbox,
		Radio,
		RadioButton
	} from 'flowbite-svelte';
	let number = '';

	let popupOpen = false;
	let infoOpen = true;

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

	let formData = {
		haveMedicalCondition: false
	};

	$: {
		console.log(formData);
	}
</script>

<div class="bg-background text-white flex flex-col min-h-[100vh] py-4 items-center justify-center">
	<div class="flex flex-col min-h-[50vh] lg:min-h-[50vh] p-8 rounded-md bg-muted-background">
		<h1 class="text-2xl text-[#1aa841] font-semibold mb-4">Student Details</h1>

		<div class="mt-2 flex flex-col-reverse md:flex-row gap-4 justify-between">
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
								<TableBodyCell>Gender</TableBodyCell>
								<TableBodyCell>Male</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Aggretate</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Programme</TableBodyCell>
								<TableBodyCell>Arts</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Class</TableBodyCell>
								<TableBodyCell>General Arts</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Residence</TableBodyCell>
								<TableBodyCell>Boarding</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>House</TableBodyCell>
								<TableBodyCell>Boys House 1	</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>House Capacity</TableBodyCell>
								<TableBodyCell>44</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>House Occupancy</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>NHIS No</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Number</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Email</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Present Address</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Nationality</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Home Town</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Religion</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>Previous JHS</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							<TableBodyRow>
								<TableBodyCell>BECE year</TableBodyCell>
								<TableBodyCell>12</TableBodyCell>
							</TableBodyRow>

							
						</TableBody>
					</Table>
				</div>
				<div>
					<img class="ml-2" src="/student.png" alt="" />
				</div>
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
		<div class="mt-6 w-full flex flex-col items-center md:flex-row gap-2">
			<Button
				on:click={() => {
					if (number == '99') {
						infoOpen = true;
					} else {
						popupOpen = true;
					}
				}}
				class="w-3/5 whitespace-nowrap"
				color="green">Download Admission Letter</Button
			>
			<Button
				on:click={() => {
					if (number == '99') {
						infoOpen = true;
					} else {
						popupOpen = true;
					}
				}}
				class="w-3/5 whitespace-nowrap"
				color="green">Download Personal Record</Button
			>

			<Button
				on:click={() => {
					if (number == '99') {
						infoOpen = true;
					} else {
						popupOpen = true;
					}
				}}
				class="w-3/5 whitespace-nowrap"
				color="green">Download Prospectus</Button
			>
		</div>
	</div>
</div>
