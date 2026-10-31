<script lang="ts">
    import {
        Tabs,
        Button,
        Select,
        Switch,
        MultiScreenPager,
        ToggleGroup,
        RadioGroup,
        Input,
        Toggle,
    } from '#lib';
    import DateSelector from '#lib/components/inputs/DateSelector.svelte';
    import TimeSelector from '#lib/components/inputs/TimeSelector.svelte';
    import { getWeekDays } from '#lib/utils/CalendarGridUtils.ts';
    import { formatDate } from '#lib/utils/DateFormatUtils.ts';
    import {
        ChevronRight,
        Clock,
        MoveLeft,
        MoveRight,
        Repeat2,
        Route,
    } from '@lucide/svelte';
    import { isAfter, isBefore } from 'date-fns';

    let selectedColor = $state('#4285F4');
    let isAllDay = $state(false);
    let startDate = $state(new Date());
    let endDate = $state(new Date());
    let selectedRecurrence = $state('recurrence-none');

    let selectedDateScreen = $state('');
    let selectedRecurringDays = $state([new Date().getDay().toString()]);
    let selectedWeekRecurrenceCount = $state('1');

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
            startDate = updateTime(startDate, index);
        } else if (selectedDateScreen === 'endTime') {
            endDate = updateTime(endDate, index);
        }
    };

    const timeMinuteSelected = (index: number) => {
        if (selectedDateScreen === 'startTime') {
            startDate = updateTime(startDate, undefined, index);
        } else if (selectedDateScreen === 'endTime') {
            endDate = updateTime(endDate, undefined, index);
        }
    };

    const dateSelected = (date: Date) => {
        const updatedDate = updateTime(
            date,
            startDate.getHours(),
            startDate.getMinutes()
        );

        if (selectedDateScreen === 'startDate') {
            startDate = updatedDate;

            if (!isBefore(startDate, endDate)) {
                endDate = startDate;
            }
        } else if (selectedDateScreen === 'endDate') {
            endDate = updatedDate;

            if (!isAfter(endDate, startDate)) {
                startDate = endDate;
            }
        }
    };
</script>

<div data-page-bg="secondary" class="h-full flex flex-col">
    <MultiScreenPager.Root defaultValue="main">
        <MultiScreenPager.Screen value="main">
            <Tabs.Root value="event" class="h-full">
                <Tabs.List variant="secondary" class="mx-8 my-4 bg-bg-primary">
                    <Tabs.Trigger variant="secondary" value="event">Event</Tabs.Trigger>
                    <Tabs.Trigger variant="secondary" value="task">Task</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                    value="event"
                    class="bg-bg-primary px-8 pt-8 rounded-t-[3rem] h-full"
                >
                    <div class="flex justify-between items-center">
                        <Input.Styled
                            placeholder="Title"
                            appearance="plain"
                            inputClass="w-full font-semibold text-2xl placeholder:text-muted-foreground"
                        />
                        <Select.Base bind:value={selectedColor}>
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
                                            style:background-color={selectedColor}
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
                                            {#if color === selectedColor}
                                                <div
                                                    class="w-2 h-2 rounded-full bg-white shadow-sm"
                                                ></div>
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
                            <Switch.Root
                                bind:checked={isAllDay}
                                id="allday-switch"
                                size="md"
                            ></Switch.Root>
                        </div>
                        <div>
                            <ToggleGroup.Base
                                type="SINGLE"
                                bind:value={selectedDateScreen}
                                class="flex justify-between items-center"
                            >
                                <div
                                    class="flex flex-col gap-1 content-center items-center"
                                >
                                    <ToggleGroup.BaseItem
                                        value="startDate"
                                        class="rounded-full min-h-6 w-35 data-pressed:bg-muted px-2 text-muted-foreground whitespace-nowrap font-medium"
                                        >{formatDate(
                                            startDate,
                                            'weekDayMonthYear'
                                        )}</ToggleGroup.BaseItem
                                    >
                                    {#if !isAllDay}
                                        <ToggleGroup.BaseItem
                                            value="startTime"
                                            class="rounded-full min-h-6 w-min data-pressed:bg-muted px-2 text-muted-foreground"
                                            >{formatDate(
                                                startDate,
                                                'timeFormat'
                                            )}</ToggleGroup.BaseItem
                                        >
                                    {/if}
                                </div>
                                <MoveRight />
                                <div
                                    class="flex flex-col gap-1 content-center items-center"
                                >
                                    <ToggleGroup.BaseItem
                                        value="endDate"
                                        class="rounded-full min-h-6 w-35 data-pressed:bg-muted px-2 text-muted-foreground whitespace-nowrap font-medium"
                                        >{formatDate(
                                            endDate,
                                            'weekDayMonthYear'
                                        )}</ToggleGroup.BaseItem
                                    >
                                    {#if !isAllDay}
                                        <ToggleGroup.BaseItem
                                            value="endTime"
                                            class="rounded-full min-h-6 w-min data-pressed:bg-muted px-2 text-muted-foreground"
                                            >{formatDate(
                                                endDate,
                                                'timeFormat'
                                            )}</ToggleGroup.BaseItem
                                        >
                                    {/if}
                                </div>
                            </ToggleGroup.Base>
                        </div>
                        {#if selectedDateScreen.endsWith('Time') && !isAllDay}
                            {@const isForStart = selectedDateScreen.startsWith('start')}

                            <!-- Key so it re-inits when going from start to end or vice versa-->
                            {#key selectedDateScreen}
                                <div
                                    class="flex my-auto h-[146.24px] items-center gap-4 w-30 self-center"
                                >
                                    <TimeSelector
                                        preset="hours"
                                        startIndex={isForStart
                                            ? startDate.getHours()
                                            : endDate.getHours()}
                                        onselectchange={timeHourSelected}
                                    />

                                    <div class="flex flex-col gap-3">
                                        <div class="w-2 h-2 rounded-full bg-muted"></div>
                                        <div class="w-2 h-2 rounded-full bg-muted"></div>
                                    </div>

                                    <TimeSelector
                                        preset="minutes"
                                        startIndex={isForStart
                                            ? startDate.getMinutes()
                                            : endDate.getMinutes()}
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
                                        startDate={isForStart ? startDate : endDate}
                                    />
                                </div>
                            {/key}
                        {/if}
                        <hr class="bg-muted h-0.5 border-none rounded-full" />
                        <MultiScreenPager.Trigger value="recurrence">
                            <div class="flex justify-between items-center">
                                <div class="flex gap-2 items-center">
                                    <Repeat2 class="text-muted-foreground" size={20} />
                                    <span>No recurrences set</span>
                                </div>
                                <ChevronRight class="text-muted-foreground" size={20} />
                            </div>
                        </MultiScreenPager.Trigger>
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
                </Tabs.Content>
                <Tabs.Content value="task"></Tabs.Content>
            </Tabs.Root></MultiScreenPager.Screen
        >
        <MultiScreenPager.Screen value="recurrence">
            <div class="h-full bg-bg-primary flex flex-col p-6">
                <MultiScreenPager.Trigger value="main">
                    {#snippet child({ props })}
                        <Button.Root
                            variant="ghost"
                            {...props}
                            class="justify-start px-0 -ml-2 hover:bg-transparent text-foreground"
                        >
                            <MoveLeft class="size-5 mr-2" />
                            <span class="text-xl font-semibold">Recurrence</span>
                        </Button.Root>
                    {/snippet}
                </MultiScreenPager.Trigger>

                <div class="mt-6 flex flex-col">
                    <RadioGroup.Root
                        bind:value={selectedRecurrence}
                        class="flex flex-col gap-5"
                    >
                        <!-- Don't repeat -->
                        <div class="flex items-center space-x-3">
                            <RadioGroup.Item
                                value="recurrence-none"
                                id="recurrence-none"
                            />
                            <label
                                for="recurrence-none"
                                class="text-sm font-medium leading-none cursor-pointer"
                            >
                                Don't repeat
                            </label>
                        </div>

                        <div class="flex items-center space-x-3">
                            <RadioGroup.Item value="recurrence-day" id="recurrence-day" />
                            <label
                                for="recurrence-day"
                                class="text-sm font-medium leading-none cursor-pointer"
                            >
                                Every day
                            </label>
                        </div>

                        <div class="flex flex-col gap-3">
                            <div class="flex items-center space-x-3">
                                <RadioGroup.Item
                                    value="recurrence-week"
                                    id="recurrence-week"
                                />
                                <label
                                    for="recurrence-week"
                                    class="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                                >
                                    Every
                                    <Input.Styled
                                        bind:value={selectedWeekRecurrenceCount}
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

                            {#if selectedRecurrence === 'recurrence-week'}
                                <ToggleGroup.Base
                                    type="MULTIPLE"
                                    class="flex gap-2 pl-7 pt-1"
                                    bind:value={selectedRecurringDays}
                                >
                                    {#each getWeekDays(startDate) as day (day)}
                                        <ToggleGroup.Item
                                            variant="ghost"
                                            value={day.getDay().toString()}
                                            class="size-10  rounded-full text-xs font-medium "
                                        >
                                            {formatDate(day, 'weekdayOnly')}
                                        </ToggleGroup.Item>
                                    {/each}
                                </ToggleGroup.Base>
                            {/if}
                        </div>

                        <div class="flex items-center space-x-3">
                            <RadioGroup.Item
                                value="recurrence-month"
                                id="recurrence-month"
                            />
                            <label
                                for="recurrence-month"
                                class="text-sm font-medium leading-none cursor-pointer"
                            >
                                Every month
                            </label>
                        </div>

                        <div class="flex items-center space-x-3">
                            <RadioGroup.Item
                                value="recurrence-year"
                                id="recurrence-year"
                            />
                            <label
                                for="recurrence-year"
                                class="text-sm font-medium leading-none cursor-pointer"
                            >
                                Every Year
                            </label>
                        </div>
                    </RadioGroup.Root>
                </div>
            </div></MultiScreenPager.Screen
        >
    </MultiScreenPager.Root>
</div>
