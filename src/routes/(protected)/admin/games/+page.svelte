<script>
    import { page } from '$app/stores';
    import { Modal, InputField, TextAreaField, GameForm, ImagePicker, MultiSelectField, GameCard } from '$lib/components';
    import { gameFieldsRegex } from '$lib/utils/validator.js';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { invalidateAll } from '$app/navigation';

    let showAddGameModal = false;
    let addGameForm;
    let addGameError = {};

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
        await invalidateAll();
    }
</script>

<section class="h-full w-full flex-col">
    <section class="w-full flex flex-col gap-8 justify-between p-8 sm:flex-row">
        <h1 class="text-5xl">Manage Games</h1>
        <button
            class="bg-blue-600 text-white font-bold px-4 py-2 rounded"
            on:click={() => showAddGameModal = true}
        >+ Add Game</button>
    </section>
    <section class="h-fit w-full flex flex-wrap justify-center gap-4">
        {#if $page.data.games.length}
            {#each $page.data.games as game}
                <GameCard
                    {...game}
                    showUpdateButton
                    showDeleteButton
                />
            {/each}
        {:else}
            <p class="text-xl text-center font-bold p-10">No games to list</p>
        {/if}
    </section>
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
