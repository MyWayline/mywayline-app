<script lang="ts">
    import { Button, ToggleGroup } from '#lib';
    import { getDate } from 'date-fns';
    import { ChevronDown, Funnel, Menu } from '@lucide/svelte';
    import { formatMonthYearIfNotCurrentYear } from '#lib/utils/TimeDateUtils.ts';
    import { getCalendarContext } from '../calendarContext.svelte';
    import NormalBottomSheet from '#lib/components/BottomSheet/NormalBottomSheet.svelte';
    import { userSettingsStore } from '#lib/stores/userSettingStore.svelte.ts';
    import { UserCalendarMode } from '#lib/types/UserSettings.types.ts';
    import DateSelector from '#lib/components/inputs/DateSelector.svelte';
    import LeftFloatingSheet from '#lib/components/BottomSheet/LeftFloatingSheet.svelte';

    let calendarContext = getCalendarContext();

    let isSelectSheetOpen = $state(false);
    let isSideSheetOpen = $state(false);

    const ondateselect = (selectedDate: Date) => {
        isSelectSheetOpen = false;
        calendarContext.setViewingDate(selectedDate);
    };
</script>

<div class="flex items-center justify-between px-2 h-12.5">
    <div class="flex flex-1 justify-start">
        <Button.Root
            variant="ghost"
            iconOnly
            aria-haspopup="dialog"
            onclick={() => (isSideSheetOpen = !isSideSheetOpen)}
        >
            <Menu size={20} />
        </Button.Root>
    </div>
    <Button.Root
        variant="ghost"
        aria-haspopup="dialog"
        class="flex gap-2 flex-1"
        onclick={() => (isSelectSheetOpen = !isSelectSheetOpen)}
    >
        <span class="text-lg whitespace-nowrap"
            >{formatMonthYearIfNotCurrentYear(calendarContext.viewingDate)}</span
        >
        <ChevronDown size={20} class="text-muted-foreground" />
    </Button.Root>

    <div class="flex items-center gap-1 flex-1 justify-end">
        <Button.Root
            variant="ghost"
            iconOnly
            aria-label="Heute"
            onclick={() => calendarContext.setViewingDate(new Date())}
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

<NormalBottomSheet bind:isOpen={isSelectSheetOpen} maxHeight={500}>
    <DateSelector
        mode="SINGLE"
        viewMode="DAY"
        onselect={ondateselect}
        startDate={calendarContext.viewingDate}
    />
</NormalBottomSheet>

<LeftFloatingSheet bind:isOpen={isSideSheetOpen} maxHeight={200}>
    <div class="flex flex-col p-4">
        <ToggleGroup.Base
            allowDeselect={false}
            type="SINGLE"
            class="flex flex-col gap-2"
            value={userSettingsStore.calendarMode.toString()}
            onselected={(selected) => {
                userSettingsStore.setCalendarMode(Number(selected) as UserCalendarMode);

                setTimeout(() => {
                    isSideSheetOpen = false;
                }, 200);
            }}
        >
            <ToggleGroup.Item value="1" class="justify-start">DAY</ToggleGroup.Item>
            <ToggleGroup.Item value="2" class="justify-start">WEEK</ToggleGroup.Item>
            <ToggleGroup.Item value="3" class="justify-start">MONTH</ToggleGroup.Item>
        </ToggleGroup.Base>
    </div>
</LeftFloatingSheet>
