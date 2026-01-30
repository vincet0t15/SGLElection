import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

export default function ImportVoter() {
    const { data, setData, post, processing, errors, reset } = useForm<{
        file: File | null;
    }>({
        file: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) {
            toast.error('Please select a file to upload.');
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
        const headers = ['name', 'lrn_number', 'username', 'password', 'year_level_id', 'year_section_id', 'event_id'];
        const sample = ['John Doe', '123456789012', 'johndoe', 'password123', '1', '1', '1'];
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
                                        <li>The first row must contain the column headers.</li>
                                        <li>Required columns: <strong>name, lrn_number, username, password, year_level_id, year_section_id, event_id</strong>.</li>
                                        <li>Ensure <strong>lrn_number</strong> and <strong>username</strong> are unique.</li>
                                        <li>Use IDs for Year Level, Section, and Event (check the database or admin panel for IDs).</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-6">
                                <Button type="button" variant="outline" onClick={handleDownloadTemplate}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Template
                                </Button>
                                <Button type="submit" disabled={processing || !data.file}>
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
