import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export { default as Base } from './base/ButtonBase.svelte';
export { default as Root } from './styled/Button.svelte';

export type ButtonProps = {
    children?: Snippet<[]>;
    child?: Snippet<[{ props: Record<string, unknown> }]>;
    ref?: HTMLButtonElement;
} & HTMLButtonAttributes;

export interface StyledButtonProps extends Omit<ButtonProps, 'child'> {
    variant?: 'ghost' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    iconOnly?: boolean;
    isLoading?: boolean;
}
