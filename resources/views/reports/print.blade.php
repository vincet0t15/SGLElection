<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Official Election Results</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
        }

        .logo {
            height: 60px;
            width: auto;
            margin-bottom: 10px;
        }

        .logo-text {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            line-height: 1.2;
        }

        .header h1 {
            margin: 0;
            font-size: 16px;
            text-transform: uppercase;
            font-weight: bold;
        }

        .header h2 {
            margin: 5px 0;
            font-size: 14px;
            text-transform: uppercase;
            font-weight: bold;
        }

        .header h3 {
            margin: 5px 0 0;
            font-size: 12px;
            font-weight: normal;
        }

        .meta-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        .meta-table td {
            padding: 5px;
            border: 1px solid #ddd;
        }

        .meta-label {
            font-weight: bold;
            background-color: #f9f9f9;
            width: 150px;
        }

        .position-block {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .position-title {
            background-color: #000;
            color: #fff;
            padding: 8px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .candidates-table {
            width: 100%;
            border-collapse: collapse;
        }

        .candidates-table th,
        .candidates-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }

        .candidates-table th {
            background-color: #f0f0f0;
            font-weight: bold;
        }

        .winner-row {
            background-color: #f0fdf4;
            /* emerald-50 equivalent light */
        }

        .winner-badge {
            font-weight: bold;
            color: #059669;
            /* emerald-600 */
        }

        .signatories {
            margin-top: 50px;
            page-break-inside: avoid;
        }

        .signatories-grid {
            width: 100%;
            border-collapse: separate;
            border-spacing: 20px 0;
        }

        .signatory-cell {
            vertical-align: top;
            padding-top: 40px;
            text-align: center;
            width: 33.33%;
        }

        .sig-line {
            border-top: 1px solid #000;
            margin: 0 auto 5px;
            width: 80%;
        }

        .sig-name {
            font-weight: bold;
            text-transform: uppercase;
        }

        .sig-pos {
            font-size: 10px;
            color: #666;
        }
    </style>
</head>

<body>
    <div class="header">
        <table width="100%">
            <tr>
                <td width="20%" style="vertical-align: middle; text-align: left;">
                    <div class="logo-text">{{ $system_settings->name ?? 'Voting System' }}</div>
                </td>
                <td width="60%" style="vertical-align: middle; text-align: center;">
                    <h1>{{ $type === 'winners' ? 'OFFICIAL LIST OF WINNERS' : 'OFFICIAL ELECTION RESULTS' }}</h1>
                    <h2>{{ $event->name }}</h2>
                </td>
                <td width="20%" style="vertical-align: top; text-align: right; font-size: 10px; color: #666;">
                    Ref: {{ $event->id }}-{{ date('Y') }}
                </td>
            </tr>
        </table>
    </div>

    <table class="meta-table">
        <tr>
            <td class="meta-label">Date Generated:</td>
            <td>{{ now()->format('F j, Y h:i A') }}</td>
            <td class="meta-label">Registered Voters:</td>
            <td>{{ number_format($stats['registered_voters']) }}</td>
        </tr>
        <tr>
            <td class="meta-label">Election Period:</td>
            <td>{{ \Carbon\Carbon::parse($event->start_date)->format('M d, Y') }} - {{ \Carbon\Carbon::parse($event->end_date)->format('M d, Y') }}</td>
            <td class="meta-label">Total Votes Cast:</td>
            <td>{{ number_format($stats['actual_voters']) }} ({{ $stats['turnout'] }}%)</td>
        </tr>
    </table>

    @foreach($positions as $position)
    <div class="position-block">
        <div class="position-title">{{ $position->name }} (Vote for {{ $position->max_votes }})</div>
        <table class="candidates-table">
            <thead>
                <tr>
                    <th>Candidate</th>
                    <th>Partylist</th>
                    <th width="100">Votes</th>
                    @if($type !== 'winners')
                    <th width="80">%</th>
                    @endif
                    <th width="100">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($position->candidates as $index => $candidate)
                @php
                $isWinner = $index < $position->max_votes;
                    $percentage = $stats['actual_voters'] > 0
                    ? round(($candidate->votes_count / $stats['actual_voters']) * 100, 2)
                    : 0;
                    @endphp
                    <tr class="{{ $isWinner ? 'winner-row' : '' }}">
                        <td>
                            <strong>{{ $candidate->name }}</strong>
                        </td>
                        <td>{{ $candidate->partylist ? $candidate->partylist->name : 'Independent' }}</td>
                        <td>{{ number_format($candidate->votes_count) }}</td>
                        @if($type !== 'winners')
                        <td>{{ $percentage }}%</td>
                        @endif
                        <td>
                            @if($isWinner)
                            <span class="winner-badge">WINNER</span>
                            @endif
                        </td>
                    </tr>
                    @endforeach
            </tbody>
        </table>
    </div>
    @endforeach

    <div class="signatories">
        <h3>Certified Correct:</h3>
        <table class="signatories-grid">
            <tr>
                @foreach($signatories as $index => $signatory)
                @if($index > 0 && $index % 3 == 0)
            </tr>
            <tr>
                @endif
                <td class="signatory-cell">
                    <div class="sig-line"></div>
                    <div class="sig-name">{{ $signatory->name }}</div>
                    <div class="sig-pos">{{ $signatory->position }}</div>
                </td>
                @endforeach
            </tr>
        </table>
    </div>
</body>

</html>