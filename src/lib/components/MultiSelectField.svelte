<script>
    import MultiSelect from 'svelte-multiselect';

    export let name = '';
    export let label = '';
    export let placeholder = '';
    export let selected = [];
    export let options = [];
    export let required = false;
    export let requiredMarker = false;
    export let errorMessage = '';

    let id = crypto.randomUUID();
    let outerDivElement;
    let showDropdown;
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
    <MultiSelect
        bind:outerDiv={outerDivElement}
        bind:open={showDropdown}
        outerDivClass="w-full bg-gray-200 border border-gray-400 p-2 text-black"
        noMatchingOptionsMsg="No matching {name}"
        maxOptions={5}
        selectedOptionsDraggable={false}
        --sms-placeholder-color="gray"
        {id}
        {name}
        {placeholder}
        {selected}
        {options}
        {required}
        on:blur={() => {
            if(!outerDivElement.matches(':focus-within')) {
                showDropdown = false;
            }
        }}
    />
    {#if errorMessage}
        <p class="text-rose-500">{errorMessage}</p>
    {/if}
</section>
