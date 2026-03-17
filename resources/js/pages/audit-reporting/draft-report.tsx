import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    FileText, 
    ShieldCheck, 
    Eye, 
    Download, 
    Share2, 
    CheckCircle2, 
    History,
    AlertCircle,
    Printer,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/',
    },
    {
        title: 'Audit Reporting',
        href: '#',
    },
    {
        title: 'Draft Report',
        href: '/audit-reporting/draft-report',
    },
];

export default function DraftReport() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Draft Audit Report" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8 max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
                            <FileText className="size-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-bold tracking-tight">Audit Report - Revenue Recognition</h2>
                                <Badge className="bg-amber-500 text-white text-[10px] font-bold">Draft v1.2</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">Generated on March 17, 2024 • Engagement #2024-FN-01</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-white/10">
                            <History className="mr-2 size-4" /> Version History
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20">
                            <Share2 className="mr-2 size-4" /> Submit for Review
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Progress & Quick Stats Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Review Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>Stakeholder Approval</span>
                                        <span className="text-indigo-400">65%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: '65%' }} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <ReviewItem user="John Doe" role="CFO" status="Approved" />
                                    <ReviewItem user="Jane Smith" role="Head of Audit" status="Pending" />
                                    <ReviewItem user="Mike Ross" role="IT Director" status="In Review" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Findings Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">High Risk</span>
                                        <Badge className="bg-red-500 text-white">02</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Medium Risk</span>
                                        <Badge className="bg-amber-500 text-white">05</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Low Risk</span>
                                        <Badge className="bg-blue-500 text-white">03</Badge>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full mt-4 text-indigo-400 font-bold uppercase text-[10px]">Generate Executive Summary</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Report Preview Section */}
                    <Card className="lg:col-span-3 border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm shadow-2xl overflow-hidden ring-1 ring-white/10">
                        <CardHeader className="bg-white/5 border-b border-sidebar-border/30 flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Tabs defaultValue="preview" className="w-[300px]">
                                    <TabsList className="bg-black/20 border border-white/10">
                                        <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
                                        <TabsTrigger value="comments" className="text-xs">Comments (4)</TabsTrigger>
                                        <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="size-9 rounded-full"><Printer className="size-4" /></Button>
                                <Button variant="ghost" size="icon" className="size-9 rounded-full"><Download className="size-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 bg-[#0a0a0b]">
                            {/* Realistic PDF-like preview */}
                            <div className="aspect-[1/1.414] w-full p-12 overflow-y-auto custom-scrollbar">
                                <div className="bg-white rounded shadow-2xl p-16 text-slate-800 min-h-full">
                                    <div className="border-b-2 border-slate-900 pb-8 mb-8 flex justify-between items-end">
                                        <div>
                                            <h1 className="text-4xl font-serif font-black tracking-tighter uppercase text-slate-900">INTERNAL AUDIT REPORT</h1>
                                            <p className="text-slate-500 font-medium tracking-widest text-xs mt-2">CONFIDENTIAL • FISCAL YEAR 2024</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">Engagement #2024-FN-01</p>
                                            <p className="text-slate-500 text-xs">Final Draft v1.2</p>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <section>
                                            <h3 className="text-lg font-bold border-l-4 border-indigo-600 pl-4 mb-4 text-slate-900">1. Executive Summary</h3>
                                            <p className="leading-relaxed text-slate-600">The objective of this engagement was to evaluate the internal control framework governing revenue recognition at the Finance & Accounting department. Based on our testing, while the overall framework is functional, we identified significant gaps in the authorization workflow for high-value sales transactions...</p>
                                        </section>

                                        <section>
                                            <h3 className="text-lg font-bold border-l-4 border-indigo-600 pl-4 mb-4 text-slate-900">2. Key Findings</h3>
                                            <div className="space-y-6">
                                                <div className="p-5 rounded-lg border border-slate-100 bg-slate-50/50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-slate-800">2.1 Lack of Segregation of Duties</span>
                                                        <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase">HIGH RISK</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">It was identified that the accounts receivable manager has the authority to both update customer credit limits and authorize transaction write-offs without secondary review...</p>
                                                </div>
                                                <div className="p-5 rounded-lg border border-slate-100 bg-slate-50/50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-slate-800">2.2 Incomplete Audit Trails</span>
                                                        <span className="bg-amber-500 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase">MEDIUM RISK</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">System logs failed to capture the identity of users modifying billing data for approximately 12% of tested manual adjustments...</p>
                                                </div>
                                            </div>
                                        </section>

                                        <div className="pt-10 border-t border-slate-100 mt-20 flex justify-center opacity-40">
                                            <p className="text-[10px] text-slate-400">Page 1 of 12 • Generated by AMS Cloud Platform</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Approval Sticky Footer */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 px-6">
                    <div className="p-4 rounded-2xl bg-indigo-600/90 backdrop-blur-xl border border-indigo-500/50 shadow-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4 text-white">
                            <div className="p-2 rounded-full bg-white/20">
                                <AlertCircle className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Review Needed</p>
                                <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Requires 2 more signatures before finalization</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="text-white hover:bg-white/10 font-bold border-white/20 border">View Feedback</Button>
                            <Button className="bg-white text-indigo-600 hover:bg-white/90 font-black shadow-xl px-8 group transition-all">
                                <ShieldCheck className="mr-2 size-4 group-hover:scale-110" /> Final Approve <ArrowRight className="ml-2 size-4 group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function ReviewItem({ user, role, status }: { user: string; role: string; status: string }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 group hover:border-indigo-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                    {user[0]}{user.split(' ')[1][0]}
                </div>
                <div>
                    <p className="text-xs font-bold">{user}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">{role}</p>
                </div>
            </div>
            <Badge variant="outline" className={`
                text-[8px] font-bold
                ${status === 'Approved' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : ''}
                ${status === 'Pending' ? 'border-muted-foreground/30 text-muted-foreground' : ''}
                ${status === 'In Review' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
            `}>{status}</Badge>
        </div>
    );
}
