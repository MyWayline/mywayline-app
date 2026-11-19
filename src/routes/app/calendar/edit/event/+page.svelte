<script lang="ts">
    import { Button, Tabs } from '#lib';
    import * as FlowForm from '#lib/shared/components/FlowForm/index.ts';
    import { EventForm } from '#lib/app/calendar/forms/models/EventForm.ts';
    import { goto } from '$app/navigation';
    import { type PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let form = $derived(
        new EventForm({
            title: data.eventToEdit?.summary,
            startDate: data.eventToEdit?.dtstart,
            endDate: data.eventToEdit?.dtend,
            color: data.eventToEdit?.color,
            isAllDay: data.eventToEdit?.isAllDay,
            frequency: 'daily',
        })
    );

    $inspect(form.values);
</script>

<div class="h-full flex flex-col">
    <FlowForm.Base values={form.values} screens={form.screens} slideClass="p-6" />
    <div class="flex shrink-0 gap-2 p-6 pt-3">
        <Button.Root class="w-full">Create event</Button.Root>
        <Button.Root
            variant="secondary"
            class="w-full"
            onclick={() => goto('/app/calendar')}
        >
            Cancel
        </Button.Root>
    </div>
</div>
