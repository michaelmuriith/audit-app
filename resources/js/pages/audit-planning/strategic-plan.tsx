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
    BarChart3
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
import { useState } from 'react';

type Entity = {
    id: number;
    entity: string;
    priority: string;
    status: string;
    year1: boolean;
    year2: boolean;
    year3: boolean;
};

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

const initialAuditUniverse: Entity[] = [
    { id: 1, entity: 'Financial Operations', priority: 'High', status: 'Approved', year1: true, year2: false, year3: true },
    { id: 2, entity: 'IT Infrastructure', priority: 'Critical', status: 'Approved', year1: true, year2: true, year3: true },
    { id: 3, entity: 'HR Compliance', priority: 'Medium', status: 'Draft', year1: false, year2: true, year3: false },
    { id: 4, entity: 'Procurement Services', priority: 'Low', status: 'Approved', year1: true, year2: false, year3: false },
    { id: 5, entity: 'Customer Support', priority: 'Medium', status: 'Draft', year1: false, year2: false, year3: true },
];

export default function StrategicPlan() {
    const [entities, setEntities] = useState<Entity[]>(initialAuditUniverse);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // New Entity State
    const [newEntity, setNewEntity] = useState({
        name: '',
        priority: 'Medium',
        year1: false,
        year2: false,
        year3: false
    });

    const handleAddEntity = () => {
        if (!newEntity.name) {
            return;
        }

        const entityToAdd: Entity = {
            id: Date.now(),
            entity: newEntity.name,
            priority: newEntity.priority,
            status: 'Draft',
            year1: newEntity.year1,
            year2: newEntity.year2,
            year3: newEntity.year3
        };

        setEntities([entityToAdd, ...entities]);
        setNewEntity({
            name: '',
            priority: 'Medium',
            year1: false,
            year2: false,
            year3: false
        });
        setIsModalOpen(false);
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
                            Current Period: 2024 - 2026
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="hidden border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/5 md:flex">
                            <Download className="mr-2 size-4" /> Export Plan
                        </Button>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus className="mr-2 size-4" /> Add Entity
                        </Button>
                    </div>
                </div>

                {/* Plan Overview Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-sidebar-border/50 bg-sidebar/40 backdrop-blur-sm transition-all hover:border-indigo-500/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Auditable Entities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">42</div>
                            <p className="text-xs text-muted-foreground mt-1">Found in audit universe</p>
                        </CardContent>
                    </Card>
                    <Card className="border-sidebar-border/50 bg-sidebar/40 backdrop-blur-sm transition-all hover:border-amber-500/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">High Risk Priority</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-500">12</div>
                            <p className="text-xs text-muted-foreground mt-1">Requiring immediate attention</p>
                        </CardContent>
                    </Card>
                    <Card className="border-sidebar-border/50 bg-sidebar/40 backdrop-blur-sm transition-all hover:border-emerald-500/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Plan Status</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-emerald-500">85%</div>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Finalizing</Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="border-sidebar-border/40 bg-sidebar/20 backdrop-blur-md">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Filter by entity name..." className="pl-9 bg-white/5 border-white/10" />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" className="text-indigo-500">Reset Filters</Button>
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
                                <Badge variant="outline" className="bg-black/20 font-mono">2024</Badge>
                                <Badge variant="outline" className="bg-black/20 font-mono">2025</Badge>
                                <Badge variant="outline" className="bg-black/20 font-mono">2026</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Auditable Entity</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Priority</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                                        <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">Year 1</th>
                                        <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">Year 2</th>
                                        <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">Year 3</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/40">
                                    {entities.map((item) => (
                                        <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5 font-medium">{item.entity}</td>
                                            <td className="px-6 py-5">
                                                <Badge variant="outline" className={`
                                                    ${item.priority === 'Critical' ? 'border-red-500/50 text-red-500 bg-red-500/5' : ''}
                                                    ${item.priority === 'High' ? 'border-orange-500/50 text-orange-500 bg-orange-500/5' : ''}
                                                    ${item.priority === 'Medium' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
                                                    ${item.priority === 'Low' ? 'border-blue-500/50 text-blue-500 bg-blue-500/5' : ''}
                                                `}>{item.priority}</Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`size-1.5 rounded-full ${item.status === 'Approved' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                                                    {item.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <YearIndicator active={item.year1} />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <YearIndicator active={item.year2} />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <YearIndicator active={item.year3} />
                                            </td>
                                            <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="sm" className="text-indigo-400">Edit</Button>
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
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all">
                        <CheckCircle2 className="mr-2 size-4" /> Submit for Approval
                    </Button>
                </div>

                {/* Add Entity Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[500px] border-sidebar-border/50 bg-sidebar/95 backdrop-blur-xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Add Auditable Entity
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
                                    value={newEntity.name}
                                    onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                                />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="priority" className="text-sm font-medium">Risk Priority</Label>
                                <Select 
                                    value={newEntity.priority} 
                                    onValueChange={(value) => setNewEntity({ ...newEntity, priority: value })}
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
                            </div>

                            <div className="grid gap-3">
                                <Label className="text-sm font-medium">Strategic Coverage</Label>
                                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex flex-col items-center gap-2">
                                        <Label htmlFor="year1" className="text-[10px] uppercase text-muted-foreground tracking-wider">Year 1</Label>
                                        <Checkbox 
                                            id="year1" 
                                            checked={newEntity.year1}
                                            onCheckedChange={(checked) => setNewEntity({ ...newEntity, year1: !!checked })}
                                            className="border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <Label htmlFor="year2" className="text-[10px] uppercase text-muted-foreground tracking-wider">Year 2</Label>
                                        <Checkbox 
                                            id="year2" 
                                            checked={newEntity.year2}
                                            onCheckedChange={(checked) => setNewEntity({ ...newEntity, year2: !!checked })}
                                            className="border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <Label htmlFor="year3" className="text-[10px] uppercase text-muted-foreground tracking-wider">Year 3</Label>
                                        <Checkbox 
                                            id="year3" 
                                            checked={newEntity.year3}
                                            onCheckedChange={(checked) => setNewEntity({ ...newEntity, year3: !!checked })}
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
                                onClick={handleAddEntity}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20"
                                disabled={!newEntity.name}
                            >
                                Save Entity
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
