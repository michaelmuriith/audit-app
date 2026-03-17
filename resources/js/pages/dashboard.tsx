import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { annualPlan } from '@/routes/audit-planning';
import { engagement } from '@/routes/audit-execution';
import { actionPlans } from '@/routes/issue-management';
import type { BreadcrumbItem } from '@/types';
import { 
    FileText, 
    AlertTriangle, 
    CheckCircle2, 
    Clock, 
    ArrowUpRight, 
    MoreHorizontal,
    Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

function StatCard({ title, value, description, icon: Icon, trend, trendValue, color }: any) {
    return (
        <Card className="overflow-hidden border-sidebar-border/50 bg-sidebar/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-indigo-500/30 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <StatTitle title={title} />
                <div className={`p-2 rounded-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                    <Icon className={`size-5 ${color.replace('bg-', 'text-')}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                    {trend && (
                        <span className={`mr-1 flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            <ArrowUpRight className="mr-0.5 size-3" />
                            {trendValue}
                        </span>
                    )}
                    {description}
                </div>
            </CardContent>
        </Card>
    );
}

function StatTitle({ title }: { title: string }) {
    return (
        <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
        </CardTitle>
    );
}

const recentAudits = [
    { id: 'AUD-2024-001', name: 'Annual Financial Review', department: 'Finance', status: 'In Progress', priority: 'High', dueDate: '2024-12-15' },
    { id: 'AUD-2024-002', name: 'IT Security Audit', department: 'IT', status: 'Planned', priority: 'Critical', dueDate: '2024-11-20' },
    { id: 'AUD-2024-003', name: 'HR Compliance Check', department: 'Human Resources', status: 'Completed', priority: 'Medium', dueDate: '2024-10-10' },
    { id: 'AUD-2024-004', name: 'Procurement Process Audit', department: 'Operations', status: 'Drafting', priority: 'Low', dueDate: '2024-11-05' },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Audit Dashboard</h2>
                        <p className="text-muted-foreground">Welcome back, Chief Auditor. Here is an overview of your audit universe.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20">
                            <Link href={annualPlan()}>
                                New Audit Plan
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Overdue Action Alert */}
                <div className="flex items-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-600 dark:bg-red-500/10">
                    <AlertTriangle className="size-5 shrink-0" />
                    <div className="flex-1 text-sm font-medium">
                        You have <span className="font-bold underline">5 overdue corrective actions</span> that require immediate attention.
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-red-600 hover:bg-red-500/10">
                        <Link href={actionPlans()}>
                            View Actions
                        </Link>
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Total Audits" 
                        value="24" 
                        description="Across all departments" 
                        icon={FileText} 
                        color="bg-blue-500"
                        trend="up"
                        trendValue="+2"
                    />
                    <StatCard 
                        title="Active Engagements" 
                        value="8" 
                        description="Currently in progress" 
                        icon={Clock} 
                        color="bg-orange-500"
                    />
                    <StatCard 
                        title="Issues Found" 
                        value="112" 
                        description="Draft & Finalized" 
                        icon={AlertTriangle} 
                        color="bg-amber-500"
                        trend="up"
                        trendValue="+12%"
                    />
                    <StatCard 
                        title="Completion Rate" 
                        value="88%" 
                        description="Year to date" 
                        icon={CheckCircle2} 
                        color="bg-emerald-500"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Recent Audits Table */}
                    <Card className="lg:col-span-4 overflow-hidden border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Assigned Audits</CardTitle>
                                <CardDescription>Your current audit responsibilities and their status.</CardDescription>
                            </div>
                            <div className="relative w-full max-w-40 hidden md:block">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="pl-8 h-9 text-xs"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Audit Name</th>
                                            <th className="px-4 py-3 font-medium">Department</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium">Priority</th>
                                            <th className="px-4 py-3 font-medium">Due Date</th>
                                            <th className="px-4 py-3 font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/50">
                                        {recentAudits.map((audit) => (
                                            <tr key={audit.id} className="hover:bg-muted/30 transition-colors group">
                                                <td className="px-4 py-4">
                                                    <div className="font-medium text-foreground">{audit.name}</div>
                                                    <div className="text-xs text-muted-foreground">{audit.id}</div>
                                                </td>
                                                <td className="px-4 py-4 text-muted-foreground">{audit.department}</td>
                                                <td className="px-4 py-4">
                                                    <Badge variant="outline" className={`
                                                        ${audit.status === 'In Progress' ? 'border-orange-500/50 text-orange-500 bg-orange-500/5' : ''}
                                                        ${audit.status === 'Planned' ? 'border-blue-500/50 text-blue-500 bg-blue-500/5' : ''}
                                                        ${audit.status === 'Completed' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : ''}
                                                        ${audit.status === 'Drafting' ? 'border-purple-500/50 text-purple-500 bg-purple-500/5' : ''}
                                                    `}>{audit.status}</Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`size-2 rounded-full 
                                                            ${audit.priority === 'Critical' ? 'bg-red-500 animate-pulse' : ''}
                                                            ${audit.priority === 'High' ? 'bg-orange-500' : ''}
                                                            ${audit.priority === 'Medium' ? 'bg-amber-500' : ''}
                                                            ${audit.priority === 'Low' ? 'bg-blue-500' : ''}
                                                        `} />
                                                        {audit.priority}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-muted-foreground">{audit.dueDate}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-muted/20 text-center">
                                <Button asChild variant="link" size="sm" className="text-indigo-500 font-medium">
                                    <Link href={engagement()}>
                                        View All Audits
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Overview / Chart Placeholder */}
                    <Card className="lg:col-span-3 border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Audit Universe Health</CardTitle>
                            <CardDescription>Risk distribution across departments.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-muted-foreground uppercase tracking-wider">Critical Risks</span>
                                        <span className="text-red-500">12%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full bg-red-500 transition-all rounded-full" style={{ width: '12%' }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-muted-foreground uppercase tracking-wider">High Risks</span>
                                        <span className="text-orange-500">28%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full bg-orange-500 transition-all rounded-full" style={{ width: '28%' }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-muted-foreground uppercase tracking-wider">Medium Risks</span>
                                        <span className="text-amber-500">45%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full bg-amber-500 transition-all rounded-full" style={{ width: '45%' }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-muted-foreground uppercase tracking-wider">Low Risks</span>
                                        <span className="text-blue-500">15%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full bg-blue-500 transition-all rounded-full" style={{ width: '15%' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-dashed border-sidebar-border p-6 flex flex-col items-center justify-center text-center gap-2">
                                <div className="size-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-2">
                                    <ArrowUpRight className="size-5" />
                                </div>
                                <div className="text-sm font-semibold">Risk Exposure Report</div>
                                <p className="text-xs text-muted-foreground max-w-[200px]">
                                    Generate a detailed risk exposure report for the upcoming board meeting.
                                </p>
                                <Button variant="outline" size="sm" className="mt-2 text-xs">Generate PDF</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
