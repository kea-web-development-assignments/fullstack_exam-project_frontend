<script>
    export let thisForm;
    export let errorMessage = '';
    export let submitText = 'Submit';
    export let onSubmit = () => {};
</script>

<form
    class="w-[24rem] flex flex-col gap-3 bg-white drop-shadow-around-md rounded-md p-4"
    bind:this={thisForm}
    on:submit|preventDefault={onSubmit}
>
    <slot />
    {#if errorMessage}
        <p class="text-rose-500 text-center">{errorMessage}</p>
    {/if}
    <input
        class="bg-gray-700 text-white rounded-full cursor-pointer p-2 mt-2"
        type="submit"
        value={submitText}
    >
    <slot name="after-submit-button" />
</form>
