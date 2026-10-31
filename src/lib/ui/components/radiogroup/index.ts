import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export interface BaseProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLInputElement;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    value: string;
    children?: Snippet<[]>;
    child?: Snippet<[{ props: Record<string, any> }]>;
}

export interface BaseItemProps extends HTMLButtonAttributes {
    value: string;
    disabled?: boolean;
    child?: Snippet<[{ props: Record<string, any>; checked: boolean }]>;
    children?: Snippet<[]>;
    ref?: HTMLButtonElement;
}

export interface StyledRootProps extends Omit<BaseProps, 'child'> {}
export interface StyledItemProps extends Omit<BaseItemProps, 'child'> {
    variant?: 'ghost' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
}

export type RadioGroupState = {
    toggleItem: (value: string) => void;
    value: string;
    disabled: boolean;
};

export { default as Base } from './base/RadioGroupBase.svelte';
export { default as BaseItem } from './base/Item/RadioGroupItem.svelte';
export { default as Root } from './styled/RadioGroup.svelte';
export { default as Item } from './styled/Item/RadioGroupItem.svelte';
