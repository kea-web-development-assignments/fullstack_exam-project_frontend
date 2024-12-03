<script>
    export let thisForm;
    export let onSubmit = () => {};
</script>

<form
    class="max-w-[24rem] w-full flex flex-col gap-3 bg-white text-black drop-shadow-around-md rounded-md p-4 m-2"
    bind:this={thisForm}
    on:submit|preventDefault={onSubmit}
>
    <slot />
</form>
