<script>
	import { db, storage } from '$lib/firebase';
	import { readFileAsArrayBuffer } from '$utils/readFileAsArrayBuffer.js';
	import { addDoc, collection, deleteDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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
		Fileupload,
		TableBodyCell,
		TableHeadCell,
		TableBodyRow,
		TableSearch,
		Modal,
		Datepicker
	} from 'flowbite-svelte';

	let searchTerm = '';
	let searchName = undefined;

	let color = 'green';

	class Genders {
		static male = 0;
		static female = 1;
	}

	export let data;

	console.log(data.students);

	$: filteredStudents = searchName
		? data.students.filter(
				(item) => item.name.toLowerCase().indexOf(searchName.toLowerCase()) !== -1
		  )
		: data.students;

	let addStudentModalOpened = false;
	let editStudentOpened = false;
	let deleteStudentOpened = false;

	let selectedStudent = {};
	let newStudentDetails = {};
	let editStudentDetails = {};

	async function createSchoolStudent() {
		await addDoc(collection(db, 'students'), {
			...newStudentDetails,
			paymentCompleted: false,
			createdAt: Date.now()
		});

		addStudentModalOpened = false;
	}

	async function deleteStudent() {
		console.log(selectedStudent);
		let studentDoc = await getDoc(doc(db, 'students', selectedStudent.id));
		if (studentDoc.exists()) {
			await deleteDoc(doc(db, 'students', studentDoc.id));
		}

		selectedStudent = {};
		deleteStudentOpened = false;
	}

	async function exportStudents() {
		const students = data.students; // Assuming data.students is your array of student objects

		let csvContent = '';

		// Adding CSV headers
		const headers = "index,name,gender,nationality,religion,admissionNumber,enrollmentCode,serial,track,house,programme,class,email,haveMedicalCondition,previousJHS,guardian,homeTown,schoolType,presentAddress,beceYear,admissionDate,formFilled,aggregate,pin,paymentCompleted,status,dob,paymentId,nhisNumber"
		csvContent += (headers + '\n');

		for(let i = 0; i < students.length; i++){
			let student = students[i];
			let row = "";

			row += (student.index + ",");
			row += (student.name + ",");
			row += (student.gender + ",");
			row += (student.nationality + ",");
			row += (student.religion + ",");
			row += (student.admissionNumber + ",");
			row += (student.enrollmentCode + ",");
			row += (student.serial + ",");
			row += (student.track + ",");
			row += (student.house + ",");
			row += (student.programme + ",");
			row += (student.class + ",");
			row += (student.email + ",");
			row += (student.haveMedicalCondition + ",");
			row += (student.previousJHS + ",");
			row += (student.guardian ? student.guardian.name : undefined + ",");
			row += (student.homeTown + ",");
			row += (student.schoolType + ",");
			// row += (student.pic + ",");
			row += (student.presentAddress + ",");
			row += (student.beceYear + ",");
			row += (student.admissionDate + ",");
			row += (student.formFilled + ",");
			row += (student.aggregate + ",");
			row += (student.pin + ",");
			row += (student.paymentCompleted + ",");
			row += (student.status + ",");
			row += (student.dob + ",");
			row += (student.paymentId + ",");
			// row += (student.admissionPdfUrl + ",");
			row += (student.nhisNumber);

			csvContent += (row + '\n');
		}

		// Create a Blob
		const blob = new Blob([csvContent], { type: 'text/csv' });

		// Create a download link
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'students.csv';

		// Append the link to the document
		document.body.appendChild(link);

		// Trigger the click event to start the download
		link.click();

		// Remove the link from the document
		document.body.removeChild(link);
	}

	async function updateStudent() {
		if (typeof selectedStudent.pic != 'string') {
			if (
				selectedStudent.pic[0].type !== 'image/jpeg' &&
				selectedStudent.pic[0].type !== 'image/png'
			) {
				error = 'Please upload a png/jpeg file only.';
				errorModalShown = true;
				return;
			}

			let image = await readFileAsArrayBuffer(selectedStudent.pic[0]);
			const storageRef = ref(storage, `students_pics/${Date.now() + selectedStudent.pic[0].name}`);
			try {
				console.log(image);
				const uploadTask = uploadBytes(storageRef, image);
				await uploadTask;
			} catch (error) {
				console.error(`Error uploading ${selectedStudent.pic[0].name} to Firebase Storage:`, error);
				throw error(500, 'File upload failed');
			}

			selectedStudent.pic = await getDownloadURL(storageRef);
		}

		await updateDoc(doc(db, 'students', selectedStudent.id), {
			...selectedStudent
		});

		selectedStudent = {};
		editStudentOpened = false;
	}
</script>

<div class="px-12 py-8">
	<div>
		<h1 class="text-xl font-semibold mt-4 mb-2">Dashboard</h1>
		<div class="flex flex-row gap-2">
			<div class="flex flex-col grow gap-2 bg-muted-background p-4 rounded-md">
				<span class="text-sm text-gray-400 font-semibold">Total Applicants</span>
				<span class="text-black text-xl font-semibold">{data.counts.totalStudents}</span>
			</div>
			<div class="flex flex-col grow gap-2 bg-muted-background p-4 rounded-md">
				<span class="text-sm text-gray-400 font-semibold">Male Students</span>
				<span class="text-black text-xl font-semibold">{data.counts.maleStudents}</span>
			</div>
			<div class="flex flex-col grow gap-2 bg-muted-background p-4 rounded-md">
				<span class="text-sm text-gray-400 font-semibold">Female Students</span>
				<span class="text-black text-xl font-semibold">{data.counts.femaleStudents}</span>
			</div>
			<div class="flex flex-col grow gap-2 bg-muted-background p-4 rounded-md">
				<span class="text-sm text-gray-400 font-semibold">Other Students</span>
				<span class="text-black text-xl font-semibold">{data.counts.otherStudents}</span>
			</div>
		</div>
		<div class="flex flex-row justify-between mt-10">
			<h1 class="text-xl font-semibold">Students List</h1>

			<div class="flex flex-row gap-2">
				<Button
					on:click={() => {
						exportStudents();
					}}
					color={'green'}>Export</Button
				>
				<Button
					on:click={() => {
						addStudentModalOpened = true;
					}}
					color={'green'}>Add Student</Button
				>
			</div>
		</div>

		<Modal bind:open={addStudentModalOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add User</h3>
				<Label class="space-y-2">
					<span>Full Name</span>
					<Input
						bind:value={newStudentDetails.name}
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
						bind:value={newStudentDetails.gender}
						defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
						items={[
							{ value: 'male', name: 'Male' },
							{ value: 'female', name: 'Female' },
							{ value: 'other', name: 'Other' }
						]}
					/>
				</Label>

				<Label class="space-y-2">
					<span>Index Number</span>
					<Input
						bind:value={newStudentDetails.index}
						color={'green'}
						type="text"
						name="Index Number"
						placeholder="E.g. xxxxxxxxxx23"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Aggregate</span>
					<Input
						bind:value={newStudentDetails.aggregate}
						color={'green'}
						type="text"
						name="aggregate"
						placeholder="E.g. xx"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Programme</span>
					<Input
						bind:value={newStudentDetails.programme}
						color={'green'}
						type="text"
						name="programme"
						placeholder="E.g. General Arts"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Track</span>
					<Input
						bind:value={newStudentDetails.track}
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
						bind:value={newStudentDetails.status}
						color={'green'}
						type="text"
						name="status"
						placeholder="E.g. Day"
						required
					/>
				</Label>

				<Button on:click={createSchoolStudent} color="green" type="submit" class="w-full1"
					>Confirm</Button
				>
			</div>
		</Modal>

		<Modal bind:open={deleteStudentOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Delete Programme</h3>

				<span>Are you sure you want to delete the student named "{selectedStudent.name}"</span>
			</div>
			<svelte:fragment slot="footer">
				<Button color="red" on:click={deleteStudent}>Yeah</Button>
				<Button color="alternative">Decline</Button>
			</svelte:fragment>
		</Modal>

		<Modal bind:open={editStudentOpened} size="xs" autoclose={false} class="w-full">
			<div class="flex flex-col space-y-6" action="#">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Student</h3>

				<Label class="space-y-2">
					<span>Picture</span>
					{#if typeof selectedStudent.pic == 'string'}
						<img src={selectedStudent.pic} alt="Student Picture" class="w-20 h-20 rounded-md" />
					{:else}
						<img
							src={URL.createObjectURL(selectedStudent.pic[0])}
							alt="Student Picture"
							class="w-20 h-20 rounded-md"
						/>
					{/if}
					<Fileupload bind:files={selectedStudent.pic} color={'green'} name="pic" required />
				</Label>

				<Label class="space-y-2">
					<span>Full Name</span>
					<Input
						bind:value={selectedStudent.name}
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
						bind:value={selectedStudent.gender}
						defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
						items={[
							{ value: 'male', name: 'Male' },
							{ value: 'female', name: 'Female' },
							{ value: 'other', name: 'Other' }
						]}
					/>
				</Label>

				<Label class="space-y-2">
					<span>Index Number</span>
					<Input
						bind:value={selectedStudent.index}
						color={'green'}
						type="text"
						name="Index Number"
						placeholder="E.g. xxxxxxxxxx23"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Aggregate</span>
					<Input
						bind:value={selectedStudent.aggregate}
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
						bind:value={selectedStudent.religion}
						color={'green'}
						type="text"
						name="aggregate"
						placeholder="E.g. xx"
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Nationality</span>
					<Input
						bind:value={selectedStudent.nationality}
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
						bind:value={selectedStudent.previousJHS}
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
						bind:value={selectedStudent.track}
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
						bind:value={selectedStudent.status}
						color={'green'}
						type="text"
						name="status"
						placeholder="E.g. Day"
						required
					/>
				</Label>

				<Label class="space-y-2 flex flex-col gap-2">
					NHIS No.*
					<input
						class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
						type="text"
						bind:value={selectedStudent.nhisNumber}
						name="nhisNumber"
					/>
				</Label>
		
				<Label class="space-y-2 flex flex-col gap-2">
					BECE Year*
					<Select
						bind:value={selectedStudent.beceYear}
						defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
						items={[
							{ value: 2030, name: '2030' },
							{
								value: 2029,
								name: '2029'
							},
							{
								value: 2028,
								name: '2028'
							},
							{
								value: 2027,
								name: '2027'
							},
							{
								value: 2026,
								name: '2026'
							},
							{
								value: 2025,
								name: '2025'
							},
							{
								value: 2024,
								name: '2024'
							},
							{
								value: 2023,
								name: '2023'
							},
							{
								value: 2022,
								name: '2022'
							},
							{
								value: 2021,
								name: '2021'
							},
							{
								value: 2020,
								name: '2020'
							},
							{
								value: 2019,
								name: '2019'
							},
							{
								value: 2018,
								name: '2018'
							},
							{
								value: 2017,
								name: '2017'
							},
							{
								value: 2016,
								name: '2016'
							},
							{
								value: 2015,
								name: '2015'
							},
							{
								value: 2014,
								name: '2014'
							},
							{
								value: 2013,
								name: '2013'
							},
							{
								value: 2012,
								name: '2012'
							},
							{
								value: 2011,
								name: '2011'
							},
							{
								value: 2010,
								name: '2010'
							}
						]}
					/>
				</Label>
		
				<Label class="space-y-2">
					<span>Previous JHS</span>
					<Input
						bind:value={selectedStudent.previousJHS}
						color={'green'}
						type="text"
						name="aggregate"
						placeholder="E.g. xx"
						required
					/>
				</Label>
		
				<Label class="space-y-2 flex flex-col gap-2">
					Previous School Type*
					<Select
						defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
						items={[
							{ value: 'public', name: 'Public' },
							{ value: 'private', name: 'Private' }
						]}
						bind:value={selectedStudent.schoolType}
					/>
				</Label>
		
				<!-- Guardian's Name -->
				<Label class="space-y-2 flex flex-col gap-2">
					Guardian's Name*
					<Input
						bind:value={selectedStudent.guardian.name}
						class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
						name="guardianName"
					/>
				</Label>
		
				<!-- Relation -->
		
				<Label class="space-y-2 flex flex-col gap-2">
					Relation*
					<Select
						bind:value={selectedStudent.guardian.relation}
						defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
						items={[
							{ value: 'father', name: 'Father' },
							{ value: 'mother', name: 'Mother' },
							{ value: 'other', name: 'Others' }
						]}
					/>
				</Label>
		
				<!-- Occupation -->
		
				<Label class="space-y-2 flex flex-col gap-2">
					Occupation*
					<Input
						bind:value={selectedStudent.guardian.occupation}
						class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
						type="text"
						name="occupation"
					/>
				</Label>
		
				<!-- Number -->
				<Label class="space-y-2 flex flex-col gap-2">
					Phone Number*
					<Input
						class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
						type="number"
						name="number"
						bind:value={selectedStudent.guardian.phoneNumber}
					/>
				</Label>
		
				<!-- Email -->
				<Label class="space-y-2 flex flex-col gap-2">
					Guardian's Email
					<input
						class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
						type="email"
						bind:value={selectedStudent.guardian.email}
						name="email"
					/>
				</Label>

				<Button on:click={updateStudent} color="green" type="submit" class="w-full1">Confirm</Button
				>
			</div>
		</Modal>

		<div>
			<input
				bind:value={searchName}
				class="rounded-md border"
				type="text"
				placeholder="Search By Name"
			/>
		</div>

		<Table divClass="mt-4" hoverable={true}>
			<TableHead>
				<TableHeadCell>Index Number</TableHeadCell>
				<TableHeadCell>Enrollment Code</TableHeadCell>
				<TableHeadCell>Student Name</TableHeadCell>
				<TableHeadCell>Gender</TableHeadCell>
				<TableHeadCell>Payment Status</TableHeadCell>
				<TableHeadCell>
					<span class="sr-only">Edit</span>
				</TableHeadCell>
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each filteredStudents as student}
					<TableBodyRow>
						<TableBodyCell>{student.index}</TableBodyCell>
						<TableBodyCell>{student.enrollmentCode}</TableBodyCell>
						<TableBodyCell>{student.name}</TableBodyCell>
						<TableBodyCell>{student.gender}</TableBodyCell>
						<TableBodyCell>{student.paymentCompleted ? 'Completed' : 'Pending'}</TableBodyCell>
						<TableBodyCell>
							<button
								on:click={() => {
									editStudentOpened = true;
									selectedStudent = student;
									selectedStudent.gender = selectedStudent.gender.toLowerCase();
								}}
								class="font-medium text-green-600 hover:underline dark:text-green-500">Edit</button
							>
						</TableBodyCell>

						<TableBodyCell>
							<button
								on:click={() => {
									deleteStudentOpened = true;
									selectedStudent = student;
								}}
								class="font-medium text-red-600 hover:underline dark:text-green-500">Delete</button
							>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<span class="text-center ml-4 mt-4 flex">No Students Found</span>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
