<script>
	import { readFileAsArrayBuffer } from '$utils/readFileAsArrayBuffer.js';
	import { updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase.js';
	import { storage } from '$lib/firebase.js';

	import { doc, getDoc } from 'firebase/firestore';

	import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

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
	import { onMount } from 'svelte';
	let number = '';

	let color = 'green';

	
	
	export let data;
	
	let selectedHouse = "";
	
	for(let i = 0; i < data.houses.length; i++){
		let house = data.houses[i];
		data.student.gender = data.student.gender.toLowerCase();

		if(data.student.gender == house.gender){
			if(house.noOfStudents < parseInt(house.capacity)){
				selectedHouse = house;
				break;
			}
		}
		
	}
	
	let formData = {
		pic: undefined,
		haveMedicalCondition: undefined,
		dob: undefined,
		house: selectedHouse.name,
		admissionDate: new Date().toISOString().slice(0, 10),
		admissionNumber: 'PSHS/23',
		guardian: {
			name: undefined
		}
	};

	console.log(selectedHouse)

	let classesForSelect = [];

	data.classes.forEach((item) => {
		classesForSelect.push({ value: item.id, name: item.name });
	});

	let housesForSelect = [];
	data.houses.forEach((item) => {
		housesForSelect.push({ value: item.id, name: item.name });
	});

	let errorModalShown = false;
	let error = '';

	async function submit() {

		let studentDoc = await getDoc(doc(db, 'students', data.student.id));
		let studentData = studentDoc.data();
		if(studentData.formFilled){
			error = 'You have already filled the form.';
			errorModalShown = true;
			window.open('/placement/details');
			return;
		}

		if (
			!formData.dob ||
			!formData.pic ||
			!formData.email ||
			formData.haveMedicalCondition === undefined ||
			(formData.haveMedicalCondition && !formData.medicalCondition) ||
			!formData.beceYear ||
			!formData.schoolType ||
			!formData.previousJHS ||
			!formData.religion ||
			!formData.homeTown ||
			!formData.presentAddress ||
			!formData.guardian.name ||
			!formData.guardian.relation ||
			!formData.guardian.occupation ||
			!formData.guardian.phoneNumber ||
			!formData.guardian.email
		) {
			error = 'Please enter all of the required fields.';
			errorModalShown = true;
			return;
		} else {
			if (formData.pic[0].type !== 'image/jpeg' && formData.pic[0].type !== 'image/png') {
				error = 'Please upload a png/jpeg file only.';
				errorModalShown = true;
				return;
			}

			
			let image = await readFileAsArrayBuffer(formData.pic[0]);
			const storageRef = ref(storage, `students_pics/${Date.now() + formData.pic[0].name}`);
			try {
				console.log(image);
				const uploadTask = uploadBytes(storageRef, image);
				await uploadTask;
			} catch (error) {
				console.error(`Error uploading ${files[0].name} to Firebase Storage:`, error);
				throw error(500, 'File upload failed');
			}

			const downloadURL = await getDownloadURL(storageRef);

			if(formData.haveMedicalCondition){
				let medicalCondition = await readFileAsArrayBuffer(formData.medicalCondition[0]);
				const storageRef = ref(storage, `students_medical/${Date.now() + formData.medicalCondition[0].name}`);
				try {
					console.log(medicalCondition);
					const uploadTask = uploadBytes(storageRef, medicalCondition);
					await uploadTask;
				} catch (error) {
					console.error(`Error uploading ${files[0].name} to Firebase Storage:`, error);
					throw error(500, 'File upload failed');
				}
	
				const downloadURL2 = await getDownloadURL(storageRef);
	
				formData.medicalCondition = downloadURL2;
			}
			
			formData.pic = downloadURL;
			
			let schoolDetailsDoc = await getDoc(doc(db, "school", "details"));
			let schoolDetails = schoolDetailsDoc.data();
			
			let admissionNumber = 'PSHS/23' + schoolDetails.admissionNumber + 1;
			
			await updateDoc(doc(db, 'students', data.student.id), {
				...formData,
				house: selectedHouse.id,
				formFilled: true,
				admissionNumber
			});

			await updateDoc(doc(db, 'school', 'details'), {
				admissionNumber: schoolDetails.admissionNumber + 1
			});

			window.open('/placement/details', '_self');
			setTimeout(() => {
				window.close();
			}, 1000);
		}
	}
</script>

<Modal title="Invalid Details" bind:open={errorModalShown} size="sm" autoclose>
	<div class="text-base leading-relaxed">
		{error}
	</div>
	<svelte:fragment slot="footer">
		<Button color="green">Confirm</Button>
	</svelte:fragment>
</Modal>

<div class="bg-background text-white flex flex-col min-h-[100vh] py-8 items-center justify-center">
	<div class="flex flex-col min-h-[50vh] lg:min-h-[50vh] p-8 rounded-md bg-muted-background">
		<h1 class="text-2xl text-[#1aa841] font-semibold mb-4">Student Application Form</h1>

		<!-- 12. Upload passport picture*
            13. Date of Birth*
            14. Any medical condition, YES/NO (if yes upload medical
            report)*
            15. Admission date*
            16. Admission number*
            17. House (Hostel)*
            18. NHIS No.*
            19. Class*
            20. Email
            21. Present address*
            22. Nationality*
            23. Home Town*
            24. Religion*
            25. Previous JHS*
            26. Public/Private*
            27. BECE year*
            28. Guadian’s Name*
            29. Relation*
            30. Occupation*
            31. Number*
            32. Email 
        -->

		<div class="mt-2 flex flex-col gap-4">
			<Label class="space-y-2 flex flex-col gap-2">
				Passport Size Picture*
				<Fileupload bind:files={formData.pic} />
			</Label>

			<Label class="space-y-2 flex flex-col gap-2">
				Date of Birth*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					bind:value={formData.dob}
					type="date"
				/>
			</Label>

			<Label class="space-y-2 flex flex-col gap-2">
				Do you have an medical condition?*
				<Select
					defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
					items={[
						{ value: true, name: 'Yes' },
						{ value: false, name: 'No' }
					]}
					bind:value={formData.haveMedicalCondition}
				/>
			</Label>

			{#if formData.haveMedicalCondition}
				<Label class="space-y-2 flex flex-col gap-2">
					Medical Condition*
					<Fileupload bind:files={formData.medicalCondition} />
				</Label>
			{/if}

			<Label class="space-y-2 flex flex-col gap-2">
				Admission Date*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="date"
					value={formData.admissionDate}
					disabled
					name="admissionDate"
				/>
			</Label>

			<!-- Admission Number -->
			<Label class="space-y-2 flex flex-col gap-2">
				Admission Number*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					disabled
					value={formData.admissionNumber}
					name="admissionNumber"
				/>
			</Label>

			<!-- House (Hostel) -->
			<Label class="space-y-2 flex flex-col gap-2">
				House (Hostel)*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					disabled
					value={formData.house}
					name="admissionNumber"
				/>
			</Label>

			<!-- NHIS No. -->
			<Label class="space-y-2 flex flex-col gap-2">
				NHIS No.*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					bind:value={formData.nhisNumber}
					name="nhisNumber"
				/>
			</Label>

			<!-- Class -->
			<Label class="space-y-2 flex flex-col gap-2">
				Class*
				<Select
					defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
					items={classesForSelect}
					bind:value={formData.class}
				/>
			</Label>

			<!-- Email -->
			<Label class="space-y-2 flex flex-col gap-2">
				Email
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="email"
					bind:value={formData.email}
					name="email"
				/>
			</Label>

			<!-- Present Address -->
			<Label class="space-y-2 flex flex-col gap-2">
				Present Address*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					bind:value={formData.presentAddress}
					name="presentAddress"
				/>
			</Label>

			<!-- Nationality -->
			<Label class="space-y-2 flex flex-col gap-2">
				Nationality*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					bind:value={formData.nationality}
					name="nationality"
				/>
			</Label>

			<!-- Home Town -->
			<Label class="space-y-2 flex flex-col gap-2">
				Home Town*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					bind:value={formData.homeTown}
					name="homeTown"
				/>
			</Label>

			<!-- Religion -->
			<Label class="space-y-2 flex flex-col gap-2">
				Religion*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					bind:value={formData.religion}
					name="religion"
				/>
			</Label>

			<!-- Previous JHS -->
			<Label class="space-y-2 flex flex-col gap-2">
				Previous JHS*
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					bind:value={formData.previousJHS}
					name="previousJHS"
				/>
			</Label>

			<!-- Public/Private -->
			<Label class="space-y-2 flex flex-col gap-2">
				School Type*
				<Select
					defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
					items={[
						{ value: 'public', name: 'Public' },
						{ value: 'private', name: 'Private' }
					]}
					bind:value={formData.schoolType}
				/>
			</Label>

			<!-- BECE Year -->
			<Label class="space-y-2 flex flex-col gap-2">
				BECE Year*
				<Select
					bind:value={formData.beceYear}
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

			<!-- Guardian's Name -->
			<Label class="space-y-2 flex flex-col gap-2">
				Guardian's Name*
				<Input
					bind:value={formData.guardian.name}
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					name="guardianName"
				/>
			</Label>

			<!-- Relation -->

			<Label class="space-y-2 flex flex-col gap-2">
				Relation*
				<Select
					bind:value={formData.guardian.relation}
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
					bind:value={formData.guardian.occupation}
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
					bind:value={formData.guardian.phoneNumber}
				/>
			</Label>

			<!-- Email -->
			<Label class="space-y-2 flex flex-col gap-2">
				Guardian's Email
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="email"
					bind:value={formData.guardian.email}
					name="email"
				/>
			</Label>
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
		<div class="mt-8 w-full flex flex-row justify-center">
			<Button
				on:click={() => {
					submit();
				}}
				class="w-3/5"
				color="green">Submit</Button
			>
		</div>
	</div>
</div>
