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
                <td width="20%" style="vertical-align: middle; text-align: left;">
                    <div class="logo-text">{{ $system_settings->name ?? 'Voting System' }}</div>
                </td>
                <td width="60%" style="vertical-align: middle; text-align: center;">
                    <h1>Official Ballot Receipt</h1>
                    <div style="font-size: 12px; margin-top: 5px; font-weight: bold;">{{ $event->name }}</div>
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