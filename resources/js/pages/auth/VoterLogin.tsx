import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import voter from '@/routes/voter';
import { login } from '@/routes';
import { User, Lock, Shield, Info, Vote } from 'lucide-react';

export default function VoterLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post((voter.login().url), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Voter Portal"
            description="Enter your credentials to cast your vote."
        >
            <Head title="Voter Login" />

            <div className="items-center justify-items-center bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-md p-2 mb-1 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600  flex-shrink-0" />
                <p className="text-[10px] text-blue-800 dark:text-blue-200 leading-snug">
                    Have your Voter ID ready. Contact support for issues.
                </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid gap-3">
                    <div className="grid gap-1.5">
                        <Label htmlFor="username" className="text-xs">Voter ID</Label>
                        <div className="relative">
                            <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                id="username"
                                type="text"
                                name="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="username"
                                placeholder="Enter your Voter ID"
                                className="pl-8 h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <InputError message={errors.username} />
                    </div>

                    <div className="grid gap-1.5">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-xs">Password</Label>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className="pl-8 h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-500/25 transition-all h-9 text-sm font-medium"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <Spinner className="text-white mr-2 w-3 h-3" />}
                        <Vote className="w-3.5 h-3.5 mr-2" />
                        Sign in to Vote
                    </Button>
                </div>

                <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-white dark:bg-slate-900 px-1 text-slate-400">
                            Or
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href={(login()).url}
                        className="inline-flex items-center justify-center w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors gap-1.5"
                    >
                        <Shield className="w-3.5 h-3.5" />
                        Login as Admin
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
