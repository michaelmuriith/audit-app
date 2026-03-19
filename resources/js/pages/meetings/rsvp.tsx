import { Head, useForm } from '@inertiajs/react';
import type { Meeting } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

interface Props {
    meeting: Meeting;
    flash?: { success?: string };
}

export default function MeetingRsvp({ meeting, flash }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        designation: '',
        department: '',
        rsvp_status: 'present' as 'present' | 'apologies',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/meetings/${meeting.id}/rsvp`);
    };

    if (flash?.success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-md shadow-lg border-emerald-500/20">
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                        <CheckCircle2 className="size-16 text-emerald-500" />
                        <h2 className="text-2xl font-bold">RSVP Recorded!</h2>
                        <p className="text-muted-foreground">Thank you for responding to the meeting: <strong className="block mt-1">{meeting.title}</strong></p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Head title={`RSVP - ${meeting.title}`} />
            
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader className="text-center space-y-2 pb-6">
                    <CardTitle className="text-3xl font-bold tracking-tight">Meeting RSVP</CardTitle>
                    <CardDescription className="text-base">{meeting.title}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input 
                                    id="name" 
                                    required 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    placeholder="Jane Doe"
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    required 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    placeholder="jane@example.com"
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="designation">Designation</Label>
                                <Input 
                                    id="designation" 
                                    value={data.designation} 
                                    onChange={e => setData('designation', e.target.value)} 
                                    placeholder="e.g. Audit Manager"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input 
                                    id="department" 
                                    value={data.department} 
                                    onChange={e => setData('department', e.target.value)} 
                                    placeholder="e.g. Finance"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label>Will you be attending?</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setData('rsvp_status', 'present')}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${data.rsvp_status === 'present' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-muted hover:border-muted-foreground/30'}`}
                                >
                                    <span className="font-semibold text-lg">Present</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('rsvp_status', 'apologies')}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${data.rsvp_status === 'apologies' ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'border-muted hover:border-muted-foreground/30'}`}
                                >
                                    <span className="font-semibold text-lg">Apologies</span>
                                </button>
                            </div>
                            {errors.rsvp_status && <p className="text-sm text-red-500">{errors.rsvp_status}</p>}
                        </div>

                        <Button type="submit" className="w-full py-6 text-lg mt-4" disabled={processing}>
                            Submit RSVP
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
