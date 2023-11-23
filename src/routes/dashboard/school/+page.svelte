<script>
	import { Button, Fileupload, Input, Label } from "flowbite-svelte";

    let color = "green";
</script>

<div class="px-12 py-8">
	<div class="bg-white p-4 rounded-md">
		<h1 class="text-xl font-semibold">Edit School</h1>

		<div class="flex flex-row mt-4 gap-4">
            <div>
                <Label class="block mb-2">School Name</Label>
                <Input color="green" placeholder="Enter the name"/>
            </div>
            <div>
                <Label class="block mb-2">Phone</Label>
                <Input color="green" placeholder="Enter the number"/>
            </div>
            <div>
                <Label class="block mb-2">Email</Label>
                <Input color="green" placeholder="Enter the email"/>
            </div>
        </div>
        <div class="flex flex-col mt-4">
            
                <Label class="block mb-2">School Name</Label>
                <Input color="green" placeholder="Address"/>
            
        </div>
        <div class="flex flex-row mt-4 gap-4">
            <div>
                <Label class="block mb-2">Head School Name</Label>
                <Input color="green" placeholder="Enter the name"/>
            </div>
            <div>
                <Label class="block mb-2">Head Master Name</Label>
                <Input color="green" placeholder="Enter the name"/>
            </div>
            <div>
                <Label class="block mb-2">Help Desk Number</Label>
                <Input color="green" placeholder="Enter the number"/>
            </div>
        </div>
        <div class="flex flex-col mt-4 ">
            <Label class="block mb-2">School Logo</Label>
            <Fileupload color="green" placeholder="Upload School Logo"/>
        </div>
        <div class="mt-4">
            <Button color="green">Save</Button>
        </div>
	</div>
</div>
