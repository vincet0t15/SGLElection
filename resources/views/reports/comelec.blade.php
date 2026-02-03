<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>COMELEC Election Return</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.3;
            color: #000;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .header h1 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .header h2 {
            margin: 5px 0;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .header p {
            margin: 2px 0;
            font-size: 12px;
        }

        .meta-info {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        .meta-info td {
            padding: 5px;
            font-weight: bold;
        }

        .position-container {
            page-break-inside: avoid;
            margin-bottom: 20px;
        }

        .section-title {
            background-color: #ddd;
            padding: 5px;
            font-weight: bold;
            text-transform: uppercase;
            border: 1px solid #000;
        }

        .results-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: -1px;
            /* Overlap borders */
        }

        .results-table th,
        .results-table td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }

        .results-table th {
            background-color: #f0f0f0;
            text-align: center;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
        }

        .signatories-grid {
            width: 100%;
            border-collapse: separate;
            border-spacing: 20px 0;
            margin-top: 50px;
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
                    if ($system_settings && $system_settings->system_logo) {
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
                    <img src="{{ $logoData }}" alt="Logo" style="height: 80px; width: auto;">
                    @else
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
                    <div style="font-family: 'Times New Roman', serif; font-size: 16px; font-weight: bold; color: #006400; text-transform: uppercase; margin: 5px 0;">{{ $system_settings->system_name ?? 'SAN VICENTE NATIONAL HIGH SCHOOL' }}</div>
                    <div style="font-family: 'Times New Roman', serif; font-size: 12px; font-style: italic;">Poblacion, San Vicente, Palawan</div>
                </td>
                <td width="130"></td>
            </tr>
        </table>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; text-transform: uppercase;">ELECTION RETURN</h2>
        <p style="margin: 5px 0;">{{ $event->name }}</p>
        <p style="margin: 0; font-size: 12px;">Date of Election: {{ $date }}</p>
    </div>

    <table class="meta-info">
        <tr>
            <td>Total Registered Voters: {{ number_format($totalRegisteredVoters) }}</td>
            <td>Total Votes Cast: {{ number_format($totalVotesCast) }}</td>
            <td>Voter Turnout: {{ $voterTurnout }}%</td>
        </tr>
    </table>

    @foreach($positions as $position)
    <div class="position-container">
        <div class="section-title">{{ $position->name }} (Vote for {{ $position->max_votes }})</div>
        <table class="results-table">
            <thead>
                <tr>
                    <th width="50%">CANDIDATE NAME</th>
                    <th width="30%">PARTY / AFFILIATION</th>
                    <th width="20%">VOTES OBTAINED</th>
                </tr>
            </thead>
            <tbody>
                @foreach($position->candidates as $candidate)
                <tr>
                    <td>{{ strtoupper($candidate->name) }}</td>
                    <td>{{ $candidate->partylist ? strtoupper($candidate->partylist->name) : 'INDEPENDENT' }}</td>
                    <td style="text-align: center;">{{ number_format($candidate->votes_count) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endforeach

    <div class="footer">
        <p>WE HEREBY CERTIFY that the foregoing is a true and correct statement of the votes obtained by each candidate in the election.</p>

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