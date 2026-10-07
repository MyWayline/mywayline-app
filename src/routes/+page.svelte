<script lang="ts">
    import { Button, Checkbox, Toggle } from '#lib';
    import DateSelector from '#lib/app/misc/DateSelector.svelte';
    import ButtonBase from '#lib/ui/components/button/base/ButtonBase.svelte';
    import { goto } from '$app/navigation';
    import { Plus } from '@lucide/svelte';
</script>

<Checkbox.Root />
<Button.Root variant="ghost">123</Button.Root>
<Toggle.Root>hi</Toggle.Root>
<Button.Root onclick={() => goto('/auth')}>Auth</Button.Root>
<Button.Root onclick={() => goto('/calendar')}>Calendar</Button.Root>
<Button.Root variant="ghost" iconOnly><Plus /></Button.Root>
