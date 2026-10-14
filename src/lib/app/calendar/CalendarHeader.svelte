<script lang="ts">
    import { Button } from '#lib';
    import { getCalendarMode, getSelectedDate, setSelectedDate } from './Calendar.svelte';
    import { getDate } from 'date-fns';
    import { ChevronDown, ChevronLeft, ChevronRight, Funnel } from '@lucide/svelte';
    import DateSelector from '../misc/DateSelector.svelte';
    import NormalBottomSheet from '#lib/ui/components/BottomSheet/NormalBottomSheet.svelte';
    import { formatMonthYearIfNotCurrentYear } from '#lib/utils/TimeDateUtils.ts';
    let isSelectSheetOpen = $state(false);

    const ondateselect = (selectedDate: Date) => {
        isSelectSheetOpen = false;
        setSelectedDate(selectedDate);
    };
</script>

<div class="flex items-center justify-between px-2 h-12.5">
    <Button.Root
        variant="ghost"
        aria-haspopup="dialog"
        class="flex gap-2"
        onclick={() => (isSelectSheetOpen = !isSelectSheetOpen)}
    >
        <span class="text-lg">{formatMonthYearIfNotCurrentYear(getSelectedDate())}</span>
        <ChevronDown size={18} class="text-muted-foreground" />
    </Button.Root>
    <NormalBottomSheet bind:isOpen={isSelectSheetOpen} fitContent>
        <DateSelector mode={getCalendarMode()} onselect={ondateselect} />
    </NormalBottomSheet>

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
