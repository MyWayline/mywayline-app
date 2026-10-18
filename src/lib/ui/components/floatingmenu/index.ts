import { type Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export { default as Base } from './base/FloatingMenu.svelte';
export { default as Content } from './base/Content/FloatingMenuContent.svelte';
export { default as Anchor } from './base/Anchor/FloatingMenuAnchor.svelte';

export type FloatingMenuState = {
    anchor: HTMLElement | null;
    content: HTMLElement | null;
    update: () => void;
    triggerId: string;
    contentId: string;
    id: string;
};

export interface FloatingMenuContentProps extends HTMLAttributes<HTMLDivElement> {
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
    offset?: number;
    padding?: number;
    ref?: HTMLElement;
    fitViewport?: boolean;
    content?: Snippet<[{ props: Record<string, unknown> }]>;
}
