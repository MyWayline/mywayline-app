<script lang="ts">
    import { Button } from '#lib';
    import { setSelectedDate } from './Calendar.svelte';
    import { getDate } from 'date-fns';
    import { ChevronDown, ChevronLeft, ChevronRight, Funnel } from '@lucide/svelte';
    import DateSelector from '../misc/DateSelector.svelte';
    import * as BottomSheet from 'svelte-bottom-sheet';
    let isSelectSheetOpen = $state(false);

    const ondateselect = (selectedDate: Date) => {
        isSelectSheetOpen = false;
        setSelectedDate(selectedDate);
    };
</script>

<div class="flex items-center justify-between">
    <Button.Root
        variant="ghost"
        aria-haspopup="dialog"
        onclick={() => (isSelectSheetOpen = !isSelectSheetOpen)}
    >
        <ChevronDown size={18} class="text-muted-foreground" />
    </Button.Root>
    <BottomSheet.Root bind:isSheetOpen={isSelectSheetOpen}>
        <BottomSheet.Sheet>
            <BottomSheet.Handle />
            <BottomSheet.Content class="flex flex-col items-center w-full">
                <DateSelector mode={'week'} onselect={ondateselect} />
            </BottomSheet.Content>
        </BottomSheet.Sheet>
    </BottomSheet.Root>

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
