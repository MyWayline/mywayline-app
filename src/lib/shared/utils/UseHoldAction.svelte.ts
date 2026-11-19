import type { Action } from 'svelte/action';

export const useOnHold: Action<
    HTMLDivElement,
    undefined,
    {
        onhold: (e: CustomEvent) => void;
    }
> = (node) => {
    let timer: ReturnType<typeof setTimeout>;

    $effect(() => {
        node.addEventListener('pointerdown', () => {
            timer = setTimeout(() => {
                node.dispatchEvent(new CustomEvent('hold'));
            }, 500);
            node.addEventListener('pointerup', () => clearTimeout(timer));
            node.addEventListener('pointerleave', () => clearTimeout(timer));
        });

        return () => {
            node.dispatchEvent(new CustomEvent('onhold'));
        };
    });
};
