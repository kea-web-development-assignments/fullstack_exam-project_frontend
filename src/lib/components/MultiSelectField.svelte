<script>
    import MultiSelect from 'svelte-multiselect';

    export let containerClass = '';
    export let labelClass = 'text-black pl-1';
    export let multiSelectClass = 'w-full bg-gray-200 border border-gray-400 p-2 text-black';
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

<section class={containerClass}>
    <label
        class={labelClass}
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
        outerDivClass={multiSelectClass}
        noMatchingOptionsMsg="No matching {name}"
        maxOptions={5}
        selectedOptionsDraggable={false}
        --sms-placeholder-color="gray"
        --sms-remove-btn-hover-bg="red"
        {id}
        {name}
        {placeholder}
        bind:selected={selected}
        {options}
        {required}
        on:blur={() => {
            if(!outerDivElement.matches(':focus-within')) {
                showDropdown = false;
            }
        }}
        on:change
    />
    {#if errorMessage}
        <p class="text-rose-500">{errorMessage}</p>
    {/if}
</section>
