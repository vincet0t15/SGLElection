import { Head, Link, usePage } from '@inertiajs/react';
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
    Fingerprint,
    Globe
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

            <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground flex flex-col">
                {/* Header/Nav */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                {system_settings.logo ? (
                                    <img src={system_settings.logo} alt="Logo" className="aspect-square h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <AppLogoIcon className="h-5 w-5 fill-current" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-bold text-lg tracking-tight">{appName}</span>
                                <span className="text-xs text-muted-foreground font-medium">Official Voting Portal</span>
                            </div>
                        </div>
                        <nav className="flex gap-2">
                            <Link href={login().url}>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span className="hidden sm:inline">Admin Portal</span>
                                </Button>
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-8 animate-fade-in-up">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                                Secure • Transparent • Real-time
                            </div>

                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                                Your Voice, <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500">Your Future</span>
                            </h1>

                            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                                Welcome to the official voting platform. Participate in shaping the future of our community with a secure, anonymous, and easy-to-use digital ballot.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link href={voterLogin().url}>
                                    <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5">
                                        <Vote className="mr-2 h-5 w-5" />
                                        Vote Now
                                    </Button>
                                </Link>
                                <Link href="#how-it-works">
                                    <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Abstract Background */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
                            <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-3xl"></div>
                        </div>
                    </div>

                    {/* Stats/Trust Banner */}
                    <div className="border-y bg-muted/30">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: 'Security', value: 'Enterprise Grade', icon: Lock },
                                    { label: 'Transparency', value: 'Real-time Audit', icon: FileCheck },
                                    { label: 'Uptime', value: '99.9% Reliable', icon: CheckCircle },
                                    { label: 'Accessibility', value: 'Any Device', icon: Smartphone },
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center text-center gap-2 group">
                                        <div className="p-2 rounded-full bg-primary/10 text-primary mb-1 group-hover:scale-110 transition-transform">
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                        <div className="font-bold text-foreground">{stat.value}</div>
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Process Section (How it works) */}
                    <div id="how-it-works" className="py-24 bg-background">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                                    Simple Voting Process
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Cast your vote in three easy steps.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 relative">
                                {/* Connecting Line (Desktop) */}
                                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10"></div>

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
                                    <Card key={idx} className="relative border-none shadow-none bg-transparent pt-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 shadow-sm relative z-10">
                                                <item.icon className="h-10 w-10 text-primary" />
                                            </div>
                                            <div className="absolute top-0 right-10 text-6xl font-black text-muted/10 select-none z-0">
                                                {item.step}
                                            </div>
                                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="bg-muted/30 py-24 border-t">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold tracking-tight mb-4">Why use this platform?</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                    },
                                    {
                                        title: "Transparent Audit",
                                        desc: "Every vote is logged and verifiable by the election committee.",
                                        icon: FileCheck
                                    },
                                    {
                                        title: "Fast Results",
                                        desc: "Automated tallying provides instant results after election close.",
                                        icon: CheckCircle
                                    },
                                    {
                                        title: "Eco-Friendly",
                                        desc: "Paperless voting reduces waste and environmental impact.",
                                        icon: Globe
                                    }
                                ].map((feature, idx) => (
                                    <Card key={idx} className="bg-background border-muted hover:border-primary/50 transition-colors">
                                        <CardHeader>
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-primary">
                                                <feature.icon className="h-5 w-5" />
                                            </div>
                                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base">
                                                {feature.desc}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t bg-background py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-1 rounded text-primary-foreground">
                                <Vote className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-sm">{appName}</span>
                        </div>

                        <div className="text-muted-foreground text-sm">
                            &copy; {new Date().getFullYear()} {appName}. All rights reserved.
                        </div>

                        <div className="flex gap-6 text-sm font-medium text-muted-foreground">
                            <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
                            <span className="hover:text-primary cursor-pointer transition-colors">Contact</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
