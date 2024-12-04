<script>
    export let disabled;
    export let isCurrentPage = false;
</script>

<button
    class="rounded mx-1 px-2 py-1 sm:px-4 sm:py-2"
    class:bg-blue-600={!isCurrentPage && !disabled}
    class:bg-blue-400={isCurrentPage && !disabled}
    class:text-white={!disabled}
    class:bg-gray-400={disabled}
    class:text-gray-500={disabled}
    disabled={disabled}
    on:click
>
    <slot />
</button>
