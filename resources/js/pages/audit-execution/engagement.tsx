import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    FileText, 
    Target, 
    Users, 
    Calendar, 
    ShieldCheck, 
    ArrowRight,
    Save,
    Send,
    AlertCircle,
    CheckCircle2
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
        title: 'Audit Execution',
        href: '#',
    },
    {
        title: 'Engagement Memo',
        href: '/audit-execution/engagement',
    },
];

export default function EngagementMemo() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Engagement Memo" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8 max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Audit Engagement & Planning Memo</h2>
                        <p className="text-muted-foreground">Define scope, objectives, and resource requirements for the engagement.</p>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1">Draft Phase</Badge>
                </div>

                <div className="grid gap-6">
                    {/* Basic Information */}
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="size-5 text-indigo-500" /> General Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="engagementTitle">Engagement Title</Label>
                                <Input id="engagementTitle" defaultValue="Revenue Recognition Audit 2024" className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="auditId">Engagement ID</Label>
                                <Input id="auditId" defaultValue="2024-FN-01" disabled className="bg-white/5 border-white/10 opacity-60" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Auditable Department</Label>
                                <Input id="department" defaultValue="Finance & Accounting" className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="leadAuditors">Lead Auditor(s)</Label>
                                <Input id="leadAuditors" defaultValue="Sarah Jenkins, Mark Thompson" className="bg-white/5 border-white/10" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scope & Objectives */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="size-5 text-emerald-500" /> Audit Objectives
                                </CardTitle>
                                <CardDescription>What this audit intends to achieve.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                                    <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                                    <span className="text-sm">Verify adherence to IFRS 15 Revenue Recognition standards.</span>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                                    <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                                    <span className="text-sm">Assess the effectiveness of internal controls over invoicing.</span>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full h-9 border border-dashed border-white/10 text-muted-foreground hover:text-foreground">
                                    <Plus className="mr-2 size-3" /> Add Objective
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldCheck className="size-5 text-blue-500" /> Audit Scope
                                </CardTitle>
                                <CardDescription>Boundaries of the audit engagement.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">In Scope</Label>
                                    <textarea className="w-full min-h-[80px] rounded-lg bg-white/5 border border-white/10 p-3 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none" defaultValue="All revenue streams from domestic sales for FY2023." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Out of Scope</Label>
                                    <textarea className="w-full min-h-[60px] rounded-lg bg-white/5 border border-white/10 p-3 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none" defaultValue="International subsidiaries and non-operating income." />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Timeline & Resources */}
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="size-5 text-amber-500" /> Schedule & Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Planning Phase</Label>
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm">March 01 - March 15</div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Fieldwork Phase</Label>
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm">March 16 - April 15</div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Reporting Phase</Label>
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm">April 16 - April 30</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                            <AlertCircle className="size-3" /> Requires Head of Audit Approval
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="border-white/10">
                                <Save className="mr-2 size-4" /> Save Draft
                            </Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20">
                                <Send className="mr-2 size-4" /> Finalize & Submit <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Plus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    );
}
