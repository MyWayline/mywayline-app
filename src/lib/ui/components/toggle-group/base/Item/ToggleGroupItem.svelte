<script lang="ts">
	import { getContext } from 'svelte';
	import { mergeProps } from '../../../../utils/merge-props.ts';
	import { withRef } from '../../../../utils/ref-attachment.ts';
	import type { ToggleGroupState, ToggleItemProps } from '../../index.ts';
	import { focusUtils } from '../../../../utils/focus.ts';

	let {
		children,
		child,
		ref = $bindable(),
		disabled = false,
		value,
		...rest
	}: ToggleItemProps = $props();

	const state = getContext<ToggleGroupState>('TOGGLE_GROUP_ROOT');
	const pressed = $derived(state.value.includes(value));
	const isDisabled = $derived(disabled || state.disabled);

	let mergedProps = $derived(
		mergeProps(
			rest,
			{
				type: 'button',
				disabled: isDisabled,
				'aria-disabled': isDisabled,
				'aria-pressed': pressed,
				'data-pressed': pressed ? '' : undefined,
				'data-disabled': isDisabled ? '' : undefined,
				'data-value': value,
				'data-toggle-group-item': '',
				onclick: () => {
					if (!isDisabled) state.toggleItem(value);
				},
				onkeydown: (e: KeyboardEvent) => {
					focusUtils.handleRoving(e, {
						root: '[data-toggle-group]',
						item: '[data-toggle-group-item]'
					});
				}
			},
			withRef((el) => (ref = el as HTMLButtonElement))
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps, pressed })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
