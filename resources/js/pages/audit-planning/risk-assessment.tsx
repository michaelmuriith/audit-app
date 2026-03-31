import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {
    AlertTriangle,
    ArrowRight,
    Zap,
    Activity,
    Info,
    LayoutGrid,
    Search,
    SlidersHorizontal,
    Plus,
    Edit2,
    Trash2,
    Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';
import AuditPlanning from '@/routes/audit-planning';

type Entity = {
    id: number;
    name: string;
};

type Risk = {
    id: number;
    name: string;
    category: 'Technology' | 'Financial' | 'Compliance' | 'Operational' | 'Strategic';
    likelihood: number;
    impact: number;
    control_effectiveness: number;
    inherent_score: number;
    residual_score: number;
    auditable_entity_id: number;
    auditable_entity?: Entity;
    description?: string;
    mitigations?: string;
};

interface RiskAssessmentProps {
    risks: Risk[];
    entities: Entity[];
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
        title: 'Risk Assessment',
        href: '/audit-planning/risk-assessment',
    },
];

export default function RiskAssessment({ risks, entities }: RiskAssessmentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRisk, setEditingRisk] = useState<Risk | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        category: 'Technology',
        likelihood: 1,
        impact: 1,
        control_effectiveness: 1,
        auditable_entity_id: '',
        description: '',
        mitigations: '',
    });

    const handleSaveRisk = () => {
        if (editingRisk) {
            put(AuditPlanning.riskAssessment.update(editingRisk.id).url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingRisk(null);
                    reset();
                },
            });
        } else {
            post(AuditPlanning.riskAssessment.store().url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (risk: Risk) => {
        setEditingRisk(risk);
        setData({
            name: risk.name,
            category: risk.category,
            likelihood: risk.likelihood,
            impact: risk.impact,
            control_effectiveness: risk.control_effectiveness,
            auditable_entity_id: (risk.auditable_entity_id || '').toString(),
            description: risk.description || '',
            mitigations: risk.mitigations || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this risk entry?')) {
            router.delete(AuditPlanning.riskAssessment.destroy(id).url);
        }
    };

    // Calculate Heat Map Data
    const [viewMode, setViewMode] = useState<'inherent' | 'residual'>('inherent');

    const getRisksAt = (likelihood: number, impact: number) => {
        return risks.filter(r => {
            if (viewMode === 'inherent') {
                return r.likelihood === likelihood && r.impact === impact;
            }
            // Logic for residual grid positioning if needed, 
            // but usually Heat Map shows Inherent. 
            // PSASB often wants both.
            return r.likelihood === likelihood && r.impact === impact;
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Risk Assessment" />

            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Risk Assessment & Heat Map</h2>
                        <p className="text-muted-foreground">Identify, analyze, and prioritize organizational risks.</p>
                    </div>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20"
                        onClick={() => {
                            setEditingRisk(null);
                            reset();
                            setIsModalOpen(true);
                        }}
                    >
                        <Plus className="mr-2 size-4" /> New Risk Entry
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Heat Map Visualization */}
                    <Card className="lg:col-span-5 border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-sidebar-border/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Zap className="size-4 text-amber-500" /> Risk Heat Map
                            </CardTitle>
                            <CardDescription>Correlation between Likelihood and Impact.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-6 grid-rows-6 gap-2 aspect-square max-w-[400px] mx-auto relative">
                                {/* Axis Labels */}
                                <div className="absolute -left-8 top-1/2 -rotate-90 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Likelihood</div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Impact</div>

                                {/* Map Grid (5x5) */}
                                {[5, 4, 3, 2, 1].map((likelihood) => (
                                    [1, 2, 3, 4, 5].map((impact) => {
                                        const risksAtNode = getRisksAt(likelihood, impact);
                                        const rating = likelihood * impact;
                                        let bgColor = 'bg-muted/10';
                                        if (rating >= 15) bgColor = 'bg-red-500/30 border-red-500/50';
                                        else if (rating >= 10) bgColor = 'bg-orange-500/30 border-orange-500/50';
                                        else if (rating >= 5) bgColor = 'bg-amber-500/30 border-amber-500/50';
                                        else bgColor = 'bg-emerald-500/30 border-emerald-500/50';

                                        return (
                                            <div
                                                key={`${likelihood}-${impact}`}
                                                className={`relative rounded-md border text-[9px] flex items-center justify-center font-bold overflow-visible
                                                    ${bgColor} transition-transform hover:scale-105 hover:z-10 group cursor-pointer
                                                `}
                                            >
                                                <span className="opacity-30 group-hover:opacity-100">{rating}</span>
                                                {/* Risk Markers */}
                                                {risksAtNode.length > 0 && (
                                                    <div className={`absolute size-3 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[7px] text-white
                                                        ${rating >= 15 ? 'bg-red-600 animate-pulse' : (rating >= 10 ? 'bg-orange-600' : (rating >= 5 ? 'bg-amber-600' : 'bg-emerald-600'))}
                                                    `}>
                                                        {risksAtNode.length > 1 ? risksAtNode.length : ''}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ))}
                            </div>
                            <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-bold text-muted-foreground uppercase">
                                <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-emerald-500" /> Low</span>
                                <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-amber-500" /> Moderate</span>
                                <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-orange-500" /> High</span>
                                <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-red-500" /> Critical</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Register Table */}
                    <Card className="lg:col-span-7 border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm shadow-xl">
                        <CardHeader className="border-b border-sidebar-border/50 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Risk Register</CardTitle>
                                    <CardDescription>Detailed risk entries with calculated scores.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Search risks..." className="pl-8 h-9 text-xs w-48 bg-white/5 border-white/10" />
                                    </div>
                                    <Button variant="outline" size="sm" className="border-white/10"><SlidersHorizontal className="size-4" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 text-muted-foreground text-[11px] uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-[10px]">Risk Name</th>
                                            <th className="px-6 py-4 font-semibold text-[10px]">Inherent Risk</th>
                                            <th className="px-6 py-4 font-semibold text-[10px]">Control</th>
                                            <th className="px-6 py-4 text-center font-semibold text-[10px]">Residual Risk</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/30">
                                        {risks.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground italic">
                                                    No risk entries found. Add your first risk to begin assessment.
                                                </td>
                                            </tr>
                                        ) : risks.map((risk) => (
                                            <tr key={risk.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-black text-[13px]">{risk.name}</span>
                                                        <span className="text-[10px] text-indigo-400/80 font-medium uppercase tracking-tight">
                                                            {risk.auditable_entity?.name || 'Unlinked Entity'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 font-mono text-[10px]">
                                                            {(risk.likelihood * risk.impact)}
                                                        </Badge>
                                                        <div className="text-[8px] text-muted-foreground uppercase">{risk.likelihood} × {risk.impact}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Badge variant="outline" className={`
                                                            text-[10px]
                                                            ${risk.control_effectiveness >= 4 ? 'border-emerald-500/50 text-emerald-500' : ''}
                                                            ${risk.control_effectiveness <= 2 ? 'border-red-500/50 text-red-500' : ''}
                                                        `}>
                                                            {risk.control_effectiveness}/5
                                                        </Badge>
                                                        <span className="text-[8px] text-muted-foreground uppercase">
                                                            {risk.control_effectiveness === 5 ? 'Excellent' :
                                                                risk.control_effectiveness === 4 ? 'Good' :
                                                                    risk.control_effectiveness === 3 ? 'Fair' :
                                                                        risk.control_effectiveness === 2 ? 'Weak' : 'Poor'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Badge className={`
                                                            ${risk.residual_score >= 15 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : ''}
                                                            ${risk.residual_score >= 10 && risk.residual_score < 15 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : ''}
                                                            ${risk.residual_score >= 5 && risk.residual_score < 10 ? 'bg-amber-500 text-white' : ''}
                                                            ${risk.residual_score < 5 ? 'bg-emerald-500 text-white' : ''}
                                                        `}>{Math.round(risk.residual_score)}</Badge>
                                                        <div className="text-[8px] text-muted-foreground uppercase font-bold tracking-tighter">Net Exposure</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="size-8 text-indigo-400" onClick={() => handleEdit(risk)}>
                                                            <Edit2 className="size-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="size-8 text-red-400" onClick={() => handleDelete(risk.id)}>
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Risk Insight Section */}
                <Card className="border-sidebar-border/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-dashed">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="p-4 rounded-full bg-indigo-500/20 text-indigo-500 ring-8 ring-indigo-500/5">
                                <Activity className="size-8" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold">Automatic Risk Scoring Engine</h3>
                                <p className="text-muted-foreground mt-2 max-w-2xl">
                                    Our system calculates risk magnitude based on the product of likelihood and impact, aligned with ISO 31000 standards. These scores directly influence the **Strategic Plan** by highlighting high-priority auditable entities.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                                onClick={() => router.get(AuditPlanning.strategicPlan.url())}
                            >
                                Open Strategic Plan <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk Entry Modal */}
                <Dialog open={isModalOpen} onOpenChange={(open) => {
                    if (!open) { setEditingRisk(null); reset(); }
                    setIsModalOpen(open);
                }}>
                    <DialogContent className="sm:max-w-[500px] border-sidebar-border/50 bg-sidebar/95 backdrop-blur-xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {editingRisk ? 'Edit Risk Entry' : 'New Risk Entry'}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Identify an organizational risk and link it to an auditable entity.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-5 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="risk-name" className="text-sm font-medium">Risk Name</Label>
                                <Input
                                    id="risk-name"
                                    placeholder="e.g. Unauthorised System Access"
                                    className="bg-white/5 border-white/10 focus-visible:ring-indigo-500/50"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">Risk Category</Label>
                                    <Select value={data.category} onValueChange={(v: any) => setData('category', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Financial">Financial</SelectItem>
                                            <SelectItem value="Compliance">Compliance</SelectItem>
                                            <SelectItem value="Operational">Operational</SelectItem>
                                            <SelectItem value="Strategic">Strategic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">Mitigations / Controls in Place</Label>
                                    <Input
                                        placeholder="e.g. Automated login monitoring..."
                                        className="bg-white/5 border-white/10"
                                        value={data.mitigations}
                                        onChange={(e) => setData('mitigations', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Link to Auditable Entity</Label>
                                <Select value={data.auditable_entity_id} onValueChange={(v) => setData('auditable_entity_id', v)}>
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select entity to point this risk to..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {entities.map(entity => (
                                            <SelectItem key={entity.id} value={entity.id.toString()}>{entity.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.auditable_entity_id && <p className="text-xs text-red-500">{errors.auditable_entity_id}</p>}
                            </div>
                            <div className="grid grid-cols-1 gap-4 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs uppercase font-bold text-muted-foreground">Likelihood</Label>
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <button key={val} type="button" onClick={() => setData('likelihood', val)}
                                                className={`size-8 rounded flex items-center justify-center text-xs font-bold transition-all
                                                    ${data.likelihood === val ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 hover:bg-white/10 text-muted-foreground'}
                                                `}>{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs uppercase font-bold text-muted-foreground">Impact</Label>
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <button key={val} type="button" onClick={() => setData('impact', val)}
                                                className={`size-8 rounded flex items-center justify-center text-xs font-bold transition-all
                                                    ${data.impact === val ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 hover:bg-white/10 text-muted-foreground'}
                                                `}>{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-indigo-500/10 mt-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <Label className="text-xs uppercase font-bold text-amber-500">Control Effectiveness</Label>
                                            <span className="text-[10px] text-muted-foreground italic">1=Poor, 5=Excellent</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {[1, 2, 3, 4, 5].map((val) => (
                                                <button key={val} type="button" onClick={() => setData('control_effectiveness', val)}
                                                    className={`size-8 rounded flex items-center justify-center text-xs font-bold transition-all
                                                        ${data.control_effectiveness === val ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white/5 hover:bg-white/10 text-muted-foreground'}
                                                    `}>{val}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-center p-2 rounded bg-indigo-500/10 mb-[-8px]">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Calculated Residual Risk: </span>
                                    <span className="text-sm font-bold text-indigo-400">
                                        {Math.round((data.likelihood * data.impact) * (1 - ((data.control_effectiveness - 1) * 0.2)))}
                                    </span>
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
                                onClick={handleSaveRisk}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : (editingRisk ? 'Update Risk' : 'Save Risk')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

function RatingValue({ value }: { value: number }) {
    return (
        <div className="flex items-center justify-center gap-1.5">
            <span className="font-mono text-xs">{value}</span>
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className={`size-1 rounded-full ${i <= value ? 'bg-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.5)]' : 'bg-muted/30'}`}
                    />
                ))}
            </div>
        </div>
    );
}
