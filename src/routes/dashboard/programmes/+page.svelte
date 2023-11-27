<script>
	import { db } from '$lib/firebase';
	import { addDoc, deleteDoc, getDocs, where, doc, collection, updateDoc } from 'firebase/firestore';
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

	let addProgrammeModalOpened = false;
	let editProgrammeOpened = false;

	let selectedProgramme = {};
	let deleteProgrammeOpened = false;

	let newProgrammeDetails = {};
	let editStudentDetails = {};

	async function createProgramme() {
		await addDoc(collection(db, 'programmes'), {
			...newProgrammeDetails,
			createdAt: Date.now()
		});

		addProgrammeModalOpened = false;
	}

	async function deleteProgramme(){
		let programmeDoc = await getDocs(collection(db, 'programmes'), where('id', '==', selectedProgramme.id));
		if (!programmeDoc.empty){
			await deleteDoc(doc(db, 'programmes', programmeDoc.docs[0].id));
		}

		selectedProgramme = {};
		deleteProgrammeOpened = false;
	}

	async function updateProgramme(){
		await updateDoc(doc(db, 'programmes', selectedProgramme._id), {
			id: selectedProgramme.id,
			name: selectedProgramme.name,
			shortName: selectedProgramme.shortName
		});

		selectedProgramme = {};
		editProgrammeOpened = false;
	}
</script>

<div class="px-12 py-8">
	<div>
		<div class="flex flex-row justify-between">
			<h1 class="text-xl font-semibold">Programmes List</h1>
			<Button
				on:click={() => {
					addProgrammeModalOpened = true;
				}}
				color={'green'}>Add Programme</Button
			>
		</div>

		<Modal bind:open={addProgrammeModalOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Programme</h3>
				<Label class="space-y-2">
					<span>Programme Id</span>
					<Input
						bind:value={newProgrammeDetails.id}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. 12"
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Programme Name</span>
					<Input
						bind:value={newProgrammeDetails.name}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. General Arts"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Short Name</span>
					<Input
						bind:value={newProgrammeDetails.shortName}
						color={'green'}
						type="text"
						name="Index Number"
						placeholder="E.g. Arts"
						required
					/>
				</Label>

				<Button on:click={createProgramme} color="green" type="submit" class="w-full1"
					>Confirm</Button
				>
			</div>
		</Modal>

		<Modal bind:open={editProgrammeOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Programme</h3>
				<Label class="space-y-2">
					<span>Programme Id</span>
					<Input
						bind:value={selectedProgramme.id}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. 12"
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Programme Name</span>
					<Input
						bind:value={selectedProgramme.name}
						color={'green'}
						type="text"
						name="name"
						placeholder="E.g. General Arts"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Short Name</span>
					<Input
						bind:value={selectedProgramme.shortName}
						color={'green'}
						type="text"
						name="Index Number"
						placeholder="E.g. Arts"
						required
					/>
				</Label>

				<Button on:click={updateProgramme} color="green" type="submit" class="w-full1"
					>Confirm</Button
				>
			</div>
		</Modal>

		<Modal bind:open={deleteProgrammeOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Delete Programme</h3>

				<span>Are you sure you want to delete the programme named "{selectedProgramme.name}"</span>

			</div>
			<svelte:fragment slot="footer">
				<Button color="red" on:click={deleteProgramme}>Yeah</Button>
				<Button color="alternative">Decline</Button>
			  </svelte:fragment>
		</Modal>

		<Table divClass="mt-4" hoverable={true}>
			<TableHead>
				<TableHeadCell>Programme Id</TableHeadCell>
				<TableHeadCell>Programme Name</TableHeadCell>
				<TableHeadCell>Short Name</TableHeadCell>
				<TableHeadCell>No of students</TableHeadCell>
				<TableHeadCell>
					<span class="sr-only">Edit</span>
				</TableHeadCell>
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each data.programmes as student}
					<TableBodyRow>
						<TableBodyCell>{student.id}</TableBodyCell>
						<TableBodyCell>{student.name}</TableBodyCell>
						<TableBodyCell>{student.shortName}</TableBodyCell>
						<TableBodyCell>{student.noOfStudents}</TableBodyCell>
						<TableBodyCell>
							<button
								on:click={() => {
									editProgrammeOpened = true;
									selectedProgramme = student;
								}}

								class="font-medium text-green-600 hover:underline dark:text-green-500">Edit</button
							>
						</TableBodyCell>
						<TableBodyCell>
							<button
								on:click={() => {
									deleteProgrammeOpened = true;
									selectedProgramme = student;
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
