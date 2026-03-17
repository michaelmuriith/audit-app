<?php

namespace App\Mail;

use App\Models\Meeting;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MeetingInvite extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Meeting $meeting) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Meeting Invitation: {$this->meeting->title}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.meetings.invite',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => $this->generateIcs(), 'meeting-invite.ics')
                ->withMime('text/calendar'),
        ];
    }

    /**
     * Generate an ICS file content.
     */
    protected function generateIcs(): string
    {
        $dtStart = Carbon::parse($this->meeting->start_time)->format('Ymd\THis\Z');
        $dtEnd = Carbon::parse($this->meeting->end_time)->format('Ymd\THis\Z');
        $stamp = now()->format('Ymd\THis\Z');
        $uid = 'meeting-'.$this->meeting->id.'-'.uniqid();

        $ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Laravel//Audit App//EN',
            'BEGIN:VEVENT',
            "UID:{$uid}",
            "DTSTAMP:{$stamp}",
            "DTSTART:{$dtStart}",
            "DTEND:{$dtEnd}",
            "SUMMARY:{$this->meeting->title}",
            'DESCRIPTION:'.str_replace(["\r", "\n"], [' ', ' '], $this->meeting->agenda),
            "LOCATION:{$this->meeting->location}",
        ];

        if ($this->meeting->google_meet_link) {
            $ics[] = "URL:{$this->meeting->google_meet_link}";
        }

        $ics[] = 'END:VEVENT';
        $ics[] = 'END:VCALENDAR';

        return implode("\r\n", $ics);
    }
}
