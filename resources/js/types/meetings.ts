import { User } from './auth';

export interface Meeting {
    id: number;
    user_id: number;
    title: string;
    agenda?: string;
    start_time: string;
    end_time: string;
    google_event_id?: string;
    google_meet_link?: string;
    status: 'scheduled' | 'rescheduled' | 'cancelled' | 'approved';
    location?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    attendees?: MeetingAttendee[];
    minutes?: MeetingMinute;
}

export interface MeetingAttendee {
    id: number;
    meeting_id: number;
    email: string;
    user_id?: number;
    rsvp_status: 'needsAction' | 'accepted' | 'declined' | 'tentative';
    user?: User;
}

export interface MeetingMinute {
    id: number;
    meeting_id: number;
    content: any;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    notes?: string;
    decisions?: string;
    action_items?: string;
    approved_by?: number;
    approved_at?: string;
    reviews?: MeetingMinuteReview[];
}

export interface MeetingMinuteReview {
    id: number;
    meeting_minute_id: number;
    user_id: number;
    comment?: string;
    status: 'approved' | 'rejected';
    user?: User;
}
