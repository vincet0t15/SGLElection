import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import voter from '@/routes/voter';
import { ShieldCheck, User, Lock, KeyRound } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Admin Portal"
            description="Secure access for election administrators only."
        >
            <Head title="Admin Login" />

            <div className="items-center justify-items-center bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-md p-2 mb-1 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600  flex-shrink-0" />
                <p className="text-[10px] text-emerald-800 dark:text-emerald-200 leading-snug">
                    Restricted area. Activities are monitored.
                </p>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="username" className="text-xs">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                    <Input
                                        id="username"
                                        type="text"
                                        name="username"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        placeholder="Admin Username"
                                        className="pl-8 h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <InputError message={errors.username} />
                            </div>

                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs">Password</Label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="pl-8 h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 h-3.5 w-3.5"
                                />
                                <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 font-normal">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 h-9 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="text-white mr-2 w-3 h-3" />}
                                Sign In
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
                                href={(voter.login().url)}
                                className="inline-flex items-center justify-center w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors gap-1.5"
                            >
                                <KeyRound className="w-3.5 h-3.5" />
                                Login as Voter
                            </Link>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-3 p-2 bg-green-50 text-green-600 rounded-md text-xs font-medium text-center border border-green-100">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
