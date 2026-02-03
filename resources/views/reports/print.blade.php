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
        <table style="margin: 0 auto;">
            <tr>
                <td width="120" style="vertical-align: top; text-align: right; padding-right: 10px;">
                    @php
                    $logoPath = null;
                    if ($system_settings->system_logo) {
                    $storagePath = \Illuminate\Support\Facades\Storage::disk('public')->path($system_settings->system_logo);
                    if (file_exists($storagePath)) {
                    $logoPath = $storagePath;
                    } elseif (file_exists(public_path($system_settings->system_logo))) {
                    $logoPath = public_path($system_settings->system_logo);
                    }
                    }

                    $logoData = null;

                    if ($logoPath && file_exists($logoPath)) {
                    $type = pathinfo($logoPath, PATHINFO_EXTENSION);
                    $data = file_get_contents($logoPath);
                    $logoData = 'data:image/' . $type . ';base64,' . base64_encode($data);
                    }
                    @endphp

                    @if ($logoData)
                    <img
                        src="{{ $logoData }}"
                        alt="Logo"
                        style="height: 80px; width: auto;">
                    @else
                    {{-- Default SVG Logo --}}
                    <svg width="80" height="80" viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#059669" fill-rule="evenodd" clip-rule="evenodd"
                            d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325Z" />
                    </svg>
                    @endif
                </td>

                <td style="vertical-align: middle; text-align: center;">
                    <div style="font-family: 'Times New Roman', serif; font-size: 13px;">REPUBLIC OF THE PHILIPPINES</div>
                    <div style="font-family: 'Times New Roman', serif; font-size: 13px;">DEPARTMENT OF EDUCATION</div>
                    <div style="font-family: 'Times New Roman', serif; font-size: 13px;">MIMAROPA Region</div>
                    <div style="font-family: 'Times New Roman', serif; font-size: 13px;">Schools Division of Palawan</div>
                    <div style="font-family: 'Times New Roman', serif; font-size: 16px; font-weight: bold; color: #006400; text-transform: uppercase; margin: 5px 0;">SAN VICENTE NATIONAL HIGH SCHOOL</div>
                    <div style="font-family: 'Times New Roman', serif; font-size: 12px; font-style: italic;">Poblacion, San Vicente, Palawan</div>
                </td>
                <td width="130"></td>
            </tr>
        </table>
    </div>

    <div style="margin-bottom: 30px; margin-top: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="vertical-align: top;">
                    <div style="font-family: 'Times New Roman', serif; font-weight: bold; font-size: 18px; text-transform: uppercase; margin-bottom: 5px;">SSG VOTING SYSTEM</div>
                    <div style="font-family: 'Times New Roman', serif; font-size: 14px; text-transform: uppercase; margin-bottom: 5px;">{{ $type === 'winners' ? 'OFFICIAL LIST OF WINNERS' : 'OFFICIAL ELECTION RESULTS' }}</div>
                    <div style="font-family: 'Times New Roman', serif; font-size: 12px; text-transform: uppercase;">{{ $event->name }}</div>
                </td>
                <td style="vertical-align: top; text-align: right; width: 150px;">
                    <div style="font-size: 12px; color: #666;">Ref: {{ $event->id }}-{{ date('Y') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px;">
            <tr>
                <td style="width: 350px; padding: 5px 0;">Period:</td>
                <td style="padding: 5px 0;">{{ \Carbon\Carbon::parse($event->start_date)->format('F j, Y') }} - {{ \Carbon\Carbon::parse($event->end_date)->format('F j, Y') }}</td>
            </tr>
            <tr>`
                <td style="padding: 5px 0;">Total Number of Sections:</td>
                <td style="padding: 5px 0;">{{ $stats['total_sections'] }}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0;">Total Number of Registered Voters:</td>
                <td style="padding: 5px 0;">{{ number_format($stats['registered_voters']) }}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0;">Total Number of Voters that Actually Voted:</td>
                <td style="padding: 5px 0;">{{ number_format($stats['actual_voters']) }}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0;">Voters' Turnout (%):</td>
                <td style="padding: 5px 0;">{{ $stats['turnout'] }}%</td>
            </tr>
        </table>
    </div>

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
                    @if($type !== 'winners')
                    <tr>
                        <td colspan="2" style="text-align: right; font-weight: bold; background-color: #f9f9f9;">Abstentions / Undervotes</td>
                        <td style="font-weight: bold; background-color: #f9f9f9;">{{ number_format($stats['actual_voters'] - ($position->votes_cast_count ?? 0)) }}</td>
                        <td style="background-color: #f9f9f9;">{{ $stats['actual_voters'] > 0 ? round((($stats['actual_voters'] - ($position->votes_cast_count ?? 0)) / $stats['actual_voters']) * 100, 2) : 0 }}%</td>
                        <td style="background-color: #f9f9f9;"></td>
                    </tr>
                    @endif
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