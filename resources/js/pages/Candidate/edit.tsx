import { Button } from "@/components/ui/button";
import { useForm, Head, router, Link } from '@inertiajs/react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/custom-select";
import InputError from "@/components/input-error";
import { ChangeEventHandler, SubmitEventHandler, useMemo, useState } from "react";
import { LoaderCircle, ChevronLeft, Upload, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { EventProps } from "@/types/event";
import { YearLevelProps } from "@/types/yearlevel";
import { PartylistProps } from "@/types/partylist";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { dashboard } from "@/routes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CandidateProps } from "@/types/candidate";
import Heading from "@/components/heading";

interface Position {
    id: number;
    name: string;
    event_id: number;
}

interface Props {
    candidate: CandidateProps;
    events: EventProps[];
    yearLevels: YearLevelProps[];
    positions: Position[];
    partylists: PartylistProps[];
}

type CandidateForm = {
    name: string;
    year_level_id: number;
    year_section_id: number;
    event_id: number;
    position_id: number;
    partylist_id: number | null;
    platform?: string | null;
    photo?: File | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Candidates',
        href: '/candidate',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

export default function CandidateEdit({ candidate, events, yearLevels, positions, partylists }: Props) {
    const { data, setData, post, processing, errors } = useForm<CandidateForm>({
        name: candidate.name,
        year_level_id: candidate.year_level_id,
        year_section_id: candidate.year_section_id,
        event_id: candidate.event_id,
        position_id: candidate.position_id,
        partylist_id: candidate.partylist_id ?? null,
        platform: candidate.platform ?? '',
        photo: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        candidate.candidate_photos && candidate.candidate_photos.length > 0
            ? `/storage/${candidate.candidate_photos[0].path}`
            : null
    );

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

    const positionOptions = useMemo(() => positions.map(pos => ({
        value: String(pos.id),
        label: pos.name,
    })), [positions]);

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        const { name, value } = e.target;
        setData(name as keyof CandidateForm, value);
    }

    const onChangeYearLevel = (yearLevelId: string) => {
        setData(prev => ({
            ...prev,
            year_level_id: Number(yearLevelId),
            year_section_id: 0,
        }));
    }

    const onChangeYearSection = (yearSectionId: string) => {
        setData('year_section_id', Number(yearSectionId));
    }

    const onChangeEvent = (eventId: string) => {
        setData(prev => ({
            ...prev,
            event_id: Number(eventId),
            position_id: 0,
        }));

        // Fetch positions for the selected event
        router.get(`/candidate/${candidate.id}/edit`, { event_id: eventId }, {
            preserveState: true,
            preserveScroll: true,
            only: ['positions', 'partylists'],
            replace: true,
        });
    }

    const onChangePosition = (positionId: string) => {
        setData('position_id', Number(positionId));
    }

    const onChangePartylist = (partylistId: string) => {
        setData('partylist_id', Number(partylistId));
    }

    const handlePhotoChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(`/candidate/${candidate.id}`, {
            onSuccess: () => {
                toast.success("Candidate updated successfully");
            },
            onError: (err) => {
                toast.error("Failed to update candidate");
                console.error(err);
            },
            forceFormData: true,
        });
    }


    const partylistOptions = useMemo(() => partylists.map(pl => ({
        value: String(pl.id),
        label: pl.name,
    })), [partylists]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Candidate" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto rounded-xl p-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/candidate">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading
                        variant="small"
                        title="Edit Candidate"
                        description="Enter candidate details and assign a position and partylist."

                    />
                </div>

                <Card className="mx-auto w-full">
                    <CardHeader>
                        <CardTitle>Edit Candidate Profile</CardTitle>
                        <CardDescription>
                            Update the candidate's information below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                                {/* Left Column: Photo Upload */}
                                <div className="flex flex-col gap-4">
                                    <div
                                        className="relative group aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors bg-muted/5 flex items-center justify-center cursor-pointer"
                                        onClick={() => document.getElementById('photo')?.click()}
                                    >
                                        {previewUrl ? (
                                            <>
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="text-white flex flex-col items-center gap-1">
                                                        <ImagePlus className="h-8 w-8" />
                                                        <span className="text-xs font-medium">Change Photo</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-muted-foreground p-4 text-center">
                                                <div className="p-3 rounded-full bg-muted">
                                                    <Upload className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-foreground">Upload Photo</p>
                                                    <p className="text-xs">Click to browse</p>
                                                </div>
                                            </div>
                                        )}
                                        <Input
                                            type="file"
                                            id="photo"
                                            name="photo"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <InputError message={errors.photo} className="text-center" />
                                    <p className="text-xs text-muted-foreground text-center">
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> Max size of 5 MB
                                    </p>
                                </div>

                                {/* Right Column: Form Fields */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium">Personal Information</h3>
                                        <Separator className="my-2" />
                                        <div className="grid gap-4 mt-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Juan Dela Cruz"
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="platform">Platform / Description (Optional)</Label>
                                                <Textarea
                                                    id="platform"
                                                    name="platform"
                                                    value={data.platform || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter candidate platform or description..."
                                                    className="min-h-[100px]"
                                                />
                                                <InputError message={errors.platform} />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>Year Level</Label>
                                                    <CustomSelect
                                                        options={yearLevelOptions}
                                                        value={data.year_level_id ? String(data.year_level_id) : '0'}
                                                        onChange={onChangeYearLevel}
                                                        placeholder="Select Year Level"
                                                    />
                                                    <InputError message={errors.year_level_id} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Section</Label>
                                                    <CustomSelect
                                                        options={yearSectionOptions}
                                                        value={data.year_section_id ? String(data.year_section_id) : '0'}
                                                        onChange={onChangeYearSection}
                                                        placeholder="Select Section"
                                                        disabled={!data.year_level_id}
                                                    />
                                                    <InputError message={errors.year_section_id} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium">Candidacy Details</h3>
                                        <Separator className="my-2" />
                                        <div className="grid gap-4 mt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>Event</Label>
                                                    <CustomSelect
                                                        options={eventOptions}
                                                        value={data.event_id ? String(data.event_id) : '0'}
                                                        onChange={onChangeEvent}
                                                        placeholder="Select Event"
                                                    />
                                                    <InputError message={errors.event_id} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Position</Label>
                                                    <CustomSelect
                                                        options={positionOptions}
                                                        value={data.position_id ? String(data.position_id) : '0'}
                                                        onChange={onChangePosition}
                                                        placeholder="Select Position"
                                                        disabled={!data.event_id || positions.length === 0}
                                                    />
                                                    <InputError message={errors.position_id} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Partylist (Optional)</Label>
                                                    <CustomSelect
                                                        options={partylistOptions}
                                                        value={data.partylist_id ? String(data.partylist_id) : '0'}
                                                        onChange={onChangePartylist}
                                                        placeholder="Select Partylist"
                                                        disabled={!data.event_id || partylists.length === 0}
                                                    />
                                                    <InputError message={errors.partylist_id} />
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button type="button" variant="outline" asChild>
                                            <Link href="/candidate">Cancel</Link>
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}