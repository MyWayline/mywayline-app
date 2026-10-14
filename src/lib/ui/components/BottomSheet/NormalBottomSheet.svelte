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

<BottomSheet.Root bind:isSheetOpen={isOpen} {...rest}>
    <BottomSheet.Sheet class="rounded-t-lg shadow-2xl bg-bg-primary">
        <BottomSheet.Handle class=" flex justify-center items-center h-8">
            <div class="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </BottomSheet.Handle>
        <BottomSheet.Content
            class="flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]"
        >
            {@render children?.()}
        </BottomSheet.Content>
    </BottomSheet.Sheet>
</BottomSheet.Root>
