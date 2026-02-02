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

import { ChangeEventHandler, SubmitEventHandler } from "react";
import position from "@/routes/position";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { PositionType } from "@/types/position";
import { EventProps } from "@/types/event";
import CustomSelect from "@/components/custom-select";
import { Checkbox } from "@/components/ui/checkbox"
import { YearLevelProps } from "@/types/yearlevel";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    events: EventProps[],
    yearLevels: YearLevelProps[],
}
export function PositionCreateDialog({ open, setOpen, events, yearLevels }: Props) {
    const { data, setData, post, reset, processing, errors } = useForm<PositionType>({
        name: '',
        max_votes: 1,
        event_id: 0,
        year_level_ids: [],
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

    const handleYearLevelChange = (checked: boolean, yearLevelId: number) => {
        if (checked) {
            setData('year_level_ids', [...data.year_level_ids, yearLevelId]);
        } else {
            setData('year_level_ids', data.year_level_ids.filter(id => id !== yearLevelId));
        }
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(position.store().url, {
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
                            <Input id="name" name="name" placeholder="e.g. President" onChange={handleChange} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="max_votes">Max Votes</Label>
                            <Input id="max_votes" name="max_votes" type="number" onChange={handleChange} />
                            <InputError message={errors.max_votes} />
                        </div>

                        <div className="grid gap-3">
                            <Label>Restricted to Year Levels (Optional)</Label>
                            <div className="grid grid-cols-2 gap-2 border p-3 rounded-md">
                                {yearLevels.map((yl) => (
                                    <div key={yl.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`yl-${yl.id}`}
                                            checked={data.year_level_ids.includes(yl.id)}
                                            onCheckedChange={(checked) => handleYearLevelChange(checked as boolean, yl.id)}
                                        />
                                        <Label htmlFor={`yl-${yl.id}`} className="font-normal cursor-pointer">
                                            {yl.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">If none selected, all year levels can vote.</p>
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
