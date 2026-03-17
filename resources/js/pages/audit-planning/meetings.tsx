import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { 
    Users, 
    Calendar, 
    Clock, 
    FileText, 
    Paperclip, 
    MessageSquare, 
    Plus,
    MoreVertical,
    CheckCircle2,
    Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        title: 'Meeting Management',
        href: '/audit-planning/meetings',
    },
];

const meetings = [
    { id: 1, title: '2024 Strategic Plan Kickoff', date: '2024-03-20', time: '10:00 AM', type: 'Strategic', participants: 6, status: 'Scheduled' },
    { id: 2, title: 'Risk Assessment Workshop', date: '2024-03-25', time: '02:00 PM', type: 'Risk', participants: 12, status: 'Draft' },
    { id: 3, title: 'Audit Committee Review', date: '2024-03-15', time: '09:00 AM', type: 'Review', participants: 4, status: 'Completed' },
];

export default function MeetingManagement() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meeting Management" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Meeting Management</h2>
                        <p className="text-muted-foreground">Collaborate with stakeholders and document audit discussions.</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20">
                        <Plus className="mr-2 size-4" /> Schedule Meeting
                    </Button>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-white/5 border border-white/10">
                            <TabsTrigger value="all">All Meetings</TabsTrigger>
                            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search meetings..." className="pl-8 h-9 text-xs w-48 bg-white/5 border-white/10" />
                        </div>
                    </div>

                    <TabsContent value="all" className="mt-0">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {meetings.map((meeting) => (
                                <Card key={meeting.id} className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm group hover:border-indigo-500/30 transition-all">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <Badge variant="outline" className={`
                                                ${meeting.status === 'Completed' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : ''}
                                                ${meeting.status === 'Scheduled' ? 'border-blue-500/50 text-blue-500 bg-blue-500/5' : ''}
                                                ${meeting.status === 'Draft' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : ''}
                                            `}>{meeting.status}</Badge>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <MoreVertical className="size-4" />
                                            </Button>
                                        </div>
                                        <CardTitle className="mt-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">{meeting.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="bg-white/5 text-[10px] uppercase">{meeting.type}</Badge>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="size-3 text-indigo-500" />
                                                {meeting.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="size-3 text-indigo-500" />
                                                {meeting.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Users className="size-3 text-indigo-500" />
                                                {meeting.participants} Participants
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-sidebar-border/30 flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="size-6 rounded-full border border-sidebar-border bg-muted flex items-center justify-center text-[10px] font-bold ring-2 ring-sidebar/30">
                                                        U{i}
                                                    </div>
                                                ))}
                                                <div className="size-6 rounded-full border border-sidebar-border bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-sidebar/30">
                                                    +{meeting.participants - 3}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 text-xs text-indigo-400 font-medium">
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Recording Interface Placeholder */}
                <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="bg-indigo-500/5 border-b border-sidebar-border/30">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Record Meeting Minutes</CardTitle>
                            <Badge className="bg-indigo-600 text-white">Active Session</Badge>
                        </div>
                        <CardDescription>Document decisions, action items, and upload recordings.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Discussion Points</label>
                                    <div className="min-h-[200px] w-full rounded-xl border border-sidebar-border/50 bg-white/5 p-4 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                                        <p className="text-sm text-foreground/80">Start typing minutes here...</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" className="border-indigo-500/20 text-indigo-500"><Paperclip className="mr-2 size-3" /> Attach Evidence</Button>
                                    <Button size="sm" variant="outline" className="border-indigo-500/20 text-indigo-500"><MessageSquare className="mr-2 size-3" /> Add Participant Comment</Button>
                                </div>
                            </div>
                            <div className="lg:col-span-4 space-y-4">
                                <div className="rounded-xl border border-sidebar-border/50 bg-white/5 p-4">
                                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                                        <CheckCircle2 className="size-4 text-indigo-500" /> Action Items
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                                            <input type="checkbox" className="rounded border-white/20" />
                                            <span className="text-xs">Finalize Strategic Plan year 2</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                                            <input type="checkbox" className="rounded border-white/20" />
                                            <span className="text-xs text-muted-foreground">Review IT Risk Matrix</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="w-full h-8 text-xs border border-dashed border-white/10">+ Add Action Item</Button>
                                    </div>
                                </div>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12">
                                    Save & Finalize Minutes
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
