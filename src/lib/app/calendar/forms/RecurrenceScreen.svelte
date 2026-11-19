<script lang="ts">
    import { Button, Input, RadioGroup, ToggleGroup } from '#lib';
    import * as FlowForm from '#lib/shared/components/FlowForm/index.ts';
    import { DateFormat, formatDate } from '#lib/shared/utils/DateFormatUtils.ts';
    import { getWeekDays } from '#lib/shared/utils/CalendarGridUtils.ts';
    import { MoveLeft } from '@lucide/svelte';
    import type { RecurrenceForm } from './models/RecurrenceForm';

    let { values = $bindable() }: { values: FlowForm.FormValues<RecurrenceForm> } =
        $props();
</script>

<FlowForm.Link back>
    <Button.Root
        variant="ghost"
        class="justify-start px-0 -ml-2 hover:bg-transparent text-foreground"
    >
        <MoveLeft class="size-5 mr-2" />
        <span class="text-xl font-semibold">Recurrence</span>
    </Button.Root>
</FlowForm.Link>
<div class="mt-6 flex flex-col">
    <RadioGroup.Root bind:value={values.frequency} class="flex flex-col gap-5">
        <!-- Don't repeat -->
        <div class="flex items-center space-x-3">
            <RadioGroup.Item value="none" id="recurrence-none" />
            <label
                for="recurrence-none"
                class="text-sm font-medium leading-none cursor-pointer"
            >
                Don't repeat
            </label>
        </div>

        <div class="flex items-center space-x-3">
            <RadioGroup.Item value="daily" id="recurrence-day" />
            <label
                for="recurrence-day"
                class="text-sm font-medium leading-none cursor-pointer"
            >
                Every day
            </label>
        </div>

        <div class="flex flex-col gap-3">
            <div class="flex items-center space-x-3">
                <RadioGroup.Item value="weekly" id="recurrence-week" />
                <label
                    for="recurrence-week"
                    class="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                >
                    Every
                    <Input.Styled
                        bind:value={values.weekNumber}
                        appearance="underline"
                        class="w-8"
                        inputClass="w-8 text-center font-semibold text-muted-foreground"
                        type="text"
                        inputmode="numeric"
                        maxlength={1}
                        minlength={1}
                    />
                    weeks
                </label>
            </div>

            {#if values.frequency === 'weekly'}
                <ToggleGroup.Base
                    type="MULTIPLE"
                    class="flex gap-2 pl-7 pt-1"
                    bind:value={values.weekDays}
                >
                    {#each getWeekDays(new Date()) as day (day)}
                        <ToggleGroup.Item
                            variant="ghost"
                            value={day.getDay().toString()}
                            class="size-10  rounded-full text-xs font-medium"
                        >
                            {formatDate(day, DateFormat.WEEKDAY_SHORT)}
                        </ToggleGroup.Item>
                    {/each}
                </ToggleGroup.Base>
            {/if}
        </div>

        <div class="flex items-center space-x-3">
            <RadioGroup.Item value="monthly" id="recurrence-month" />
            <label
                for="recurrence-month"
                class="text-sm font-medium leading-none cursor-pointer"
            >
                Every month
            </label>
        </div>

        <div class="flex items-center space-x-3">
            <RadioGroup.Item value="yearly" id="recurrence-year" />
            <label
                for="recurrence-year"
                class="text-sm font-medium leading-none cursor-pointer"
            >
                Every Year
            </label>
        </div>
    </RadioGroup.Root>
</div>
