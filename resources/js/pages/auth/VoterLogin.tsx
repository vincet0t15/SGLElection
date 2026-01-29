import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import voter from '@/routes/voter';
import { login } from '@/routes';

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
            title="Voter Login"
            description="Enter your credentials to access the voting system"
        >
            <Head title="Voter Login" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
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
                            placeholder="username"
                            className="focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <InputError message={errors.username} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            className="focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <InputError message={errors.password} />
                    </div>



                    <Button
                        type="submit"
                        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <Spinner className="text-white" />}
                        Log in as Voter
                    </Button>
                </div>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Are you an admin? </span>
                    <Link
                        href={(login()).url}
                        className="font-medium text-emerald-600 hover:text-emerald-500 hover:underline"
                    >
                        Login here
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
