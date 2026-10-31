<script lang="ts">
    import type { Snippet } from 'svelte';
    import * as BottomSheet from 'svelte-bottom-sheet';
    let {
        isOpen = $bindable(false),
        children,
        ...rest
    }: {
        isOpen?: boolean;
        children?: Snippet<[]>;
    } & BottomSheet.BottomSheetProps = $props();
</script>

<BottomSheet.Root position="left" bind:isSheetOpen={isOpen} sheetSideOffset={8} {...rest}>
    <BottomSheet.Sheet
        class="shadow-2xl rounded-lg bottom-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]! top-[calc(env(safe-area-inset-top,0px)+0.5rem)]!"
    >
        <BottomSheet.Content class="bg-bg-primary rounded-lg">
            {@render children?.()}
        </BottomSheet.Content>
    </BottomSheet.Sheet>
</BottomSheet.Root>
