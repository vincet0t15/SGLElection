import { Head, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { download, restore, reset } from '@/routes/settings/backup';
import { useRef, useState } from 'react';
import ImportDatabase from './alert';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/appearance',
    },
    {
        title: 'Backup & Restore',
        href: '/settings/backup',
    },
];

export default function Backup() {
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleDownload = () => {
        window.location.href = download().url;
    };

    const handleReset = (action: string, confirmationMessage: string) => {
        if (confirm(confirmationMessage)) {
            router.post(reset().url, { action }, {
                onError: () => toast.error('Failed to reset system'),
            });
        }
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setOpenAlert(true);
    };

    const handleAcceptImport = () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('backup_file', selectedFile);

        router.post(restore().url, formData, {
            onSuccess: (page) => {
                const flash = page.props.flash as FlashProps['flash'];
                if (flash?.success) {
                    toast.success(flash.success);
                }
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to restore database');
                if (fileInputRef.current) fileInputRef.current.value = '';
                setSelectedFile(null);
            },
            onFinish: () => {
                if (fileInputRef.current) fileInputRef.current.value = '';
                setSelectedFile(null);
            },
            forceFormData: true,
        });
    };

    const cancelImport = () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSelectedFile(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Backup & Restore" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div>
                        <Heading
                            title="Backup & Restore"
                            description="Manage your database backups and system reset"
                        />
                        <div className="mt-6 grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Download className="h-5 w-5 text-emerald-600" />
                                        Download Backup
                                    </CardTitle>
                                    <CardDescription>
                                        Create a full backup of the database (SQL file).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        It is recommended to download a backup regularly, especially before making major changes or resetting the system.
                                    </p>
                                    <Button onClick={handleDownload} className="w-full sm:w-auto">
                                        Download SQL Backup
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Upload className="h-5 w-5 text-blue-600" />
                                        Restore Database
                                    </CardTitle>
                                    <CardDescription>
                                        Restore from a SQL file.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Select a SQL backup file to restore. This will replace the current database.
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".sql,.txt"
                                    />
                                    <Button onClick={handleRestoreClick} variant="outline" className="w-full sm:w-auto">
                                        Import SQL (Restore)
                                    </Button>
                                </CardContent>
                            </Card>

                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-medium text-red-600 flex items-center gap-2 mb-4">
                                    <ShieldAlert className="h-5 w-5" />
                                    Danger Zone
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg gap-4">
                                        <div>
                                            <h4 className="font-medium text-red-900">Clear All Votes</h4>
                                            <p className="text-sm text-red-700">Removes all votes and activity logs. Voters remain registered.</p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleReset('clear_votes', 'Are you sure you want to DELETE ALL VOTES? This action cannot be undone.')}
                                        >
                                            Clear Votes
                                        </Button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg gap-4">
                                        <div>
                                            <h4 className="font-medium text-red-900">Reset Voter Status</h4>
                                            <p className="text-sm text-red-700">Sets all voters to "Not Voted" status. Useful for re-elections.</p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleReset('reset_voters_status', 'Are you sure you want to RESET ALL VOTER STATUS? Voters will be able to vote again.')}
                                        >
                                            Reset Status
                                        </Button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg gap-4">
                                        <div>
                                            <h4 className="font-medium text-red-900">Delete All Voters</h4>
                                            <p className="text-sm text-red-700">Permanently deletes all voters and their votes.</p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleReset('delete_voters', 'CRITICAL WARNING: Are you sure you want to DELETE ALL VOTERS AND VOTES? This will wipe the entire election data.')}
                                        >
                                            Delete All Data
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
            {openAlert && <ImportDatabase open={openAlert} setOpen={setOpenAlert} acceptImport={handleAcceptImport} cancelImport={cancelImport} />}
        </AppLayout>
    );
}
