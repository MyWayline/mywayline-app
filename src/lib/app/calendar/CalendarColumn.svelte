<script lang="ts">
    import type { PositionedEntry } from '#lib/types/CalendarCalculations.ts';
    import type { HTMLAttributes } from 'svelte/elements';

    let {
        items,
        hourGapPx = 80,
        ...rest
    }: {
        items: PositionedEntry[];
        hourGapPx?: number;
    } & HTMLAttributes<HTMLDivElement> = $props();

    const hours = Array.from({ length: 24 }, (_, i) => i);
</script>

<div class="relative w-full" {...rest}>
    {#each hours as hour}
        <div class="border-t border-muted" style="height: {hourGapPx}px"></div>
    {/each}

    {#each items as item}
        <div
            class="absolute box-border overflow-hidden rounded-sm p-1 text-xs font-medium transition-[box-shadow,z-index] duration-150 ease-in"
            class:shadow-md={item.isStacked}
            style="
                top: {item.top}px;
                height: {item.height}px;
                left: calc({item.left}% + {item.peekPx}px);
                width: calc({item.width}% - {item.peekPx}px);
                background-color: {item?.color ?? 'blue'};
                z-index: {item.column + 1 + (item.isStacked ? 1 : 0)};
            "
        >
            <p
                class="overflow-hidden text-ellipsis whitespace-nowrap"
                style="color: contrast-color({item.color})"
            >
                {item.summary}
            </p>
        </div>
    {/each}
</div>
