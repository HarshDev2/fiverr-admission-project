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
	import { onMount } from 'svelte';
	let number = '';

	let popupOpen = false;
	let infoOpen = true;

	let color = 'green';

	async function handlePayment() {
		let request = await fetch('/api/make-payment', {
			method: 'POST',
			body: JSON.stringify({
				clientReference: 'da' + Math.floor(Math.random() * 1000000)
			})
		});

		let response = await request.json();

		console.log(response);

		window.open(response.data.checkoutUrl, '_blank');
	}

	let formData = {
		haveMedicalCondition: false
	};

	$: {
		console.log(formData);
	}

	export let data;

	let classesForSelect = [];

	data.classes.forEach((item) => {
		classesForSelect.push({ value: item.id, name: item.name });
	});

	let housesForSelect = [];
	data.houses.forEach((item) => {
		housesForSelect.push({ value: item.id, name: item.name });
	});
</script>

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
				Passport Size Picture
				<Fileupload />
			</Label>

			<Label class="space-y-2 flex flex-col gap-2">
				Date of Birth
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					bind:value={formData.dob}
					type="date"
				/>
			</Label>

			<Label class="space-y-2 flex flex-col gap-2">
				Do you have an medical condition?
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
					Medical Condition
					<Fileupload bind:files={formData.medicalCondition}/>
				</Label>
			{/if}

			<Label class="space-y-2 flex flex-col gap-2">
				Admission Date
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="date"
					value={new Date().toISOString().slice(0, 10)}
					disabled
					name="admissionDate"
				/>
			</Label>

			<!-- Admission Number -->
			<Label class="space-y-2 flex flex-col gap-2">
				Admission Number
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					disabled
					value="PSHS/23"
					name="admissionNumber"
				/>
			</Label>

			<!-- House (Hostel) -->
			<Label class="space-y-2 flex flex-col gap-2">
				House (Hostel)
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					disabled
					value="Boys House 1"
					name="admissionNumber"
				/>
			</Label>

			<!-- NHIS No. -->
			<Label class="space-y-2 flex flex-col gap-2">
				NHIS No.
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					name="nhisNumber"
				/>
			</Label>

			<!-- Class -->
			<Label class="space-y-2 flex flex-col gap-2">
				Class
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
				Present Address
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					name="presentAddress"
				/>
			</Label>

			<!-- Nationality -->
			<Label class="space-y-2 flex flex-col gap-2">
				Nationality
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					name="nationality"
				/>
			</Label>

			<!-- Home Town -->
			<Label class="space-y-2 flex flex-col gap-2">
				Home Town
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					name="homeTown"
				/>
			</Label>

			<!-- Religion -->
			<Label class="space-y-2 flex flex-col gap-2">
				Religion
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					name="religion"
				/>
			</Label>

			<!-- Previous JHS -->
			<Label class="space-y-2 flex flex-col gap-2">
				Previous JHS
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					name="previousJHS"
				/>
			</Label>

			<!-- Public/Private -->
			<Label class="space-y-2 flex flex-col gap-2">
				School Type
				<Select
					defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
					items={[
						{ value: 'public', name: 'Public' },
						{ value: 'private', name: 'Private' }
					]}
				/>
			</Label>

			<!-- BECE Year -->
			<Label class="space-y-2 flex flex-col gap-2">
				BECE Year
				<Input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					name="beceYear"
				/>
			</Label>

			<!-- Guardian's Name -->
			<Label class="space-y-2 flex flex-col gap-2">
				Guardian's Name
				<Input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					name="guardianName"
				/>
			</Label>

			<!-- Relation -->

			<Label class="space-y-2 flex flex-col gap-2">
				Relation
				<Select
					defaultClass="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 "
					items={[
						{ value: 'father', name: 'Father' },
						{ value: 'mother', name: 'Mother' },
						{ value: 'other', name: 'Other' }
					]}
				/>
			</Label>

			<!-- Occupation -->

			<Label class="space-y-2 flex flex-col gap-2">
				Occupation
				<Input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="text"
					name="occupation"
					bind:value={formData.occupation}
				/>
			</Label>

			<!-- Number -->
			<Label class="space-y-2 flex flex-col gap-2">
				Number
				<Input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="number"
					name="number"
					bind:value={formData.phoneNumber}
				/>
			</Label>

			<!-- Email -->
			<Label class="space-y-2 flex flex-col gap-2">
				Guardian's Email
				<input
					class="text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
					type="email"
					bind:value={formData.email}
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
				color="green">Submit</Button
			>
		</div>
	</div>
</div>
