import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';
import { SharedData } from '@/types';

export default function AppLogo() {
    const { system_settings } = usePage<SharedData>().props;

    return (
        <div className="flex items-center gap-2">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground overflow-hidden">
                {system_settings.logo ? (
                    <img src={system_settings.logo} alt="System Logo" className="size-full object-contain" />
                ) : (
                    <div className="bg-primary text-primary-foreground flex size-full items-center justify-center rounded-lg">
                        <AppLogoIcon className="size-5 fill-current" />
                    </div>
                )}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center ">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 bg-clip-text text-transparent tracking-widest mb-[-0.5rem]">
                    SVNHS
                </span>
                <span className="text-[12px] text-primary tracking-wide mb-[-0.2rem]">
                    Electronic Voting and
                </span>
                <span className="text-[12px] text-primary tracking-wide mb-[-0.5rem]">
                    Tallying System <span className='font-bold'>(eVote)</span>
                </span>
            </div>

        </div>
    );
}
