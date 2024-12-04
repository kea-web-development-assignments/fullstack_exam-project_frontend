<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { GameCard, GameSearchBar, InputField, MultiSelectField, Paginator } from '$lib/components';
    import { onMount } from 'svelte';

    let gamesCount = 0;
    let from;
    let start = 0;
    let limit = 30;
    let currentPage = 1;
    let gamesPromise = getGames();

    async function getGames() {
        const searchObject = {
            from: from || new Date().toISOString().split('T')[0],
            start,
            limit,
            currentPage,
        };

        Object.keys(searchObject).forEach(key => {
            if (searchObject[key] === '' || searchObject[key] === '[]' || searchObject[key] === undefined) {
                delete searchObject[key];
            }
        });

        const searchParams = new URLSearchParams(searchObject);
        goto(`?${searchParams.toString()}`);

        try {
            const response = await fetch(`${PUBLIC_API_URL}/games-calendar?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const data = await response.json();

            if(!isNaN(parseInt(data.count))) {
                gamesCount = parseInt(data.count);
            }

            data.groupedGames = data.groupedGames?.filter(group => group?._id && group?.games?.length);

            return data;
        } catch (error) {
            console.error('Failed to get games calendar:', error);
            return {
                error: { message: 'Something went wrong while getting games calendar. Please try again later.' }
            }
        }
    }

    function onSearch() {
        gamesPromise = getGames();
    }

    onMount(() => {
        const urlParams = Object.fromEntries($page.url.searchParams);

        if(urlParams.from) {
            from = new Date(urlParams.from);
        }
        if (urlParams.start) {
            start = parseInt(urlParams.start);
        }
        if (urlParams.limit) {
            limit = parseInt(urlParams.limit);
        }
        if (urlParams.currentPage) {
            currentPage = parseInt(urlParams.currentPage);
        }

        gamesPromise = getGames();
    });
</script>

<svelte:head>
    <title>Release Calendar | All About Games</title>
</svelte:head>

<section class="h-full w-full flex flex-col">
    {#await gamesPromise}
        <p class="text-xl text-center font-bold p-10">Loading games...</p>
    {:then data}
        {#if data.error}
            <p class="text-xl text-center font-bold p-10">{data.error.message}</p>
        {:else}
            {#if data.groupedGames?.length}
                {#each data.groupedGames as group}
                    <h2 class="text-4xl p-8 pl-4 pb-4">
                        {#if group._id === new Date().toLocaleDateString()}
                            Today
                        {:else if group._id === new Date((new Date).setDate((new Date).getDate() + 1)).toLocaleDateString()}
                            Tomorrow
                        {:else}
                            {group._id}
                        {/if}
                    </h2>
                    <section class="h-fit w-full flex flex-wrap gap-4">
                        {#each group.games as game}
                            <GameCard {...game} />
                        {/each}
                    </section>
                {/each}
                <Paginator
                    totalItems={gamesCount}
                    limit={limit}
                    bind:start={start}
                    bind:currentPage={currentPage}
                    on:change={onSearch}
                />
            {:else}
                <p class="text-xl text-center font-bold p-10">No games found</p>
            {/if}
        {/if}
    {/await}
</section>
