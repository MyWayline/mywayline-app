export class FloatingMenuState {
    anchor = $state<HTMLElement | null>(null);
    content = $state<HTMLElement | null>(null);

    version = $state(0);

    update() {
        this.version++;
    }

    id = Math.random().toString(36).slice(2, 9);
    triggerId = `floating-trigger-${this.id}`;
    contentId = `floating-content-${this.id}`;
}
