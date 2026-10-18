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

<BottomSheet.Root
    position="left"
    bind:isSheetOpen={isOpen}
    sheetSideOffset={16}
    {...rest}
>
    <BottomSheet.Sheet
        class="shadow-2xl rounded-lg bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)]! top-[calc(env(safe-area-inset-top,0px)+1rem)]!"
    >
        <BottomSheet.Content class="bg-white rounded-lg">
            {@render children?.()}
        </BottomSheet.Content>
    </BottomSheet.Sheet>
</BottomSheet.Root>
