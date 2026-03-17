import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    AlertTriangle, 
    FileWarning, 
    Target, 
    Lightbulb, 
    Plus,
    Search,
    ChevronRight,
    MessageSquare,
    CheckCircle2,
    ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        title: 'Findings',
        href: '/audit-reporting/findings',
    },
];

const findings = [
    { id: 'FIND-01', title: 'Lack of Authorization Signatures', risk: 'High', status: 'Documented', category: 'Compliance' },
    { id: 'FIND-02', title: 'Incomplete Revenue Recognition logs', risk: 'Medium', status: 'Under Review', category: 'Reporting' },
];

export default function AuditFindings() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Findings" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Audit Findings & Observations</h2>
                        <p className="text-muted-foreground underline decoration-indigo-500/30">Engagement: Revenue Recognition Audit 2024</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20">
                        <Plus className="mr-2 size-4" /> Log Finding
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Findings List */}
                    <Card className="lg:col-span-4 border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm h-fit">
                        <CardHeader className="border-b border-sidebar-border/30 pb-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search findings..." className="pl-8 h-9 text-xs bg-white/5 border-white/10" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-2 space-y-2">
                            {findings.map((finding) => (
                                <button key={finding.id} className="w-full text-left p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:bg-white/5 transition-all group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono text-muted-foreground">{finding.id}</span>
                                        <Badge variant="outline" className={`
                                            text-[9px] font-bold uppercase tracking-wider
                                            ${finding.risk === 'High' ? 'border-red-500/50 text-red-500 bg-red-500/5' : ''}
                                            ${finding.risk === 'Medium' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
                                        `}>{finding.risk} Risk</Badge>
                                    </div>
                                    <h4 className="text-sm font-bold group-hover:text-indigo-400 transition-colors line-clamp-1">{finding.title}</h4>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="size-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{finding.status}</span>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Finding Detail / Editor */}
                    <Card className="lg:col-span-8 border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm shadow-xl">
                        <CardHeader className="border-b border-sidebar-border/30">
                            <div className="flex items-center justify-between">
                                <CardTitle>Documenting: Lack of Authorization Signatures</CardTitle>
                                <Button variant="ghost" size="sm" className="text-indigo-400">View Evidence</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-muted-foreground">Condition</Label>
                                    <textarea className="w-full min-h-[100px] rounded-lg bg-white/5 border border-white/10 p-3 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none" defaultValue="During the review of sales invoices for Q3 2023, it was observed that 15 out of 50 sampled invoices lacked the required signature from the department head or authorized delegate." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-muted-foreground">Criteria</Label>
                                    <textarea className="w-full min-h-[100px] rounded-lg bg-white/5 border border-white/10 p-3 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none" defaultValue="According to Internal Financial Control Policy (v4.2), Section 3.1: 'All invoices exceeding $5,000 must be manually or digitally approved by an authorized manager prior to processing.'" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                                    <ShieldAlert className="size-4" /> Root Cause Analysis
                                </div>
                                <textarea className="w-full min-h-[80px] rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-3 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none" placeholder="Identify the underlying reason for the deviation..." />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                    <Lightbulb className="size-4" /> Recommendations
                                </div>
                                <textarea className="w-full min-h-[80px] rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none" placeholder="Propose corrective actions to address the finding..." />
                            </div>

                            <div className="pt-6 border-t border-sidebar-border/30 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-red-500 text-white shadow-lg shadow-red-500/20">Criticality: High</Badge>
                                    <Badge variant="outline" className="border-white/10">Type: Process Deficiency</Badge>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" className="border-white/10">Discard Changes</Button>
                                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                                        <CheckCircle2 className="mr-2 size-4" /> Save Finding
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Management Discussion Placeholder */}
                <Card className="border-sidebar-border/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-dashed">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="p-4 rounded-full bg-indigo-500/20 text-indigo-500 ring-8 ring-indigo-500/5">
                                <MessageSquare className="size-8" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold">Stakeholder Collaboration</h3>
                                <p className="text-muted-foreground mt-2 max-w-2xl">
                                    Share these findings with the auditee for initial comments and management responses before finalizing the draft report.
                                </p>
                            </div>
                            <Button variant="outline" className="border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/5 font-bold">
                                Send for Management Comment <ChevronRight className="ml-2 size-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
