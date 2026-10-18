import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type TabState = {
    toggleItem: (value: string) => void;
    value: string;
};

export interface TabBaseContentProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    ref?: HTMLDivElement;
    child?: Snippet<    [{ props: Record<string, unknown> }]>;
    children?: Snippet<[]>;
}

export interface TabBaseListProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement;
    child?: Snippet<    [{ props: Record<string, unknown> }]>;
    children?: Snippet<[]>;
}

export interface TabBaseTriggerProps extends HTMLButtonAttributes {
    value: string;
    ref?: HTMLButtonElement;
    disabled?: boolean;
    child?: Snippet<    [{ props: Record<string, unknown> }]>;
    children?: Snippet<[]>;
}

export interface TabBaseProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    controlled?: boolean;
    onValueChange?: (item: string) => void;
    children?: Snippet<[]>;
    child?: Snippet<    [{ props: Record<string, unknown> }]>;
    ref?: HTMLDivElement;
}

export interface StyledTabsProps extends Omit<TabBaseProps, 'child'> {
    children?: Snippet<[]>;
}

export interface StyledTabListProps extends Omit<TabBaseListProps, 'child'> {
    children?: Snippet<[]>;
    variant?: 'default' | 'subtle';
}

export interface StyledTabTriggerProps extends Omit<TabBaseTriggerProps, 'child'> {
    children?: Snippet<[]>;
    variant?: 'default' | 'subtle';
    size?: 'sm' | 'md';
}

export interface StyledTabContentProps extends Omit<TabBaseContentProps, 'child'> {
    children?: Snippet<[]>;
}

export { default as Base } from './base/TabBase.svelte';
export { default as BaseList } from './base/List/TabList.svelte';
export { default as BaseTrigger } from './base/Trigger/TabTrigger.svelte';
export { default as BaseContent } from './base/Content/TabContent.svelte';

export { default as Root } from './styled/Tab.svelte';
export { default as List } from './styled/List/TabList.svelte';
export { default as Trigger } from './styled/Trigger/TabTrigger.svelte';
export { default as Content } from './styled/Content/TabContent.svelte';
