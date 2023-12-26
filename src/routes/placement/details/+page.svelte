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
		RadioButton,

		Fileupload

	} from 'flowbite-svelte';

	import Cookies from 'js-cookie';

	import { db, storage } from '$lib/firebase';
	import { readFileAsArrayBuffer } from '$utils/readFileAsArrayBuffer.js';
	import { addDoc, collection, deleteDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

	let number = '';

	export let data;

	let error;

	data.student.gender = data.student.gender.toLowerCase();

	let editStudentOpened = false;
	

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

	async function updateStudent() {
		console.log(data.student);

		if (typeof data.student.pic != 'string') {
			if (
				data.student.pic[0].type !== 'image/jpeg' &&
				data.student.pic[0].type !== 'image/png'
			) {
				error = 'Please upload a png/jpeg file only.';
				errorModalShown = true;
				return;
			}

			let image = await readFileAsArrayBuffer(data.student.pic[0]);
			const storageRef = ref(storage, `students_pics/${Date.now() + data.student.pic[0].name}`);
			try {
				console.log(image);
				const uploadTask = uploadBytes(storageRef, image);
				await uploadTask;
			} catch (error) {
				console.error(`Error uploading ${data.student.pic[0].name} to Firebase Storage:`, error);
				throw error(500, 'File upload failed');
			}

			data.student.pic = await getDownloadURL(storageRef);
		}

		console.log("Updating Student..")

		await updateDoc(doc(db, 'students', data.student.id), {
			...data.student
		});

		console.log("Updated Successfully..")

		editStudentOpened = false;
	}
</script>

<Modal bind:open={editStudentOpened} size="xs" autoclose={false} class="w-full">
	<div class="flex flex-col space-y-6" action="#">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Student</h3>

		<Label class="space-y-2">
			<span>Picture</span>
			{#if typeof data.student.pic == 'string'}
				<img src={data.student.pic} alt="Student Picture" class="w-20 h-20 rounded-md" />
			{:else}
				<img
					src={URL.createObjectURL(data.student.pic[0])}
					alt="Student Picture"
					class="w-20 h-20 rounded-md"
				/>
			{/if}
			<Fileupload bind:files={data.student.pic} color={'green'} name="pic" required />
		</Label>

		<Label class="space-y-2">
			<span>Full Name</span>
			<Input
				bind:value={data.student.name}
				color={'green'}
				type="text"
				name="name"
				placeholder="E.g. Ama Serwaa"
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Gender</span>
			<Select
				bind:value={data.student.gender}
				defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
				items={[
					{ value: 'male', name: 'Male' },
					{ value: 'female', name: 'Female' },
					{ value: 'other', name: 'Other' }
				]}
			/>
		</Label>

		<!-- <Label class="space-y-2">
			<span>Index Number</span>
			<Input
				bind:value={data.student.index}
				color={'green'}
				type="text"
				name="Index Number"
				placeholder="E.g. xxxxxxxxxx23"
				required
			/>
		</Label> -->

		<Label class="space-y-2">
			<span>Aggregate</span>
			<Input
				bind:value={data.student.aggregate}
				color={'green'}
				type="text"
				name="aggregate"
				placeholder="E.g. xx"
				required
			/>
		</Label>

		<Label class="space-y-2">
			<span>Religion</span>
			<Input
				bind:value={data.student.religion}
				color={'green'}
				type="text"
				name="aggregate"
				placeholder="E.g. xx"
				required
			/>
		</Label>

		<Label class="space-y-2">
			<span>Previous JHS</span>
			<Input
				bind:value={data.student.previousJHS}
				color={'green'}
				type="text"
				name="aggregate"
				placeholder="E.g. xx"
				required
			/>
		</Label>

		<Label class="space-y-2">
			<span>Track</span>
			<Input
				bind:value={data.student.track}
				color={'green'}
				type="text"
				name="track"
				placeholder="E.g. Single"
				required
			/>
		</Label>

		<Label class="space-y-2">
			<span>Status</span>
			<Input
				bind:value={data.student.status}
				color={'green'}
				type="text"
				name="status"
				placeholder="E.g. Day"
				required
			/>
		</Label>

		<Button on:click={updateStudent} color="green" type="submit" class="w-full1">Confirm</Button
		>
	</div>
</Modal>

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
							<TableBodyCell>{data.house.name}</TableBodyCell>
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
							<TableBodyCell>{data.student.guardian.relation}</TableBodyCell>
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
				<img class="ml-2 max-h-[200px]" src="{data.student.pic}" alt="" />
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

			<Button
				on:click={() => {
					editStudentOpened = true;
				}}
				class="w-3/5 whitespace-nowrap"
				color="green">Edit</Button
			>

			<Button
				on:click={() => {
					Cookies.remove("pin");
					Cookies.remove("serial");

					window.open('/placement', '_self');
				}}
				class="w-3/5 whitespace-nowrap"
				color="green">Logout</Button
			>
		</div>
	</div>
</div>
