import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle,
    ShieldCheck,
    Users,
    Vote,
    ClipboardCheck,
    Lock,
    Smartphone,
    ChevronRight,
    BarChart3,
    FileCheck,
    Fingerprint
} from 'lucide-react';
import { login } from '@/routes';
import { login as voterLogin } from '@/routes/voter';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome - SVNHS Voting System" />

            <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
                {/* Header/Nav */}
                <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-600/20">
                                <Fingerprint className="h-6 w-6" />
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
                        <nav className="flex gap-4">
                            <Link
                                href={login().url}
                                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                <span className="hidden md:inline">Admin Portal</span>
                            </Link>
                        </nav>
                    </div>
                </header>

                <main>
                    {/* Hero Section */}
                    <div className="relative overflow-hidden pt-20 pb-32 lg:pt-40 lg:pb-56">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-8 border border-emerald-100 dark:border-emerald-900/50 animate-fade-in-up">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                                Official Voting Portal
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
                                Your Voice, <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Your Future</span>
                            </h1>

                            <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                                Welcome to the official voting platform. Securely cast your vote and participate in shaping the future of our community.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                <Link
                                    href={voterLogin().url}
                                    className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <Vote className="h-6 w-6" />
                                    <span>Vote Now</span>
                                    <ChevronRight className="h-5 w-5 opacity-70" />
                                </Link>
                            </div>
                            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                                Need help? <span className="text-emerald-600 font-medium cursor-pointer hover:underline">Contact Support</span>
                            </p>
                        </div>

                        {/* Abstract Background */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                            <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl filter opacity-50"></div>
                            <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-100/40 dark:bg-teal-900/10 blur-3xl filter opacity-50"></div>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        </div>
                    </div>

                    {/* Stats/Trust Banner */}
                    <div className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: 'Security', value: 'Enterprise Grade', icon: Lock },
                                    { label: 'Transparency', value: 'Real-time Audit', icon: FileCheck },
                                    { label: 'Uptime', value: '99.9% Reliable', icon: CheckCircle },
                                    { label: 'Accessibility', value: 'Any Device', icon: Smartphone },
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center text-center gap-2">
                                        <stat.icon className="h-6 w-6 text-emerald-600 mb-1" />
                                        <div className="font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Process Section (How it works) */}
                    <div className="py-24 bg-white dark:bg-slate-950">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-4">
                                    Simple Voting Process
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                    Cast your vote in three easy steps.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 relative">
                                {/* Connecting Line (Desktop) */}
                                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>

                                {/* Steps */}
                                {[
                                    {
                                        title: "Login",
                                        desc: "Enter your secure voter credentials to access your ballot.",
                                        icon: Lock,
                                        step: "01"
                                    },
                                    {
                                        title: "Select Candidates",
                                        desc: "Choose your preferred candidates for each position.",
                                        icon: Vote,
                                        step: "02"
                                    },
                                    {
                                        title: "Submit Vote",
                                        desc: "Review your selections and submit your vote securely.",
                                        icon: ClipboardCheck,
                                        step: "03"
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative flex flex-col items-center text-center p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6 border-4 border-white dark:border-slate-950 shadow-sm">
                                            <item.icon className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="absolute top-6 right-6 text-4xl font-black text-slate-100 dark:text-slate-800 select-none opacity-50">
                                            {item.step}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="bg-slate-50 dark:bg-slate-900 py-24 border-t border-slate-200 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: "Live Updates",
                                        desc: "Stay informed with real-time election progress and announcements.",
                                        icon: BarChart3
                                    },
                                    {
                                        title: "Secure & Anonymous",
                                        desc: "Your vote is encrypted and completely anonymous.",
                                        icon: ShieldCheck
                                    },
                                    {
                                        title: "Vote Anywhere",
                                        desc: "Access the voting platform from any device, anywhere.",
                                        icon: Smartphone
                                    }
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex gap-4 p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors">
                                        <div className="flex-shrink-0">
                                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                                                <feature.icon className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-emerald-600 p-1.5 rounded text-white">
                                    <Vote className="h-4 w-4" />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">SGLL Voting System</span>
                            </div>

                            <div className="text-slate-500 dark:text-slate-400 text-sm">
                                &copy; {new Date().getFullYear()} SGLL Voting System. All rights reserved.
                            </div>

                            <div className="flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <span className="hover:text-emerald-600 cursor-pointer transition-colors">Privacy Policy</span>
                                <span className="hover:text-emerald-600 cursor-pointer transition-colors">Terms of Service</span>
                                <span className="hover:text-emerald-600 cursor-pointer transition-colors">Contact Support</span>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
