import { login } from '@/routes';
import voter from '@/routes/voter';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, ShieldCheck, Users, Vote } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome - SGLL Voting System" />

            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans selection:bg-emerald-500 selection:text-white">
                {/* Header/Nav */}
                <header className="w-full py-6 px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-600 p-2 rounded-lg text-white">
                                <Vote className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-emerald-900 dark:text-emerald-400">SGLL Voting System</span>
                        </div>
                        <nav className="hidden md:flex gap-6">
                            <Link href={(login())} className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                Admin Portal
                            </Link>
                        </nav>
                    </div>
                </header>

                <main>
                    {/* Hero Section */}
                    <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                                <span className="block">Modern & Secure</span>
                                <span className="block text-emerald-600 dark:text-emerald-500">Digital Voting Platform</span>
                            </h1>
                            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                                Experience a seamless election process with our secure, transparent, and user-friendly voting system.
                                Your voice matters—make it count today.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link
                                    href={(voter.login().url)}
                                    className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <Users className="h-5 w-5" />
                                    Login as Voter
                                </Link>
                                <Link
                                    href={(login())}
                                    className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-900 dark:text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck className="h-5 w-5" />
                                    Admin Login
                                </Link>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-30 dark:opacity-10">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                            <div className="absolute top-20 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-white dark:bg-gray-950 py-24 border-t border-gray-100 dark:border-gray-900">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="grid md:grid-cols-3 gap-12">
                                <div className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
                                        <ShieldCheck className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Your vote is encrypted and stored securely. We prioritize voter privacy and data integrity above all else.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
                                        <CheckCircle className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transparent Results</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Real-time vote counting ensures complete transparency. Results are verifiable and accurate.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
                                        <Users className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Easy Accessibility</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Vote from anywhere, anytime. Our platform is designed to be accessible on all devices.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="bg-gray-50 dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} SGLL Voting System. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
