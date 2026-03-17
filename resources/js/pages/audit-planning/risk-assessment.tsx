import { Head } from '@inertiajs/react';
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
    Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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

const risks = [
    { id: 1, name: 'Cybersecurity Data Breach', department: 'IT', likelihood: 2, impact: 5, rating: 10, category: 'Technology' },
    { id: 2, name: 'Financial Misstatement', department: 'Finance', likelihood: 3, impact: 4, rating: 12, category: 'Financial' },
    { id: 3, name: 'Regulatory Non-Compliance', department: 'Legal', likelihood: 4, impact: 4, rating: 16, category: 'Compliance' },
    { id: 4, name: 'Supply Chain Disruption', department: 'Operations', likelihood: 3, impact: 3, rating: 9, category: 'Operational' },
    { id: 5, name: 'Talent Retention', department: 'HR', likelihood: 5, impact: 2, rating: 10, category: 'Strategic' },
];

export default function RiskAssessment() {
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
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20">
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
                                                {/* Risk Markers (Mock) */}
                                                {rating === 16 && (
                                                    <div className="absolute size-3 rounded-full bg-red-500 border-2 border-white shadow-lg animate-bounce" />
                                                )}
                                                {rating === 12 && (
                                                    <div className="absolute size-3 rounded-full bg-orange-500 border-2 border-white shadow-lg" />
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
                                            <th className="px-6 py-4 font-semibold">Risk Name</th>
                                            <th className="px-6 py-4 font-semibold">Cat.</th>
                                            <th className="px-6 py-4 text-center font-semibold">Likelihood</th>
                                            <th className="px-6 py-4 text-center font-semibold">Impact</th>
                                            <th className="px-6 py-4 text-center font-semibold">Score</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/30">
                                        {risks.map((risk) => (
                                            <tr key={risk.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="font-medium text-foreground">{risk.name}</div>
                                                    <div className="text-xs text-muted-foreground">{risk.department}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge variant="outline" className="text-[10px] font-normal border-indigo-500/20 bg-indigo-500/5">{risk.category}</Badge>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <RatingValue value={risk.likelihood} />
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <RatingValue value={risk.impact} />
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <Badge className={`
                                                        ${risk.rating >= 15 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : ''}
                                                        ${risk.rating >= 10 && risk.rating < 15 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : ''}
                                                        ${risk.rating >= 5 && risk.rating < 10 ? 'bg-amber-500 text-white' : ''}
                                                        ${risk.rating < 5 ? 'bg-emerald-500 text-white' : ''}
                                                    `}>{risk.rating}</Badge>
                                                </td>
                                                <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="sm" className="text-indigo-400">Details</Button>
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
                                    Our system calculates risk magnitude based on the product of likelihood and impact, aligned with ISO 31000 standards. High-risk areas are automatically prioritized for the next audit cycle.
                                </p>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                                View Calculation Methodology <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
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
