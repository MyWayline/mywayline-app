import type { HTMLInputAttributes } from 'svelte/elements';

export type InputProps = {
    child?: import('svelte').Snippet<[{ props: Record<string, unknown> }]>;
    ref?: HTMLInputElement | null;
} & HTMLInputAttributes;

export interface StyledInputProps extends Omit<InputProps, 'child' | 'size'> {
    variant?: 'ghost' | 'primary' | 'secondary';
    appearance?: 'plain' | 'underline';
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    id?: string;
    inputClass?: string;
    passwordIndicator?: boolean;
    error?: string;
}

export { default as Base } from './base/InputBase.svelte';
export { default as Styled } from './styled/Input.svelte';
