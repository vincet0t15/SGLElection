import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Printer, Calendar, MapPin, Search, Eye } from 'lucide-react';
import { EventProps } from '@/types/event';
import { useState } from 'react';
import Heading from '@/components/heading';

interface Props {
    events: EventProps[];
}

export default function ReportsIndex({ events }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/reports' }]}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Reports"
                    description="View voting results, summaries, and analytics."
                />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search events..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[300px]">Event Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{event.name}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {event.description}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(event.dateTime_start).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {event.location ? (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>{event.location}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${event.is_active
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                            }`}>
                                            {event.is_active ? 'Active' : 'Ended'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">


                                        <Link href={`/reports/${event.id}`}>

                                            <span className='hover:underline hover:font-bold text-teal-800 hover:text-teal-900'>View</span>
                                        </Link>

                                    </TableCell>
                                </TableRow>
                            ))}

                            {filteredEvents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        {events.length === 0 ? "No events found." : "No matching events found."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
