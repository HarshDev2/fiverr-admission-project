<script>
	import { theme } from '../store';
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';

	let currentTheme = 'dark';

	onMount(() => {
		if (!Cookies.get('theme')) {
			Cookies.set('theme', 'dark');
			currentTheme = 'dark';
		} else currentTheme = Cookies.get('theme');

		theme.set(currentTheme);

		theme.subscribe((newTheme) => {
			Cookies.set('theme', newTheme);
			currentTheme = newTheme;
		});
	});
</script>

<div class="{$theme == "dark" ? "dark bg-dark-background text-white" : "bg-[#fffefe]"} min-h-screen flex flex-col">
	<slot />
</div>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
