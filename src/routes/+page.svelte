<script lang="ts">
    import { goto } from '$app/navigation';

    let darkMode = $state(false);

    const toggleTheme = () => {
        darkMode = !darkMode;
        document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    };
</script>

<p>You shouldn't be here!</p>
<div class="flex gap-2">
    <button
        class="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        onclick={toggleTheme}
    >
        {darkMode ? 'Use light theme' : 'Use dark theme'}
    </button>
    <button
        class="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground"
        onclick={() => goto('/calendar2')}
    >
        Open calendar
    </button>
    <button
        class="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground"
        onclick={() => goto('/app/home')}
    >
        Home
    </button>
</div>
