import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    ClipboardCheck, 
    Calendar, 
    User, 
    CheckCircle2, 
    AlertCircle, 
    Plus,
    MessageSquare,
    ArrowRight,
    Save
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
        title: 'Issue Management',
        href: '#',
    },
    {
        title: 'Action Plans',
        href: '/issue-management/action-plans',
    },
];

export default function ActionPlans() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Management Action Plans" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8 max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Management Response & Action Plans</h2>
                        <p className="text-muted-foreground">Address audit findings with concrete remediation steps.</p>
                    </div>
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 bg-indigo-500/5 px-3 py-1">2 Pending Responses</Badge>
                </div>

                {/* Finding Summary Card (Context) */}
                <Card className="border-sidebar-border/50 bg-red-500/5 backdrop-blur-sm border-dashed">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="size-5 text-red-500" /> Finding: Lack of Segregation of Duties
                            </CardTitle>
                            <Badge className="bg-red-500 text-white">High Risk</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                            "The accounts receivable manager has the authority to both update customer credit limits and authorize transaction write-offs without secondary review, creating a significant fraud risk."
                        </p>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    {/* Management Response Section */}
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <MessageSquare className="size-4 text-indigo-500" /> Management Response
                            </CardTitle>
                            <CardDescription>Official position and comment from the auditee management.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Response Summary</Label>
                                <textarea className="w-full min-h-[100px] rounded-lg bg-white/5 border border-white/10 p-3 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none" placeholder="We agree/disagree with the finding because..." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Items Section */}
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm shadow-xl">
                        <CardHeader className="border-b border-sidebar-border/30">
                            <CardTitle className="text-base flex items-center gap-2">
                                <ClipboardCheck className="size-4 text-emerald-500" /> Remediation Action Items
                            </CardTitle>
                            <CardDescription>Specific steps to be taken to address the finding.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-6 space-y-6">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Action Description</Label>
                                            <Input placeholder="e.g. Implement dual authorization in ERP" className="bg-white/5 border-white/10 text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Due Date</Label>
                                                <div className="flex h-9 items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-muted-foreground">
                                                    <span className="text-xs">Pick a date</span>
                                                    <Calendar className="size-3" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Owner</Label>
                                                <div className="flex h-9 items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-muted-foreground">
                                                    <span className="text-xs">Select user</span>
                                                    <User className="size-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <Button variant="ghost" size="sm" className="text-red-400">Remove Item</Button>
                                    </div>
                                </div>

                                <Button variant="ghost" className="w-full border border-dashed border-white/10 h-10 text-muted-foreground hover:text-white transition-all">
                                    <Plus className="mr-2 size-4" /> Add Remediation Step
                                </Button>
                            </div>

                            <div className="p-6 bg-indigo-500/5 border-t border-sidebar-border/30 flex items-center justify-end gap-3">
                                <Button variant="outline" className="border-white/10">
                                    <Save className="mr-2 size-4" /> Save as Draft
                                </Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20">
                                    <CheckCircle2 className="mr-2 size-4" /> Finalize Response & Action Plan <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
