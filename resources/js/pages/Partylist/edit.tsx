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
import partylist from "@/routes/partylist";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { PartylistProps, PartylistType } from "@/types/partylist";
import { EventProps } from "@/types/event";
import CustomSelect from "@/components/custom-select";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    events: EventProps[],
    SelectedPartylist: PartylistProps,
}
export function PartylistEditDialog({ open, setOpen, events, SelectedPartylist }: Props) {
    const { data, setData, put, reset, processing, errors } = useForm<PartylistType>({
        name: SelectedPartylist?.name || '',
        description: SelectedPartylist?.description || '',
        event_id: SelectedPartylist?.event_id || 0,
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
        put(partylist.update(SelectedPartylist?.id).url, {
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
                    <DialogTitle>Edit Partylist</DialogTitle>
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
                            <Label htmlFor="name">Partylist Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Alyansang Tapat" onChange={handleChange} value={data.name} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input id="description" name="description" placeholder="Description..." onChange={handleChange} value={data.description} />
                            <InputError message={errors.description} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Update Partylist
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}
