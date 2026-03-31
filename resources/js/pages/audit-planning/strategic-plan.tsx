import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    Plus, 
    Calendar, 
    Filter, 
    Download, 
    ChevronRight, 
    Save, 
    CheckCircle2,
    BarChart3,
    Edit2,
    Trash2,
    AlertTriangle,
    Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { useDebounce } from '@/hooks/use-debounce';
import AuditPlanning from '@/routes/audit-planning';

type Risk = {
    id: number;
    name: string;
    score: number;
};

type Entity = {
    id: number;
    name: string;
    priority: string;
    status: string;
    year1_planned: boolean;
    year2_planned: boolean;
    year3_planned: boolean;
    description: string | null;
    residual_risk_score?: number;
    suggested_frequency?: 'Annual' | 'Bi-annual' | 'Tri-annual';
    risks?: Risk[];
};

interface StrategicPlanProps {
    entities: Entity[];
    filters: {
        search?: string;
        priority?: string;
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
        title: 'Strategic Plan',
        href: '/audit-planning/strategic-plan',
    },
];

export default function StrategicPlan({ entities, filters }: StrategicPlanProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 300);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        priority: 'Medium',
        risk_frequency: 'Annual',
        year1_planned: false,
        year2_planned: false,
        year3_planned: false,
        description: '',
    });

    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            handleFilterChange('search', debouncedSearch);
        }
    }, [debouncedSearch]);

    const handleSaveEntity = () => {
        if (editingEntity) {
            put(AuditPlanning.strategicPlan.update(editingEntity.id).url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingEntity(null);
                    reset();
                },
            });
        } else {
            post(AuditPlanning.strategicPlan.store().url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (entity: Entity) => {
        setEditingEntity(entity);
        setData({
            name: entity.name,
            priority: entity.priority,
            risk_frequency: 'Annual', // Default if not set
            year1_planned: !!entity.year1_planned,
            year2_planned: !!entity.year2_planned,
            year3_planned: !!entity.year3_planned,
            description: entity.description || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this entity from the strategic plan?')) {
            router.delete(AuditPlanning.strategicPlan.destroy(id).url);
        }
    };

    const handleSubmitPlan = () => {
        if (confirm('Submit the current strategic plan for approval? This will mark all draft entities as finalized.')) {
            router.post(AuditPlanning.strategicPlan.submit().url);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (value === 'all' || !value) {
            delete newFilters[key as keyof (typeof filters)];
        }
        
        router.get(
            AuditPlanning.strategicPlan.url({ query: newFilters }),
            {},
            { preserveState: true, replace: true }
        );
    };

    const currentYear = new Date().getFullYear();
    const startYear = currentYear;
    const endYear = currentYear + 2;

    const stats = {
        total: entities.length,
        highRisk: entities.filter(e => e.priority === 'Critical' || e.priority === 'High').length,
        finalizing: entities.length > 0 
            ? Math.round((entities.filter(e => e.status === 'Approved').length / entities.length) * 100) 
            : 0
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Strategic Audit Plan" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Three-Year Strategic Plan</h2>
                        <p className="text-muted-foreground underline decoration-indigo-500/30">
                            Current Period: {startYear} - {endYear}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="hidden border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/5 md:flex">
                            <Download className="mr-2 size-4" /> Export Plan
                        </Button>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                            onClick={() => {
                                setEditingEntity(null);
                                reset();
                                setIsModalOpen(true);
                            }}
                        >
                            <Plus className="mr-2 size-4" /> Add Entity
                        </Button>
                    </div>
                </div>

                {/* Strategic Context / SWOT */}
                <Card className="border-sidebar-border/50 bg-sidebar/20 backdrop-blur-md overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-sidebar-border/20 py-3">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                             <Target className="size-4 text-indigo-400" /> Strategic Context & Environmental Scan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid md:grid-cols-4 divide-x divide-sidebar-border/20">
                            <div className="p-4 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                                <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Strengths</h4>
                                <p className="text-[11px] leading-relaxed text-muted-foreground">Robust internal controls in core financial processes and highly skilled IT audit team.</p>
                            </div>
                            <div className="p-4 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                                <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Weaknesses</h4>
                                <p className="text-[11px] leading-relaxed text-muted-foreground">Limited budget for specialized forensic tools and high staff turnover in junior roles.</p>
                            </div>
                            <div className="p-4 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors">
                                <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Opportunities</h4>
                                <p className="text-[11px] leading-relaxed text-muted-foreground">Implementation of new ERP system allows for real-time continuous auditing integration.</p>
                            </div>
                            <div className="p-4 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                                <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">Threats</h4>
                                <p className="text-[11px] leading-relaxed text-muted-foreground">Increasing cyber-security threats in the sector and evolving regulatory compliance laws.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters and Search */}
                <Card className="border-sidebar-border/40 bg-sidebar/20 backdrop-blur-md">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Filter by entity name..." 
                                    className="pl-9 bg-white/5 border-white/10" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select 
                                value={filters.priority || 'all'} 
                                onValueChange={(value) => handleFilterChange('priority', value)}
                            >
                                <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => router.get(AuditPlanning.strategicPlan.url())}
                                className="text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/10"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Universe Table */}
                <Card className="overflow-hidden border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                    <CardHeader className="border-b border-sidebar-border/50 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Audit Universe Coverage</CardTitle>
                                <CardDescription>Strategic multi-year distribution of audit engagements.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-black/20 font-mono">{startYear}</Badge>
                                <Badge variant="outline" className="bg-black/20 font-mono">{startYear + 1}</Badge>
                                <Badge variant="outline" className="bg-black/20 font-mono">{endYear}</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Audit Scope / Primary Risk</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Risk Score</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Priority</th>
                                        <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">{startYear}</th>
                                        <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">{startYear + 1}</th>
                                        <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">{endYear}</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/40">
                                    {entities.map((item) => (
                                        <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-white text-[13px]">
                                                    {item.risks?.[0]?.name || item.name}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-tight">
                                                        {item.risks?.[0] ? item.name : 'Unlinked Entity'}
                                                    </span>
                                                    <div className="size-1 rounded-full bg-sidebar-border/50 mx-1" />
                                                    <div className={`size-1.5 rounded-full ${item.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground'}`} />
                                                    <span className="text-[10px] uppercase text-muted-foreground tracking-tighter">{item.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <Badge className={`
                                                        ${(item.residual_risk_score || 0) >= 15 ? 'bg-red-600 shadow-lg shadow-red-600/20' : ''}
                                                        ${(item.residual_risk_score || 0) >= 8 && (item.residual_risk_score || 0) < 15 ? 'bg-orange-600 shadow-lg shadow-orange-600/20' : ''}
                                                        ${(item.residual_risk_score || 0) < 8 ? 'bg-emerald-600' : ''}
                                                    `}>{Math.round(item.residual_risk_score || 0)}</Badge>
                                                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">
                                                        {item.suggested_frequency}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge variant="outline" className={`
                                                    ${item.priority === 'Critical' ? 'border-red-500/50 text-red-500 bg-red-500/5' : ''}
                                                    ${item.priority === 'High' ? 'border-orange-500/50 text-orange-500 bg-orange-500/5' : ''}
                                                    ${item.priority === 'Medium' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
                                                    ${item.priority === 'Low' ? 'border-blue-500/50 text-blue-500 bg-blue-500/5' : ''}
                                                `}>{item.priority}</Badge>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <YearIndicator active={item.year1_planned} />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <YearIndicator active={item.year2_planned} />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <YearIndicator active={item.year3_planned} />
                                            </td>
                                            <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => router.get(AuditPlanning.annualPlan.url({ query: { entity_id: item.id } })) }
                                                    className="text-emerald-400 hover:text-emerald-300"
                                                    title="Schedule Engagement"
                                                >
                                                    <Calendar className="size-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-indigo-400 hover:text-indigo-300">
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 mt-4">
                    <Button variant="outline" className="border-white/10">Save as Draft</Button>
                    <Button 
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all"
                        onClick={handleSubmitPlan}
                    >
                        <CheckCircle2 className="mr-2 size-4" /> Submit for Approval
                    </Button>
                </div>

                {/* Add Entity Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[500px] border-sidebar-border/50 bg-sidebar/95 backdrop-blur-xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {editingEntity ? 'Edit Auditable Entity' : 'Add Auditable Entity'}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Add a new auditable entity to the three-year strategic plan.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium">Entity Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="e.g. Finance Operations" 
                                    className="bg-white/5 border-white/10 focus-visible:ring-indigo-500/50"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="priority" className="text-sm font-medium">Risk Priority</Label>
                                <Select 
                                    value={data.priority} 
                                    onValueChange={(value) => setData('priority', value)}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.priority && <p className="text-xs text-red-500">{errors.priority}</p>}
                            </div>

                            <div className="grid gap-4">
                                <Label className="text-sm font-medium">Strategic Coverage & Frequency</Label>
                                
                                {editingEntity?.suggested_frequency && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                                                <BarChart3 className="size-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-indigo-400 leading-none">AI Risk Insight</span>
                                                <span className="text-xs font-semibold">Suggested: {editingEntity.suggested_frequency}</span>
                                            </div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="h-7 text-[10px] uppercase font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300"
                                            onClick={() => {
                                                const freq = editingEntity.suggested_frequency;
                                                if (freq === 'Annual') {
                                                    setData(d => ({ ...d, year1_planned: true, year2_planned: true, year3_planned: true, risk_frequency: 'Annual' }));
                                                } else if (freq === 'Bi-annual') {
                                                    setData(d => ({ ...d, year1_planned: true, year2_planned: false, year3_planned: true, risk_frequency: 'Bi-annual' }));
                                                } else {
                                                    setData(d => ({ ...d, year1_planned: false, year2_planned: false, year3_planned: true, risk_frequency: 'Tri-annual' }));
                                                }
                                            }}
                                        >
                                            Auto-Apply
                                        </Button>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex flex-col items-center gap-2">
                                        <Label htmlFor="year1_planned" className="text-[10px] uppercase text-muted-foreground tracking-wider">Year 1</Label>
                                        <Checkbox 
                                            id="year1_planned" 
                                            checked={data.year1_planned}
                                            onCheckedChange={(checked: boolean | 'indeterminate') => setData('year1_planned', checked === true)}
                                            className="border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <Label htmlFor="year2_planned" className="text-[10px] uppercase text-muted-foreground tracking-wider">Year 2</Label>
                                        <Checkbox 
                                            id="year2_planned" 
                                            checked={data.year2_planned}
                                            onCheckedChange={(checked: boolean | 'indeterminate') => setData('year2_planned', checked === true)}
                                            className="border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <Label htmlFor="year3_planned" className="text-[10px] uppercase text-muted-foreground tracking-wider">Year 3</Label>
                                        <Checkbox 
                                            id="year3_planned" 
                                            checked={data.year3_planned}
                                            onCheckedChange={(checked: boolean | 'indeterminate') => setData('year3_planned', checked === true)}
                                            className="border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsModalOpen(false)}
                                className="border-white/10 hover:bg-white/5"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSaveEntity}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20"
                                disabled={processing || !data.name}
                            >
                                {processing ? 'Saving...' : (editingEntity ? 'Update Entity' : 'Save Entity')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

function YearIndicator({ active }: { active: boolean }) {
    return (
        <div className="flex justify-center">
            {active ? (
                <div className="size-5 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center animate-pulse">
                    <div className="size-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                </div>
            ) : (
                <div className="size-5 rounded-full border border-sidebar-border/30 bg-muted/20" />
            )}
        </div>
    );
}
