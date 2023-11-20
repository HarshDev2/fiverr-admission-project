<script>
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

	let addStudentModalOpened = false;
</script>

<div class="px-12 py-8">
	<div>
		<div class="flex flex-row justify-between">
			<h1 class="text-xl font-semibold">Students List</h1>
			<Button
				on:click={() => {
					addStudentModalOpened = true;
				}}
				color={'green'}>Add Student</Button
			>
		</div>

		<Modal bind:open={addStudentModalOpened} size="xs" autoclose={false} class="w-full">
			<form class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add User</h3>
				<Label class="space-y-2">
					<span>Full Name</span>
					<Input color={'green'} type="email" name="email" placeholder="E.g. Ama Serwaa" required />
				</Label>
				<Label class="space-y-2">
					<span>Gender</span>
					<Select
						defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
						items={[
							{ value: 'male', name: 'Male' },
							{ value: 'female', name: 'Female' },
							{ value: 'other', name: 'Other' }
						]}
					/>
				</Label>

				<Label class="space-y-2 flex flex-col gap-2">
					Date of Birth
					<input
						class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
						type="date"
					/>
				</Label>

				<Label class="space-y-2">
					<span>Index Number</span>
					<Input
						color={'green'}
						type="email"
						name="email"
						placeholder="E.g. xxxxxxxxxx23"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Email</span>
					<Input
						color={'green'}
						type="email"
						name="email"
						placeholder="E.g. test@gmail.com"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<Input color={'green'} type="text" name="phone" placeholder="E.g. 0541234567" required />
				</Label>

				<Button color="green" type="submit" class="w-full1">Confirm</Button>
			</form>
		</Modal>

		<Table divClass="mt-4" hoverable={true}>
			<TableHead>
				<TableHeadCell>Index Number</TableHeadCell>
				<TableHeadCell>Student Name</TableHeadCell>
				<TableHeadCell>Gender</TableHeadCell>
				<TableHeadCell>Payment Status</TableHeadCell>
				<TableHeadCell>
					<span class="sr-only">Edit</span>
				</TableHeadCell>
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each students as student}
					<TableBodyRow>
						<TableBodyCell>{student.index}</TableBodyCell>
						<TableBodyCell>{student.name}</TableBodyCell>
						<TableBodyCell>{student.gender == Genders.male ? 'Male' : 'Female'}</TableBodyCell>
						<TableBodyCell>{student.paymentStatus ? 'Completed' : 'Pending'}</TableBodyCell>
						<TableBodyCell>
							<a class="font-medium text-green-600 hover:underline dark:text-green-500">Edit</a>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
