<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>COMELEC Election Return - {{ $event->name }}</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 11px;
            line-height: 1.3;
            color: #000;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .header-table td {
            vertical-align: top;
        }

        .logo {
            width: 80px;
            height: auto;
        }

        .header-text {
            text-align: center;
        }

        .font-old-english {
            font-family: "DejaVu Serif", serif;
            /* Fallback for Old English */
        }

        .school-name {
            font-size: 16px;
            font-weight: bold;
            color: #006400;
            text-transform: uppercase;
            margin: 5px 0;
        }

        .title-section {
            text-align: center;
            margin-bottom: 20px;
        }

        .report-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
        }

        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .meta-table td {
            font-weight: bold;
            padding: 4px;
        }

        .position-container {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .position-header {
            background-color: #f3f4f6;
            padding: 4px;
            font-weight: bold;
            text-transform: uppercase;
            border: 1px solid #000;
        }

        .candidates-table {
            width: 100%;
            border-collapse: collapse;
            border-left: 1px solid #000;
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
        }

        .candidates-table th {
            border: 1px solid #000;
            background-color: #f9fafb;
            padding: 4px;
            text-align: center;
        }

        .candidates-table td {
            border: 1px solid #000;
            padding: 4px;
        }

        .text-center {
            text-align: center;
        }

        .text-uppercase {
            text-transform: uppercase;
        }

        .font-bold {
            font-weight: bold;
        }

        .signatories-section {
            margin-top: 40px;
            text-align: center;
            page-break-inside: avoid;
        }

        .certification-text {
            margin-bottom: 30px;
        }

        .signatories-grid {
            width: 100%;
            margin-top: 20px;
        }

        .signatory-box {
            width: 30%;
            float: left;
            margin-right: 3%;
            margin-bottom: 20px;
            text-align: center;
        }

        .signatory-line {
            border-top: 1px solid #000;
            width: 80%;
            margin: 0 auto 5px auto;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            font-size: 10px;
            text-align: center;
        }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
    </style>
</head>

<body>
    <div class="header-table">
        <table width="100%">
            <tr>
                <td width="15%" style="text-align: right; padding-right: 15px;">
                    <?php
                    $logoPath = null;
                    if ($system_settings && $system_settings->logo) {
                        $path = $system_settings->logo;
                        // Try public path first (if it's a full path or relative to public)
                        if (file_exists(public_path($path))) {
                            $logoPath = public_path($path);
                        }
                        // Try storage path (common for uploads)
                        elseif (file_exists(storage_path('app/public/' . $path))) {
                            $logoPath = storage_path('app/public/' . $path);
                        }
                        // Try relative to public/storage
                        elseif (file_exists(public_path('storage/' . $path))) {
                            $logoPath = public_path('storage/' . $path);
                        }
                    }

                    // Fallback 1: smartvote.png (if user mentioned it before, but I don't see it in file list. I'll skip)
                    // Fallback 2: middle_logo.png
                    if (!$logoPath && file_exists(public_path('middle_logo.png'))) {
                        //$logoPath = public_path('middle_logo.png');
                    }

                    // Use inline SVG if no logo found to ensure something shows up
                    ?>

                    @if($logoPath)
                    <img src="{{ $logoPath }}" class="logo" alt="Logo">
                    @else
                    {{-- Inline SVG Fallback --}}
                    <svg viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg" class="logo" style="width: 80px; height: auto;">
                        <path fill="#059669" fill-rule="evenodd" clip-rule="evenodd" d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z" />
                    </svg>
                    @endif
                </td>
                <td width="70%" class="header-text">
                    <div style="font-size: 13px;">REPUBLIC OF THE PHILIPPINES</div>
                    <div style="font-size: 13px;">DEPARTMENT OF EDUCATION</div>
                    <div style="font-size: 13px;">MIMAROPA Region</div>
                    <div style="font-size: 13px;">Schools Division of Palawan</div>
                    <div class="school-name">SAN VICENTE NATIONAL HIGH SCHOOL</div>
                    <div style="font-size: 12px; font-style: italic;">Poblacion, San Vicente, Palawan</div>
                </td>
                <td width="15%"></td>
            </tr>
        </table>
    </div>

    <div class="title-section">
        <h2 class="report-title">ELECTION RETURN</h2>
        <p style="margin: 5px 0; font-size: 12px;">{{ $event->name }}</p>
        <p style="margin: 0; font-size: 12px;">Date of Election: {{ $date }}</p>
    </div>

    <table class="meta-table">
        <tr>
            <td>Total Registered Voters: {{ number_format($totalRegisteredVoters) }}</td>
            <td class="text-center">Total Votes Cast: {{ number_format($totalVotesCast) }}</td>
            <td style="text-align: right;">Voter Turnout: {{ $voterTurnout }}%</td>
        </tr>
    </table>

    @foreach($positions as $position)
    <div class="position-container">
        <div class="position-header">
            {{ $position->name }} (Vote for {{ $position->max_votes }})
        </div>
        <table class="candidates-table">
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
                    <td class="text-uppercase">{{ $candidate->name }}</td>
                    <td class="text-uppercase">{{ $candidate->partylist->name ?? 'INDEPENDENT' }}</td>
                    <td class="text-center font-bold">{{ number_format($candidate->votes_count) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endforeach

    <div class="signatories-section">
        <p class="certification-text">
            WE HEREBY CERTIFY that the foregoing is a true and correct statement of the votes obtained by each candidate in the election.
        </p>

        <div class="signatories-grid clearfix">
            @foreach($signatories as $index => $signatory)
            <div class="signatory-box">
                <div style="height: 30px;"></div>
                <div class="signatory-line"></div>
                <div class="font-bold text-uppercase" style="font-size: 11px;">{{ $signatory->name }}</div>
                <div style="font-size: 10px;">{{ $signatory->position }}</div>
            </div>

            @if(($index + 1) % 3 == 0)
            <div class="clearfix"></div>
            @endif
            @endforeach
        </div>
    </div>

    <div class="footer">
        Generated by Voting System • {{ date('m/d/Y') }}
    </div>
</body>

</html>