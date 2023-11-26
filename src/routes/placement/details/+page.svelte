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

	export let data;
	

	async function makeAdmissionLetter(){
		let request = await fetch('/api/make-admission-pdf', {
			method: 'POST',
			body: JSON.stringify({
				studentId: data.student.id,
			})
		});

		let response = await request.json();

		console.log(response)

		if(response.success){
			window.open(response.link, '_blank');
		}
	}

	async function makePersonalRecordPdf(){
		let request = await fetch('/api/make-personal-record-pdf', {
			method: 'POST',
			body: JSON.stringify({
				studentId: data.student.id,
			})
		});

		let response = await request.json();

		console.log(response)

		if(response.success){
			window.open(response.link, '_blank')
		}
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
						<TableHeadCell>{data.student.name}</TableHeadCell>
					</TableHead>

					<TableBody tableBodyClass="divide-y">
						<TableBodyRow>
							<TableBodyCell>Index Number</TableBodyCell>
							<TableBodyCell>{data.student.index}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Gender</TableBodyCell>
							<TableBodyCell>{data.student.gender}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Aggretate</TableBodyCell>
							<TableBodyCell>{data.student.aggregate}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Programme</TableBodyCell>
							<TableBodyCell>{data.student.programme}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Class</TableBodyCell>
							<TableBodyCell>{data.student.class}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Residence</TableBodyCell>
							<TableBodyCell>{data.student.status}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>House</TableBodyCell>
							<TableBodyCell>{data.student.house}</TableBodyCell>
						</TableBodyRow>

						<!-- <TableBodyRow>
							<TableBodyCell>House Capacity</TableBodyCell>
							<TableBodyCell>{data.student}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>House Occupancy</TableBodyCell>
							<TableBodyCell>{data}</TableBodyCell>
						</TableBodyRow> -->

						<TableBodyRow>
							<TableBodyCell>NHIS No</TableBodyCell>
							<TableBodyCell>{data.student.nhisNumber}</TableBodyCell>
						</TableBodyRow>

						
						<TableBodyRow>
							<TableBodyCell>Guardian Name</TableBodyCell>
							<TableBodyCell>{data.student.guardian.name}</TableBodyCell>
						</TableBodyRow>
						
						<TableBodyRow>
							<TableBodyCell>Relationship</TableBodyCell>
							<TableBodyCell>{data.student.guardian.relationship}</TableBodyCell>
						</TableBodyRow>
						
						<TableBodyRow>
							<TableBodyCell>Number</TableBodyCell>
							<TableBodyCell>{data.student.guardian.phoneNumber}</TableBodyCell>
						</TableBodyRow>
						
						<TableBodyRow>
							<TableBodyCell>Email</TableBodyCell>
							<TableBodyCell>{data.student.guardian.email}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Present Address</TableBodyCell>
							<TableBodyCell>{data.student.presentAddress}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Nationality</TableBodyCell>
							<TableBodyCell>{data.student.nationality}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Home Town</TableBodyCell>
							<TableBodyCell>{data.student.homeTown}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Religion</TableBodyCell>
							<TableBodyCell>{data.student.religion}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>Previous JHS</TableBodyCell>
							<TableBodyCell>{data.student.previousJHS}</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell>BECE year</TableBodyCell>
							<TableBodyCell>{data.student.beceYear}</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				</Table>
			</div>
			<div>
				<img class="ml-2" src="{data.student.pic}" alt="" />
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
					makeAdmissionLetter();
				}}
				class="w-3/5 whitespace-nowrap"
				color="green">Admission Letter</Button
			>
			<Button
				on:click={() => {
					makePersonalRecordPdf();
				}}
				class="w-3/5 whitespace-nowrap"
				color="green">Personal Record</Button
			>

			<Button
				on:click={() => {
					window.open('/prospectus.pdf', '_blank');
				}}
				class="w-3/5 whitespace-nowrap"
				color="green">Prospectus</Button
			>
		</div>
	</div>
</div>
