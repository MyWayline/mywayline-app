<script lang="ts">
    import '../app.css';

    let { children } = $props();
</script>

<div class="app-shell">
    {@render children()}
</div>

<style>
    :global(html),
    :global(body) {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    .app-shell {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        overflow: hidden;

        padding-top: env(safe-area-inset-top, 0px);
        padding-right: env(safe-area-inset-right, 0px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
        padding-left: env(safe-area-inset-left, 0px);
    }

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
