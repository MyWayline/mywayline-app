<script lang="ts">
    import '../app.css';

    let { children } = $props();
</script>

<div
    class="fixed inset-x-0 top-(--safe-top) bottom-(--safe-bottom) overflow-y-auto overscroll-contain"
>
    {@render children()}
</div>

<style>
    :global(.touch-target-safe) {
        position: relative;
    }

    :global(.touch-target-safe::before) {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 48px;
        min-height: 48px;
        width: 100%;
        height: 100%;
        z-index: 0;
    }
</style>
