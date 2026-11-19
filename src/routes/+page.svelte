<script lang="ts">
    import { googleAuthService } from '#lib/shared/services/google-auth.service.ts';
    import { goto } from '$app/navigation';

    let darkMode = $state(false);

    let res2 = $state();
    const toggleTheme = () => {
        darkMode = !darkMode;
        document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    };

    const auth = async () => {
        let res = await googleAuthService.linkGoogleCalendarOnly();
        res2 = res.res?.accessToken + ' ||||| ' + res.res?.refreshToken;
        console.log(res);
    };
</script>

<p>You shouldn't be here!</p>
<div class="flex gap-2 flex-col">
    <button
        class="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        onclick={toggleTheme}
    >
        {darkMode ? 'Use light theme' : 'Use dark theme'}
    </button>
    <button
        class="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground"
        onclick={() => goto('/auth')}
    >
        Open calendar
    </button>
    <button
        class="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground"
        onclick={() => goto('/app/home')}
    >
        Home
    </button>

    <button
        class="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground"
        onclick={() => auth()}
    >
        Login
    </button>
    <p>{res2}</p>
</div>
