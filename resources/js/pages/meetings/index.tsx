import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    Calendar, 
    MoreHorizontal, 
    Plus, 
    Search, 
    Video, 
    Users, 
    Clock, 
    MapPin, 
    FileText,
    CheckCircle2,
    AlertCircle,
    RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store, update, destroy } from '@/actions/App/Http/Controllers/MeetingController';
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
        status?: string;
        date?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Meetings',
        href: '/meetings',
    },
];

export default function MeetingsIndex({ meetings, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        agenda: '',
        start_time: '',
        end_time: '',
        location: '',
        attendees: [] as string[],
    });

    const [attendeeEmail, setAttendeeEmail] = useState('');

    const addAttendee = () => {
        if (attendeeEmail && !data.attendees.includes(attendeeEmail)) {
            setData('attendees', [...data.attendees, attendeeEmail]);
            setAttendeeEmail('');
        }
    };

    const removeAttendee = (email: string) => {
        setData('attendees', data.attendees.filter((a) => a !== email));
    };

    const openCreateModal = () => {
        setEditingMeeting(null);
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (meeting: Meeting) => {
        setEditingMeeting(meeting);
        setData({
            title: meeting.title,
            agenda: meeting.agenda || '',
            start_time: meeting.start_time.split('.')[0].slice(0, 16), // Format for datetime-local
            end_time: meeting.end_time.split('.')[0].slice(0, 16),
            location: meeting.location || '',
            attendees: meeting.attendees?.map(a => a.email) || [],
        });
        setIsCreateModalOpen(true);
    };

    const handleCancelMeeting = (id: number) => {
        if (confirm('Are you sure you want to cancel this meeting? This will also remove it from Google Calendar.')) {
            router.delete(destroy({ meeting: id }).url);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMeeting) {
            put(update({ meeting: editingMeeting.id }).url, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        } else {
            post(store().url, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'scheduled':
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/50">Scheduled</Badge>;
            case 'rescheduled':
                return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/50">Rescheduled</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/50">Cancelled</Badge>;
            case 'approved':
                return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/50">Minutes Approved</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meetings Management" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Meetings & Committees</h2>
                        <p className="text-muted-foreground">Schedule and manage your audit meetings and committees.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            onClick={openCreateModal}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20"
                        >
                            <Plus className="mr-2 size-4" />
                            Create Meeting
                        </Button>
                    </div>
                </div>

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingMeeting ? 'Reschedule Meeting' : 'Create New Meeting'}</DialogTitle>
                            <DialogDescription>
                                {editingMeeting 
                                    ? 'Change the time or details of your meeting. Attendees will be notified.' 
                                    : 'Schedule a new meeting and send Google Calendar invites.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Meeting Title</Label>
                                <Input 
                                    id="title" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="e.g. Q1 Audit Planning"
                                />
                                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="agenda">Agenda</Label>
                                <Textarea 
                                    id="agenda" 
                                    value={data.agenda} 
                                    onChange={e => setData('agenda', e.target.value)}
                                    placeholder="Outline the meeting topics..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_time">Start Time</Label>
                                    <Input 
                                        id="start_time" 
                                        type="datetime-local" 
                                        value={data.start_time} 
                                        onChange={e => setData('start_time', e.target.value)}
                                    />
                                    {errors.start_time && <p className="text-xs text-red-500">{errors.start_time}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_time">End Time</Label>
                                    <Input 
                                        id="end_time" 
                                        type="datetime-local" 
                                        value={data.end_time} 
                                        onChange={e => setData('end_time', e.target.value)}
                                    />
                                    {errors.end_time && <p className="text-xs text-red-500">{errors.end_time}</p>}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location (Optional)</Label>
                                <Input 
                                    id="location" 
                                    value={data.location} 
                                    onChange={e => setData('location', e.target.value)}
                                    placeholder="Physical room or other link"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Attendees</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={attendeeEmail} 
                                        onChange={e => setAttendeeEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        type="email"
                                    />
                                    <Button type="button" variant="outline" onClick={addAttendee}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data.attendees.map((email) => (
                                        <Badge key={email} variant="secondary" className="gap-1 px-2 py-1">
                                            {email}
                                            <button type="button" onClick={() => removeAttendee(email)} className="text-muted-foreground hover:text-foreground">
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                {errors.attendees && <p className="text-xs text-red-500">{errors.attendees}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Processing...' : (editingMeeting ? 'Update Meeting' : 'Create Meeting')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Filters & Search */}
                <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search meetings..." 
                                    className="pl-9 h-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="h-10">
                                    <Calendar className="mr-2 size-4" />
                                    Filter by Date
                                </Button>
                                <Button variant="outline" className="h-10">
                                    Status: All
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Meetings Dashboard Grid / Table */}
                <div className="grid gap-6">
                    <Card className="overflow-hidden border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle>Upcoming & Past Meetings</CardTitle>
                            <CardDescription>A complete history of all scheduled meetings.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Meeting Info</th>
                                            <th className="px-6 py-3 font-medium">Schedule</th>
                                            <th className="px-6 py-3 font-medium">Location/Link</th>
                                            <th className="px-6 py-3 font-medium">Attendees</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/50">
                                        {meetings.data.length > 0 ? meetings.data.map((meeting) => (
                                            <tr key={meeting.id} className="hover:bg-muted/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-foreground">{meeting.title}</div>
                                                    <div className="text-xs text-muted-foreground line-clamp-1">{meeting.agenda}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-foreground font-medium">
                                                        <Calendar className="size-3.5 text-indigo-500" />
                                                        {format(new Date(meeting.start_time), 'MMM d, yyyy')}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                        <Clock className="size-3.5" />
                                                        {format(new Date(meeting.start_time), 'hh:mm a')} - {format(new Date(meeting.end_time), 'hh:mm a')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {meeting.google_meet_link ? (
                                                        <a 
                                                            href={meeting.google_meet_link} 
                                                            target="_blank" 
                                                            className="flex items-center gap-2 text-indigo-500 hover:underline font-medium"
                                                        >
                                                            <Video className="size-4" />
                                                            Google Meet
                                                        </a>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <MapPin className="size-4" />
                                                            {meeting.location || 'N/A'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex -space-x-2">
                                                        {meeting.attendees?.slice(0, 3).map((a, i) => (
                                                            <div key={i} className="size-8 rounded-full border-2 border-sidebar bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                                {a.email.charAt(0).toUpperCase()}
                                                            </div>
                                                        ))}
                                                        {meeting.attendees && meeting.attendees.length > 3 && (
                                                            <div className="size-8 rounded-full border-2 border-sidebar bg-muted flex items-center justify-center text-[10px] font-bold">
                                                                +{meeting.attendees.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(meeting.status)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/meetings/${meeting.id}`}>View Details</Link>
                                                            </DropdownMenuItem>
                                                             <DropdownMenuItem asChild>
                                                                <Link href={`/meetings/${meeting.id}/minutes`}>Manage Minutes</Link>
                                                             </DropdownMenuItem>
                                                             <DropdownMenuItem 
                                                                className="text-orange-500"
                                                                onClick={() => openEditModal(meeting)}
                                                            >
                                                                Reschedule
                                                             </DropdownMenuItem>
                                                             <DropdownMenuItem 
                                                                className="text-red-500"
                                                                onClick={() => handleCancelMeeting(meeting.id)}
                                                            >
                                                                Cancel Meeting
                                                             </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Calendar className="size-12 opacity-20" />
                                                        <p>No meetings found based on your filters.</p>
                                                        <Button variant="link" onClick={() => setSearchTerm('')}>Clear Filters</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
