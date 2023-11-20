<script>
	import { page } from '$app/stores';
	let links = [
        { name: 'Students', href: '/dashboard' },
		{ name: 'School', href: '/dashboard/school' },
	];
</script>

<div
	class="sticky top-0 py-4 px-2 left-0 min-w-[20vw] flex flex-col bg-[#2a3042] text-white border-r border-r-gray-200 dark:border-r-gray-700 min-h-screen"
>
	<div class="flex flex-row justify-center mt-8">
		<img class="w-20 h-20" src={'/favicon.png'} alt="" />
	</div>
    <div class="mt-12">
        {#each links as link}
            <a href={link.href} class="{$page.url.pathname == link.href ? "text-white" : "text-gray-400"} rounded-md flex cursor-pointer px-4 py-3">
                <span>{link.name}</span>
            </a>
        {/each}
    </div>
</div>
