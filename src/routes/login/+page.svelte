<script lang="ts">
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import { getDoc, doc, getDocs, collection, where, query } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	let popupOpen = false;

	let email: string;
	let password: string;

	async function login() {

		let adminDocs = await getDocs(
			query(
				collection(db, 'admins'),
				where('email', '==', email),
				where('password', '==', password)
			)
		);

		if(adminDocs.docs.length > 0) {
			let admin = adminDocs.docs[0].data();

			Cookies.set('token', admin.token, {
				expires: 7,
				path: '/'
			});

			goto('/dashboard');
		} else {
			popupOpen = true;
		}
	}
</script>

<div class="flex min-h-screen justify-center items-center">
	<form class="flex flex-col space-y-6 bg-slate-200/40 dark:bg-gray-800 rounded-md p-6">
		<h1 class="mb-4 text-2xl font-medium text-gray-900 dark:text-white">Sign in</h1>
		<Label class="space-y-2">
			<span>Email</span>
			<Input
				bind:value={email}
				color={'green'}
				type="email"
				name="email"
				placeholder="name@company.com"
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Your password</span>
			<Input
				bind:value={password}
				color={'green'}
				type="password"
				name="password"
				placeholder="•••••"
				required
			/>
		</Label>
		<Button
			on:click={(event) => {
				event.preventDefault();
				login();
			}}
			color={'green'}
			type="submit"
			class="w-full">Login to your account</Button
		>
	</form>
</div>

<Modal title="Invalid Details" bind:open={popupOpen} size="sm" autoclose>
	<div class="text-base leading-relaxed">
		The details you entered are invalid. Please check and try again.
	</div>
	<svelte:fragment slot="footer">
		<Button color="green">Confirm</Button>
	</svelte:fragment>
</Modal>
