import z from 'zod';
import EventScreen from '#lib/app/calendar/forms/EventScreen.svelte';
import { RecurrenceForm } from './RecurrenceForm';
import { FlowForm } from '#lib';
const eventScheme = z.object({
    title: z.string().min(1),
    startDate: z.date(),
    endDate: z.date(),
    color: z.string(),
    isAllDay: z.boolean(),
});

type EventValues = z.infer<typeof eventScheme>;

export class EventForm extends FlowForm.FormBase<typeof eventScheme, [RecurrenceForm]> {
    protected defaults(): EventValues {
        return {
            title: '',
            startDate: new Date(),
            endDate: new Date(),
            color: '#4285F4',
            isAllDay: false,
        };
    }

    public constructor(defaultValues?: Partial<FlowForm.FormValues<EventForm>>) {
        super(eventScheme, defaultValues);
        this.addScreen('main', FlowForm.createFlowScreen(EventScreen));
        this.addForm('recurrence', new RecurrenceForm(defaultValues));
    }
}
