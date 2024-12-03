<script>
    import { Form } from '$lib/components';
    export let thisForm;
    export let submitText = 'Submit';
    export let errorMessage = '';
    export let redSubmitButton = false;
    export let onSubmit = () => {};
</script>

<Form
    bind:thisForm={thisForm}
    onSubmit={onSubmit}
>
    <slot />
    {#if errorMessage}
        <p class="text-rose-500 text-center">{errorMessage}</p>
    {/if}
    <input
        class="w-full bg-gray-700 text-white rounded-full cursor-pointer p-2"
        class:bg-rose-500={redSubmitButton}
        type="submit"
        value={submitText}
    >
    <slot name="after-submit-button" />
</Form>
