import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    Activity, 
    CheckCircle2, 
    Clock, 
    FileUp, 
    Link, 
    Search, 
    ShieldAlert,
    MoreHorizontal,
    Plus,
    Filter,
    Download
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
        title: 'Audit Execution',
        href: '#',
    },
    {
        title: 'Audit Programme',
        href: '/audit-execution/programme',
    },
];

const procedures = [
    { id: 'PROC-01', step: 'Perform walkthrough of the revenue cycle.', status: 'Completed', owner: 'Sarah J.', evidence: 3 },
    { id: 'PROC-02', step: 'Select a sample of 25 sales transactions for testing.', status: 'In Progress', owner: 'Mark T.', evidence: 1 },
    { id: 'PROC-03', step: 'Verify math accuracy of sample invoices.', status: 'Pending', owner: 'Sarah J.', evidence: 0 },
    { id: 'PROC-04', step: 'Trace sample invoices to bank statements.', status: 'Pending', owner: 'Mark T.', evidence: 0 },
];

export default function AuditProgramme() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Programme" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Audit Programme & Procedures</h2>
                        <p className="text-muted-foreground underline decoration-indigo-500/30">Engagement: Revenue Recognition Audit 2024</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="hidden border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/5 md:flex">
                            <Download className="mr-2 size-4" /> Export Workbook
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20">
                            <Plus className="mr-2 size-4" /> Add Procedure
                        </Button>
                    </div>
                </div>

                {/* Progress Overview */}
                <Card className="border-sidebar-border/50 bg-indigo-500/5 backdrop-blur-sm border-dashed">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">25%</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Overall Progress</div>
                                </div>
                                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: '25%' }} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-emerald-500">1</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-amber-500">1</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">In Progress</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-muted-foreground">2</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Pending</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Procedures Table */}
                <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm shadow-xl overflow-hidden">
                    <CardHeader className="border-b border-sidebar-border/30 pb-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Test Procedures</CardTitle>
                                <CardDescription>Execute audit steps and link supporting evidence.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search procedures..." className="pl-8 h-9 text-xs w-64 bg-white/5 border-white/10" />
                                </div>
                                <Button variant="outline" size="sm" className="border-white/10"><Filter className="size-4" /></Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="border-sidebar-border/30 hover:bg-transparent">
                                    <TableHead className="w-[100px] text-[11px] uppercase tracking-wider font-bold">Ref ID</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">Audit Procedure / Step</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">Owner</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold text-center">Status</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold text-center">Evidence</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {procedures.map((proc) => (
                                    <TableRow key={proc.id} className="border-sidebar-border/20 group hover:bg-white/[0.02]">
                                        <TableCell className="font-mono text-[11px] text-muted-foreground">{proc.id}</TableCell>
                                        <TableCell className="max-w-md">
                                            <div className="text-sm font-medium leading-relaxed group-hover:text-indigo-400 transition-colors">
                                                {proc.step}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{proc.owner}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={`
                                                font-normal text-[10px]
                                                ${proc.status === 'Completed' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : ''}
                                                ${proc.status === 'In Progress' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
                                                ${proc.status === 'Pending' ? 'border-muted-foreground/50 text-muted-foreground' : ''}
                                            `}>{proc.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1.5 cursor-pointer hover:text-indigo-500 transition-colors">
                                                <FileUp className="size-3.5" />
                                                <span className="text-xs font-bold">{proc.evidence}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Evidence Dropzone Mockdown */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm border-dashed hover:border-indigo-500/50 transition-all cursor-pointer">
                        <CardContent className="p-10 flex flex-col items-center justify-center gap-4">
                            <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                                <FileUp className="size-8" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-lg font-bold">Quick Evidence Upload</h4>
                                <p className="text-xs text-muted-foreground mt-1">Drag and drop files or click to browse. Supported: PDF, XLSX, DOCX, PNG.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <ShieldAlert className="size-4 text-amber-500" /> Observation Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold uppercase text-amber-500">Draft Observation</span>
                                    <Badge className="bg-amber-500 text-white text-[9px]">High Risk</Badge>
                                </div>
                                <p className="text-xs line-clamp-2 italic">Sample #14 shows an invoice without authorized signature from the department head...</p>
                                <Button variant="ghost" size="sm" className="h-7 text-[10px] mt-2 text-indigo-400 p-0 font-bold uppercase tracking-wider">Expand Issue</Button>
                            </div>
                            <Button variant="ghost" size="sm" className="w-full text-xs border border-dashed border-white/10">+ Flag New Observation</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
