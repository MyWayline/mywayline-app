<script lang="ts">
    import { setContext, type Snippet } from 'svelte';
    import * as FloatingMenu from '../../floatingmenu/index.ts';

    let {
        isOpen = $bindable(false),
        anchor,
        children,
    }: {
        isOpen?: boolean;
        anchor?: HTMLElement;
        children?: Snippet<[]>;
    } = $props();

    setContext('POPOVER_ROOT', {
        get isOpen() {
            return isOpen;
        },
        set isOpen(value: boolean) {
            isOpen = value;
        },
    });
</script>

<FloatingMenu.Base {anchor}>
    {@render children?.()}
</FloatingMenu.Base>
