<script>
	import {
		Table,
		TableHead,
		TabItem,
		TableBody,
		TableBodyCell,
		TableHeadCell,
		TableBodyRow,
		TableSearch
	} from 'flowbite-svelte';

	let searchTerm = '';

    let color = "green";

    class Genders {
        static male = 0;
        static female = 1;
    }

	let students = [
    {
        name: "Kwame Nkrumah",
        gender: Genders.male,
        paymentStatus: true,
        index: 1023,
        createdAt: new Date("2023-10-01"),
    },
    {
        name: "Ama Serwaa",
        gender: Genders.female,
        paymentStatus: false,
        index: 1024,
        createdAt: new Date("2023-10-02"),
    },
    {
        name: "Kofi Annan",
        gender: Genders.male,
        paymentStatus: true,
        index: 1025,
        createdAt: new Date("2023-10-03"),
    },
    {
        name: "Abena Osei",
        gender: Genders.female,
        paymentStatus: false,
        index: 1026,
        createdAt: new Date("2023-10-04"),
    },
    {
        name: "Yaw Asamoah",
        gender: Genders.male,
        paymentStatus: true,
        index: 1027,
        createdAt: new Date("2023-10-05"),
    }
];


	$: filteredItems = students.filter(
		(item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);
</script>

<div class="px-12 py-8">
	<div>
		<h1 class="text-xl font-semibold">Students List</h1>

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
						<TableBodyCell>{student.gender == Genders.male ? "Male" : "Female"}</TableBodyCell>
						<TableBodyCell>{student.paymentStatus ? "Completed" : "Pending"}</TableBodyCell>
						<TableBodyCell>
							<a
								class="font-medium text-green-600 hover:underline dark:text-green-500">Edit</a
							>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
