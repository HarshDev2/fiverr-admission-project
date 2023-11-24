<script>
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
	let number = '';

	let popupOpen = false;
	let infoOpen = false;

	let color = 'green';

	let studentData;

	async function handlePayment() {
		let request = await fetch('/api/make-payment', {
			method: 'POST',
			body: JSON.stringify({
				student: studentData.id
			})
		});

		let response = await request.json();

		console.log(response);

		window.open(response.data.checkoutUrl, '_blank');
	}


	async function getStudentDetails(){
		let request = await fetch('/api/get-student-details', {
			method: 'POST',
			body: JSON.stringify({
				student: number
			})
		});

		let response = await request.json();

		if(response.success){
			studentData = response.student;
			infoOpen = true;
		} else {
			popupOpen = true;
		}

		console.log(response);
	}
</script>

<div class="bg-background flex flex-col min-h-[100vh] items-center justify-center">
	<div
		class="flex flex-col min-h-[50vh] lg:min-h-[50vh] items-center p-8 rounded-md bg-muted-background"
	>
		{#if !infoOpen}
			<h1 class="text-2xl text-[#1aa841] font-semibold mb-4">PEKI SENIOR HIGH SCHOOL</h1>
			<img class="max-h-[20vh]" src={'/favicon.png'} alt="School Logo" />
			<h1 class="text-xl text-black mt-6 font-bold text-center">Verify Index Number</h1>
			<div class="w-4/5 mt-4 flex flex-col">
				<span class="text-[15px] my-1">Index Number</span>
				<Input
					bind:value={number}
					color="green"
					defaultClass="w-full"
					placeholder="E.g. xxxxxxxxxx23"
				/>
				<span class="text-[14px] text-center mt-1 text-red-600">Add the year you completed JHS</span
				>
				<span class="text-[14px] text-center mt-1 text-red-600">E.g. xxxxxxx23</span>
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
			<div class="mt-6 w-full flex flex-row justify-center">
				<Button
					on:click={() => {
						getStudentDetails();
					}}
					class="w-3/5"
					color="green">Verify now</Button
				>
			</div>
		{/if}

		<Modal title="Invalid Number" bind:open={popupOpen} size="sm" autoclose>
			<div class="text-base leading-relaxed">
				The index number you entered is invalid or not yet added into the system. Contact the school
				or call/whatsapp IT Department on 0205458775.
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
		{/if}
	</div>
</div>
