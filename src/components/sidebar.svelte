<script>
	import { page } from '$app/stores';
	import Cookies from 'js-cookie';

	let links = [
		{ name: 'Students', href: '/dashboard' },
		{ name: 'School', href: '/dashboard/school' },
		{
			name: 'Password',
			href: '/dashboard/password'
		},
		{
			name: 'Actions',
			href: '/dashboard/actions'
		},
		{
			name: 'Programmes',
			href: '/dashboard/programmes'
		},
		{
			name: 'Class',
			href: '/dashboard/class'
		},
		{
			name: 'Houses/Bed Capacity',
			href: '/dashboard/houses'
		}
	];

	let sideBarDiv;

	let sideBarOpened = false;

	function handleClickOutside(event) {
		if (
			!event.target.closest('.hamburger-button') &&
			sideBarDiv != event.target &&
			!sideBarDiv.contains(event.target)
		) {
			sideBarOpened = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<button
	on:click={() => {
		sideBarOpened = true;
	}}
	class="fixed hamburger-button top-6 left-4 flex md:hidden"
>
	<svg xmlns="http://www.w3.org/2000/svg" height="1.2em" width="1.2em" viewBox="0 0 448 512"
		><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
			d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
		/></svg
	>
</button>

<div
	bind:this={sideBarDiv}
	class="{sideBarOpened
		? 'flex'
		: 'hidden'} fixed min-w-[40vw] md:!sticky top-0 py-4 px-2 left-0 md:min-w-[20vw] md:!flex flex-col bg-[#2a3042] text-white border-r border-r-gray-200 dark:border-r-gray-700 min-h-screen"
>
	<div class="flex flex-row justify-center mt-8">
		<img class="w-20 h-20" src={'/favicon.png'} alt="" />
	</div>
	<div class="mt-12">
		{#each links as link}
			<a
				href={link.href}
				class="{$page.url.pathname == link.href
					? 'text-white'
					: 'text-gray-400'} rounded-md flex cursor-pointer px-4 py-3"
			>
				<span>{link.name}</span>
			</a>
		{/each}
		<button
			on:click={() => {
				Cookies.remove('token');
				location.reload();
			}}
			class="text-gray-400 rounded-md flex cursor-pointer px-4 py-3"
		>
			<span>Logout</span>
		</button>
	</div>
</div>
