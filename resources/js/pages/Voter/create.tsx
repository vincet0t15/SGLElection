import { Head, router } from '@inertiajs/react';
import { Delete, PlusIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Voter() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Voter" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 bg-red">

                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Create Voter</h2>
                </div>


            </div>
        </AppLayout >
    )

}