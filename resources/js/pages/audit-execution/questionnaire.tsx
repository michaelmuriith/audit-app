import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    ClipboardCheck, 
    HelpCircle, 
    MessageSquare, 
    FileText, 
    Save, 
    Send,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
        title: 'Questionnaire',
        href: '/audit-execution/questionnaire',
    },
];

const sections = [
    { id: 'sec1', title: 'Internal Controls General', active: true },
    { id: 'sec2', title: 'Financial Reporting', active: false },
    { id: 'sec3', title: 'Operations & IT', active: false },
];

const questions = [
    { 
        id: 1, 
        text: 'Are duties within the department adequately segregated to prevent fraud?', 
        hint: 'Consider authorization, recording, and custody functions.' 
    },
    { 
        id: 2, 
        text: 'Is there a formal process for periodic review of access permissions?', 
        hint: 'Check if access is revoked immediately upon employee termination.' 
    },
    { 
        id: 3, 
        text: 'Are all significant agreements and transactions documented in writing?', 
        hint: 'Look for contracts, invoices, and signed approvals.' 
    },
];

export default function Questionnaire() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pre-Audit Questionnaire" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8 max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Pre-Audit Questionnaire</h2>
                        <p className="text-muted-foreground underline decoration-indigo-500/30">Engagement: Revenue Recognition Audit 2024</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Navigation Sidebar */}
                    <Card className="lg:col-span-3 border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm h-fit">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Sections</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1">
                            {sections.map((sec) => (
                                <button 
                                    key={sec.id}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all
                                        ${sec.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-muted-foreground hover:bg-white/5'}
                                    `}
                                >
                                    {sec.title}
                                    {sec.active ? <ChevronRight className="size-4" /> : <div className="size-4 border border-white/10 rounded-full" />}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Question Content */}
                    <Card className="lg:col-span-9 border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm shadow-xl">
                        <CardHeader className="border-b border-sidebar-border/30">
                            <div className="flex items-center justify-between">
                                <CardTitle>Section 1: Internal Controls General</CardTitle>
                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/5">40% Completed</Badge>
                            </div>
                            <CardDescription>Please respond accurately to provide context for the audit team.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            {questions.map((q, idx) => (
                                <div key={q.id} className="space-y-4 group">
                                    <div className="flex items-start gap-4">
                                        <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-base font-semibold leading-relaxed group-hover:text-indigo-400 transition-colors">{q.text}</Label>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Info className="size-3" /> {q.hint}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="pl-12 space-y-4">
                                        <RadioGroup defaultValue="none" className="flex items-center gap-6">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="yes" id={`q${q.id}-yes`} className="border-emerald-500/50 text-emerald-500" />
                                                <Label htmlFor={`q${q.id}-yes`} className="text-sm font-medium">Yes / Compliant</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id={`q${q.id}-no`} className="border-red-500/50 text-red-500" />
                                                <Label htmlFor={`q${q.id}-no`} className="text-sm font-medium">No / Non-Compliant</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="na" id={`q${q.id}-na`} />
                                                <Label htmlFor={`q${q.id}-na`} className="text-sm font-medium">N/A</Label>
                                            </div>
                                        </RadioGroup>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Comments / Evidence Link</Label>
                                            <textarea 
                                                className="w-full min-h-[60px] rounded-lg bg-white/5 border border-white/10 p-3 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none" 
                                                placeholder="Provide detailed explanation or link to supporting documents..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6 border-t border-sidebar-border/30 flex items-center justify-between">
                                <Button variant="ghost" className="text-muted-foreground">
                                    <ChevronLeft className="mr-2 size-4" /> Previous Section
                                </Button>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" className="border-white/10">
                                        <Save className="mr-2 size-4" /> Save Progress
                                    </Button>
                                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                                        Next Section <ChevronRight className="ml-2 size-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Final Submission Banner */}
                <Card className="border-sidebar-border/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border-dashed">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-500 ring-8 ring-emerald-500/5">
                                <ClipboardCheck className="size-8" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold">Ready for Submission?</h3>
                                <p className="text-muted-foreground mt-2 max-w-2xl">
                                    Once all sections are completed, submit the questionnaire for auditor review. You will not be able to edit responses after final submission.
                                </p>
                            </div>
                            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 h-12">
                                <Send className="mr-2 size-4" /> Submit Questionnaire
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
