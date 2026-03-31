import { Head, useForm, router } from '@inertiajs/react';
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
    Briefcase,
    Edit2,
    Trash2,
    Zap
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
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import AuditPlanning from '@/routes/audit-planning';

type Auditor = {
    id: number;
    name: string;
    email: string;
};

type AuditableEntity = {
    id: number;
    name: string;
    residual_risk_score?: number;
};

type Engagement = {
    id: number;
    name: string;
    status: string;
    start_date: string;
    end_date: string;
    engagement_id: string;
    auditable_entity_id: number | null;
    lead_auditor_id: number | null;
    auditable_entity?: {
        name: string;
        residual_risk_score?: number;
    };
    lead_auditor?: {
        name: string;
    };
};

interface AnnualPlanProps {
    engagements: Engagement[];
    auditors: Auditor[];
    entities: AuditableEntity[];
    filters: {
        search?: string;
    };
}

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

export default function AnnualPlan({ engagements, auditors, entities, filters }: AnnualPlanProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEngagement, setEditingEngagement] = useState<Engagement | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 300);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        auditable_entity_id: '',
        lead_auditor_id: '',
        start_date: '',
        end_date: '',
        description: '',
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const entityId = params.get('entity_id');
        if (entityId) {
            setData('auditable_entity_id', entityId);
            setIsModalOpen(true);
            // Optional: find entity and set default name
            const entity = entities.find(e => e.id.toString() === entityId);
            if (entity) {
                setData(d => ({ ...d, auditable_entity_id: entityId, name: `${entity.name} Audit` }));
            }
        }
    }, [entities]);

    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            router.get(
                AuditPlanning.annualPlan.url({ query: { search: debouncedSearch } }),
                {},
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    const handleSaveEngagement = () => {
        if (editingEngagement) {
            put(AuditPlanning.annualPlan.update(editingEngagement.id).url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingEngagement(null);
                    reset();
                },
            });
        } else {
            post(AuditPlanning.annualPlan.store().url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (eng: Engagement) => {
        setEditingEngagement(eng);
        setData({
            name: eng.name,
            auditable_entity_id: (eng.auditable_entity_id || '').toString(),
            lead_auditor_id: (eng.lead_auditor_id || '').toString(),
            start_date: eng.start_date ? new Date(eng.start_date).toISOString().split('T')[0] : '',
            end_date: eng.end_date ? new Date(eng.end_date).toISOString().split('T')[0] : '',
            description: '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this engagement?')) {
            router.delete(AuditPlanning.annualPlan.destroy(id).url);
        }
    };

    const handleOptimize = () => {
        alert('Optimizing resource distribution based on current auditor availability and branch proximity...');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const currentYear = new Date().getFullYear();

    const stats = {
        total: engagements.length,
        q2Load: 82 // Mocked for now
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Annual Audit Plan" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Annual Internal Audit Plan</h2>
                        <p className="text-muted-foreground underline decoration-indigo-500/30">Fiscal Year {currentYear}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isModalOpen} onOpenChange={(open) => {
                            if (!open) {
                                setEditingEngagement(null);
                                reset();
                            }
                            setIsModalOpen(open);
                        }}>
                            <DialogTrigger asChild>
                                <Button 
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20"
                                    onClick={() => {
                                        setEditingEngagement(null);
                                        reset();
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Plus className="mr-2 size-4" /> Add Engagement
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] bg-sidebar border-sidebar-border/40 backdrop-blur-xl">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">
                                        {editingEngagement ? 'Edit Engagement Schedule' : 'Schedule New Engagement'}
                                    </DialogTitle>
                                    <DialogDescription className="text-muted-foreground">
                                        Define timelines and assign lead auditors to a planned engagement.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="eng-name">Engagement Name</Label>
                                        <Input 
                                            id="eng-name" 
                                            placeholder="e.g. Revenue Recognition Audit" 
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="bg-white/5 border-white/10"
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Auditable Entity</Label>
                                        <Select value={data.auditable_entity_id} onValueChange={v => setData('auditable_entity_id', v)}>
                                            <SelectTrigger className="bg-white/5 border-white/10">
                                                <SelectValue placeholder="Select entity from universe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {entities.map(e => (
                                                    <SelectItem key={e.id} value={e.id.toString()}>
                                                        <div className="flex items-center justify-between w-full gap-8">
                                                            <span>{e.name}</span>
                                                            <Badge variant="outline" className="text-[9px] font-mono opacity-60">Risk: {Math.round(e.residual_risk_score || 0)}</Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.auditable_entity_id && <p className="text-xs text-red-500">{errors.auditable_entity_id}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Lead Auditor</Label>
                                        <Select value={data.lead_auditor_id} onValueChange={v => setData('lead_auditor_id', v)}>
                                            <SelectTrigger className="bg-white/5 border-white/10">
                                                <SelectValue placeholder="Assign lead auditor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {auditors.map(a => (
                                                    <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.lead_auditor_id && <p className="text-xs text-red-500">{errors.lead_auditor_id}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="start">Start Date</Label>
                                            <Input 
                                                id="start" 
                                                type="date" 
                                                value={data.start_date}
                                                onChange={e => setData('start_date', e.target.value)}
                                                className="bg-white/5 border-white/10"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="end">End Date</Label>
                                            <Input 
                                                id="end" 
                                                type="date" 
                                                value={data.end_date}
                                                onChange={e => setData('end_date', e.target.value)}
                                                className="bg-white/5 border-white/10"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSaveEngagement} disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                                        {processing ? 'Saving...' : (editingEngagement ? 'Update Schedule' : 'Confirm Schedule')}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Quarterly View / Timeline Summary */}
                <div className="grid gap-4 md:grid-cols-4">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                        <Card key={q} className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader className="py-3 bg-white/5 border-b border-sidebar-border/20">
                                <CardTitle className="text-sm font-bold text-center">{q} {currentYear}</CardTitle>
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
                                <Input 
                                    placeholder="Search engagements..." 
                                    className="pl-8 h-9 text-xs w-64 bg-white/5 border-white/10" 
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="border-sidebar-border/30 hover:bg-transparent">
                                    <TableHead className="w-[300px] text-[11px] uppercase tracking-wider font-bold">Engagement Name</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">Risk Priority</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">Lead Auditor</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold">Timeline</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-bold text-center">Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {engagements.map((eng) => (
                                    <TableRow key={eng.id} className="border-sidebar-border/20 group hover:bg-white/[0.02]">
                                        <TableCell>
                                            <div className="font-semibold text-foreground group-hover:text-indigo-400 transition-colors">{eng.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="text-[10px] text-muted-foreground font-mono">ENG-{eng.id.toString().padStart(4, '0')}</div>
                                                <div className="size-1 rounded-full bg-muted-foreground/30" />
                                                <span className="text-[10px] text-muted-foreground uppercase">{eng.auditable_entity?.name || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Badge className={`
                                                    w-fit text-[10px]
                                                    ${(eng.auditable_entity?.residual_risk_score || 0) >= 15 ? 'bg-red-500 shadow-lg shadow-red-500/20' : ''}
                                                    ${(eng.auditable_entity?.residual_risk_score || 0) >= 8 && (eng.auditable_entity?.residual_risk_score || 0) < 15 ? 'bg-orange-500' : ''}
                                                    ${(eng.auditable_entity?.residual_risk_score || 0) < 8 ? 'bg-emerald-500' : ''}
                                                `}>
                                                    Risk: {Math.round(eng.auditable_entity?.residual_risk_score || 0)}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] border border-indigo-500/20">
                                                    {eng.lead_auditor?.name.split(' ').map(n => n[0]).join('') || '?'}
                                                </div>
                                                <span className="text-sm">{eng.lead_auditor?.name || 'Unassigned'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                    <Calendar className="size-3 text-indigo-400" /> {formatDate(eng.start_date)} - {formatDate(eng.end_date)}
                                                </div>
                                                <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: eng.status === 'Planning' ? '20%' : (eng.status === 'Completed' ? '100%' : '5%') }} />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={`
                                                font-normal text-[10px]
                                                ${eng.status === 'Planning' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
                                                ${eng.status === 'Completed' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : ''}
                                                ${eng.status === 'In Progress' ? 'border-blue-500/50 text-blue-500 bg-blue-500/5' : ''}
                                                ${eng.status === 'Not Started' ? 'border-muted-foreground/50 text-muted-foreground bg-muted/5' : ''}
                                            `}>{eng.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(eng)} className="size-8 text-indigo-400 hover:text-indigo-300">
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(eng.id)} className="size-8 text-red-400 hover:text-red-300">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
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
                                    Current plan utilizes {stats.q2Load}% of available auditor hours for Q2. Consider reallocating resources to avoid team burnout.
                                </p>
                            </div>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10 transition-all flex items-center gap-2"
                                onClick={handleOptimize}
                            >
                                <Zap className="size-3.5" /> Optimize Resources
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
