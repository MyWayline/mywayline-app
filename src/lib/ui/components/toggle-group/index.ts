import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes, HTMLAttributes } from 'svelte/elements';

export type ToggleGroupProps = {
    ref?: HTMLDivElement;
    disabled?: boolean;
    orientation?: 'vertical' | 'horizontal';
    children?: Snippet<[]>;
    child?: Snippet<[{ props: Record<string, unknown> }]>;
    role?: string;
} & HTMLAttributes<HTMLDivElement>;

export type ToggleItemProps = {
    children?: Snippet<[]>;
    child?: Snippet<[{ props: Record<string, unknown>; pressed: boolean }]>;
    ref?: HTMLButtonElement;
    pressed?: boolean;
    value: string;
} & HTMLButtonAttributes;

export type SingleToggleProps = {
    type?: 'SINGLE';
    value?: string;
    allowDeselect?: boolean;
    onselected?: (selected: string) => void;
};

export type MultipleToggleProps = {
    type: 'MULTIPLE';
    value?: string[];
    allowDeselect?: boolean;
    onselected?: (selected: string[]) => void;
};

export interface StyledToggleItem extends Omit<ToggleItemProps, 'child'> {
    variant?: 'ghost' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
}

export type ToggleGroupState = {
    toggleItem: (value: string) => void;
    value: string[];
    disabled: boolean;
};

export { default as Base } from './base/ToggleGroupBase.svelte';
export { default as BaseItem } from './base/Item/ToggleGroupItem.svelte';
export { default as Item } from './styled/Item/ToggleGroupItem.svelte';
