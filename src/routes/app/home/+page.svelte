<script lang="ts">
    import { Button, Checkbox, Toggle } from '#lib';
    import { api } from '#lib/api/api.ts';
    import { GoogleAuthService } from '#lib/services/google-auth.service.ts';
    import { userStore } from '#lib/stores/userStore.svelte.js';
    import { goto } from '$app/navigation';
    import { Plus } from '@lucide/svelte';
    import { onMount } from 'svelte';

    let { data } = $props();
</script>

<Checkbox.Root />
<Button.Root variant="ghost">123</Button.Root>
<Toggle.Root>hi</Toggle.Root>
<Button.Root onclick={() => goto('/auth')}>Auth</Button.Root>
<Button.Root onclick={() => goto('/app/calendar')}>Calendar</Button.Root>
<Button.Root variant="ghost" iconOnly><Plus /></Button.Root>
<Button.Root variant="ghost">>Link google</Button.Root>
<p>{data.userInfo?.username}</p>
<p>{data.userInfo?.email}</p>
<button onclick={() => userStore.logOut()}>Logout</button>
