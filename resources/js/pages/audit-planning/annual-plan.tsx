import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    Calendar, 
    UserPlus, 
    Clock, 
    FileCheck, 
    Plus,
    Search,
    ChevronRight,
    SearchCheck,
    Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/',
    },
    {
        title: 'Audit Planning',
        href: '#',
    },
    {
        title: 'Annual Plan',
        href: '/audit-planning/annual-plan',
    },
];

const annualEngagements = [
    { id: '2024-FN-01', name: 'Revenue Recognition Audit', department: 'Finance', lead: 'Sarah Jenkins', start: '2024-04-01', end: '2024-05-15', status: 'Assigned' },
    { id: '2024-IT-02', name: 'Network Security Review', department: 'IT', lead: 'Michael Ross', start: '2024-05-20', end: '2024-06-30', status: 'Not Started' },
    { id: '2024-OP-03', name: 'Inventory Management Audit', department: 'Operations', lead: 'David Chen', start: '2024-06-01', end: '2024-07-15', status: 'Planning' },
    { id: '2024-LG-04', name: 'Contractual Compliance', department: 'Legal', lead: 'Emma Wilson', start: '2024-08-15', end: '2024-09-30', status: 'Not Started' },
];

export default function AnnualPlan() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Annual Audit Plan" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Annual Internal Audit Plan</h2>
                        <p className="text-muted-foreground underline decoration-indigo-500/30">Fiscal Year 2024</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20">
                            <Plus className="mr-2 size-4" /> Add Engagement
                        </Button>
                    </div>
                </div>

                {/* Quarterly View / Timeline Summary */}
                <div className="grid gap-4 md:grid-cols-4">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                        <Card key={q} className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader className="py-3 bg-white/5 border-b border-sidebar-border/20">
                                <CardTitle className="text-sm font-bold text-center">{q} 2024</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Engagements:</span>
                                        <span className="font-bold">4</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Resource Load:</span>
                                        <span className="text-indigo-400 font-bold">High</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-2">
                                        <div className="h-full bg-indigo-500" style={{ width: q === 'Q2' ? '90%' : '60%' }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Engagements List */}
                <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm overflow-hidden shadow-xl">
                    <CardHeader className="border-b border-sidebar-border/30 pb-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Scheduled Engagements</CardTitle>
                                <CardDescription>Define timelines and assign lead auditors to planned engagements.</CardDescription>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search engagements..." className="pl-8 h-9 text-xs w-64 bg-white/5 border-white/10" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="border-sidebar-border/30 hover:bg-transparent">
                                    <TableHead className="w-[300px] text-[11px] uppercase tracking-wider font-bold">Engagement Name</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">Department</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">Lead Auditor</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">Timeline</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold text-center">Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {annualEngagements.map((eng) => (
                                    <TableRow key={eng.id} className="border-sidebar-border/20 group hover:bg-white/[0.02]">
                                        <TableCell>
                                            <div className="font-semibold text-foreground group-hover:text-indigo-400 transition-colors">{eng.name}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono">{eng.id}</div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{eng.department}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] border border-indigo-500/20">
                                                    {eng.lead.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-sm">{eng.lead}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                    <Calendar className="size-3" /> {eng.start} - {eng.end}
                                                </div>
                                                <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: eng.status === 'Assigned' ? '20%' : '0' }} />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={`
                                                font-normal text-[10px]
                                                ${eng.status === 'Assigned' ? 'border-blue-500/50 text-blue-500 bg-blue-500/5' : ''}
                                                ${eng.status === 'Planning' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
                                                ${eng.status === 'Not Started' ? 'border-muted-foreground/50 text-muted-foreground bg-muted/5' : ''}
                                            `}>{eng.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Resource Allocation Insight */}
                <Card className="border-sidebar-border/50 bg-sidebar/20 backdrop-blur-sm border-dashed">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                                <SearchCheck className="size-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold">Resource Allocation Check</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Current plan utilizes 82% of available auditor hours for Q2. Consider reallocating the <span className="text-amber-500 underline">Inventory Management Audit</span> to Q3 to avoid team burnout.
                                </p>
                            </div>
                            <Button size="sm" variant="outline" className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10 transition-all">Optimize Resources</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
