import type z from 'zod';
import type { FlowScreen } from '.';

// Typing
export type AnyForm = FormBase<z.ZodType<object>, any>;

/**
 * Turns A | B into A & B. Needed to combine the values of several subforms.
 */
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

/**
 * A form's own values plus the  values of all its subforms.
 */
type MergedValues<
    S extends z.ZodType<object>,
    Subforms extends AnyForm[],
> = SchemaValues<S> & UnionToIntersection<Subforms[number]['values']>;
type SchemaValues<S extends z.ZodType<object>> = z.infer<S>;

/**
 * The full value type of a form.
 */
export type FormValues<F extends AnyForm> = F['values'];

export type InitialValues<
    S extends z.ZodType<object>,
    Subforms extends AnyForm[] = [],
> = Partial<MergedValues<S, Subforms>>;

// Helpers
const pick = (obj: object, keys: string[]) =>
    Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));

/**
 * Returns all the values which aren't undefined. Used for getting the set initial values for override.
 */
const withoutUndefined = <T extends object>(obj: T): Partial<T> =>
    Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
    ) as Partial<T>;

/**
 * If a screen key starts with main, return the new forkey. If it doesn't, combine them.
 */
const mountedScreenId = (formKey: string, screenKey: string) =>
    screenKey === 'main' ? formKey : `${formKey}.${screenKey}`;

/**
 * Base class for FlowForms (multi-step forms)
 *
 * - OwnValues: the values this form defines itself.
 * - Subforms: tuple of forms mounted via `addForm`, ex. `[RecurrenceForm]`.
 */
export abstract class FormBase<
    S extends z.ZodType<object>,
    Subforms extends AnyForm[] = [],
> {
    readonly #schema: S;
    readonly #values = {} as MergedValues<S, Subforms>;
    readonly #screens: Record<string, FlowScreen<any>> = {};
    readonly #subforms: AnyForm[] = [];

    protected abstract defaults(): z.infer<S>;

    public constructor(schema: S, initialValues?: InitialValues<S, Subforms>) {
        this.#schema = schema;

        const defaults = this.defaults();

        const ownInitial = pick(
            withoutUndefined(initialValues ?? {}),
            Object.keys(defaults)
        );

        const ownState = $state({
            ...defaults,
            ...ownInitial,
        }) as z.infer<S>;

        this.#forwardValues(ownState);
    }

    public get values() {
        return this.#values;
    }

    public get screens() {
        return this.#screens;
    }

    public addScreen(key: string, screen: FlowScreen<MergedValues<S, Subforms>>) {
        this.#screens[key] = screen;
    }

    public addForm(key: string, form: Subforms[number]) {
        this.#subforms.push(form);
        this.#forwardValues(form.values);

        for (const [screenKey, screen] of Object.entries(form.screens)) {
            this.#screens[mountedScreenId(key, screenKey)] = screen;
        }
    }

    public validate(): z.core.$ZodIssue[] {
        const ownValues = Object.fromEntries(
            Object.keys(this.defaults()).map((key) => [
                key,
                (this.#values as Record<string, unknown>)[key],
            ])
        );

        const ownIssues = this.#schema.safeParse(ownValues).error?.issues ?? [];
        const subformIssues = this.#subforms.flatMap((form) => form.validate());

        return [...ownIssues, ...subformIssues];
    }

    #forwardValues(source: object) {
        const target = this.#values as object;

        for (const key of Object.keys(source)) {
            if (Object.hasOwn(target, key)) {
                throw new Error(`Form value "${key}" is defined by more than one form`);
            }

            Object.defineProperty(target, key, {
                enumerable: true,
                get: () => (source as Record<string, unknown>)[key],
                set: (value) => {
                    (source as Record<string, unknown>)[key] = value;
                },
            });
        }
    }
}
