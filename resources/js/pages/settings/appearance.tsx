import { Head, useForm } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import appearance, { edit as editAppearance } from '@/routes/appearance';
import type { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormEventHandler, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

interface Props {
    system_name: string;
    system_logo: string | null;
}

export default function Appearance({ system_name, system_logo }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(system_logo);

    const { data, setData, post, processing, errors } = useForm({
        system_name: system_name,
        system_logo: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('system_logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(appearance.update().url, {
            onSuccess: () => {
                toast.success('System settings updated successfully');
            },
            onError: () => {
                toast.error('Failed to update system settings');
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />
            <SettingsLayout>
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <h1 className="sr-only">Appearance Settings</h1>


                    <div className="space-y-6">
                        <div className="border-t pt-6">
                            <Heading
                                variant="small"
                                title="System Settings"
                                description="Customize the system name and logo"
                            />

                            <form onSubmit={submit} className="mt-6 space-y-6 max-w-xl">
                                <div className="space-y-2">
                                    <Label htmlFor="system_name">System Name</Label>
                                    <Input
                                        id="system_name"
                                        value={data.system_name}
                                        onChange={(e) => setData('system_name', e.target.value)}
                                        placeholder="Enter system name"
                                    />
                                    {errors.system_name && (
                                        <p className="text-sm text-destructive">{errors.system_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="system_logo">System Logo</Label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-16 w-16 overflow-hidden rounded-lg border bg-muted cursor-pointer flex items-center justify-center"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="System Logo"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No Logo</span>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Change Logo
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            id="system_logo"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {errors.system_logo && (
                                        <p className="text-sm text-destructive">{errors.system_logo}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
