<script>
    import { page } from '$app/stores';
    import { GameImage, InputField } from '$lib/components';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { invalidateAll } from '$app/navigation';

    let initialListGroup = 'want-to-play';
    let currentImageIndex = 0;

    function previousImage() {
        if(!$page.data.game.screenshots?.length) {
            return;
        }
        if((currentImageIndex - 1) < 0) {
            currentImageIndex = $page.data.game.screenshots.length - 1;
            return;
        }

        currentImageIndex -= 1;
    }
    function nextImage() {
        if(!$page.data.game.screenshots?.length) {
            return;
        }
        if((currentImageIndex + 1) >= $page.data.game.screenshots.length) {
            currentImageIndex = 0;
            return;
        }

        currentImageIndex += 1;
    }

    async function addGameToList(group) {
        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/me/list`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    id: $page.data.game._id,
                    group: group || initialListGroup,
                }),
            });
            data = await response.json();
        } catch (err) {
            console.error('Failed to add game to list:', err);
            alert('Something went wrong with adding the game to your list, try again later');
            return;
        }

        if(data.error) {
            alert(data.error);
            return;
        }

        await invalidateAll();
    }
    async function removeGameFromList() {
        let data;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/me/list/${$page.data.game._id}`, {
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

        await invalidateAll();
    }
</script>

<section class="h-full w-full flex flex-col gap-4 xl:[display:grid_!important] [grid-template-areas:'title_screenshots''content_screenshots'] grid-cols-2">
    <section class="xl:h-full flex justify-center items-end">
        <h1 class="[grid-area:title] text-4xl font-bold text-center line-clamp-2 md:text-ellipsis md:overflow-hidden lg:text-nowrap">
            {$page.data.game.name}
        </h1>
    </section>
    <section class="[grid-area:screenshots] w-full flex flex-col gap-4 p-2 xl:mt-20">
        <ul class="w-full relative flex justify-center items-center text-black">
            {#each $page.data.game.screenshots?.length ? $page.data.game.screenshots : [''] as screenshot, i}
                <li
                    class="w-full relative flex items-center"
                    class:flex={currentImageIndex === i}
                    class:hidden={currentImageIndex !== i}
                >
                    <button
                        class="w-7 h-7 absolute flex items-center justify-center bg-white text-xl rounded-full drop-shadow-around-md left-2 p-2 z-10"
                        on:click={previousImage}
                    >
                        &#10094;
                    </button>
                    <GameImage
                        elementClass="max-h-[30rem] w-full object-cover rounded-md"
                        src={screenshot}
                        alt={`${$page.data.game.name} screenshot`}
                    />
                    <button
                        class="w-7 h-7 absolute flex items-center justify-center bg-white text-xl rounded-full drop-shadow-around-md right-2 p-2 z-10"
                        on:click={nextImage}
                    >
                        &#10095;
                    </button>
                </li>
            {/each}
        </ul>
        {#if $page.data.game.listGroup}
            <select
                class="w-full bg-gray-200 border border-gray-400 p-2 text-black"
                value={$page.data.game.listGroup}
                on:change={(e) => addGameToList(e.target.value)}
            >
                <option value="want-to-play">Want to play</option>
                <option value="playing">Playing</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="dropped">Dropped</option>
            </select>
            <button
                class="w-full bg-rose-500 color-white text-lg text-center font-bold rounded-lg p-3"
                on:click={removeGameFromList}
            >
                Remove from list
            </button>
        {:else}
            <button
                class="w-full bg-blue-500 color-white text-lg text-center font-bold rounded-lg p-3"
                on:click={() => addGameToList()}
            >
                Add to list
            </button>
        {/if}
    </section>
    <section class="[grid-area:content] w-full flex flex-col gap-8">
        <section>
            <h2 class="text-2xl">Description</h2>
            <p class="whitespace-pre-line mt-2">
                {$page.data.game.description}
            </p>
        </section>
        <section class="w-full grid grid-cols-2 gap-4">
            <section>
                <h3 class="font-bold">Platforms</h3>
                <p>
                    {#if $page.data.game.platforms?.length}
                        {#each $page.data.game.platforms as platform, i}
                            {#if i < $page.data.game.platforms.length - 1}
                                <a class="underline" href="/search?platform={platform.name}">
                                    {platform.name}
                                </a>, &nbsp;
                            {:else}
                                <a class="underline" href="/search?platform={platform.name}">
                                    {platform.name}
                                </a>
                            {/if}
                        {/each}
                    {:else}
                        Unknown
                    {/if}
                </p>
            </section>
            <section>
                <h3 class="font-bold">Tags</h3>
                <p>
                    {#if $page.data.game.tags?.length}
                        {#each $page.data.game.tags as tag, i}
                            {#if i < $page.data.game.tags.length - 1}
                                <a class="underline" href="/search?tag={tag.name}">
                                    {tag.name}
                                </a>, &nbsp;
                            {:else}
                                <a class="underline" href="/search?tag={tag.name}">
                                    {tag.name}
                                </a>
                            {/if}
                        {/each}
                    {:else}
                        Unknown
                    {/if}
                </p>
            </section>
            <section>
                <h3 class="font-bold">Release Date</h3>
                <p>
                    {#if $page.data.game.releaseDate}
                        {new Date($page.data.game.releaseDate).toLocaleDateString()}
                    {:else}
                        Unknown
                    {/if}
                </p>
            </section>
        </section>
    </section>
</section>
