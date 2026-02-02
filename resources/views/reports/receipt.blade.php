<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Official Ballot Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
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
            font-size: 18px;
            text-transform: uppercase;
        }

        .header h2 {
            margin: 5px 0 0;
            font-size: 14px;
            font-weight: normal;
        }

        .info-grid {
            margin-bottom: 20px;
            width: 100%;
        }

        .info-row {
            margin-bottom: 5px;
        }

        .label {
            font-weight: bold;
            display: inline-block;
            width: 100px;
        }

        .votes-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .votes-table th,
        .votes-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        .votes-table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(0, 0, 0, 0.05);
            z-index: -1;
            pointer-events: none;
        }
    </style>
</head>

<body>
    <div class="watermark">OFFICIAL</div>

    <div class="header">
        <table width="100%">
            <tr>
                <td width="10%" style="vertical-align: top; text-align: center;">
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

                    @if($logoData)
                    <img src="{{ $logoData }}" class="logo" alt="Logo" style="height: 60px; width: auto;">
                    @else
                    <svg width="60" height="60" viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#059669" fill-rule="evenodd" clip-rule="evenodd" d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z" />
                    </svg>
                    @endif
                </td>
                <td width="70%" style="vertical-align: top; text-align: left; padding-left: 10px;">
                    <div style="font-weight: bold; font-size: 14px; text-transform: uppercase; font-family: 'Times New Roman', serif;">{{ $system_settings->system_name ?? 'Voting System' }}</div>
                    <div style="font-weight: bold; font-size: 12px; margin-top: 2px; text-transform: uppercase;">Official Ballot Receipt</div>
                    <div style="font-size: 12px; margin-top: 2px; text-transform: uppercase;">{{ $event->name }}</div>
                </td>
                <td width="20%" style="vertical-align: top; text-align: right; font-size: 10px; color: #666;">
                    Ref: {{ $voter->username }}
                </td>
            </tr>
        </table>
    </div>

    <div class="info-grid">
        <div class="info-row">
            <span class="label">Voter Name:</span> {{ $voter->name }}
        </div>
        <div class="info-row">
            <span class="label">Voter ID:</span> {{ $voter->username }}
        </div>
        <div class="info-row">
            <span class="label">Date Voted:</span> {{ $votes->first() ? $votes->first()->created_at->format('F j, Y h:i A') : 'N/A' }}
        </div>
        <div class="info-row">
            <span class="label">Location:</span> {{ $event->location ?? 'Online' }}
        </div>
    </div>

    <table class="votes-table">
        <thead>
            <tr>
                <th>Position</th>
                <th>Candidate</th>
                <th>Party List</th>
            </tr>
        </thead>
        <tbody>
            @foreach($votes as $vote)
            <tr>
                <td>{{ $vote->candidate->position->name }}</td>
                <td>{{ $vote->candidate->name }}</td>
                <td>{{ $vote->candidate->partylist ? $vote->candidate->partylist->name : 'Independent' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>This document is a system-generated receipt. Valid only for the specified election event.</p>
        <p>Generated on: {{ now()->format('F j, Y h:i A') }}</p>
    </div>
</body>

</html>