import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    FileText, 
    Search, 
    Calendar, 
    Clock, 
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    FileEdit,
    Clock3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { format } from 'date-fns';
import { Meeting } from '@/types/meetings';

interface Props {
    meetings: {
        data: Meeting[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Audit Planning',
        href: '#',
    },
    {
        title: 'Meeting Minutes',
        href: '/audit-planning/meetings/minutes',
    },
];

export default function MinutesIndex({ meetings, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const getMinutesStatusBadge = (status?: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/50">Approved</Badge>;
            case 'submitted':
                return <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/50">Awaiting Review</Badge>;
            case 'rejected':
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/50">Revision Needed</Badge>;
            case 'draft':
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/50">Draft</Badge>;
            default:
                return <Badge variant="outline" className="text-muted-foreground opacity-50 text-[10px] uppercase font-bold tracking-tighter">No Minutes</Badge>;
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="size-4 text-emerald-500" />;
            case 'submitted': return <Clock3 className="size-4 text-indigo-500" />;
            case 'rejected': return <AlertCircle className="size-4 text-red-500" />;
            case 'draft': return <FileEdit className="size-4 text-amber-500" />;
            default: return <FileText className="size-4 text-muted-foreground opacity-30" />;
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // search logic
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meeting Minutes" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Meeting Minutes</h2>
                        <p className="text-muted-foreground">Document and review discussions from all audit meetings.</p>
                    </div>
                </div>

                {/* Search */}
                <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by meeting title..." 
                                className="pl-9 h-10 bg-sidebar/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    {meetings.data.length > 0 ? meetings.data.map((meeting) => (
                        <Card key={meeting.id} className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm hover:border-indigo-500/30 transition-all group overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center p-5 gap-5">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        {getStatusIcon(meeting.minutes?.status)}
                                        <h3 className="font-bold text-lg leading-none group-hover:text-indigo-400 transition-colors truncate">
                                            {meeting.title}
                                        </h3>
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter ml-auto md:ml-0">
                                            {meeting.id}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mt-1">
                                        <div className="flex items-center gap-1.5 font-medium text-foreground/80">
                                            <Calendar className="size-3.5 text-indigo-500" />
                                            {format(new Date(meeting.start_time), 'PPP')}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="size-3.5" />
                                            {format(new Date(meeting.start_time), 'p')}
                                        </div>
                                        <div className="bg-muted/30 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                                            {meeting.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 justify-between md:justify-end">
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Minutes Status</span>
                                        {getMinutesStatusBadge(meeting.minutes?.status)}
                                    </div>
                                    <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 group-hover:translate-x-1 transition-transform">
                                        <Link href={`/audit-planning/meetings/${meeting.id}/minutes`}>
                                            {meeting.minutes ? 'Manage Minutes' : 'Start Recording'}
                                            <ChevronRight className="ml-2 size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )) : (
                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm p-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <FileText className="size-12 text-muted-foreground opacity-20" />
                                <h3 className="text-lg font-semibold">No meetings found</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Meetings must be scheduled before minutes can be recorded.
                                </p>
                                <Button asChild variant="outline" className="mt-4">
                                    <Link href="/audit-planning/meetings">Go to Meetings Management</Link>
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
