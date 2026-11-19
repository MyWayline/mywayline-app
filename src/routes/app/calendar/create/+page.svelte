<script>
    import { Button, Tabs } from '#lib';
    import * as FlowForm from '#lib/shared/components/FlowForm/index.ts';
    import { EventForm } from '#lib/app/calendar/forms/models/EventForm.ts';
    import { goto } from '$app/navigation';

    let form = new EventForm();

    const handleSubmit = () => {
        console.log(form.validate());
    };
</script>

<div data-page-bg="secondary" class="h-full flex flex-col">
    <Tabs.Root value="event" class="flex h-full min-h-0 flex-col">
        <Tabs.List variant="secondary" class="mx-8 my-4 bg-bg-primary">
            <Tabs.Trigger variant="secondary" value="event">Event</Tabs.Trigger>
            <Tabs.Trigger variant="secondary" value="task" disabled>Task</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
            value="event"
            class="bg-bg-primary rounded-t-[3rem] h-full min-h-0 flex flex-col overflow-hidden"
        >
            <FlowForm.Base
                bind:values={form.values}
                screens={form.screens}
                slideClass="p-6"
            />

            <div class="flex shrink-0 gap-2 p-6 pt-3">
                <Button.Root class="w-full" onclick={() => handleSubmit()}
                    >Create event</Button.Root
                >
                <Button.Root
                    variant="secondary"
                    class="w-full"
                    onclick={() => goto('/app/calendar')}
                >
                    Cancel
                </Button.Root>
            </div>
        </Tabs.Content>
        <Tabs.Content value="task"></Tabs.Content>
    </Tabs.Root>
</div>
