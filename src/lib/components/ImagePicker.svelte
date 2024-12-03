<script>
    import Dropzone from "svelte-file-dropzone";

    export let name = '';
    export let label = '';
    export let required = false;
    export let requiredMarker = false;
    export let multiple = false;
    export let errorMessage = '';
    export let images = [];
    export let imagePreviews = [];

    let id = crypto.randomUUID();
    let inputElement;

    $: if(inputElement && id) {
        inputElement.setAttribute('id', id);

        // hide dropzone html input element, but keep validation
        inputElement.style = '';
        inputElement.classList.add('h-[1px]', 'w-[1px]', 'opacity-0');
    }

    function imageSelected(e) {
        errorMessage = '';
        imagePreviews = [];

        const { acceptedFiles, fileRejections } = e.detail;

        if(fileRejections.length > 0) {
            errorMessage = 'Only images are allowed';
            return;
        }

        imagePreviews = acceptedFiles.map(file => URL.createObjectURL(file));
        images = acceptedFiles;
    }
</script>

<section>
    <label
        class="pl-1 text-black"
        for={id}
    >
        {label}
        {#if required && requiredMarker}
            <span class="text-rose-500">*</span>
        {/if}
    </label>
    <Dropzone
        containerStyles="border-color: gray; color: gray; padding: .7rem; text-align: center;"
        accept="image/*"
        {name}
        {required}
        {multiple}
        bind:inputElement={inputElement}
        on:drop={imageSelected}
    >
        {#if imagePreviews?.length > 0}
            <section class="flex flex-wrap gap-4">
                {#each imagePreviews as image}
                    <img src={image} alt="Preview" class="flex-1 h-20 object-cover" />
                {/each}
            </section>
        {:else}
            <p class="text-gray-500">
                Drag and drop {multiple ? 'images' : 'an image'} here, or click to select {multiple ? 'images' : 'an image'}
            </p>
        {/if}
    </Dropzone>
    {#if errorMessage}
        <p class="text-rose-500">{errorMessage}</p>
    {/if}
</section>
