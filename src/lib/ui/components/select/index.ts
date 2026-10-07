import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type SelectState = {
    toggleItem: (value: string) => void;
    value: string[];
    isOpen: boolean;
    disabled: boolean;
};

export type SingleSelectProps = {
    type?: 'SINGLE';
    value?: string;
    allowDeselect?: boolean;
};

export type MultipleSelectProps = {
    type: 'MULTIPLE';
    value?: string[];
    allowDeselect?: boolean;
};

export type BaseProps = {
    isOpen?: boolean;
    ref?: HTMLInputElement;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    children?: Snippet<[]>;
} & HTMLAttributes<HTMLDivElement>;

export { default as Base } from './base/SelectBase.svelte';
export { default as Item } from './base/Item/SelectItem.svelte';
export { default as Trigger } from './base/Trigger/SelectTrigger.svelte';
export { default as Content } from './base/Content/SelectContent.svelte';
