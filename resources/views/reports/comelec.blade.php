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

        .section-title {
            background-color: #ddd;
            padding: 5px;
            font-weight: bold;
            text-transform: uppercase;
            border: 1px solid #000;
            margin-top: 15px;
        }

        .results-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
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

        .signatures {
            width: 100%;
            margin-top: 50px;
        }

        .signature-box {
            width: 30%;
            display: inline-block;
            text-align: center;
            margin: 0 1.5%;
        }

        .line {
            border-bottom: 1px solid #000;
            margin-bottom: 5px;
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
    @endforeach

    <div class="footer">
        <p>WE HEREBY CERTIFY that the foregoing is a true and correct statement of the votes obtained by each candidate in the election.</p>

        <div class="signatures">
            <div class="signature-box">
                <div class="line"></div>
                <strong>CHAIRMAN</strong>
                <br>Board of Election Inspectors
            </div>
            <div class="signature-box">
                <div class="line"></div>
                <strong>MEMBER</strong>
                <br>Board of Election Inspectors
            </div>
            <div class="signature-box">
                <div class="line"></div>
                <strong>MEMBER</strong>
                <br>Board of Election Inspectors
            </div>
        </div>
    </div>
</body>

</html>