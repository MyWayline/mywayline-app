<script lang="ts">
    import { setContext, tick } from 'svelte';
    import * as FloatingMenu from '../../floatingmenu/index.ts';
    import { withRef } from '../../../utils/ref-attachment.ts';
    import { focusUtils } from '../../../utils/focus.ts';
    import type { BaseProps, MultipleSelectProps, SingleSelectProps } from '../index.ts';

    let {
        type = 'SINGLE',
        value = $bindable(type === 'MULTIPLE' ? [] : ''),
        isOpen = $bindable(false),
        allowDeselect = true,
        children,
        ref = $bindable(),
        disabled = false,
        required,
        name,
        ...rest
    }: (SingleSelectProps | MultipleSelectProps) & BaseProps = $props();

    setContext('SELECT_ROOT', {
        get value() {
            return value;
        },
        get isOpen() {
            return isOpen;
        },
        get disabled() {
            return disabled;
        },
        set isOpen(value: boolean) {
            if (value && !disabled) {
                isOpen = true;
                tick();
                (async () => {
                    await tick();

                    focusUtils.auto('[data-select-content]', {
                        selector: '[data-select-item]',
                        select: 'first',
                    });
                })();
            } else if (!value) {
                isOpen = false;
            }
        },
        toggleItem: (v: string) => toggleItem(v),
    });

    const toggleItem = (itemValue: string): void => {
        if (type === 'SINGLE') {
            const current = value as string;

            if (current === itemValue) {
                if (allowDeselect) value = '';
            } else {
                value = itemValue;
            }
        } else {
            const current = value as string[];

            if (current.includes(itemValue)) {
                if (allowDeselect) {
                    value = current.filter((v) => v !== itemValue);
                }
            } else {
                value = [...current, itemValue];
            }
        }
    };
</script>

<div data-select-root>
    <FloatingMenu.Base {...rest} data-select-root>
        {@render children?.()}
    </FloatingMenu.Base>
</div>

<input
    {...withRef((el) => (ref = el as HTMLInputElement))}
    type="hidden"
    class="native-input"
    value={type === 'MULTIPLE' ? (value as string[]).join(',') : (value as string)}
    {disabled}
    {required}
    {name}
/>

<style>
    .native-input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        transform: translateX(-100%);
    }
</style>
