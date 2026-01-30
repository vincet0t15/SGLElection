import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Loader2, Upload, Download } from 'lucide-react';
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
    {
        title: 'Import',
        href: '/voter/import',
    },
];

interface Event {
    id: number;
    name: string;
}

interface Props {
    events: Event[];
}

export default function ImportVoter({ events }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        file: File | null;
        event_id: string;
    }>({
        file: null,
        event_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) {
            toast.error('Please select a file to upload.');
            return;
        }
        if (!data.event_id) {
            toast.error('Please select an event.');
            return;
        }

        post('/voter/import', {
            onSuccess: () => {
                toast.success('Voters imported successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to import voters. Please check the file and try again.');
            },
            forceFormData: true,
        });
    };

    const handleDownloadTemplate = () => {
        const headers = ['Learners Reference Number', 'Name', 'Section', 'Grade Level'];
        const sample = ['123456789012', 'Doe, John Smith', '3', '3'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + sample.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "voters_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Voters" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Import Voters</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 lg:col-span-5">
                        <CardHeader>
                            <CardTitle>Upload File</CardTitle>
                            <CardDescription>
                                Upload an Excel or CSV file to import voters in bulk.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={submit}>
                            <CardContent className="space-y-4">
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

                                <div className="space-y-2">
                                    <Label htmlFor="file">File</Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                        required
                                    />
                                    <InputError message={errors.file} />
                                </div>

                                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
                                    <p className="font-semibold">Instructions:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>File must be in .xlsx, .xls, or .csv format.</li>
                                        <li>The first row must contain the column headers: <strong>Learners Reference Number, Name, Section, Grade Level</strong>.</li>
                                        <li>Name format should be "Lastname, Firstname MiddleName" (e.g., Abao, Aldrich Franz Caabay).</li>
                                        <li>Section and Grade Level should match the name in the system (e.g., "3").</li>
                                        <li>Username and Password will be auto-generated based on Name and LRN.</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-6">
                                <Button type="button" variant="outline" onClick={handleDownloadTemplate}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Template
                                </Button>
                                <Button type="submit" disabled={processing || !data.file || !data.event_id}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import Voters
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
