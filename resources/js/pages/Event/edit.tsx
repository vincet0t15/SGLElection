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
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    SelectedEvent: EventProps | null;
}
export function EventEditDialog({ open, setOpen, SelectedEvent }: Props) {
    if (!SelectedEvent) {
        return null;
    }
    const formatDateTimeForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const { data, setData, put, reset, processing, errors } = useForm<EventType>({
        name: SelectedEvent.name,
        dateTime_start: formatDateTimeForInput(SelectedEvent.dateTime_start),
        dateTime_end: formatDateTimeForInput(SelectedEvent.dateTime_end),
        location: SelectedEvent.location,
        description: SelectedEvent.description,
        is_active: SelectedEvent.is_active,
    })

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
                            <Input id="dateTime_start" name="dateTime_start" type="datetime-local" onChange={handleChange} value={data.dateTime_start} />
                            <InputError message={errors.dateTime_start} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="dateTime_end">Event End Date and Time</Label>
                            <Input id="dateTime_end" name="dateTime_end" type="datetime-local" onChange={handleChange} value={data.dateTime_end} />
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
