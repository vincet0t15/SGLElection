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

            <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg p-3 mb-2 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    Please ensure you have your Voter ID ready. If you experience any issues, contact the election committee.
                </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Voter ID</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
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
                                className="pl-9 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <InputError message={errors.username} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
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
                                className="pl-9 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25 transition-all h-11 text-base font-medium"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <Spinner className="text-white mr-2" />}
                        <Vote className="w-4 h-4 mr-2" />
                        Sign in to Vote
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">
                            Or
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href={(login()).url}
                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors gap-2"
                    >
                        <Shield className="w-4 h-4" />
                        Login as Admin
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
