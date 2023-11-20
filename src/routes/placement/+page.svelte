<script>
	import { Button, Input, Modal, Alert } from 'flowbite-svelte';
	let number = '';

	let popupOpen = false;

	let color = 'green';
</script>

<div
	class="bg-background text-white flex flex-col min-h-[100vh] items-center justify-center"
>
	<div
		class="flex flex-col min-h-[50vh] lg:min-h-[50vh] items-center p-8 rounded-md bg-muted-background"
	>
		<h1 class="text-2xl text-[#1aa841] font-semibold mb-4">PEKI SENIOR HIGH SCHOOL</h1>
		<img class="max-h-[20vh]" src={'/favicon.png'} alt="School Logo" />
		<h1 class="text-xl text-black mt-6 font-bold text-center">Student's Login</h1>
		<div class="w-4/5 mt-4 flex flex-col">
            <span class="text-[15px] my-1 text-white">Index Number</span>
			<Input
				bind:value={number}
				color="green"
				defaultClass="w-full"
				placeholder="E.g. xxxxxxxxxx23"
			/>
			<span class="text-[14px] mt-1 text-gray-400">Add the year you completed JHS</span>
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
					popupOpen = true;
				}}
				class="w-3/5"
				color="green">Login</Button
			>
		</div>

		<Modal title="Invalid Number" bind:open={popupOpen} size="sm" autoclose>
			<div class="text-base leading-relaxed">
				The Index Number you entered is invalid. Please check and try again.
			</div>
			<svelte:fragment slot="footer">
				<Button color="green">Confirm</Button>
			</svelte:fragment>
		</Modal>
	</div>
</div>
