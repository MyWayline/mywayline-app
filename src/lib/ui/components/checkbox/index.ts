import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export { default as Base } from './base/CheckboxBase.svelte';
export { default as Root } from './styled/Checkbox.svelte';

export interface CheckboxProps extends Omit<HTMLButtonAttributes, 'type' | 'children'> {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    readonly?: boolean;
    child?: Snippet<
        [{ props: Record<string, unknown>; checked: boolean; indeterminate: boolean }]
    >;
    children?: Snippet<[]>;
    ref?: HTMLInputElement;
}

export interface StyledCheckboxProps extends Omit<CheckboxProps, 'child'> {
    variant?: 'default' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
}
