<script lang="ts">
    import { Button, Input, Select, Switch, ToggleGroup } from '#lib';
    import * as FlowForm from '#lib/shared/components/FlowForm/index.ts';
    import { isAfter, isBefore } from 'date-fns';
    import { ChevronRight, Clock, MoveRight, Repeat2, Route } from '@lucide/svelte';
    import { formatDate } from '#lib/shared/utils/DateFormatUtils.ts';
    import TimeSelector from '#lib/shared/components/inputs/TimeSelector.svelte';
    import DateSelector from '#lib/shared/components/inputs/DateSelector.svelte';
    import { CalendarFrequencyUtil } from '#lib/app/calendar/utils/RRules.ts';
    import type { EventForm } from './models/EventForm';

    let { values = $bindable() }: { values: FlowForm.FormValues<EventForm> } = $props();

    let selectedDateScreen = $state('');

    const colorHexList = [
        '#4285F4',
        '#34A853',
        '#EA4335',
        '#FBBC05',
        '#FA7B17',
        '#A142F4',
        '#24B2BB',
        '#EC407A',
        '#78909C',
        '#107C41',
        '#742796',
        '#0063B1',
    ];

    const updateTime = (date: Date, hours?: number, minutes?: number) => {
        const updatedDate = new Date(date);

        if (hours !== undefined) updatedDate.setHours(hours);
        if (minutes !== undefined) updatedDate.setMinutes(minutes);

        return updatedDate;
    };

    const timeHourSelected = (index: number) => {
        if (selectedDateScreen === 'startTime') {
            values.startDate = updateTime(values.startDate, index);
        } else if (selectedDateScreen === 'endTime') {
            values.endDate = updateTime(values.endDate, index);
        }
    };

    const timeMinuteSelected = (index: number) => {
        if (selectedDateScreen === 'startTime') {
            values.startDate = updateTime(values.startDate, undefined, index);
        } else if (selectedDateScreen === 'endTime') {
            values.endDate = updateTime(values.endDate, undefined, index);
        }
    };

    const dateSelected = (date: Date) => {
        const updatedDate = updateTime(
            date,
            values.startDate.getHours(),
            values.startDate.getMinutes()
        );

        if (selectedDateScreen === 'startDate') {
            values.startDate = updatedDate;

            if (!isBefore(values.startDate, values.endDate)) {
                values.endDate = values.startDate;
            }
        } else if (selectedDateScreen === 'endDate') {
            values.endDate = updatedDate;

            if (!isAfter(values.endDate, values.startDate)) {
                values.startDate = values.endDate;
            }
        }
    };
</script>

<div class="flex justify-between items-center">
    <Input.Styled
        bind:value={values.title}
        placeholder="Title"
        appearance="plain"
        inputClass="w-full font-semibold text-2xl placeholder:text-muted-foreground"
    />
    <Select.Base bind:value={values.color}>
        <Select.Trigger>
            {#snippet child({ props })}
                <Button.Root
                    variant="ghost"
                    iconOnly
                    {...props}
                    class="p-1 rounded-full hover:bg-muted transition-colors"
                >
                    <div
                        class="w-5 h-5 rounded-full"
                        style:background-color={values.color}
                    ></div>
                </Button.Root>
            {/snippet}
        </Select.Trigger>

        <Select.Content
            class="bg-bg-primary shadow-lg rounded-lg border border-border grid grid-cols-4 gap-2 p-3 rounded-xl z-50 min-w-30"
            side="left"
        >
            {#each colorHexList as color (color)}
                <Select.Item
                    value={color}
                    class="flex rounded-lg items-center justify-center p-1 outline-none "
                >
                    <div
                        class="w-6 h-6 rounded-full flex items-center justify-center"
                        style:background-color={color}
                    >
                        {#if color === values.color}
                            <div class="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                        {/if}
                    </div>
                </Select.Item>
            {/each}
        </Select.Content>
    </Select.Base>
</div>
<hr class="bg-muted h-0.5 border-none rounded-full mb-4 mt-2" />
<div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
        <div class="flex gap-2 items-center">
            <Clock class="text-muted-foreground" size={20} />
            <label for="allday-switch">Allday</label>
        </div>
        <Switch.Root bind:checked={values.isAllDay} id="allday-switch" size="md"
        ></Switch.Root>
    </div>
    <div>
        <ToggleGroup.Base
            type="SINGLE"
            bind:value={selectedDateScreen}
            class="flex justify-between items-center"
        >
            <div class="flex flex-col gap-1 content-center items-center">
                <ToggleGroup.BaseItem
                    value="startDate"
                    class="rounded-full min-h-6 w-35 data-pressed:bg-muted px-2 text-muted-foreground whitespace-nowrap font-medium"
                    >{formatDate(
                        values.startDate,
                        'weekDayMonthYear'
                    )}</ToggleGroup.BaseItem
                >
                {#if !values.isAllDay}
                    <ToggleGroup.BaseItem
                        value="startTime"
                        class="rounded-full min-h-6 w-min data-pressed:bg-muted px-2 text-muted-foreground"
                        >{formatDate(
                            values.startDate,
                            'timeFormat'
                        )}</ToggleGroup.BaseItem
                    >
                {/if}
            </div>
            <MoveRight />
            <div class="flex flex-col gap-1 content-center items-center">
                <ToggleGroup.BaseItem
                    value="endDate"
                    class="rounded-full min-h-6 w-35 data-pressed:bg-muted px-2 text-muted-foreground whitespace-nowrap font-medium"
                    >{formatDate(
                        values.endDate,
                        'weekDayMonthYear'
                    )}</ToggleGroup.BaseItem
                >
                {#if !values.isAllDay}
                    <ToggleGroup.BaseItem
                        value="endTime"
                        class="rounded-full min-h-6 w-min data-pressed:bg-muted px-2 text-muted-foreground"
                        >{formatDate(values.endDate, 'timeFormat')}</ToggleGroup.BaseItem
                    >
                {/if}
            </div>
        </ToggleGroup.Base>
    </div>
    {#if selectedDateScreen.endsWith('Time') && !values.isAllDay}
        {@const isForStart = selectedDateScreen.startsWith('start')}

        <!-- Key so it re-inits when going from start to end or vice versa-->
        {#key selectedDateScreen}
            <div class="flex my-auto h-[146.24px] items-center gap-4 w-30 self-center">
                <TimeSelector
                    preset="hours"
                    startIndex={isForStart
                        ? values.startDate.getHours()
                        : values.endDate.getHours()}
                    onselectchange={timeHourSelected}
                />

                <div class="flex flex-col gap-3">
                    <div class="w-2 h-2 rounded-full bg-muted"></div>
                    <div class="w-2 h-2 rounded-full bg-muted"></div>
                </div>

                <TimeSelector
                    preset="minutes"
                    startIndex={isForStart
                        ? values.startDate.getMinutes()
                        : values.endDate.getMinutes()}
                    onselectchange={timeMinuteSelected}
                />
            </div>
        {/key}
    {:else if selectedDateScreen.endsWith('Date')}
        {@const isForStart = selectedDateScreen.startsWith('start')}

        <!-- Key so it re-inits when going from start to end or vice versa-->
        {#key selectedDateScreen}
            <div class="self-center">
                <DateSelector
                    mode="SINGLE"
                    viewMode="DAY"
                    onselect={dateSelected}
                    startDate={isForStart ? values.startDate : values.endDate}
                />
            </div>
        {/key}
    {/if}
    <hr class="bg-muted h-0.5 border-none rounded-full" />
    <FlowForm.Link to="recurrence">
        <div class="flex justify-between items-center w-full">
            <div class="flex gap-2 items-center min-w-0 flex-1 mr-2">
                <Repeat2 class="text-muted-foreground shrink-0" size={20} />
                <span class="truncate"
                    >{CalendarFrequencyUtil.inputsToRRule(
                        values.frequency,
                        values.weekNumber,
                        values.weekDays
                    )?.toText() ?? 'No recurrence set'}</span
                >
            </div>
            <ChevronRight class="text-muted-foreground shrink-0" size={20} />
        </div>
    </FlowForm.Link>
    <hr class="bg-muted h-0.5 border-none rounded-full" />
    <div class="flex justify-between items-center">
        <div class="flex gap-2 items-center">
            <Route class="text-muted-foreground" size={20} />
            <span>No journey set</span>
        </div>
        <ChevronRight class="text-muted-foreground" size={20} />
    </div>
    <hr class="bg-muted h-0.5 border-none rounded-full" />
</div>
