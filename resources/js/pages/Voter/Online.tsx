import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, LogOut, RefreshCcw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
        title: 'Online Voters',
        href: '/online-voters',
    },
];

interface OnlineVoter {
    session_id: string;
    voter_id: number;
    name: string;
    username: string;
    lrn_number: string;
    ip_address: string;
    user_agent: string;
    last_activity: number;
    last_activity_human: string;
}

interface Props {
    onlineVoters: OnlineVoter[];
}

export default function Online({ onlineVoters }: Props) {
    const [sessionIdToDelete, setSessionIdToDelete] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleLogout = (sessionId: string) => {
        setSessionIdToDelete(sessionId);
        setOpenDialog(true);
    };

    const confirmLogout = () => {
        if (sessionIdToDelete) {
            router.delete(`/online-voters/${sessionIdToDelete}`, {
                preserveScroll: true,
                onSuccess: (response: { props: FlashProps }) => {
                    toast.success(response.props.flash?.success);
                    setOpenDialog(false);
                    setSessionIdToDelete(null);
                }
            });
        }
    };

    const handleRefresh = () => {
        router.reload();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Online Voters" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Online Voters"
                    description="Monitor currently active voter sessions and force logout if necessary."
                />

                <div className="flex justify-between items-center">
                    <Link href="/voter">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Voters
                        </Button>
                    </Link>

                    <Button onClick={handleRefresh} variant="outline" size="sm">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">Name</TableHead>
                                <TableHead className="text-primary font-bold">Username</TableHead>
                                <TableHead className="text-primary font-bold">IP Address</TableHead>
                                <TableHead className="text-primary font-bold">Last Activity</TableHead>
                                <TableHead className="text-primary font-bold text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {onlineVoters.length > 0 ? (
                                onlineVoters.map((voter) => (
                                    <TableRow key={voter.session_id} className="text-sm">
                                        <TableCell className="font-medium">{voter.name}</TableCell>
                                        <TableCell>{voter.username}</TableCell>
                                        <TableCell>{voter.ip_address}</TableCell>
                                        <TableCell title={new Date(voter.last_activity * 1000).toLocaleString()}>
                                            {voter.last_activity_human}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleLogout(voter.session_id)}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Force Logout
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                                        No voters are currently online.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Force Logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to force logout this voter? They will be disconnected immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmLogout} className="bg-red-600 hover:bg-red-700">
                            Force Logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
