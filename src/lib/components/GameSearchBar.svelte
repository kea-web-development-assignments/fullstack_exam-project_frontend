<script>
    import { createEventDispatcher } from 'svelte';

    export let query = '';
    export let placeholder = '';
    export let debounceDelay = 500;

    const dispatch = createEventDispatcher();
    let timer;

    function debounceSearch() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            dispatch('search', { query });
        }, debounceDelay);
    }

    function search(event) {
        dispatch('search', { query });
    }
</script>

<form on:submit|preventDefault={search} class="max-w-[40rem] w-full flex flex-col gap-2 sm:flex-row">
    <input
        class="w-full border border-gray-400 text-black rounded-full p-2"
        type="text"
        {placeholder}
        bind:value={query}
        on:input={debounceSearch}
    />
    <input
        class="w-full bg-blue-500 text-white rounded-full p-2 cursor-pointer sm:w-24"
        type="submit"
        value="Search"
    />
</form>
