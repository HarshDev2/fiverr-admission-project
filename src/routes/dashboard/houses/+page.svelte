<script>
	import { db } from '$lib/firebase';
	import {
		addDoc,
		collection,
		deleteDoc,
		doc,
		updateDoc,
		getDoc,
		getDocs,
		where,
		query
	} from 'firebase/firestore';
	import {
		Table,
		TableHead,
		TabItem,
		TableBody,
		Button,
		Input,
		Checkbox,
		Select,
		Label,
		TableBodyCell,
		TableHeadCell,
		TableBodyRow,
		TableSearch,
		Modal,
		Datepicker
	} from 'flowbite-svelte';

	let searchTerm = '';

	let color = 'green';

	class Genders {
		static male = 0;
		static female = 1;
	}

	export let data;

	let addHouseModalOpened = false;
	let editHouseOpened = false;

	let deleteHouseOpened = false;
	let selectedHouse = {};

	let newHouseDetails = {};
	let editStudentDetails = {};

	async function createHouse() {
		await addDoc(collection(db, 'houses'), {
			...newHouseDetails,
			createdAt: Date.now()
		});

		addHouseModalOpened = false;
	}

	async function deleteHouse() {
		let houseDoc = await getDocs(collection(db, 'houses'), where('id', '==', selectedHouse.id));
		if (!houseDoc.empty) {
			await deleteDoc(doc(db, 'houses', houseDoc.docs[0].id));
		}

		selectedHouse = {};
		deleteHouseOpened = false;
	}

	async function updateHouse() {
		await updateDoc(doc(db, 'houses', selectedHouse._id), {
			id: selectedHouse.id,
			name: selectedHouse.name,
			capacity: selectedHouse.capacity,
			gender: selectedHouse.gender
		});

		selectedHouse = {};
		editHouseOpened = false;
	}

	async function exportStudents(index) {
		let house = data.houses[index];

		let students = await getDocs(query(collection(db, 'students'), where('house', '==', house.id)));

		students = students.docs;

		let csvContent = '';

		const headers =
			'index,name,gender,nationality,religion,admissionNumber,enrollmentCode,serial,track,house,programme,class,email,haveMedicalCondition,previousJHS,guardian,homeTown,schoolType,presentAddress,beceYear,admissionDate,formFilled,aggregate,pin,paymentCompleted,status,dob,paymentId,nhisNumber';
		csvContent += headers + '\n';

		for (let i = 0; i < students.length; i++) {
			let student = students[i].data();
			let row = '';

			row += student.index + ',';
			row += student.name + ',';
			row += student.gender + ',';
			row += student.nationality + ',';
			row += student.religion + ',';
			row += student.admissionNumber + ',';
			row += student.enrollmentCode + ',';
			row += student.serial + ',';
			row += student.track + ',';
			row += student.house + ',';
			row += student.programme + ',';
			row += student.class + ',';
			row += student.email + ',';
			row += student.haveMedicalCondition + ',';
			row += student.previousJHS + ',';
			row += student.guardian ? student.guardian.name : undefined + ',';
			row += student.homeTown + ',';
			row += student.schoolType + ',';
			// row += (student.pic + ",");
			row += student.presentAddress + ',';
			row += student.beceYear + ',';
			row += student.admissionDate + ',';
			row += student.formFilled + ',';
			row += student.aggregate + ',';
			row += student.pin + ',';
			row += student.paymentCompleted + ',';
			row += student.status + ',';
			row += student.dob + ',';
			row += student.paymentId + ',';
			// row += (student.admissionPdfUrl + ",");
			row += student.nhisNumber;

			csvContent += row + '\n';
		}

		const blob = new Blob([csvContent], { type: 'text/csv' });

		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'students.csv';

		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);
	}
</script>

<div class="px-12 py-8">
	<div>
		<div class="flex flex-row justify-between">
			<h1 class="text-xl font-semibold">Houses List</h1>
			<Button
				on:click={() => {
					addHouseModalOpened = true;
				}}
				color={'green'}>Add House</Button
			>
		</div>

		<Modal bind:open={addHouseModalOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Class</h3>
				<Label class="space-y-2">
					<span>House Id</span>
					<Input
						bind:value={newHouseDetails.id}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. 12"
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>House Name</span>
					<Input
						bind:value={newHouseDetails.name}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. Optical Physics"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Gender</span>
					<Select
						bind:value={newHouseDetails.gender}
						defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
						items={[
							{ value: 'male', name: 'Male' },
							{ value: 'female', name: 'Female' },
							{ value: 'other', name: 'Other' }
						]}
					/>
				</Label>

				<Label class="space-y-2">
					<span>House Capacity</span>
					<Input
						bind:value={newHouseDetails.capacity}
						color={'green'}
						type="number"
						name="House Capacity"
						placeholder="E.g. 23"
						required
					/>
				</Label>

				<Button on:click={createHouse} color="green" type="submit" class="w-full1">Confirm</Button>
			</div>
		</Modal>

		<Modal bind:open={editHouseOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Class</h3>
				<Label class="space-y-2">
					<span>House Id</span>
					<Input
						bind:value={selectedHouse.id}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. 12"
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>House Name</span>
					<Input
						bind:value={selectedHouse.name}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. Optical Physics"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Gender</span>
					<Select
						bind:value={selectedHouse.gender}
						defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
						items={[
							{ value: 'male', name: 'Male' },
							{ value: 'female', name: 'Female' },
							{ value: 'other', name: 'Other' }
						]}
					/>
				</Label>

				<Label class="space-y-2">
					<span>House Capacity</span>
					<Input
						bind:value={selectedHouse.capacity}
						color={'green'}
						type="number"
						name="House Capacity"
						placeholder="E.g. 23"
						required
					/>
				</Label>

				<Button on:click={updateHouse} color="green" type="submit" class="w-full1">Confirm</Button>
			</div>
		</Modal>

		<Modal bind:open={deleteHouseOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Delete House</h3>

				<span>Are you sure you want to delete the house named "{selectedHouse.name}"</span>
			</div>
			<svelte:fragment slot="footer">
				<Button color="red" on:click={deleteHouse}>Yeah</Button>
				<Button color="alternative">Decline</Button>
			</svelte:fragment>
		</Modal>

		<Table divClass="mt-4" hoverable={true}>
			<TableHead>
				<TableHeadCell>House Id</TableHeadCell>
				<TableHeadCell>House Name</TableHeadCell>
				<TableHeadCell>Gender</TableHeadCell>
				<TableHeadCell>Capacity</TableHeadCell>
				<TableHeadCell>Occupancy</TableHeadCell>
				<TableHeadCell>
					<span class="sr-only">Edit</span>
				</TableHeadCell>
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each data.houses as student, index}
					<TableBodyRow>
						<TableBodyCell>{student.id}</TableBodyCell>
						<TableBodyCell>{student.name}</TableBodyCell>
						<TableBodyCell>{student.gender}</TableBodyCell>
						<TableBodyCell>{student.capacity}</TableBodyCell>
						<TableBodyCell>{student.noOfStudents}</TableBodyCell>
						<TableBodyCell>
							<button
								on:click={() => {
									editHouseOpened = true;
									selectedHouse = student;
								}}
								class="font-medium text-green-600 hover:underline dark:text-green-500">Edit</button
							>
						</TableBodyCell>
						<TableBodyCell>
							<button
								on:click={() => {
									selectedHouse = student;
									deleteHouseOpened = true;
								}}
								class="font-medium text-red-600 hover:underline dark:text-green-500">Delete</button
							>
						</TableBodyCell>
						<TableBodyCell>
							<Button
								color={'green'}
								on:click={() => {
									exportStudents(index);
								}}
								class="font-medium">Export Students</Button
							>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<span class="text-center ml-4 mt-4 flex">No Class Found</span>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
