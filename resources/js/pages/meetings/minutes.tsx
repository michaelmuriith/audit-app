import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Meeting, MeetingMinute } from '@/types';
import { 
    Save, 
    Send, 
    CheckCircle, 
    XCircle, 
    History,
    MessageSquare,
    Lock,
    Unlock,
    ChevronLeft,
    ListChecks,
    Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';
import { store, review } from '@/actions/App/Http/Controllers/MeetingMinuteController';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    meeting: Meeting & {
        minutes: MeetingMinute | null;
    };
}

interface AgendaItem {
    no: string;
    title: string;
    details: string;
}

const parseAgenda = (agenda: string): AgendaItem[] => {
    if (!agenda) return [];
    
    const lines = agenda.split('\n').filter(line => line.trim() !== '');
    const items: AgendaItem[] = [];
    
    let currentItem: AgendaItem | null = null;
    
    lines.forEach(line => {
        // Match patterns like "1. Title", "1: Title", "Item 1: Title", "No 1. Title"
        const match = line.match(/^((?:Item|No|Agenda)?\s*\d+[\.:]?)\s*(.*)/i);
        
        if (match) {
            if (currentItem) {
                items.push(currentItem);
            }
            currentItem = {
                no: match[1],
                title: match[2].trim(),
                details: ''
            };
        } else if (currentItem) {
            currentItem.details += (currentItem.details ? '\n' : '') + line.trim();
        } else {
            // If no match and no current item, create one
            currentItem = {
                no: (items.length + 1) + ':',
                title: line.trim(),
                details: ''
            };
        }
    });
    
    if (currentItem) {
        items.push(currentItem);
    }
    return items;
};

export default function MeetingMinutes({ meeting }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Meetings', href: '/meetings' },
        { title: meeting.title, href: `/meetings/${meeting.id}` },
        { title: 'Minutes', href: `/meetings/${meeting.id}/minutes` },
    ];

    const agendaItems = parseAgenda(meeting.agenda || '');

    const editor = useEditor({
        extensions: [
            StarterKit,
            LinkExtension.configure({ openOnClick: false }),
            Underline,
        ],
        content: meeting.minutes?.content || '<p>Start typing meeting minutes here...</p>',
        editable: meeting.minutes?.status !== 'approved',
    });

    const { data, setData, post, processing } = useForm({
        meeting_id: meeting.id,
        content: meeting.minutes?.content || {},
        notes: meeting.minutes?.notes || '',
        decisions: meeting.minutes?.decisions || '',
        action_items: meeting.minutes?.action_items || '',
        status: meeting.minutes?.status || 'draft',
    });

    const handleSave = (status: 'draft' | 'submitted' = 'draft', callback?: () => void) => {
        const content = editor?.getJSON();
        setData(data => ({
            ...data,
            content,
            status
        }));
        
        // Use router directly to handle the manual payload instead of relying on useForm state sync
        router.post(store().url, {
            ...data,
            content,
            status
        }, {
            onSuccess: () => {
                if (callback) callback();
            }
        });
    };

    const handleAgendaClick = (item: AgendaItem) => {
        if (meeting.minutes?.status === 'approved') return;

        handleSave('draft', () => {
            if (!editor) return;

            // Move to end of document
            editor.commands.focus('end');
            
            // Add a horizontal rule if not empty
            if (editor.getText().trim() !== '' && editor.getText().trim() !== 'Start typing meeting minutes here...') {
                editor.commands.setHorizontalRule();
            }

            // Insert agenda item info
            editor.commands.insertContent([
                {
                    type: 'heading',
                    attrs: { level: 3 },
                    content: [
                        { type: 'text', text: `Agenda ${item.no} ${item.title}` }
                    ]
                },
                {
                    type: 'paragraph',
                    content: [
                        { type: 'text', text: item.details, marks: [{ type: 'italic' }] }
                    ]
                },
                {
                    type: 'paragraph',
                    content: []
                }
            ]);

            editor.commands.focus('end');
        });
    };

    const handleReview = (status: 'approved' | 'rejected') => {
        router.post(review({ minute: meeting.minutes?.id! }).url, {
            status,
            comment: '', // Could be added later
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Minutes - ${meeting.title}`} />
            
            <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
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
                        <h2 className="text-3xl font-bold tracking-tight">Minutes of Meeting</h2>
                        <p className="text-muted-foreground">{meeting.title}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {meeting.minutes?.status !== 'approved' ? (
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
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                                    onClick={() => handleSave('submitted')}
                                    disabled={processing}
                                >
                                    <Send className="mr-2 size-4" />
                                    Submit for Review
                                </Button>
                            </>
                        ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/50 py-1.5 px-3">
                                <Lock className="mr-2 size-3.5" />
                                Finalized & Locked
                            </Badge>
                        ) }
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Rich Text Editor */}
                    <Card className="lg:col-span-2 border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm overflow-hidden flex flex-col">
                        <CardHeader className="border-b border-sidebar-border/50 bg-muted/20">
                            <CardTitle className="text-lg">Detailed Discussion</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 min-h-[500px]">
                            <EditorContent 
                                editor={editor} 
                                className="prose prose-sm dark:prose-invert max-w-none p-6 outline-none"
                            />
                        </CardContent>
                    </Card>

                    {/* Left Sidebar: Agendas */}
                    <div className="flex flex-col gap-6">
                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <ListChecks className="size-4 text-indigo-500" />
                                    Meeting Agenda
                                </CardTitle>
                                <CardDescription>Click an item to record minutes for it.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-sidebar-border/30">
                                    {agendaItems.map((item, index) => (
                                        <button
                                            key={index}
                                            className="w-full text-left p-4 hover:bg-muted/50 transition-colors group relative"
                                            onClick={() => handleAgendaClick(item)}
                                            disabled={meeting.minutes?.status === 'approved'}
                                        >
                                            <div className="flex gap-3">
                                                <span className="text-xs font-bold text-indigo-500 mt-0.5">{item.no}</span>
                                                <div>
                                                    <div className="text-sm font-semibold leading-tight group-hover:text-indigo-500 transition-colors">
                                                        {item.title}
                                                    </div>
                                                    {item.details && (
                                                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                            {item.details}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {meeting.minutes?.status !== 'approved' && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Plus className="size-3.5 text-indigo-400" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    {agendaItems.length === 0 && (
                                        <div className="p-8 text-center text-muted-foreground text-sm italic">
                                            No agenda items defined for this meeting.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar: Notes, Decisions, Actions */}
                    <div className="flex flex-col gap-6">
                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <CheckCircle className="size-4 text-emerald-500" />
                                    Decisions Made
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea 
                                    placeholder="Enter key decisions..." 
                                    className="min-h-[80px] text-sm"
                                    value={data.decisions}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('decisions', e.target.value)}
                                    disabled={meeting.minutes?.status === 'approved'}
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/50 bg-sidebar/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <History className="size-4 text-orange-500" />
                                    Action Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea 
                                    placeholder="List tasks and assignees..." 
                                    className="min-h-[80px] text-sm"
                                    value={data.action_items}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('action_items', e.target.value)}
                                    disabled={meeting.minutes?.status === 'approved'}
                                />
                            </CardContent>
                        </Card>

                        {/* Workflow Review Section */}
                        {meeting.minutes?.status === 'submitted' && (
                            <Card className="border-indigo-500/30 bg-indigo-500/5 border">
                                <CardHeader>
                                    <CardTitle className="text-md flex items-center gap-2 text-indigo-500">
                                        <MessageSquare className="size-4" />
                                        Review Minutes
                                    </CardTitle>
                                    <CardDescription>As a reviewer, you can approve or reject these minutes.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    <Button 
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                                        onClick={() => handleReview('approved')}
                                        disabled={processing}
                                    >
                                        <CheckCircle className="mr-2 size-4" />
                                        Approve Minutes
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="w-full text-red-500 hover:text-red-600"
                                        onClick={() => handleReview('rejected')}
                                        disabled={processing}
                                    >
                                        <XCircle className="mr-2 size-4" />
                                        Request Changes
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
