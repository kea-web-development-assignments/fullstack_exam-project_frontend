<script>
    import { page } from '$app/stores';
    import { Modal, InputField, TextAreaField, Form, GameForm, ImagePicker, MultiSelectField, GameCard, GameImage } from '$lib/components';
    import { gameFieldsRegex } from '$lib/utils/validator.js';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { invalidateAll } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';

    export let _id;
    export let slug;
    export let name;
    export let releaseDate;
    export let description;
    export let image = '';
    export let screenshots;
    export let tags;
    export let platforms;
    export let showDeleteButton;
    export let showUpdateButton;
    export let showRemoveFromListButton;

    let updateGameForm;

    let showUpdateGameModal = false;
    let showDeleteGameModal = false;

	let updateError = {};
	let deleteError = {};

    const dispatch = createEventDispatcher();

    async function updateGame() {
        updateError = {};
        const gameFormData = new FormData(updateGameForm);

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
            const response = await fetch(`${PUBLIC_API_URL}/games/${_id}`, {
                method: 'PATCH',
                body: gameFormData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            data = await response.json();
        } catch (err) {
            console.error('Failed to update game:', err);
            alert('Something went wrong with updating the game, try again later');
            return;
        }

		if(data.error) {
			updateError = data.error;
			return;
		}

        showUpdateGameModal = false;
        dispatch('change');
        await invalidateAll();
    }

    async function deleteGame() {
        deleteError = {};

        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/games/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
			data = await response.json();
        } catch (err) {
            console.error('Failed to delete the game:', err);
            alert('Something went wrong with deleting the game, try again later');
            return;
        }

		if(data.error) {
			deleteError = data.error;
			return;
		}

        showDeleteGameModal = false;
        dispatch('change');
        await invalidateAll();
    }

    async function removeGameFromList() {
        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/me/list/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            data = await response.json();
        } catch (err) {
            console.error('Failed to remove game from list:', err);
            alert('Something went wrong with removing the game from your list, try again later');
            return;
        }

        if(data.error) {
            alert(data.error);
            return;
        }

        dispatch('change');
        await invalidateAll();
    }
</script>

<a
    href={`/games/${slug}`}
    class="w-[20rem] min-w-[0] flex flex-col bg-slate-200 text-black rounded-md drop-shadow-around-md duration-200 hover:transform hover:-translate-y-1"
    data-sveltekit-preload-data="tap"
>
    <GameImage
        src={image}
        alt={name}
    />
    <section class="flex-1 max-h-44 p-3 flex flex-col gap-2">
        <section class="flex-1">
            <h3 class="text-lg font-bold text-ellipsis overflow-hidden text-nowrap mb-1">{name}</h3>
            <p class="text-ellipsis overflow-hidden line-clamp-3">{description}</p>
        </section>
        <section class="flex justify-end text-lg gap-2">
            {#if showRemoveFromListButton}
                <button
                    class="w-3/5 bg-rose-500 text-white text-center rounded-lg cursor-pointer p-1"
                    on:click|stopPropagation|preventDefault={removeGameFromList}
                >
                    Remove from list
                </button>
            {/if}
            {#if showDeleteButton}
                <button
                    class="w-1/3 bg-rose-500 text-white text-center rounded-lg cursor-pointer p-1"
                    on:click|stopPropagation|preventDefault={() => showDeleteGameModal = true}
                >
                    Delete
                </button>
            {/if}
            {#if showUpdateButton}
                <button
                    class="w-1/3 bg-blue-500 text-white text-center rounded-lg cursor-pointer p-1"
                    on:click|stopPropagation|preventDefault={() => showUpdateGameModal = true}
                >
                    Update
                </button>
            {/if}
        </section>
    </section>
</a>

<Modal
    bind:showModal={showUpdateGameModal}
    on:close={() => showUpdateGameModal = false}
>
    <GameForm
        bind:thisForm={updateGameForm}
        submitText="Update Game"
        errorMessage={updateError?.message}
        onSubmit={updateGame}
        on:close
    >
        <InputField
            name="name"
            label="Name"
            placeholder="The Witcher 3: Wild Hunt"
            title="Must be between 1-100 characters"
            value={name}
            pattern={gameFieldsRegex.name}
            errorMessage={updateError?.fields?.name}
            required
        />
        <InputField
            type="date"
            name="releaseDate"
            label="Release date"
            value={releaseDate}
        />
        <TextAreaField
            name="description"
            label="Description"
            placeholder="The Witcher 3: Wild Hunt is a story-driven, open world role-playing game set in a..."
            value={description}
            errorMessage={updateError?.fields?.description}
            required
        />
        <ImagePicker
            name="image"
            label="Image"
            imagePreviews={image ? [image] : []}
            errorMessage={updateError?.fields?.image}
        />
        <ImagePicker
            name="screenshots[]"
            label="Screenshots"
            imagePreviews={screenshots ?? []}
            errorMessage={updateError?.fields?.screenshots}
            multiple
        />
        <MultiSelectField
            name="tags"
            label="Tags"
            placeholder="Action, Adventure, RPG"
            options={$page.data.tags?.map(tag => tag.name)}
            selected={tags.map(tag => tag.name)}
            errorMessage={updateError?.fields?.tags}
        />
        <MultiSelectField
            name="platforms"
            label="Platforms"
            placeholder="PC, PS4, Xbox One"
            options={$page.data.platforms?.map(platform => platform.name)}
            selected={platforms.map(platform => platform.name)}
            errorMessage={updateError?.fields?.platforms}
        />
    </GameForm>
</Modal>

<Modal
    bind:showModal={showDeleteGameModal}
    on:close={() => showDeleteGameModal = false}
>
    <Form>
        <h2 class="text-2xl font-bold">Delete Game</h2>
        <p class="mt-2">Are you sure you want to delete "{name}"?</p>
        {#if deleteError?.message}
            <p class="text-rose-500 text-center">{deleteError.message}</p>
        {/if}
        <section class="flex gap-16 mt-3">
            <button
                class="w-full bg-blue-500 text-white text-center text-lg rounded-lg cursor-pointer p-1"
                on:click={() => showDeleteGameModal = false}
            >
                Close
            </button>
            <button
                class="w-full bg-rose-500 text-white text-center text-lg rounded-lg cursor-pointer p-1"
                on:click={deleteGame}
            >
                Delete
            </button>
        </section>
    </Form>
</Modal>
