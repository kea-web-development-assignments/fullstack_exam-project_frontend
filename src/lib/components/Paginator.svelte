<script>
    import { createEventDispatcher } from 'svelte';
    import PaginatorButton from './PaginatorButton.svelte';

    export let start;
    export let limit;
    export let totalItems;
    export let currentPage;

    const dispatch = createEventDispatcher();

    $: totalPages = Math.ceil(totalItems / limit);

    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            start = (currentPage - 1) * limit;
            dispatch('change');
        }
    }

    function getVisiblePages() {
        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }
</script>

<section class="w-full flex justify-center items-center py-4">
    <PaginatorButton 
        on:click={() => goToPage(1)} 
        disabled={currentPage <= 1}
    >
        &laquo;
    </PaginatorButton>
    <PaginatorButton 
        on:click={() => goToPage(currentPage - 1)} 
        disabled={currentPage <= 1}
    >
        &larr;
    </PaginatorButton>
    {#each getVisiblePages() as pageNum}
        <PaginatorButton 
            on:click={() => goToPage(pageNum)} 
            isCurrentPage={currentPage === pageNum}
        >
            {pageNum}
        </PaginatorButton>
    {/each}
    <PaginatorButton 
        on:click={() => goToPage(currentPage + 1)} 
        disabled={currentPage >= totalPages}
    >
        &rarr;
    </PaginatorButton>
    <PaginatorButton 
        on:click={() => goToPage(totalPages)} 
        disabled={currentPage >= totalPages}
    >
        &raquo;
    </PaginatorButton>
</section>
