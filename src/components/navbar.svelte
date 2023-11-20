<script>
	import {
		Label,
		Input,
		Avatar,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,
		Tooltip,
        Search
	} from 'flowbite-svelte';

	import { Moon, Sun } from 'radix-icons-svelte';

	import { DarkMode } from 'flowbite-svelte';
	// import { SunSolid, MoonSolid } from 'flowbite-svelte-icons';

	import { theme } from '../store';
</script>

<div class="h-[72px] bg-muted-background border-b border-gray-200 dark:border-b-gray-700 flex flex-row px-12 gap-4 justify-end items-center">
    <div class="flex flex-row justify-end">
        <Search color="green" class="!w-fit" placeholder="Search..." size="md"/>
    </div>

	<Avatar
		id="user-drop"
		src="https://flowbite-svelte.com/images/profile-picture-3.webp"
		class="cursor-pointer"
	/>
	<Dropdown triggeredBy="#user-drop">
		<DropdownHeader>
			<span class="block text-sm">Bonnie Green</span>
			<span class="block truncate text-sm font-medium">name@pesco.com</span>
		</DropdownHeader>
		<DropdownItem>Dashboard</DropdownItem>
		<DropdownItem>Settings</DropdownItem>
		<DropdownItem>Earnings</DropdownItem>
		<DropdownDivider />
		<DropdownItem>Sign out</DropdownItem>
	</Dropdown>
</div>
