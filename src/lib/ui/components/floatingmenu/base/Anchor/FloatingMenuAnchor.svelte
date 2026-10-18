<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import { withRef } from '../../../../utils/ref-attachment.ts';
    import type { FloatingMenuState } from '../../floating.svelte.ts';
    import { mergeProps } from '../../../../utils/merge-props.ts';

    let {
        anchor,
        ref = $bindable(),
    }: { anchor?: Snippet<[{ props: Record<string, unknown> }]>; ref?: HTMLElement } =
        $props();
    const state = getContext<FloatingMenuState>('FLOATING_MENU_ROOT');

    const mergedProps = $derived(
        mergeProps(
            { id: state.triggerId, 'aria-controls': state.contentId },
            withRef((el) => {
                state.anchor = el as HTMLElement;
                ref = el as HTMLElement;
            })
        )
    );
</script>

{@render anchor?.({ props: mergedProps })}
