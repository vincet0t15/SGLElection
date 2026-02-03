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
        <h1>COMMISSION ON ELECTIONS</h1>
        <h2>ELECTION RETURN</h2>
        <p>{{ $event->name }}</p>
        <p>Date of Election: {{ $date }}</p>
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