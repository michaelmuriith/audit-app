<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        .header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
            font-size: 14px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f0f0f0;
        }

        .section-title {
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 5px;
            text-decoration: underline;
        }

        .no-border-table td,
        .no-border-table th {
            border: none;
            padding: 4px;
        }

        .agenda-list {
            margin-bottom: 15px;
        }

        .signatures {
            margin-top: 40px;
        }

        .signatures td {
            border: none;
        }
    </style>
</head>

<body>
    <div class="header">
        Minutes of {{ $meeting->title }} held on
        {{ $meeting->start_time?->format('d M Y') }} at
        {{ $meeting->start_time?->format('H:i') }}
    </div>

    <div class="section-title">Present</div>
    <table class="no-border-table" style="width: 100%;">
        <tr>
            <th style="width: 30%">Name</th>
            <th style="width: 35%">Designation</th>
            <th style="width: 35%">Department</th>
        </tr>
        @forelse($meeting->attendees->where('rsvp_status', 'present') as $person)
        <tr>
            <td>{{ $person->name ?? $person->user?->name ?? $person->email }}</td>
            <td>{{ $person->designation ?? '-' }}</td>
            <td>{{ $person->department ?? '-' }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="3">None recorded</td>
        </tr>
        @endforelse
    </table>

    <div class="section-title">Apologies</div>
    <table class="no-border-table" style="width: 100%;">
        <tr>
            <th style="width: 30%">Name</th>
            <th style="width: 35%">Designation</th>
            <th style="width: 35%">Department</th>
        </tr>
        @forelse($meeting->attendees->where('rsvp_status', 'apologies') as $person)
        <tr>
            <td>{{ $person->name ?? $person->user?->name ?? $person->email }}</td>
            <td>{{ $person->designation ?? '-' }}</td>
            <td>{{ $person->department ?? '-' }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="3">None recorded</td>
        </tr>
        @endforelse
    </table>

    <div class="section-title">Agenda</div>
    <ol class="agenda-list">
        @foreach($content['discussions'] ?? [] as $discussion)
        <li>{{ $discussion['title'] ?? '' }}</li>
        @endforeach
    </ol>

    <table>
        <tr>
            <th style="width: 60%">Point of Discussion</th>
            <th style="width: 20%">Action By</th>
            <th style="width: 20%">Responsibility</th>
        </tr>
        @foreach($content['discussions'] ?? [] as $discussion)
        <tr>
            <td style="background-color: #e6f2ff; font-weight: bold;" colspan="3">
                Min. {{ $loop->iteration }} {{ $discussion['title'] ?? '' }}
            </td>
        </tr>
        <tr>
            <td>{!! nl2br(e($discussion['discussion'] ?? '')) !!}</td>
            <td>{{ $discussion['action_by'] ?? '' }}</td>
            <td>{{ $discussion['responsibility'] ?? '' }}</td>
        </tr>
        @endforeach
    </table>

    <table class="signatures">
        <tr>
            <td style="width: 50%;">
                <strong>Prepared by (IA Team Leader)</strong><br><br>
                Name: ______________________<br><br>
                Date: ______________________
            </td>
            <td style="width: 50%;">
                <strong>Acknowledged by (Audit Client)</strong><br><br>
                Name: ______________________<br><br>
                Date: ______________________
            </td>
        </tr>
    </table>
</body>

</html>