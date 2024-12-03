<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { GameCard, GameSearchBar, InputField, MultiSelectField } from '$lib/components';
    import { onMount } from 'svelte';

    let searchQuery = '';
    let selectedTags = [];
    let selectedPlatforms = [];
    let fromDate;
    let toDate;
    let searchPromise = searchGames();

    async function searchGames() {
        const searchObject = {
            searchQuery,
            tags: JSON.stringify(selectedTags),
            platforms: JSON.stringify(selectedPlatforms),
            from: fromDate,
            to: toDate,
        };

        Object.keys(searchObject).forEach(key => {
            if (searchObject[key] === '' || searchObject[key] === '[]' || searchObject[key] === undefined) {
                delete searchObject[key];
            }
        });

        const searchParams = new URLSearchParams(searchObject);
        goto(`?${searchParams.toString()}`, { keepFocus: true });

        try {
            const response = await fetch(`${PUBLIC_API_URL}/games?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Failed to search games:', error);
            return {
                error: { message: 'Something went wrong while searching for games. Please try again later.' }
            }
        }
    }

    function onSearch() {
        searchPromise = searchGames();
    }

    onMount(() => {
        const urlParams = Object.fromEntries($page.url.searchParams);

        if(urlParams.searchQuery) {
            searchQuery = urlParams.query;
        }
        if(urlParams.tags) {
            selectedTags = JSON.parse(urlParams.tags);
        }
        if(urlParams.platforms) {
            selectedPlatforms = JSON.parse(urlParams.platforms);
        }
        if(urlParams.from) {
            fromDate = new Date(urlParams.from);
        }
        if(urlParams.to) {
            toDate = new Date(urlParams.to);
        }

        searchPromise = searchGames();
    });
</script>

<svelte:head>
    <title>Search | All About Games</title>
</svelte:head>

<section class="h-full w-full flex flex-col">
    <section class="w-full justify-items-center p-4">
        <GameSearchBar
            placeholder="The Witcher 3..."
            bind:query={searchQuery}
            on:search={onSearch}
        />
        <section class="w-full flex flex-wrap justify-center gap-4 p-4">
            <section class="flex-1 flex flex-wrap justify-center gap-4 md:justify-end">
                <MultiSelectField
                    containerClass="w-[18rem]"
                    labelClass="text-white pl-1"
                    label="Tags"
                    options={$page.data.tags.map(tag => tag.name)}
                    bind:selected={selectedTags}
                    on:change={onSearch}
                />
                <MultiSelectField
                    containerClass="w-[18rem]"
                    labelClass="text-white pl-1"
                    label="Platforms"
                    options={$page.data.platforms.map(platform => platform.name)}
                    bind:selected={selectedPlatforms}
                    on:change={onSearch}
                />
            </section>
            <section class="flex-1 flex flex-wrap justify-center gap-4 md:justify-start">
                <InputField
                    containerClass="w-[18rem]"
                    labelClass="text-white pl-1"
                    type="date"
                    label="From"
                    bind:value={fromDate}
                    on:change={onSearch}
                />
                <InputField
                    containerClass="w-[18rem]"
                    labelClass="text-white pl-1"
                    type="date"
                    label="To"
                    bind:value={toDate}
                    on:change={onSearch}
                />
            </section>
        </section>
    </section>
    <section class="h-fit w-full flex flex-wrap justify-center gap-4">
        {#await searchPromise}
            <p class="text-xl text-center font-bold p-10">Searching for games...</p>
        {:then data}
            {#if data.error}
                <p class="text-xl text-center font-bold p-10">{data.error.message}</p>
            {:else}
                {#if data.games?.length}
                    {#each data.games as game}
                        <GameCard {...game} />
                    {/each}
                {:else}
                    <p class="text-xl text-center font-bold p-10">No games found</p>
                {/if}
            {/if}
        {/await}
    </section>
</section>
