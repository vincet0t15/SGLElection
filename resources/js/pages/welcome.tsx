import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    ShieldCheck,
    Vote,
    ClipboardCheck,
    Lock,
    Smartphone,
    BarChart3,
    FileCheck,
    Globe,
    Calendar,
    MapPin,
    Info,
    Star
} from 'lucide-react';
import { login } from '@/routes';
import { login as voterLogin } from '@/routes/voter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {
    const { system_settings } = usePage<SharedData>().props;
    const appName = system_settings.name || 'Voting System';

    return (
        <>
            <Head title={`Welcome - ${appName}`} />

            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
                {/* Header/Nav - White bar with Red CTA */}
                <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-blue-900">
                                {system_settings.logo ? (
                                    <img src={system_settings.logo} alt="Logo" className="aspect-square h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-blue-900 text-white">
                                        <AppLogoIcon className="h-6 w-6 fill-current" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-extrabold text-xl tracking-tight text-blue-900 uppercase">{appName}</span>
                                <span className="text-xs text-red-600 font-bold tracking-widest uppercase">Official Voting Portal</span>
                            </div>
                        </div>

                        {/* Desktop Nav Links */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-wide">
                            <Link href="#" className="hover:text-blue-900 transition-colors">Home</Link>
                            <Link href="#about" className="hover:text-blue-900 transition-colors">About</Link>
                            <Link href="#how-to-vote" className="hover:text-blue-900 transition-colors">How to Vote</Link>
                            <Link href="#contact" className="hover:text-blue-900 transition-colors">Contact</Link>

                            <Link href={login().url}>
                                <Button className="bg-red-700 hover:bg-red-800 text-white font-bold rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                                    ADMIN LOGIN
                                </Button>
                            </Link>
                        </nav>

                        {/* Mobile Menu Button (Placeholder) */}
                        <div className="md:hidden">
                            <Link href={login().url}>
                                <Button size="sm" className="bg-red-700 text-white rounded-full">
                                    ADMIN
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero Section - Patriotic Theme */}
                    <div className="relative bg-blue-900 text-white overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 z-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full" style={{
                                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div>

                        {/* Abstract Flag Elements */}
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none bg-gradient-to-l from-red-600 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-950 to-transparent"></div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
                            <div className="flex flex-col items-center text-center">
                                {/* Bunting/Decoration */}
                                <div className="flex gap-2 mb-6 opacity-80">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                    ))}
                                </div>

                                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-4 drop-shadow-xl uppercase italic">
                                    Your Vote <span className="text-red-500 inline-block transform -skew-x-12 bg-white px-2 shadow-lg">Matters!</span>
                                </h1>

                                <p className="mt-4 text-xl sm:text-2xl font-bold text-blue-100 max-w-3xl mx-auto mb-10 tracking-wide uppercase">
                                    Make Your Voice Heard. <span className="text-yellow-400 border-b-4 border-yellow-400">Vote Today!</span>
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
                                    <Link href={voterLogin().url} className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-black uppercase rounded-lg bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border-b-4 border-red-950 shadow-xl transition-all hover:-translate-y-1">
                                            <Vote className="mr-3 h-6 w-6" />
                                            Vote Now
                                        </Button>
                                    </Link>
                                    <Link href="#how-it-works" className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-black uppercase rounded-lg bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border-b-4 border-blue-950 shadow-xl transition-all hover:-translate-y-1">
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner Strip */}
                    <div className="relative z-20 -mt-16 px-4">
                        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl border-t-4 border-red-600 overflow-hidden">
                            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                                <div className="p-8 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
                                    <div className="h-16 w-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <ClipboardCheck className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-blue-900 uppercase mb-2">How to Vote</h3>
                                    <p className="text-slate-600 mb-4">Learn about the simple 3-step voting process.</p>
                                    <Link href="#how-it-works" className="text-red-600 font-bold uppercase text-sm hover:underline flex items-center">
                                        View Process <span className="ml-1">→</span>
                                    </Link>
                                </div>

                                <div className="p-8 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
                                    <div className="h-16 w-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <MapPin className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-blue-900 uppercase mb-2">Find Polling Place</h3>
                                    <p className="text-slate-600 mb-4">Locate your nearest voting center or station.</p>
                                    <Link href="#" className="text-red-600 font-bold uppercase text-sm hover:underline flex items-center">
                                        Locate Now <span className="ml-1">→</span>
                                    </Link>
                                </div>

                                <div className="p-8 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
                                    <div className="h-16 w-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Calendar className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-blue-900 uppercase mb-2">Election Info</h3>
                                    <p className="text-slate-600 mb-4">Get the latest updates on schedules and candidates.</p>
                                    <Link href="#" className="text-red-600 font-bold uppercase text-sm hover:underline flex items-center">
                                        Read More <span className="ml-1">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div id="how-it-works" className="py-24 bg-slate-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                                    Voting Process
                                </div>
                                <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tight mb-4">
                                    Cast Your Vote in <span className="text-red-600">3 Easy Steps</span>
                                </h2>
                                <div className="h-1 w-24 bg-red-600 mx-auto rounded-full"></div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 relative">
                                {/* Connecting Line (Desktop) */}
                                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-300 -z-10 border-t-2 border-dashed border-slate-300"></div>

                                {/* Steps */}
                                {[
                                    {
                                        title: "Login Securely",
                                        desc: "Enter your secure voter credentials to access your official ballot.",
                                        icon: Lock,
                                        step: "1"
                                    },
                                    {
                                        title: "Make Selections",
                                        desc: "Choose your preferred candidates for each position on the ballot.",
                                        icon: Vote,
                                        step: "2"
                                    },
                                    {
                                        title: "Submit & Verify",
                                        desc: "Review your choices and submit your vote. You'll receive a confirmation.",
                                        icon: CheckCircle,
                                        step: "3"
                                    }
                                ].map((item, idx) => (
                                    <Card key={idx} className="relative border-none shadow-none bg-transparent pt-6 group">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-900 flex items-center justify-center mb-6 shadow-lg relative z-10 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                                                <item.icon className="h-10 w-10" />
                                                <div className="absolute -top-2 -right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">
                                                    {item.step}
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold text-blue-900 mb-3 uppercase">{item.title}</h3>
                                            <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Features Grid - "Why Your Vote Matters" */}
                    <div className="bg-white py-24 border-t border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-blue-900 uppercase mb-2">Why This Platform?</h2>
                                    <p className="text-slate-500 text-lg">Secure, transparent, and accessible voting for everyone.</p>
                                </div>
                                <Link href={voterLogin().url}>
                                    <Button variant="outline" className="border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-bold uppercase rounded-full">
                                        Access Portal →
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { title: "Live Real-time Updates", desc: "Track election progress as it happens with our live monitoring dashboard.", icon: BarChart3 },
                                    { title: "100% Secure & Anonymous", desc: "Advanced encryption ensures your vote remains private and tamper-proof.", icon: ShieldCheck },
                                    { title: "Vote From Anywhere", desc: "Mobile-responsive design allows you to vote from any device, anytime.", icon: Smartphone },
                                    { title: "Transparent Audit Trail", desc: "Every action is logged and verifiable by the election committee.", icon: FileCheck },
                                    { title: "Instant Results", desc: "Automated tallying provides immediate and accurate results.", icon: Info },
                                    { title: "Eco-Friendly System", desc: "Completely paperless process reduces waste and environmental impact.", icon: Globe }
                                ].map((feature, idx) => (
                                    <div key={idx} className="p-6 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
                                        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-blue-900 mb-2 uppercase">{feature.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer Banner */}
                <div className="bg-red-700 text-white py-4 overflow-hidden relative">
                    {/* Decorative Stars */}
                    <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center opacity-10 px-4">
                        {[...Array(10)].map((_, i) => (
                            <Star key={i} className="h-8 w-8" />
                        ))}
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-2 rounded-full">
                                <Vote className="h-6 w-6 text-red-700" />
                            </div>
                            <span className="font-black text-xl tracking-widest uppercase">Your Voice. Your Future. Vote!</span>
                        </div>
                        <div className="font-bold text-red-100 tracking-wide">
                            OFFICIAL ELECTION DAY: <span className="text-white bg-red-800 px-2 py-1 rounded">TODAY</span>
                        </div>
                    </div>
                </div>

                <footer className="bg-blue-950 text-slate-400 py-12 border-t border-blue-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <AppLogoIcon className="h-8 w-8 text-white fill-current" />
                                    <span className="font-bold text-2xl text-white uppercase tracking-tight">{appName}</span>
                                </div>
                                <p className="max-w-xs text-sm">
                                    The official digital voting platform designed for secure, transparent, and efficient elections.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white uppercase mb-4 tracking-wider">Quick Links</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="#" className="hover:text-white transition-colors">Home</Link></li>
                                    <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                                    <li><Link href="#how-to-vote" className="hover:text-white transition-colors">Process</Link></li>
                                    <li><Link href={login().url} className="hover:text-white transition-colors">Admin Login</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white uppercase mb-4 tracking-wider">Legal</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                    <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                            <div>&copy; {new Date().getFullYear()} {appName}. All rights reserved.</div>
                            <div className="mt-2 md:mt-0">Powered by SGLL Voting System</div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
