<script lang="ts">
    import { getCalendarContext } from '../calendarContext.svelte';
    import type { ColumnRangeSelection } from '../types/CalendarLayout.types';

    let {
        gridColumns,
        index,
        dayKeys,
        onclear,
    }: {
        gridColumns: string;
        index: number;
        dayKeys: number[];
        onclear: () => void;
    } = $props();

    const calendarContext = getCalendarContext();
    const SNAP = $derived(calendarContext.columnHourPxGap / 4);
    const maxPx = $derived(24 * calendarContext.columnHourPxGap);

    let overlayEl: HTMLDivElement;
    let drag: {
        mode: 'start' | 'end' | 'move';
        y: number;
        start: number;
        end: number;
    } | null = null;
    let dragging = $state<'start' | 'end' | 'move' | null>(null);

    const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(max, v));

    const selection = $derived(calendarContext.columnRangeSelection);

    // Which day column is under the pointer
    const dayKeyAt = (clientX: number): number | null => {
        const cols =
            overlayEl.parentElement?.querySelectorAll<HTMLElement>('[data-column-date]');
        if (!cols) return null;
        for (const col of cols) {
            const r = col.getBoundingClientRect();
            if (r.width > 0 && clientX >= r.left && clientX < r.right) {
                return Number(col.dataset.columnDate);
            }
        }
        return null;
    };

    const onPointerDown = (e: PointerEvent) => {
        if (!selection) return;
        e.stopPropagation();
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const q = rect.height / 4;

        const mode = y <= q ? 'start' : y >= rect.height - q ? 'end' : 'move';
        drag = { mode, y: e.clientY, start: selection.start, end: selection.end };
        dragging = mode;
        el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!selection) return;
        if (!drag) return;
        const delta = Math.round((e.clientY - drag.y) / SNAP) * SNAP;

        if (drag.mode === 'start') {
            selection.start = clamp(drag.start + delta, 0, drag.end - SNAP);
        } else if (drag.mode === 'end') {
            selection.end = clamp(drag.end + delta, drag.start + SNAP, maxPx);
        } else {
            const duration = drag.end - drag.start;
            const newStart = clamp(drag.start + delta, 0, maxPx - duration);
            selection.start = newStart;
            selection.end = newStart + duration;

            const key = dayKeyAt(e.clientX);
            if (key !== null) selection.dayKey = key;
        }
    };

    const onPointerUp = () => {
        drag = null;
        dragging = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (!selection) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            onclear();
            return;
        }

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const next = dayKeys[index + (e.key === 'ArrowLeft' ? -1 : 1)];
            if (next !== undefined) selection.dayKey = next;
            return;
        }

        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        e.preventDefault();
        const delta = e.key === 'ArrowUp' ? -SNAP : SNAP;

        if (e.shiftKey) {
            selection.end = clamp(selection.end + delta, selection.start + SNAP, maxPx);
        } else if (e.altKey) {
            selection.start = clamp(selection.start + delta, 0, selection.end - SNAP);
        } else {
            const duration = selection.end - selection.start;
            const newStart = clamp(selection.start + delta, 0, maxPx - duration);
            selection.start = newStart;
            selection.end = newStart + duration;
        }
    };
</script>

<div
    bind:this={overlayEl}
    class="pointer-events-none absolute inset-0 z-50 grid"
    style:grid-template-columns={gridColumns}
>
    <div class="relative min-w-0" style:grid-column={index + 1}>
        <button
            type="button"
            data-carousel-nodrag
            aria-label="Selected calendar time range"
            aria-roledescription="Movable and resizable time range"
            class="pointer-events-auto absolute left-1 right-1 block w-auto rounded-md border-2 border-primary bg-primary/20 p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
            class:cursor-ns-resize={dragging === 'start' || dragging === 'end'}
            class:cursor-grabbing={dragging === 'move'}
            class:cursor-grab={!dragging}
            style="top: {selection?.start ?? 0}px;height: {(selection?.end ?? 0) -
                (selection?.start ?? 0)}px; touch-action: none;"
            onpointerdown={onPointerDown}
            onpointermove={onPointerMove}
            onpointerup={onPointerUp}
            onpointercancel={onPointerUp}
            onkeydown={onKeyDown}
        ></button>
    </div>
</div>
