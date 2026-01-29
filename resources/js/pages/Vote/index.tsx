import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Vote',
        href: '#',
    },
];

export default function VoteIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vote" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between pt-6">
                            <h1 className="text-2xl font-bold">Voting Page</h1>
                        </div>
                        <div className="mt-4">
                            <p className="text-muted-foreground">Welcome to the voting page.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
