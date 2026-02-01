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
                <td width="20%" style="vertical-align: top; text-align: left;">
                    @if($system_settings->logo && file_exists(public_path($system_settings->logo)))
                    <img src="{{ public_path($system_settings->logo) }}" class="logo" alt="Logo">
                    @elseif(file_exists(public_path('smartvote.png')))
                    <img src="{{ public_path('smartvote.png') }}" class="logo" alt="Logo">
                    @else
                    {{-- Fallback SVG Logo --}}
                    <svg width="60" height="60" viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#059669" fill-rule="evenodd" clip-rule="evenodd" d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z" />
                    </svg>
                    @endif
                </td>
                <td width="60%" style="vertical-align: top; text-align: center;">
                    <h1>{{ $system_settings->name ?? 'Voting System' }}</h1>
                    <h2>{{ $type === 'winners' ? 'OFFICIAL LIST OF WINNERS' : 'OFFICIAL ELECTION RESULTS' }}</h2>
                    <h3>{{ $event->name }}</h3>
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