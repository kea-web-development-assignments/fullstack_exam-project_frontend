<script>
    import placeholderImage from '$lib/assets/images/placeholder.png';
    import { onMount } from 'svelte';

    export let elementClass = 'h-60 w-full object-cover rounded-t-md';
    export let src = '';
    export let alt = '';

    function changeImageSrcToFallback(e) {
        e.target.src = placeholderImage;
    }

    onMount(() => {
        if(!src) {
            src = placeholderImage;
        }
    });
</script>

<img
    class={elementClass}
    {src}
    {alt}
    on:error={changeImageSrcToFallback}
>
