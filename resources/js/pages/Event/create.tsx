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
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export function EventCreateDialog({ open, setOpen }: Props) {
    const { data, setData, post, reset, processing, errors } = useForm<EventType>({
        name: '',
        dateTime_start: '',
        dateTime_end: '',
        location: '',
        description: '',
        is_active: true,
    })

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(event.store().url, {
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
                    <DialogTitle>Create Event</DialogTitle>
                    <DialogDescription>
                        Please fill in the event details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 mb-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Event Name</Label>
                            <Input id="name" name="name" placeholder="e.g. 1st Year General Meeting" onChange={handleChange} />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="dateTime_start">Event Start Date and Time</Label>
                            <Input id="dateTime_start" name="dateTime_start" type="datetime-local" onChange={handleChange} />

                            <InputError message={errors.dateTime_start} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="dateTime_end">Event End Date and Time</Label>
                            <Input id="dateTime_end" name="dateTime_end" type="datetime-local" onChange={handleChange} />

                            <InputError message={errors.dateTime_end} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="location">Event Location</Label>
                            <Input id="location" name="location" placeholder="e.g. Auditorium" onChange={handleChange} />

                            <InputError message={errors.location} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="description">Event Description</Label>
                            <Input id="description" name="description" placeholder="e.g. This is the 1st Year General Meeting" onChange={handleChange} />

                            <InputError message={errors.description} />
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Event
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}
