<script lang="ts">
    import { Button, type CalendarMode } from '#lib';
    import {
        getCalendarMode,
        getSelectedDate,
        setCalendarMode,
        setSelectedDate,
    } from '#lib/stores/calendarStore.svelte.ts';
    import { getDate } from 'date-fns';
    import {
        Calendar1,
        CalendarDays,
        CalendarRange,
        ChevronDown,
        Funnel,
        Menu,
    } from '@lucide/svelte';
    import DateSelector from '../misc/DateSelector.svelte';
    import NormalBottomSheet from '#lib/components/BottomSheet/NormalBottomSheet.svelte';
    import { formatMonthYearIfNotCurrentYear } from '#lib/utils/TimeDateUtils.ts';
    import LeftFloatingSheet from '#lib/components/BottomSheet/LeftFloatingSheet.svelte';
    import { type Component } from 'svelte';

    let isSelectSheetOpen = $state(false);
    let isSideSheetOpen = $state(false);

    const ondateselect = (selectedDate: Date) => {
        isSelectSheetOpen = false;
        setSelectedDate(selectedDate);
    };

    const toggleCalendarMode = (mode: CalendarMode) => {
        setCalendarMode(mode);
        isSideSheetOpen = false;
    };
</script>

{#snippet calendarModeSelectItem(title: string, mode: CalendarMode, Icon: Component)}
    <Button.Root
        variant="ghost"
        class={[
            'flex justify-start  h-11 w-full items-center gap-3 rounded-lgl px-3 text-sm font-medium transition-colors',
            getCalendarMode() === mode
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        ]}
        onclick={() => toggleCalendarMode(mode)}
    >
        <Icon size={24} strokeWidth={1.8} />

        <span class="flex-1 text-left">{title}</span>
    </Button.Root>
{/snippet}

<LeftFloatingSheet bind:isOpen={isSideSheetOpen} fitContent>
    <div class="flex flex-col gap-0.5 p-4 items-start justify-start min-w-40">
        {@render calendarModeSelectItem('Day', 'day', Calendar1)}
        {@render calendarModeSelectItem('Week', 'week', CalendarRange)}
        {@render calendarModeSelectItem('Month', 'month', CalendarDays)}
    </div>
</LeftFloatingSheet>

<NormalBottomSheet bind:isOpen={isSelectSheetOpen} fitContent>
    <DateSelector mode={getCalendarMode()} onselect={ondateselect} />
</NormalBottomSheet>

<div class="flex items-center justify-between px-2 h-12.5">
    <div class="flex">
        <Button.Root
            variant="ghost"
            iconOnly
            aria-haspopup="dialog"
            onclick={() => (isSideSheetOpen = !isSideSheetOpen)}
        >
            <Menu size={20} />
        </Button.Root>
        <Button.Root
            variant="ghost"
            aria-haspopup="dialog"
            class="flex gap-2"
            onclick={() => (isSelectSheetOpen = !isSelectSheetOpen)}
        >
            <span class="text-lg"
                >{formatMonthYearIfNotCurrentYear(getSelectedDate())}</span
            >
            <ChevronDown size={20} class="text-muted-foreground" />
        </Button.Root>
    </div>

    <div class="flex items-center gap-1">
        <Button.Root
            variant="ghost"
            iconOnly
            aria-label="Heute"
            onclick={() => setSelectedDate(new Date())}
        >
            <div
                class="border-[1.5px] border-muted-foreground h-6 w-6 rounded-sm grid place-content-center"
            >
                <p class="text-xs">{getDate(new Date())}</p>
            </div>
        </Button.Root>
        <Button.Root variant="ghost" iconOnly aria-label="Filter">
            <Funnel size={24} class="text-muted-foreground" />
        </Button.Root>
    </div>
</div>
