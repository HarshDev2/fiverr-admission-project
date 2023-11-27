<script>
	import { db } from '$lib/firebase';
	import { addDoc, deleteDoc, getDocs, where, doc, collection } from 'firebase/firestore';
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

	let programmesForSelect = [];

	for(let i = 0; i < data.programmes.length; i++) {
		programmesForSelect.push({
			value: data.programmes[i].id,
			name: data.programmes[i].name
		})
	}

	let students = [
		{
			name: 'Kwame Nkrumah',
			gender: Genders.male,
			paymentStatus: true,
			index: 1023,
			createdAt: new Date('2023-10-01')
		},
		{
			name: 'Ama Serwaa',
			gender: Genders.female,
			paymentStatus: false,
			index: 1024,
			createdAt: new Date('2023-10-02')
		},
		{
			name: 'Kofi Annan',
			gender: Genders.male,
			paymentStatus: true,
			index: 1025,
			createdAt: new Date('2023-10-03')
		},
		{
			name: 'Abena Osei',
			gender: Genders.female,
			paymentStatus: false,
			index: 1026,
			createdAt: new Date('2023-10-04')
		},
		{
			name: 'Yaw Asamoah',
			gender: Genders.male,
			paymentStatus: true,
			index: 1027,
			createdAt: new Date('2023-10-05')
		}
	];

	$: filteredItems = students.filter(
		(item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

	let addClassModalOpened = false;
	let editStudentOpened = false;
	let deleteClassOpened = false;

	let newClassDetails = {};
	let editStudentDetails = {};

	let selectedClass = {};

	async function createClass() {
		await addDoc(collection(db, 'classes'), {
			...newClassDetails,
			createdAt: Date.now()
		});

		addClassModalOpened = false;
	}

	async function deleteClass(){
		let classDoc = await getDocs(collection(db, 'classes'), where('id', '==', selectedClass.id));
		if (!classDoc.empty){
			await deleteDoc(doc(db, 'classes', classDoc.docs[0].id));
		}

		selectedClass = {};
		deleteClassOpened = false;
	}
</script>

<div class="px-12 py-8">
	<div>
		<div class="flex flex-row justify-between">
			<h1 class="text-xl font-semibold">Class List</h1>
			<Button
				on:click={() => {
					addClassModalOpened = true;
				}}
				color={'green'}>Add Class</Button
			>
		</div>

		<Modal bind:open={addClassModalOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Class</h3>
				<Label class="space-y-2">
					<span>Class Id</span>
					<Input
						bind:value={newClassDetails.id}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. 12"
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Class Name</span>
					<Input
						bind:value={newClassDetails.name}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. Optical Physics"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Short Name</span>
					<Input
						bind:value={newClassDetails.shortName}
						color={'green'}
						type="text"
						name="Short Name"
						placeholder="E.g. Physics"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Programme</span>
					<Select
						bind:value={newClassDetails.programme}
						defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
						items={programmesForSelect}
					/>
				</Label>

				<Label class="space-y-2">
					<span>Class Capacity</span>
					<Input
						bind:value={newClassDetails.capacity}
						color={'green'}
						type="number"
						name="Class Capacity"
						placeholder="E.g. 23"
						required
					/>
				</Label>

				<Button on:click={createClass} color="green" type="submit" class="w-full1"
					>Confirm</Button
				>
			</div>
		</Modal>

		<Modal bind:open={deleteClassOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Delete Class</h3>

				<span>Are you sure you want to delete the class named "{selectedClass.name}"</span>

			</div>
			<svelte:fragment slot="footer">
				<Button color="red" on:click={deleteClass}>Yeah</Button>
				<Button color="alternative">Decline</Button>
			  </svelte:fragment>
		</Modal>

		<Table divClass="mt-4" hoverable={true}>
			<TableHead>
				<TableHeadCell>Class Id</TableHeadCell>
				<TableHeadCell>Class Name</TableHeadCell>
				<TableHeadCell>Short Name</TableHeadCell>
				<TableHeadCell>Programme</TableHeadCell>
				<TableHeadCell>Capacity</TableHeadCell>
				<TableHeadCell>Occupancy</TableHeadCell>
				<TableHeadCell>
					<span class="sr-only">Edit</span>
				</TableHeadCell>
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each data.classes as student}
					<TableBodyRow>
						<TableBodyCell>{student.id}</TableBodyCell>
						<TableBodyCell>{student.name}</TableBodyCell>
						<TableBodyCell>{student.shortName}</TableBodyCell>
						<TableBodyCell>{student.programme}</TableBodyCell>
						<TableBodyCell>{student.capacity}</TableBodyCell>
						<TableBodyCell>{student.noOfStudents}</TableBodyCell>
						<TableBodyCell>
							<button
								on:click={() => {
									deleteClassOpened = true;
									selectedClass = student;
								}}
								class="font-medium text-red-600 hover:underline dark:text-green-500">Delete</button
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
