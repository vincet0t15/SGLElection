import { Button } from "@/components/ui/button"
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { YearLevelType } from "@/types/yearlevel";
import { ChangeEventHandler, SubmitEventHandler } from "react";
import yearLevel from "@/routes/year-level";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { EventProps, EventType } from "@/types/event";
import event from "@/routes/event";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerTime } from "@/components/custom-date-time-picker";
import { useState } from "react";
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    SelectedEvent: EventProps | null;
}
export function EventEditDialog({ open, setOpen, SelectedEvent }: Props) {
    if (!SelectedEvent) {
        return null;
    }
    const formatLocalDateTime = (date?: Date) => {
        if (!date) return '';
        const pad = (n: number) => String(n).padStart(2, '0');
        const y = date.getFullYear();
        const m = pad(date.getMonth() + 1);
        const d = pad(date.getDate());
        const hh = pad(date.getHours());
        const mm = pad(date.getMinutes());
        return `${y}-${m}-${d}T${hh}:${mm}`;
    };

    const { data, setData, put, reset, processing, errors } = useForm<EventType>({
        name: SelectedEvent.name,
        dateTime_start: formatLocalDateTime(SelectedEvent.dateTime_start ? new Date(SelectedEvent.dateTime_start) : undefined),
        dateTime_end: formatLocalDateTime(SelectedEvent.dateTime_end ? new Date(SelectedEvent.dateTime_end) : undefined),
        location: SelectedEvent.location,
        description: SelectedEvent.description,
        is_active: SelectedEvent.is_active,
    })

    const [startDate, setStartDate] = useState<Date | undefined>(
        SelectedEvent.dateTime_start ? new Date(SelectedEvent.dateTime_start) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        SelectedEvent.dateTime_end ? new Date(SelectedEvent.dateTime_end) : undefined
    );

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(event.update(SelectedEvent.id).url, {
            preserveState: true,
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                setOpen(false);
                reset();
            },
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>


            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>
                        Please fill in the event details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 mb-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Event Name</Label>
                            <Input id="name" name="name" placeholder="e.g. 1st Year General Meeting" onChange={handleChange} value={data.name} />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="dateTime_start">Event Start Date and Time</Label>
                            <DatePickerTime
                                date={startDate}
                                setDate={(d) => {
                                    setStartDate(d);
                                    setData({
                                        ...data,
                                        dateTime_start: formatLocalDateTime(d || undefined),
                                    });
                                }}
                            />
                            <InputError message={errors.dateTime_start} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="dateTime_end">Event End Date and Time</Label>
                            <DatePickerTime
                                date={endDate}
                                setDate={(d) => {
                                    setEndDate(d);
                                    setData({
                                        ...data,
                                        dateTime_end: formatLocalDateTime(d || undefined),
                                    });
                                }}
                            />
                            <InputError message={errors.dateTime_end} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="location">Event Location</Label>
                            <Input id="location" name="location" placeholder="e.g. Auditorium" onChange={handleChange} value={data.location} />
                            <InputError message={errors.location} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="description">Event Description</Label>
                            <Textarea id="description" name="description" placeholder="e.g. This is the 1st Year General Meeting" onChange={handleChange} value={data.description} />
                            <InputError message={errors.description} />
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Update Event
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}
