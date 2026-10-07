<script>
    import { goto } from '$app/navigation';
    import { Button } from '#lib';
    import Railjet from '#lib/assets/svg/Railjet.svelte';
</script>

<div
    class="bg-bg-secondary flex flex-col items-center p-8 h-100dvh"
    data-page-bg="secondary"
>
    <Railjet size={300} />
    <div class="flex flex-col text-center gap-2 pb-12">
        <h1 class="text-3xl font-semibold">Welcome to Wayline</h1>
        <p class="text-xl text-muted-foreground font-light">
            The all-in-one app to manage your daily life with deep public transport
            integration.
        </p>
    </div>
    <div class="flex flex-col gap-2 w-full">
        <Button.Root onclick={() => goto('/auth/login?action=login')} class="h-12.5"
            >Login</Button.Root
        >
        <Button.Root
            class="h-12.5"
            onclick={() => goto('/auth/login?action=register')}
            variant="secondary">SignUp</Button.Root
        >
    </div>
</div>
