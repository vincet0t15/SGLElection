import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';
import { SharedData } from '@/types';

export default function AppLogo() {
    const { system_settings } = usePage<SharedData>().props;

    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground overflow-hidden">
                {system_settings.logo ? (
                    <img src={system_settings.logo} alt="System Logo" className="size-full object-contain" />
                ) : (
                    <div className="bg-primary text-primary-foreground flex size-full items-center justify-center rounded-lg">
                        <AppLogoIcon className="size-5 fill-current" />
                    </div>
                )}
            </div>
            <div className="grid flex-1 text-center">
                <span className="text-base font-bold leading-tight tracking-tight break-words flex items-center justify-between w-full">
                    <img src="/middle_logo.png" alt="System Logo" className="h-10 w-auto object-contain" />
                </span>
            </div>
        </>
    );
}
