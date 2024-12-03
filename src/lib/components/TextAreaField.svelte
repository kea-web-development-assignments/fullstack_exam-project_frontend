<script>
    export let name = '';
    export let label = '';
    export let placeholder = '';
    export let required = false;
    export let requiredMarker = false;
    export let value = '';
    export let errorMessage = '';

    let id = crypto.randomUUID();
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
    <textarea
        class="w-full h-[5.7rem] max-h-56 bg-gray-200 border border-gray-400 text-black p-2"
        {id}
        {name}
        {placeholder}
        {required}
        bind:value={value}
    ></textarea>
    {#if errorMessage}
        <p class="text-rose-500">{errorMessage}</p>
    {/if}
</section>
