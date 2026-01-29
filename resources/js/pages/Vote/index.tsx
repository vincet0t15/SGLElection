import { Head } from '@inertiajs/react';
import { Toaster } from 'sonner';

export default function VoteIndex() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <Head title="Vote" />
            <Toaster richColors position="top-right" />
            <div className="mx-auto max-w-7xl">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Voting Page</h1>
                        </div>
                        <div className="mt-4">
                            <p className="text-muted-foreground">Welcome to the voting page.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
