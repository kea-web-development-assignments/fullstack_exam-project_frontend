<script>
    import { page } from '$app/stores';
    import { Modal, InputField, TextAreaField, GameForm, ImagePicker, MultiSelectField, GameCard, Paginator, GameSearchBar } from '$lib/components';
    import { gameFieldsRegex } from '$lib/utils/validator.js';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { invalidateAll, goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let showAddGameModal = false;
    let addGameForm;
    let addGameError = {};

    let searchQuery = '';
    let gamesCount = 0;
    let start = 0;
    let limit = 30;
    let currentPage = 1;
    let searchPromise = searchGames();

    async function addGame() {
        addGameError = {};
        const gameFormData = new FormData(addGameForm);

        if(gameFormData.get('releaseDate')) {
            gameFormData.set('releaseDate', new Date(gameFormData.get('releaseDate')).toISOString());
        }

        if(gameFormData.get('tags')) {
            const selectedTags = $page.data.tags.filter(tag => JSON.parse(gameFormData.get('tags')).includes(tag.name));
            gameFormData.delete('tags');
            for (const tag of selectedTags) {
                gameFormData.append('tags[]', JSON.stringify(tag));
            }
        }

        if(gameFormData.get('platforms')) {
            const selectedPlatforms = $page.data.platforms.filter(platform => JSON.parse(gameFormData.get('platforms')).includes(platform.name));
            gameFormData.delete('platforms');
            for (const platform of selectedPlatforms) {
                gameFormData.append('platforms[]', JSON.stringify(platform));
            }
        }

        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/games`, {
                method: 'POST',
                body: gameFormData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            data = await response.json();
        } catch (err) {
            console.error('Failed to add game:', err);
            alert('Something went wrong with adding the game, try again later');
            return;
        }

        if(data.error) {
            addGameError = data.error;
            return;
        }

        showAddGameModal = false;
        await onSearch();
        await invalidateAll();
    }

    async function searchGames() {
        const searchObject = {
            searchQuery,
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
        goto(`?${searchParams.toString()}`, { keepFocus: true });

        try {
            const response = await fetch(`${PUBLIC_API_URL}/games?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const data = await response.json();

            if(!isNaN(parseInt(data.count))) {
                gamesCount = parseInt(data.count);
            }

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
        if (urlParams.start) {
            start = parseInt(urlParams.start);
        }
        if (urlParams.limit) {
            limit = parseInt(urlParams.limit);
        }
        if (urlParams.currentPage) {
            currentPage = parseInt(urlParams.currentPage);
        }

        searchPromise = searchGames();
    });
</script>

<svelte:head>
    <title>Manage Games | All About Games</title>
</svelte:head>

<section class="h-full w-full flex flex-col items-center mt-4">
    <section class="w-full flex flex-col gap-4 justify-between p-2 mb-8 sm:flex-row">
        <h1 class="text-5xl">Manage Games</h1>
        <button
            class="bg-blue-600 text-white font-bold px-4 py-2 rounded"
            on:click={() => showAddGameModal = true}
        >+ Add Game</button>
    </section>
    <GameSearchBar
        placeholder="The Witcher 3..."
        bind:query={searchQuery}
        on:search={onSearch}
    />
    <section class="h-fit w-full flex flex-wrap justify-center gap-4 mt-8">
        {#await searchPromise}
            <p class="text-xl text-center font-bold p-10">Searching for games...</p>
        {:then data}
            {#if data.error}
                <p class="text-xl text-center font-bold p-10">{data.error.message}</p>
            {:else}
                {#if data.games?.length}
                    {#each data.games as game}
                        <GameCard
                            {...game}
                            showUpdateButton
                            showDeleteButton
                            on:change={onSearch}
                        />
                    {/each}
                {:else}
                    <p class="text-xl text-center font-bold p-10">No games found</p>
                {/if}
            {/if}
        {/await}
    </section>
    <Paginator
        totalItems={gamesCount}
        limit={limit}
        bind:start={start}
        bind:currentPage={currentPage}
        on:change={onSearch}
    />
</section>

<Modal
    bind:showModal={showAddGameModal}
    on:close={() => showAddGameModal = false}
>
    <GameForm
        bind:thisForm={addGameForm}
        submitText="Add Game"
        errorMessage={addGameError?.message}
        onSubmit={addGame}
        on:close={() => showAddGameModal = false}
    >
        <InputField
            name="name"
            label="Name"
            placeholder="The Witcher 3: Wild Hunt"
            title="Must be between 1-100 characters"
            pattern={gameFieldsRegex.name}
            errorMessage={addGameError?.fields?.name}
            required
        />
        <InputField
            type="date"
            name="releaseDate"
            label="Release date"
        />
        <TextAreaField
            name="description"
            label="Description"
            placeholder="The Witcher 3: Wild Hunt is a story-driven, open world role-playing game set in a..."
            errorMessage={addGameError?.fields?.description}
            required
        />
        <ImagePicker
            name="image"
            label="Image"
            errorMessage={addGameError?.fields?.image}
        />
        <ImagePicker
            name="screenshots[]"
            label="Screenshots"
            errorMessage={addGameError?.fields?.screenshots}
            multiple
        />
        <MultiSelectField
            name="tags"
            label="Tags"
            placeholder="Action, Adventure, RPG"
            options={$page.data.tags?.map(tag => tag.name)}
            errorMessage={addGameError?.fields?.tags}
        />
        <MultiSelectField
            name="platforms"
            label="Platforms"
            placeholder="PC, PS4, Xbox One"
            options={$page.data.platforms?.map(platform => platform.name)}
            errorMessage={addGameError?.fields?.platforms}
        />
    </GameForm>
</Modal>
