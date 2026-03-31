import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    Plus, 
    Search, 
    Filter, 
    Edit2, 
    Trash2, 
    Building2, 
    History,
    ShieldCheck,
    Layers,
    LayoutGrid
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import AuditPlanning, { auditableEntities } from '@/routes/audit-planning';

type Entity = {
    id: number;
    name: string;
    category: string;
    sector: string | null;
    priority: string;
    risk_frequency: string;
    last_audit_date: string | null;
    last_audit_rating: string | null;
    status: string;
    description: string | null;
};

interface AuditableEntitiesProps {
    entities: Entity[];
    filters: {
        search?: string;
        sector?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/' },
    { title: 'Audit Planning', href: '#' },
    { title: 'Auditable Entities', href: '/audit-planning/auditable-entities' },
];

export default function AuditableEntities({ entities, filters }: AuditableEntitiesProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 300);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        category: 'Process',
        sector: '',
        priority: 'Medium',
        risk_frequency: 'Annual',
        last_audit_date: '',
        last_audit_rating: '',
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
            category: entity.category,
            sector: entity.sector || '',
            priority: entity.priority,
            risk_frequency: entity.risk_frequency,
            last_audit_date: entity.last_audit_date ? new Date(entity.last_audit_date).toISOString().split('T')[0] : '',
            last_audit_rating: entity.last_audit_rating || '',
            description: entity.description || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this entity from the audit universe?')) {
            router.delete(AuditPlanning.strategicPlan.destroy(id).url);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (value === 'all' || !value) {
            delete newFilters[key as keyof (typeof filters)];
        }
        router.get(
            auditableEntities({ query: newFilters }).url,
            {},
            { preserveState: true, replace: true }
        );
    };

    const sectors = ['Governance', 'Finance', 'Human Resources', 'ICT', 'Operations', 'Supply Chain', 'Legal', 'Marketing'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Universe - ARCMS" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Audit Universe Management</h2>
                        <p className="text-muted-foreground italic">Master list of all auditable units and processes.</p>
                    </div>
                    <Button 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        onClick={() => {
                            setEditingEntity(null);
                            reset();
                            setIsModalOpen(true);
                        }}
                    >
                        <Plus className="mr-2 size-4" /> Add Auditable Unit
                    </Button>
                </div>

                {/* Filters */}
                <Card className="border-sidebar-border/40 bg-sidebar/20 backdrop-blur-md">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by name..." 
                                    className="pl-9 bg-white/5 border-white/10 h-10" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select 
                                value={filters.sector || 'all'} 
                                onValueChange={(v) => handleFilterChange('sector', v)}
                            >
                                <SelectTrigger className="w-[200px] bg-white/5 border-white/10 h-10">
                                    <SelectValue placeholder="Sector / Cluster" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sectors</SelectItem>
                                    {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Universe Master Table */}
                <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground border-b border-sidebar-border/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Auditable Unit</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Sector / Cluster</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Last Audit</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Freq.</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {entities.map((item) => (
                                        <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-foreground">{item.name}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {item.id.toString().padStart(4, '0')}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="size-3.5 text-indigo-400" />
                                                    <span className="text-sm">{item.sector || 'Unassigned'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge variant="outline" className="bg-indigo-500/5 border-indigo-500/20 text-indigo-400 text-[10px]">
                                                    <Layers className="size-3 mr-1" /> {item.category}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                {item.last_audit_date ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <History className="size-3 text-muted-foreground" />
                                                            {new Date(item.last_audit_date).toLocaleDateString('en-GB')}
                                                        </div>
                                                        <Badge variant="outline" className={`
                                                            text-[9px] w-fit
                                                            ${item.last_audit_rating === 'Satisfactory' ? 'border-emerald-500/50 text-emerald-500' : 'border-amber-500/50 text-amber-500'}
                                                        `}>{item.last_audit_rating}</Badge>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic text-xs">Never Audited</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge className="bg-white/5 border-white/10 text-white font-mono text-[10px]">{item.risk_frequency}</Badge>
                                            </td>
                                            <td className="px-6 py-5 text-right whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-indigo-400 hover:text-indigo-300">
                                                    <Edit2 className="size-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300">
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {entities.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground italic">
                                                    <LayoutGrid className="size-12 opacity-20" />
                                                    No auditable units found in the universe.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Universe Insight */}
                <Card className="border-sidebar-border/50 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-dashed">
                    <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="p-4 rounded-2xl bg-indigo-500/20 text-indigo-500 ring-8 ring-indigo-500/5">
                            <ShieldCheck className="size-8" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">Standard Audit Universe (PSASB Compliant)</h3>
                            <p className="text-muted-foreground mt-2 max-w-2xl text-sm italic">
                                The Audit Universe is a comprehensive list of all auditable units. Each unit's risk profile (assessed in the next step) determines its audit frequency and scheduling in the Strategic Plan.
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            className="text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10"
                            onClick={() => router.get(AuditPlanning.riskAssessment.url())}
                        >
                            Next: Risk Assessment <ChevronRight className="ml-2 size-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Add/Edit Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[600px] border-sidebar-border/50 bg-sidebar/95 backdrop-blur-xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {editingEntity ? 'Edit Auditable Unit' : 'Define New Auditable Unit'}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground italic text-xs">
                                Populate the master list of auditable activities and units.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Unit / Process Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="e.g. Accounts Payable Process" 
                                    className="bg-white/5 border-white/10 focus-visible:ring-indigo-500/50 h-10"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Category</Label>
                                    <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Department">Department</SelectItem>
                                            <SelectItem value="Process">Process</SelectItem>
                                            <SelectItem value="Branch">Branch</SelectItem>
                                            <SelectItem value="System">System / Application</SelectItem>
                                            <SelectItem value="Project">Project</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Sector / Cluster</Label>
                                    <Select value={data.sector} onValueChange={(v) => setData('sector', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10">
                                            <SelectValue placeholder="Sector" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Risk-Based Frequency</Label>
                                    <Select value={data.risk_frequency} onValueChange={(v) => setData('risk_frequency', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10">
                                            <SelectValue placeholder="Frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Annual">Annual (High Risk)</SelectItem>
                                            <SelectItem value="Bi-annual">Bi-annual (Medium Risk)</SelectItem>
                                            <SelectItem value="Tri-annual">Tri-annual (Low Risk)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Priority Override</Label>
                                    <Select value={data.priority} onValueChange={(v) => setData('priority', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-sidebar-border/30 pt-4">
                                <div className="grid gap-2">
                                    <Label>Last Audit Date</Label>
                                    <Input 
                                        type="date" 
                                        className="bg-white/5 border-white/10 h-10" 
                                        value={data.last_audit_date}
                                        onChange={(e) => setData('last_audit_date', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Last Audit Rating</Label>
                                    <Select value={data.last_audit_rating} onValueChange={(v) => setData('last_audit_rating', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10">
                                            <SelectValue placeholder="Rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                                            <SelectItem value="Fair">Fair</SelectItem>
                                            <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                                            <SelectItem value="Unsatisfactory">Unsatisfactory</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 mt-4">
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
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : (editingEntity ? 'Update Unit' : 'Add Unit')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

function ChevronRight({ className, ...props }: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
