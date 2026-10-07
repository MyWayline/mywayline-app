import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type ToggleProps = {
    children?: Snippet<[]>;
    child?: Snippet<[{ props: Record<string, unknown>; pressed: boolean }]>;
    ref?: HTMLButtonElement;
    pressed?: boolean;
} & HTMLButtonAttributes;

export interface StyledToggleProps extends Omit<ToggleProps, 'child'> {
    variant?: 'default' | 'outline' | 'subtle' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export { default as Base } from './base/ToggleBase.svelte';
export { default as Root } from './styled/Toggle.svelte';
