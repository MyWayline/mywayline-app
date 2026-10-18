<script lang="ts">
    import { setContext, type Snippet } from 'svelte';
    import { type TabState } from '../index';
    import type { HTMLAttributes } from 'svelte/elements';
    import { mergeProps } from '../../../utils/merge-props';
    import { withRef } from '../../../utils/ref-attachment';

    let {
        value = $bindable(),
        controlled = true,
        onValueChange,
        children,
        child,
        ref = $bindable(),
        ...rest
    }: {
        value: string;
        controlled?: boolean;
        onValueChange?: (item: string) => void;
        children?: Snippet<[]>;
        child?: Snippet<[{ props: Record<string, unknown> }]>;
        ref?: HTMLDivElement;
    } & HTMLAttributes<HTMLDivElement> = $props();

    const toggleItem = (itemValue: string) => {
        if (controlled) {
            value = itemValue;
        }

        onValueChange?.(itemValue);
    };

    const tabState: TabState = {
        toggleItem,
        get value() {
            return value;
        },
    };

    setContext('TAB_ROOT', tabState);

    const mergedProbs = $derived(
        mergeProps(
            rest,
            {
                'data-tab-root': '',
            },
            withRef((el) => (ref = el as HTMLDivElement))
        )
    );
</script>

{#if child}
    {@render child({ props: mergedProbs })}
{:else}
    <div {...mergedProbs}>
        {@render children?.()}
    </div>
{/if}
