import { FlowForm } from '#lib';
import RecurrenceScreen from '#lib/app/calendar/forms/RecurrenceScreen.svelte';
import z from 'zod';

export const recurrenceSchema = z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'none']),
    weekDays: z.array(z.enum(['0', '1', '2', '3', '4', '5', '6'])),
    weekNumber: z.enum(['1', '2', '3', '4']),
});

type RecurrenceValues = z.infer<typeof recurrenceSchema>;

export class RecurrenceForm extends FlowForm.FormBase<typeof recurrenceSchema> {
    protected defaults(): RecurrenceValues {
        return recurrenceSchema.parse({
            frequency: 'none',
            weekDays: [new Date().getDay().toString()],
            weekNumber: '1',
        });
    }

    public constructor(defaultValues?: Partial<RecurrenceValues>) {
        super(recurrenceSchema, defaultValues);
        this.addScreen('main', FlowForm.createFlowScreen(RecurrenceScreen));
    }
}
