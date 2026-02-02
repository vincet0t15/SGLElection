import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from "@/components/ui/switch"
import InputError from '@/components/input-error';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Voters',
        href: '/voter',
    },
];

interface YearLevel {
    id: number;
    name: string;
}

interface YearSection {
    id: number;
    name: string;
    year_level_id: number;
}

interface Event {
    id: number;
    name: string;
}

interface Voter {
    id: number;
    name: string;
    lrn_number: string;
    username: string;
    year_level_id: number;
    year_section_id: number;
    event_id: number;
    is_active: boolean;
}

interface Props {
    voter: Voter;
    yearLevels: YearLevel[];
    yearSections: YearSection[];
    events: Event[];
}

export default function EditVoter({ voter, yearLevels, yearSections, events }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: voter.name,
        lrn_number: voter.lrn_number,
        username: voter.username,
        password: '',
        year_level_id: voter.year_level_id.toString(),
        year_section_id: voter.year_section_id.toString(),
        event_id: voter.event_id.toString(),
        is_active: voter.is_active,
    });


    const filteredSections = data.year_level_id
        ? yearSections.filter(section => section.year_level_id.toString() === data.year_level_id)
        : yearSections;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/voter/${voter.id}`, {
            onSuccess: () => {
                toast.success('Voter updated successfully');
            },
            onError: () => {
                toast.error('Failed to update voter. Please check the form.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Voter" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Edit Voter</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 lg:col-span-5">
                        <CardHeader>
                            <CardTitle>Voter Information</CardTitle>
                            <CardDescription>
                                Update the details of the voter.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={submit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Juan Dela Cruz"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lrn_number">LRN Number</Label>
                                        <Input
                                            id="lrn_number"
                                            placeholder="e.g. 123456789012"
                                            value={data.lrn_number}
                                            onChange={(e) => setData('lrn_number', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.lrn_number} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            placeholder="Unique username"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.username} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Leave blank to keep current password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="year_level">Year Level</Label>
                                        <Select
                                            value={data.year_level_id}
                                            onValueChange={(value) => setData('year_level_id', value)}
                                        >
                                            <SelectTrigger id="year_level">
                                                <SelectValue placeholder="Select Year Level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {yearLevels.map((level) => (
                                                    <SelectItem key={level.id} value={level.id.toString()}>
                                                        {level.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.year_level_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="year_section">Section</Label>
                                        <Select
                                            value={data.year_section_id}
                                            onValueChange={(value) => setData('year_section_id', value)}
                                            disabled={!data.year_level_id}
                                        >
                                            <SelectTrigger id="year_section">
                                                <SelectValue placeholder={data.year_level_id ? "Select Section" : "Select Year Level First"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredSections.map((section) => (
                                                    <SelectItem key={section.id} value={section.id.toString()}>
                                                        {section.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.year_section_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="event">Election Event</Label>
                                        <Select
                                            value={data.event_id}
                                            onValueChange={(value) => setData('event_id', value)}
                                        >
                                            <SelectTrigger id="event">
                                                <SelectValue placeholder="Select Event" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {events.map((event) => (
                                                    <SelectItem key={event.id} value={event.id.toString()}>
                                                        {event.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.event_id} />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Active Account</Label>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end p-6">
                                <Button type="submit" disabled={processing} className="w-full md:w-auto">
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Voter
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    <div className="col-span-4 lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Tips</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-2">
                                <p>
                                    • <strong>Username</strong> must be unique across the system.
                                </p>
                                <p>
                                    • <strong>LRN Number</strong> should be the student's valid Learner Reference Number.
                                </p>
                                <p>
                                    • Leave <strong>Password</strong> blank if you don't want to change it.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
