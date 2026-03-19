import { format } from 'date-fns';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Meeting, MeetingMinute } from '@/types';
import {
    Save,
    Send,
    CheckCircle,
    XCircle,
    MessageSquare,
    Lock,
    ChevronLeft,
    Plus,
    Trash2,
    FileDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { store, review } from '@/actions/App/Http/Controllers/MeetingMinuteController';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface Attendee {
    id: number;
    email: string;
    rsvp_status: string;
    name?: string;
    designation?: string;
    department?: string;
    user?: {
        name: string;
    }
}

interface Props {
    meeting: Meeting & {
        minutes: MeetingMinute | null;
        attendees?: Attendee[];
    };
}

interface AgendaItem {
    no: string;
    title: string;
}

const parseAgenda = (agenda: string): AgendaItem[] => {
    if (!agenda) {
        return [{ no: '1:', title: 'AOB' }];
    }
    const lines = agenda.split('\n').filter(line => line.trim() !== '');
    const items: AgendaItem[] = [];

    lines.forEach(line => {
        const match = line.match(/^((?:Item|No|Agenda)?\s*\d+[\.:]?)\s*(.*)/i);
        if (match) {
            items.push({ no: match[1], title: match[2].trim() });
        } else {
            items.push({ no: (items.length + 1) + ':', title: line.trim() });
        }
    });

    const hasAOB = items.some(item => 
        item.title.toLowerCase().includes('aob') || 
        item.title.toLowerCase().includes('any other business')
    );
    
    if (!hasAOB) {
        items.push({ no: (items.length + 1) + ':', title: 'AOB' });
    }

    return items;
};

export interface AgendaDiscussion {
    no: string;
    title: string;
    discussion: string;
    action_by: string;
    responsibility: string;
}

export interface MinutesContent {
    discussions: AgendaDiscussion[];
}

export default function MeetingMinutes({ meeting }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Meetings', href: '/meetings' },
        { title: meeting.title, href: `/meetings/${meeting.id}` },
        { title: 'Minutes', href: `/meetings/${meeting.id}/minutes` },
    ];

    const isApproved = meeting.minutes?.status === 'approved';

    // Safely parse initial content structure
    const existingContent: any = meeting.minutes?.content;
    const initialContent: MinutesContent = (existingContent && existingContent.discussions)
        ? existingContent
        : {
            discussions: parseAgenda(meeting.agenda || '').map(item => ({
                no: item.no,
                title: item.title,
                discussion: '',
                action_by: '',
                responsibility: ''
            }))
        };

    const { data, setData, post, processing } = useForm({
        meeting_id: meeting.id,
        content: initialContent,
        status: meeting.minutes?.status || 'draft',
    });

    const handleSave = (status: 'draft' | 'submitted' = 'draft') => {
        const payload = {
            ...data,
            status
        };
        setData('status', status);
        router.post(store().url, payload as any);
    };

    const handleReview = (status: 'approved' | 'rejected') => {
        if (!meeting.minutes?.id) return;
        router.post(review({ minute: meeting.minutes.id }).url, {
            status,
            comment: '',
        });
    };

    const handleExport = () => {
        window.location.href = `/audit-planning/meetings/${meeting.id}/minutes/export`;
    };

    const copyRsvpLink = () => {
        const link = `${window.location.origin}/meetings/${meeting.id}/rsvp`;
        navigator.clipboard.writeText(link);
        alert('RSVP Link copied to clipboard!');
    };

    const presentAttendees = meeting.attendees?.filter((a: any) => a.rsvp_status === 'present') || [];
    const absentees = meeting.attendees?.filter((a: any) => a.rsvp_status === 'apologies') || [];

    const updateContent = (key: keyof MinutesContent, value: any) => {
        setData('content', {
            ...data.content,
            [key]: value
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Minutes - ${meeting.title}`} />

            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Button variant="ghost" size="sm" asChild className="-ml-2 h-8 px-2 text-muted-foreground hover:text-foreground">
                                <Link href="/meetings">
                                    <ChevronLeft className="mr-1 size-4" />
                                    Back to Meetings
                                </Link>
                            </Button>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
                                {meeting.id}
                            </Badge>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Minutes of { } {meeting.title}</h2>
                        <p className="text-muted-foreground">{format(new Date(meeting.start_time), 'PPP')} at {format(new Date(meeting.start_time), 'p')}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="default"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={handleExport}
                        >
                            <FileDown className="mr-2 size-4" />
                            Export PDF
                        </Button>

                        {!isApproved ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSave('draft')}
                                    disabled={processing}
                                >
                                    <Save className="mr-2 size-4" />
                                    Save Draft
                                </Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => handleSave('submitted')}
                                    disabled={processing}
                                >
                                    <Send className="mr-2 size-4" />
                                    Submit
                                </Button>
                            </>
                        ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/50 py-1.5 px-3">
                                <Lock className="mr-2 size-3.5" />
                                Finalized & Locked
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Attendees Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm relative">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Present</CardTitle>
                                <Button variant="outline" size="sm" onClick={copyRsvpLink}>
                                    Copy RSVP Link
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {presentAttendees.map((person: any, idx) => (
                                    <div key={idx} className="flex gap-2 items-start py-2 border-b last:border-0 border-sidebar-border/50">
                                        <div className="grid grid-cols-3 gap-2 flex-1 text-sm">
                                            <div><span className="text-muted-foreground block text-xs">Name</span>{person.name || person.user?.name || person.email}</div>
                                            <div><span className="text-muted-foreground block text-xs">Designation</span>{person.designation || '-'}</div>
                                            <div><span className="text-muted-foreground block text-xs">Department</span>{person.department || '-'}</div>
                                        </div>
                                    </div>
                                ))}
                                {presentAttendees.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">No participants marked as present.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Apologies</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {absentees.map((person: any, idx) => (
                                    <div key={idx} className="flex gap-2 items-start py-2 border-b last:border-0 border-sidebar-border/50">
                                        <div className="grid grid-cols-3 gap-2 flex-1 text-sm">
                                            <div><span className="text-muted-foreground block text-xs">Name</span>{person.name || person.user?.name || person.email}</div>
                                            <div><span className="text-muted-foreground block text-xs">Designation</span>{person.designation || '-'}</div>
                                            <div><span className="text-muted-foreground block text-xs">Department</span>{person.department || '-'}</div>
                                        </div>
                                    </div>
                                ))}
                                {absentees.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">No apologies received.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Discussions Section */}
                    <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Agenda Discussions</CardTitle>
                            <CardDescription>Record the points of discussion, action owners, and responsibilities mapping to the Entrance Meeting template.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-sidebar-border/50">
                                {data.content.discussions.map((item, idx) => (
                                    <div key={idx} className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Badge variant="secondary" className="font-mono">{item.no}</Badge>
                                            <h4 className="font-semibold text-base">{item.title}</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">Point of Discussion</label>
                                                <Textarea
                                                    disabled={isApproved}
                                                    placeholder="Record discussion points here..."
                                                    className="min-h-[100px]"
                                                    value={item.discussion}
                                                    onChange={e => {
                                                        const newDiscussions = [...data.content.discussions];
                                                        newDiscussions[idx].discussion = e.target.value;
                                                        updateContent('discussions', newDiscussions);
                                                    }}
                                                />
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block">Action By</label>
                                                    <Input
                                                        disabled={isApproved}
                                                        placeholder="Name / Designation"
                                                        value={item.action_by}
                                                        onChange={e => {
                                                            const newDiscussions = [...data.content.discussions];
                                                            newDiscussions[idx].action_by = e.target.value;
                                                            updateContent('discussions', newDiscussions);
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block">Responsibility</label>
                                                    <Input
                                                        disabled={isApproved}
                                                        placeholder="Audit Client / Team Leader etc."
                                                        value={item.responsibility}
                                                        onChange={e => {
                                                            const newDiscussions = [...data.content.discussions];
                                                            newDiscussions[idx].responsibility = e.target.value;
                                                            updateContent('discussions', newDiscussions);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {data.content.discussions.length === 0 && (
                                    <div className="p-8 text-center text-muted-foreground text-sm italic">
                                        No agenda items found to discuss. Ensure the meeting has an agenda defined.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {meeting.minutes?.status === 'submitted' && (
                        <Card className="border-indigo-500/30 bg-indigo-500/5">
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2 text-indigo-500">
                                    <MessageSquare className="size-4" />
                                    Review Minutes
                                </CardTitle>
                                <CardDescription>As a reviewer, you can approve or reject these minutes.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-row gap-3">
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => handleReview('approved')}
                                    disabled={processing}
                                >
                                    <CheckCircle className="mr-2 size-4" /> Approve Minutes
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => handleReview('rejected')}
                                    disabled={processing}
                                >
                                    <XCircle className="mr-2 size-4" /> Request Changes
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
