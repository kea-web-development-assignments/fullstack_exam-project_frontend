<script>
    import { createEventDispatcher } from 'svelte';

    export let showModal = false;
    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch('close');
    }
</script>

{#if showModal}
    <section
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto mt-14 z-20 lg:mt-0 lg:left-72"
        on:click={closeModal}
        on:keydown={closeModal}
        role="button"
        tabindex="0"
    >
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <section
            class="max-h-full content-center justify-items-center cursor-default"
            on:click|stopPropagation
            on:keydown|stopPropagation
        >
            <slot></slot>
        </section>
    </section>
{/if}
