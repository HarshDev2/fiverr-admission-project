<script>
	import Navbar from "$components/navbar.svelte";
	import Sidebar from "$components/sidebar.svelte";
</script>

<div class="flex flex-row">
    <Sidebar />

    <div class="flex flex-col grow pt-4">
        <!-- <Navbar /> -->
        <slot />
    </div>
</div>