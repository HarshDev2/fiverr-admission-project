<script lang="ts">
	import { db } from '$lib/firebase.js';
	import { updateDoc, doc } from 'firebase/firestore';
	import { Button, Fileupload, Input, Label } from 'flowbite-svelte';
	import { Modal } from 'flowbite-svelte';

	export let data;

	let oldPassword: string;
	let newPassword: string;
	let confirmPassword: string;

	let errorModalOpened = false;
	let error = '';

	async function updatePassword() {
		if (oldPassword !== data.admin.password) {
			errorModalOpened = true;
			error = 'Incorrect old password';

		} 
        else if((!newPassword || !confirmPassword) || (newPassword.length <= 0 || confirmPassword.length <= 0)){
            errorModalOpened = true;
            error = 'Password cannot be empty';
        }
        else if (newPassword !== confirmPassword) {
			errorModalOpened = true;
			error = 'Passwords do not match';
		}

		await updateDoc(doc(db, 'admins', data.admin.id), {
			password: newPassword
		});
	}
</script>

<div class="px-12 py-8">
	<div class="bg-white p-4 rounded-md">
		<h1 class="text-xl font-semibold">Edit Password</h1>

		<div class="flex flex-col mt-4 gap-4">
			<div>
				<Label class="block mb-2">Old Password</Label>
				<Input bind:value={oldPassword} color="green" placeholder="Enter the password" />
			</div>
			<div>
				<Label class="block mb-2">New Password</Label>
				<Input bind:value={newPassword} color="green" placeholder="Enter the new password" />
			</div>
			<div>
				<Label class="block mb-2">Confirm Password</Label>
				<Input bind:value={confirmPassword} color="green" placeholder="Reenter the new password" />
			</div>
		</div>

		<div class="mt-4">
			<Button on:click={updatePassword} color="green">Save Changes</Button>
		</div>
	</div>
</div>

<Modal title="Incorrect Details" bind:open={errorModalOpened} autoclose outsideclose>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{error}</p>
	<svelte:fragment slot="footer">
		<Button
			color={'green'}
			on:click={() => {
				errorModalOpened = false;
				error = '';
			}}>Confirm</Button
		>
	</svelte:fragment>
</Modal>
