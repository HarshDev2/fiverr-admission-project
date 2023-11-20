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
</script>

<div class="bg-background text-white flex flex-col min-h-[100vh] items-center justify-center">
	<div
		class="flex flex-col min-h-[50vh] lg:min-h-[50vh] items-center p-8 rounded-md bg-muted-background"
	>
		{#if !infoOpen}
			<h1 class="text-2xl text-[#1aa841] font-semibold mb-4">PEKI SENIOR HIGH SCHOOL</h1>
			<img class="max-h-[20vh]" src={'/favicon.png'} alt="School Logo" />
			<h1 class="text-xl text-black mt-6 font-bold text-center">Student's Login</h1>
			<div class="w-4/5 mt-4 flex flex-col">
				<span class="text-[15px] my-1 text-white">Index Number</span>
				<Input
					bind:value={number}
					color="green"
					defaultClass="w-full"
					placeholder="E.g. xxxxxxxxxx23"
				/>
				<span class="text-[14px] mt-1 text-gray-400">Add the year you completed JHS</span>
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
						if (number == '99') {
							infoOpen = true;
						} else {
							popupOpen = true;
						}
					}}
					class="w-3/5"
					color="green">Login</Button
				>
			</div>
		{/if}

		<Modal title="Invalid Number" bind:open={popupOpen} size="sm" autoclose>
			<div class="text-base leading-relaxed">
				The Index Number you entered is invalid. Please check and try again.
			</div>
			<svelte:fragment slot="footer">
				<Button color="green">Confirm</Button>
			</svelte:fragment>
		</Modal>

		{#if infoOpen}
			<div class="flex flex-col">
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
									<TableBodyCell>CLASS</TableBodyCell>
									<TableBodyCell>General Arts (Geography)</TableBodyCell>
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
								<TableBodyRow>
									<TableBodyCell>Row score</TableBodyCell>
									<TableBodyCell>780</TableBodyCell>
								</TableBodyRow>
								<TableBodyRow>
									<TableBodyCell>Admission No.</TableBodyCell>
									<TableBodyCell>PSHS/23/0001</TableBodyCell>
								</TableBodyRow>
							</TableBody>
						</Table>
					</div>
					<img class="max-h-[20vh]" src={'/student.png'} alt="Student's Picture" />
				</div>
				<Button class="w-fit mt-2 ml-2" color="green">Confirm</Button>
			</div>
		{/if}
	</div>
</div>
