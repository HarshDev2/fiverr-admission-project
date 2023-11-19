<script>
	import { goto } from '$app/navigation';
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	let popupOpen = false;

	let email;
	let password;
</script>

<div class="flex min-h-screen justify-center items-center">
	<form class="flex flex-col space-y-6 bg-slate-200/40 rounded-md p-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Sign in</h3>
		<Label class="space-y-2">
			<span>Email</span>
			<Input bind:value={email} color={'green'} type="email" name="email" placeholder="name@company.com" required />
		</Label>
		<Label class="space-y-2">
			<span>Your password</span>
			<Input bind:value={password} color={'green'} type="password" name="password" placeholder="•••••" required />
		</Label>
		<Button
			on:click={(event) => {
        event.preventDefault();

				if (password != 'test' && email != 'test@gmail.com') {
					popupOpen = true;
				} else {
					goto('/dashboard');
				}
			}}
			color={'green'}
			type="submit"
			class="w-full1">Login to your account</Button
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
