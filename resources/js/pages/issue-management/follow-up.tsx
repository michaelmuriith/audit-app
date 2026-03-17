import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    Activity, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    FileCheck, 
    History, 
    Search, 
    ShieldAlert,
    AlertCircle,
    ArrowUpRight,
    SearchCheck,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
        title: 'Follow-up',
        href: '/issue-management/follow-up',
    },
];

const issues = [
    { id: 'ISS-001', finding: 'Lack of Segregation of Duties', status: 'In Progress', progress: 45, dueDate: '2024-06-30', priority: 'High' },
    { id: 'ISS-002', finding: 'Incomplete Revenue Recognition logs', status: 'Overdue', progress: 10, dueDate: '2024-03-10', priority: 'Medium' },
    { id: 'ISS-003', finding: 'Unauthorized Access to ERP', status: 'Remediated', progress: 100, dueDate: '2024-02-15', priority: 'Critical' },
    { id: 'ISS-004', finding: 'Missing Backup Verification', status: 'Pending Verification', progress: 100, dueDate: '2024-03-20', priority: 'Medium' },
];

export default function FollowUp() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Issue Follow-up" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Issue Follow-up & Remediation</h2>
                        <p className="text-muted-foreground underline decoration-indigo-500/30">Track progress of corrective actions and verify closure.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="border-indigo-500/20 text-indigo-500">
                            <History className="mr-2 size-4" /> Remediation Logs
                        </Button>
                    </div>
                </div>

                {/* Follow-up Summary Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest text-center">Open Issues</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-center">12</div>
                            <div className="h-1 w-full bg-muted rounded-full mt-3">
                                <div className="h-full bg-indigo-500" style={{ width: '60%' }} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest text-center">Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-center text-red-500">03</div>
                            <div className="h-1 w-full bg-muted rounded-full mt-3">
                                <div className="h-full bg-red-500" style={{ width: '25%' }} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest text-center">Pending Audit Verification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-center text-amber-500">05</div>
                            <div className="h-1 w-full bg-muted rounded-full mt-3">
                                <div className="h-full bg-amber-500" style={{ width: '40%' }} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest text-center">Remediated (YTD)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-center text-emerald-500">42</div>
                            <div className="h-1 w-full bg-muted rounded-full mt-3">
                                <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Follow-up Tracking Table */}
                <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm shadow-xl overflow-hidden">
                    <CardHeader className="border-b border-sidebar-border/30 pb-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle className="text-lg">Remediation Tracker</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Filter issues..." className="pl-8 h-9 text-xs w-64 bg-white/5 border-white/10" />
                                </div>
                                <Button variant="outline" size="sm" className="border-white/10"><Filter className="size-4" /></Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="border-sidebar-border/30 hover:bg-transparent">
                                    <TableHead className="w-[100px] text-[11px] uppercase tracking-wider font-bold">Issue ID</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">Finding Description</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold text-center">Priority</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold text-center">Progress</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold text-center">Status</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold text-center">Due Date</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {issues.map((issue) => (
                                    <TableRow key={issue.id} className="border-sidebar-border/20 group hover:bg-white/[0.02]">
                                        <TableCell className="font-mono text-[11px] text-muted-foreground">{issue.id}</TableCell>
                                        <TableCell className="max-w-xs md:max-w-md">
                                            <div className="text-sm font-medium group-hover:text-indigo-400 transition-colors line-clamp-1">{issue.finding}</div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={`
                                                text-[9px] font-bold uppercase
                                                ${issue.priority === 'Critical' ? 'border-red-500/50 text-red-500 bg-red-500/5' : ''}
                                                ${issue.priority === 'High' ? 'border-orange-500/50 text-orange-500 bg-orange-500/5' : ''}
                                                ${issue.priority === 'Medium' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
                                            `}>{issue.priority}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[10px] font-bold">{issue.progress}%</span>
                                                <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                                    <div className={`h-full ${issue.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${issue.progress}%` }} />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={`
                                                font-normal text-[10px]
                                                ${issue.status === 'Remediated' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : ''}
                                                ${issue.status === 'Overdue' ? 'border-red-500/50 text-red-500 bg-red-500/5 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : ''}
                                                ${issue.status === 'Pending Verification' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
                                            `}>{issue.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className={`text-xs ${issue.status === 'Overdue' ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                                                {issue.dueDate}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <ArrowUpRight className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Audit Evidence Verification Banner */}
                <Card className="border-sidebar-border/50 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 backdrop-blur-sm border-dashed">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="p-4 rounded-full bg-indigo-500/20 text-indigo-500 ring-8 ring-indigo-500/5">
                                <SearchCheck className="size-8" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold">Active Follow-up Verification</h3>
                                <p className="text-muted-foreground mt-2 max-w-2xl">
                                    Management has marked 5 issues as remediated. Audit team needs to review the uploaded evidence and verify the effectiveness of newly implemented controls before final closure.
                                </p>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 h-12 shadow-lg shadow-indigo-500/20">
                                <FileCheck className="mr-2 size-4" /> Start Verification Cycle
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
