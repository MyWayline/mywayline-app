import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export { default as Base } from './base/SwitchBase.svelte';
export { default as Root } from './styled/Switch.svelte';

export interface SwitchRootProps extends HTMLButtonAttributes {
    checked?: boolean;
    child?: Snippet<[{ props: Record<string, unknown>; checked: boolean }]>;
    children?: Snippet<[]>;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    readonly?: boolean;
    ref?: HTMLInputElement;
    value?: string;
}

export interface SwitchRootStyledProps extends Omit<SwitchRootProps, 'child'> {
    children?: Snippet<[]>;
    variant?: 'ghost' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
}
