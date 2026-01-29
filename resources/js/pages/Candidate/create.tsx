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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CustomSelect from "@/components/custom-select";
import InputError from "@/components/input-error";
import { ChangeEventHandler, SubmitEventHandler, useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import candidate from "@/routes/candidate";
import { EventProps } from "@/types/event";
import { YearLevelProps } from "@/types/yearlevel";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    events: EventProps[];
    yearLevels: YearLevelProps[];
}

type CandidateForm = {
    name: string;
    year_level_id: number;
    year_section_id: number;
    event_id: number;
    position_id: number;
    photo?: File | null;
}

export function CandidateCreateDialog({ open, setOpen, events, yearLevels }: Props) {
    const { data, setData, post, reset, processing, errors } = useForm<CandidateForm>({
        name: '',
        year_level_id: 0,
        year_section_id: 0,
        event_id: 0,
        position_id: 0,
        photo: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const yearLevelOptions = useMemo(() => yearLevels.map((yl) => ({
        value: String(yl.id),
        label: yl.name,
    })), [yearLevels]);

    const yearSectionOptions = useMemo(() => {
        const yl = yearLevels.find((y) => y.id === data.year_level_id);
        return (yl?.section ?? []).map(sec => ({
            value: String(sec.id),
            label: sec.name,
        }));
    }, [yearLevels, data.year_level_id]);

    const eventOptions = useMemo(() => events.map((ev) => ({
        value: String(ev.id),
        label: ev.name,
    })), [events]);

    const positionOptions = useMemo(() => {
        const ev = events.find((e) => e.id === data.event_id);
        return (ev?.positions ?? []).map(pos => ({
            value: String(pos.id),
            label: pos.name,
        }));
    }, [events, data.event_id]);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: name === 'name' ? value : Number(value),
        })
    }

    const onChangeYearLevel = (yearLevelId: string) => {
        setData({
            ...data,
            year_level_id: Number(yearLevelId),
            year_section_id: 0,
        })
    }

    const onChangeYearSection = (yearSectionId: string) => {
        setData({
            ...data,
            year_section_id: Number(yearSectionId),
        })
    }

    const onChangeEvent = (eventId: string) => {
        setData({
            ...data,
            event_id: Number(eventId),
            position_id: 0,
        })
    }

    const onChangePosition = (positionId: string) => {
        setData({
            ...data,
            position_id: Number(positionId),
        })
    }

    const onChangePhoto: ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0] ?? null;
        setData({
            ...data,
            photo: file,
        });
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(candidate.store().url, {
            preserveState: true,
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                setOpen(false);
                reset();
                setPreviewUrl(null);
            },

        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>Create Candidate</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 mb-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Jane Doe" onChange={handleChange} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="year_level_id">Year Level</Label>
                            <CustomSelect
                                options={yearLevelOptions}
                                onChange={onChangeYearLevel}
                                value={String(data.year_level_id)}
                                placeholder="Select year level"
                                widthClass="w-full"
                            />
                            <InputError message={errors.year_level_id} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="year_section_id">Year Section</Label>
                            <CustomSelect
                                options={yearSectionOptions}
                                onChange={onChangeYearSection}
                                value={String(data.year_section_id)}
                                placeholder="Select year section"
                                widthClass="w-full"
                                disabled={data.year_level_id === 0}
                            />
                            <InputError message={errors.year_section_id} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="event_id">Event</Label>
                            <CustomSelect
                                options={eventOptions}
                                onChange={onChangeEvent}
                                value={String(data.event_id)}
                                placeholder="Select event"
                                widthClass="w-full"
                            />
                            <InputError message={errors.event_id} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="position_id">Position</Label>
                            <CustomSelect
                                options={positionOptions}
                                onChange={onChangePosition}
                                value={String(data.position_id)}
                                placeholder="Select position"
                                widthClass="w-full"
                                disabled={data.event_id === 0}
                            />
                            <InputError message={errors.position_id} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="photo">Photo</Label>
                            <Input id="photo" name="photo" type="file" accept="image/*" onChange={onChangePhoto} />
                            <InputError message={errors.photo as unknown as string} />
                            {previewUrl && (
                                <img src={previewUrl} alt="Preview" className="mt-2 h-40 w-40 object-cover rounded-md border" />
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800 hover:text-white" type="submit" disabled={processing} variant={'outline'}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Candidate
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
