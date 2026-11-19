import { createContext } from 'svelte';

export type FlowEntry = { key: number; id: string };

export class FlowContext {
    stack = $state.raw<FlowEntry[]>([]);
    index = $state(0);
    busy = $state(false);

    private createEntry(name: string): FlowEntry {
        return { key: this.stack.length, id: name };
    }

    public constructor(defaultName: string = 'main') {
        this.stack = [this.createEntry(defaultName)];
    }

    push(id: string) {
        if (this.busy) return;
        this.stack = [...this.stack.slice(0, this.index + 1), this.createEntry(id)];
        this.index = this.stack.length - 1;
    }

    pop() {
        if (this.busy || this.index === 0) return;
        this.index -= 1;
    }

    public get canGoBack() {
        return this.index > 0;
    }

    commit(index: number) {
        this.index = index;
        if (this.stack.length > index + 1) this.stack = this.stack.slice(0, index + 1);
    }
}

export const [getFlowContext, setFlowContext] = createContext<FlowContext>();
