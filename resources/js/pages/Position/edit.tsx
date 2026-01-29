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

import { ChangeEventHandler, FormEventHandler, SubmitEventHandler } from "react";
import position from "@/routes/position";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { PositionProps, PositionType } from "@/types/position";
import { EventProps } from "@/types/event";
import CustomSelect from "@/components/custom-select";
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    events: EventProps[],
    SelectedPosition: PositionProps,
}
export function PositionEditDialog({ open, setOpen, events, SelectedPosition }: Props) {
    const { data, setData, put, reset, processing, errors } = useForm<PositionType>({
        name: SelectedPosition?.name || '',
        max_votes: SelectedPosition?.max_votes || 1,
        event_id: SelectedPosition?.event_id || 0,
    })

    const eventOptions = events.map((event) => ({
        value: event.id,
        label: event.name,
    }))

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const onChangeEvent = (eventId: String) => {
        setData({
            ...data,
            event_id: Number(eventId),
        })
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(position.update(SelectedPosition?.id).url, {
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
                    <DialogTitle>Create Position</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 mb-4">
                        <div className="grid gap-3">
                            <Label htmlFor="event_id">Select Event</Label>
                            <CustomSelect
                                options={eventOptions.map(opt => ({ value: String(opt.value), label: opt.label }))}
                                onChange={onChangeEvent}
                                value={String(data.event_id)}
                                placeholder="Select an event"
                                widthClass="w-full"
                            />
                            <InputError message={errors.event_id} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="name">Position</Label>
                            <Input id="name" name="name" placeholder="e.g. President" onChange={handleChange} value={data.name} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="max_votes">Max Votes</Label>
                            <Input id="max_votes" name="max_votes" type="number" onChange={handleChange} value={data.max_votes} />
                            <InputError message={errors.max_votes} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Position
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}
