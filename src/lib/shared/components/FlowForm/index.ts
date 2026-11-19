import type { Component } from 'svelte';

export type FlowScreen<Values extends object = any> = {
    component: Component<{ values: Values }>;
};

export const createFlowScreen = <Values extends object>(
    component: Component<{ values: Values }>
): FlowScreen<Values> => ({
    component,
});

export * from './FormBase.svelte';
export type { AnyForm, FormValues } from './FormBase.svelte';
export { default as Base } from './FlowForm.svelte';
export { default as Link } from './FlowLink.svelte';
