<script>
    export let containerClass = '';
    export let labelClass = 'text-black pl-1';
    export let inputClass = 'w-full bg-gray-200 border border-gray-400 rounded-sm p-2 text-black';
    export let type = 'text';
    export let name = '';
    export let label = '';
    export let placeholder = '';
    export let title = '';
    export let pattern = '.*';
    export let accept;
    export let required = false;
    export let requiredMarker = false;
    export let multiple = false;
    export let value = '';
    export let errorMessage = '';

    let id = crypto.randomUUID();
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
    <input
        class={inputClass}
        {id}
        {...{type}}
        {name}
        {placeholder}
        {title}
        {pattern}
        {accept}
        {required}
        {multiple}
        bind:value={value}
        on:change
    />
    {#if errorMessage}
        <p class="text-rose-500">{errorMessage}</p>
    {/if}
</section>
