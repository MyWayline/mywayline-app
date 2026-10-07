<script lang="ts">
    import {
        addDays,
        addMonths,
        format,
        isSameMonth,
        startOfMonth,
        startOfWeek,
    } from 'date-fns';
    import { de } from 'date-fns/locale';
    import { getSelectedDate, navigateDate } from './Calendar.svelte';
    import CalendarPager from './CalendarPager.svelte';

    const AXIS_LOCK_PX = 10;
    const COMMIT_PX = 50;

    const selectedDate = $derived(getSelectedDate());
    const monthKey = $derived(startOfMonth(selectedDate).getTime());

    const weekStartOf = (d: Date) => startOfWeek(d, { weekStartsOn: 1 });

    const pages = $derived(
        [-1, 0, 1].map((o) => {
            const month = addMonths(new Date(monthKey), o);
            const first = weekStartOf(month);
            return {
                month,
                days: Array.from({ length: 42 }, (_, i) => addDays(first, i)),
            };
        })
    );

    const weekdays = Array.from({ length: 7 }, (_, i) =>
        addDays(weekStartOf(new Date()), i)
    );

    let area: HTMLDivElement;
    let areaWidth = $state(0);
    let areaHeight = $state(0);

    let expanded = $state(true);
    let dragging = $state(false);
    let dragHeight = $state<number | null>(null);

    const collapsedPx = $derived(((areaWidth - 40 * 6) / 7) * 6 + 40 * 5);
    const minPx = $derived(Math.min(collapsedPx, areaHeight));
    const restingPx = $derived(expanded ? areaHeight : minPx);
    const gridHeight = $derived(dragHeight ?? restingPx);

    let tracking = false;
    let vLocked = false;
    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let startH = 0;

    const onpointerdown = (e: PointerEvent) => {
        if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
        tracking = true;
        vLocked = false;
        pointerId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        startH = gridHeight;
    };

    const onpointermove = (e: PointerEvent) => {
        if (!tracking || e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!vLocked) {
            // horizontal is swipe so lock if we go horizontal
            if (Math.abs(dx) > AXIS_LOCK_PX && Math.abs(dx) > Math.abs(dy)) {
                tracking = false;
                return;
            }
            if (Math.abs(dy) < AXIS_LOCK_PX) return;
            vLocked = true;
            dragging = true;
            area.setPointerCapture(e.pointerId);
        }

        dragHeight = Math.min(areaHeight, Math.max(minPx, startH + dy));
    };

    const finish = (e: PointerEvent) => {
        if (!tracking || e.pointerId !== pointerId) return;
        tracking = false;
        if (!vLocked) return;
        vLocked = false;
        dragging = false;

        const dy = e.clientY - startY;
        if (dy > COMMIT_PX) expanded = true;
        else if (dy < -COMMIT_PX) expanded = false;

        dragHeight = null;
    };
</script>

<div class="flex h-full min-h-0 flex-col px-2 pb-2">
    <div class="grid grid-cols-7 gap-1 pb-1">
        {#each weekdays as d (d.getTime())}
            <span class="text-center text-xs text-muted-foreground">
                {format(d, 'EEEEE', { locale: de })}
            </span>
        {/each}
    </div>

    <div
        bind:this={area}
        bind:clientWidth={areaWidth}
        bind:clientHeight={areaHeight}
        class="min-h-0 flex-1 touch-none"
        role="presentation"
        {onpointerdown}
        {onpointermove}
        onpointerup={finish}
        onpointercancel={finish}
    >
        <div
            class="overflow-hidden"
            style:height={areaHeight ? `${gridHeight}px` : '100%'}
            style:transition={dragging
                ? 'none'
                : 'height 0.4s cubic-bezier(0.25, 1, 0.5, 1)'}
        >
            <CalendarPager onPrev={() => navigateDate(-1)} onNext={() => navigateDate(1)}>
                {#snippet page(offset)}
                    {@const p = pages[offset + 1]}
                    <div class="grid h-full grid-cols-7 grid-rows-6 gap-1">
                        {#each p.days as day (day.getTime())}
                            <button
                                type="button"
                                class="h-full w-full rounded-sm bg-bg-secondary p-2 text-center text-sm font-semibold flex items-start justify-center"
                                class:opacity-50={!isSameMonth(day, p.month)}
                            >
                                <span
                                    class="transition-[margin] duration-400 ease-out {expanded
                                        ? 'mt-1'
                                        : '[-margin-top:0.25rem]'}"
                                >
                                    {format(day, 'd')}
                                </span>
                            </button>
                        {/each}
                    </div>
                {/snippet}
            </CalendarPager>
        </div>
    </div>
</div>
