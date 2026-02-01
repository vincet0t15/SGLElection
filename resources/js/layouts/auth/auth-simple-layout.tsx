import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps, SharedData } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { FlashMessageToaster } from '@/components/flash-message-toaster';
import { Vote } from 'lucide-react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { system_settings } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">
             {/* Abstract Background */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl filter opacity-50 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-teal-100/40 dark:bg-teal-900/10 blur-3xl filter opacity-50"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <FlashMessageToaster />
            <Toaster position="top-center" />

            <div className="w-full max-w-[420px] bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 overflow-hidden ring-1 ring-white/20">
                                    {system_settings.logo ? (
                                        <img src={system_settings.logo} alt="System Logo" className="size-full object-cover" />
                                    ) : (
                                        <Vote className="size-8 text-white" />
                                    )}
                                </div>
                            </div>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
                            <p className="text-center text-sm text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    {children}

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            &copy; {new Date().getFullYear()} SGLL Voting System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
