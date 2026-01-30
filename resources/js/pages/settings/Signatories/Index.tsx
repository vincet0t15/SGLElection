import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useState } from 'react';
import { index as indexSignatories, store as storeSignatory, update as updateSignatory, destroy as destroySignatory } from '@/routes/signatories';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface Event {
    id: number;
    name: string;
}

interface Signatory {
    id: number;
    event_id: number | null;
    event?: Event;
    name: string;
    position: string;
    description: string | null;
    is_active: boolean;
    order: number;
}

interface Props {
    signatories: Signatory[];
    events: Event[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Signatories',
        href: indexSignatories().url,
    },
];

export default function Signatories({ signatories, events }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingSignatory, setEditingSignatory] = useState<Signatory | null>(null);

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
        event_id: null as number | null,
        name: '',
        position: '',
        description: '',
        is_active: true,
        order: 0,
    });

    const handleCreate = () => {
        setEditingSignatory(null);
        reset();
        clearErrors();
        setIsCreateOpen(true);
    };

    const handleEdit = (signatory: Signatory) => {
        setEditingSignatory(signatory);
        setData({
            event_id: signatory.event_id,
            name: signatory.name,
            position: signatory.position,
            description: signatory.description || '',
            is_active: signatory.is_active,
            order: signatory.order,
        });
        clearErrors();
        setIsCreateOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingSignatory) {
            put(updateSignatory({ signatory: editingSignatory.id }).url, {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    toast.success('Signatory updated successfully');
                    reset();
                },
                onError: () => toast.error('Failed to update signatory'),
            });
        } else {
            post(storeSignatory().url, {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    toast.success('Signatory created successfully');
                    reset();
                },
                onError: () => toast.error('Failed to create signatory'),
            });
        }
    };

    const handleDelete = (signatory: Signatory) => {
        if (confirm('Are you sure you want to delete this signatory?')) {
            router.delete(destroySignatory({ signatory: signatory.id }).url, {
                onSuccess: () => toast.success('Signatory deleted successfully'),
                onError: () => toast.error('Failed to delete signatory'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Signatories" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Signatories"
                        description="Manage the signatories that appear on reports."
                    />
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Signatory
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {signatories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No signatories found. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                signatories.map((signatory) => (
                                    <TableRow key={signatory.id}>
                                        <TableCell>{signatory.order}</TableCell>
                                        <TableCell>
                                            {signatory.event ? (
                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                    {signatory.event.name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                    Global
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{signatory.name}</TableCell>
                                        <TableCell>{signatory.position}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={signatory.is_active}
                                                onCheckedChange={(checked) => {
                                                    router.put(updateSignatory({ signatory: signatory.id }).url, {
                                                        is_active: checked

                                                    }, {
                                                        preserveScroll: true,
                                                        onSuccess: () => toast.success('Status updated'),
                                                    });
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(signatory)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(signatory)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingSignatory ? 'Edit Signatory' : 'Add Signatory'}</DialogTitle>
                        <DialogDescription>
                            {editingSignatory
                                ? 'Update the signatory details below.'
                                : 'Add a new signatory to be displayed on reports.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="event_id">Event (Optional)</Label>
                            <Select
                                value={data.event_id?.toString() || "global"}
                                onValueChange={(value) => setData('event_id', value === "global" ? null : parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Event" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="global">All Events (Global)</SelectItem>
                                    {events.map((event) => (
                                        <SelectItem key={event.id} value={event.id.toString()}>
                                            {event.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[0.8rem] text-muted-foreground">
                                Select an event to make this signatory specific to that event. Leave as "All Events" for global signatories.
                            </p>
                            {errors.event_id && <p className="text-sm text-destructive">{errors.event_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. John Doe"
                                required
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input
                                id="position"
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                                placeholder="e.g. Election Committee Head"
                                required
                            />
                            {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order">Display Order</Label>
                            <Input
                                id="order"
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', parseInt(e.target.value))}
                                placeholder="0"
                            />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked)}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingSignatory ? 'Save Changes' : 'Create Signatory'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
