<script>
    import { page } from '$app/stores';
    import { GameCard } from '$lib/components';

    $: prettyGroup = $page.params.group ? $page.params.group.charAt(0).toUpperCase() + $page.params.group.slice(1).replaceAll('-', ' ') : '';
</script>

<svelte:head>
    <title>{prettyGroup} | All About Games</title>
</svelte:head>

<section class="h-full w-full flex flex-col">
    <section class="h-fit w-full flex flex-wrap justify-center gap-4">
        {#if $page.data.games?.length}
            {#each $page.data.games as { game }}
                <GameCard
                    {...game}
                    showRemoveFromListButton
                />
            {/each}
        {:else}
            <p class="text-xl text-center font-bold p-10">No games in this list</p>
        {/if}
    </section>
</section>
