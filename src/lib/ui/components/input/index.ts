import type { HTMLInputAttributes } from 'svelte/elements';

export type InputProps = {
    child?: import('svelte').Snippet<[{ props: Record<string, unknown> }]>;
    ref?: HTMLInputElement | null;
} & HTMLInputAttributes;

export interface StyledInputProps extends Omit<InputProps, 'child'> {
    variant?: 'normal' | 'authinput';
    label?: string;
    id?: string;
    passwordIndicator?: boolean;
    error?: string;
}

export { default as Base } from './base/InputBase.svelte';
export { default as Styled } from './styled/Input.svelte';
