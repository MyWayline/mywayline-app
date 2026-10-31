<script lang="ts">
    import { setContext } from 'svelte';
    import {
        type ToggleGroupProps,
        type MultipleToggleProps,
        type SingleToggleProps,
    } from '../index.ts';
    import { mergeProps } from '../../../utils/merge-props.ts';
    import { withRef } from '../../../utils/ref-attachment.ts';

    let {
        type = 'SINGLE',
        value = $bindable(type === 'MULTIPLE' ? [] : ''),
        allowDeselect = true,
        children,
        child,
        ref = $bindable(),
        disabled = false,
        onselected,
        ...rest
    }: (SingleToggleProps | MultipleToggleProps) & ToggleGroupProps = $props();

    setContext('TOGGLE_GROUP_ROOT', {
        get value() {
            return value;
        },
        toggleItem: (v: string) => toggleItem(v),
        get disabled() {
            return disabled;
        },
    });

    const toggleItem = (itemValue: string): void => {
        if (type === 'SINGLE') {
            const current = value as string;

            if (current === itemValue) {
                if (allowDeselect) value = '';
            } else {
                value = itemValue;
            }

            (onselected as SingleToggleProps['onselected'])?.(value as string);
        } else {
            const current = value as string[];

            if (current.includes(itemValue)) {
                if (allowDeselect) {
                    value = current.filter((v) => v !== itemValue);
                }
            } else {
                value = [...current, itemValue];
            }
            (onselected as MultipleToggleProps['onselected'])?.(value as string[]);
        }
    };

    const mergedProps = $derived(
        mergeProps(
            rest,
            {
                role: 'group',
                'data-type': type,
                'aria-disabled': disabled,
                'data-disabled': disabled ? '' : undefined,
                'data-toggle-group': '',
            },
            withRef((el) => (ref = el as HTMLDivElement))
        )
    );
</script>

{#if child}
    {@render child({ props: mergedProps })}
{:else}
    <div {...mergedProps}>
        {@render children?.()}
    </div>
{/if}
