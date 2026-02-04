<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Official Result - {{ $event->name }}</title>
    <style>
        @page {
            margin: 0.5in;
        }

        body {
            font-family: sans-serif;
            font-size: 11px;
            line-height: 1.3;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-left {
            text-align: left;
        }

        .font-bold {
            font-weight: bold;
        }

        .uppercase {
            text-transform: uppercase;
        }

        .italic {
            font-style: italic;
        }

        .w-full {
            width: 100%;
        }

        .mb-4 {
            margin-bottom: 1rem;
        }

        .mb-6 {
            margin-bottom: 1.5rem;
        }

        .mt-4 {
            margin-top: 1rem;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
        }

        .logo-cell {
            width: 100px;
            text-align: right;
            padding-right: 15px;
        }

        .header-text {
            text-align: center;
        }

        .school-name {
            font-family: "Times New Roman", serif;
            font-size: 16px;
            font-weight: bold;
            color: #006400;
            /* Emerald-like green */
            margin: 4px 0;
        }

        .serif {
            font-family: "Times New Roman", serif;
        }

        .old-english {
            font-family: "Old English Text MT", "Times New Roman", serif;
        }

        .result-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            font-family: "Old English Text MT", "Times New Roman", serif;
            margin-bottom: 5px;
        }

        .stats-table td {
            padding: 4px;
            font-weight: bold;
        }

        .candidates-table {
            border: 1px solid black;
            margin-bottom: 15px;
        }

        .candidates-table th,
        .candidates-table td {
            border: 1px solid black;
            padding: 4px 8px;
        }

        .candidates-table th {
            background-color: #f3f4f6;
            text-align: left;
        }

        .position-header {
            background-color: #f3f4f6;
            padding: 4px;
            border: 1px solid black;
            border-bottom: none;
            font-weight: bold;
            text-transform: uppercase;
        }

        .winner {
            color: #047857;
            font-weight: bold;
        }

        /* emerald-700 */
        .tie {
            color: #dc2626;
            font-size: 10px;
        }

        /* red-600 */
        .tie-break {
            color: #2563eb;
            font-size: 10px;
        }

        /* blue-600 */

        .signatories-table {
            margin-top: 30px;
            width: 100%;
        }

        .signatories-table td {
            vertical-align: top;
            padding: 0 10px;
            width: 33%;
            text-align: center;
        }

        .signatory-line {
            border-bottom: 1px solid black;
            width: 80%;
            margin: 0 auto 5px auto;
        }

        .footer {
            margin-top: 20px;
            border-top: 1px solid #ccc;
            padding-top: 5px;
            font-size: 10px;
            color: #9ca3af;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>
    {{-- Header --}}
    <div class="mb-6">
        <table class="header-table">
            <tr>
                <td class="logo-cell">
                    @if($system_settings && $system_settings->logo)
                    <?php
                    $logoPath = $system_settings->logo;
                    if (str_starts_with($logoPath, '/')) {
                        $logoPath = public_path($logoPath);
                    } elseif (str_starts_with($logoPath, 'http')) {
                        // Keep URL
                    } else {
                        $logoPath = public_path('storage/' . $logoPath);
                    }
                    ?>
                    <img src="{{ $logoPath }}" style="height: 80px; width: auto;" alt="Logo">
                    @else
                    {{-- Fallback Logo if needed, or just empty --}}
                    @endif
                </td>
                <td class="header-text">
                    <div class="serif" style="font-size: 13px;">REPUBLIC OF THE PHILIPPINES</div>
                    <div class="serif" style="font-size: 13px;">DEPARTMENT OF EDUCATION</div>
                    <div class="serif" style="font-size: 13px;">MIMAROPA Region</div>
                    <div class="serif" style="font-size: 13px;">Schools Division of Palawan</div>
                    <div class="school-name">SAN VICENTE NATIONAL HIGH SCHOOL</div>
                    <div class="serif italic" style="font-size: 12px;">Poblacion, San Vicente, Palawan</div>
                </td>
                <td style="width: 100px;"></td> {{-- Balance the logo --}}
            </tr>
        </table>
    </div>

    <div class="text-center mb-6">
        <div class="result-title">OFFICIAL RESULT</div>
        <div style="font-size: 12px; margin-bottom: 2px;">{{ $event->name }}</div>
        <div style="font-size: 12px;">Date of Election: {{ \Carbon\Carbon::parse($event->dateTime_start)->format('F j, Y') }}</div>
    </div>

    {{-- Stats --}}
    <table class="stats-table mb-6">
        <tr>
            <td>Total Registered Voters: {{ number_format($stats['registered_voters']) }}</td>
            <td class="text-center">Total Votes Cast: {{ number_format($stats['actual_voters']) }}</td>
            <td class="text-right">Voter Turnout: {{ $stats['turnout'] }}%</td>
        </tr>
    </table>

    {{-- Positions --}}
    @foreach($positions as $position)
    <div style="page-break-inside: avoid; margin-bottom: 15px;">
        <div class="position-header">
            {{ $position->name }} (Vote for {{ $position->max_votes }})
        </div>

        <table class="candidates-table">
            <thead>
                <tr>
                    <th style="width: 40%;">Candidate</th>
                    <th style="width: 30%;">Partylist</th>
                    <th class="text-center" style="width: 10%;">Votes</th>
                    <th class="text-center" style="width: 10%;">%</th>
                    <th class="text-center" style="width: 10%;">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($position->candidates as $index => $candidate)
                <?php
                $votes = $candidate->votes_count ?? 0;
                $percentage = $stats['actual_voters'] > 0
                    ? number_format(($votes / $stats['actual_voters']) * 100, 2)
                    : "0.00";

                $lastWinnerIndex = $position->max_votes - 1;
                $firstLoserIndex = $position->max_votes;

                $lastWinnerVotes = isset($position->candidates[$lastWinnerIndex]) ? ($position->candidates[$lastWinnerIndex]->votes_count ?? 0) : 0;
                $firstLoserVotes = isset($position->candidates[$firstLoserIndex]) ? ($position->candidates[$firstLoserIndex]->votes_count ?? 0) : 0;

                $isTieForLastSpot = $position->candidates->count() > $position->max_votes &&
                    $lastWinnerVotes > 0 &&
                    $lastWinnerVotes === $firstLoserVotes;

                $isTied = $isTieForLastSpot && $votes === $lastWinnerVotes;

                if ($candidate->is_tie_breaker_winner) {
                    $isTied = false;
                } elseif ($isTieForLastSpot && $votes === $lastWinnerVotes) {
                    // Check if there's a tie breaker winner in the group
                    $hasTieBreakerWinner = $position->candidates->where('votes_count', $lastWinnerVotes)->where('is_tie_breaker_winner', true)->isNotEmpty();
                    if ($hasTieBreakerWinner) {
                        $isTied = false;
                    }
                }

                $isWinner = $index < $position->max_votes || $candidate->is_tie_breaker_winner;
                ?>
                <tr>
                    <td class="uppercase">{{ $index + 1 }}. {{ $candidate->name }}</td>
                    <td class="uppercase">{{ $candidate->partylist->name ?? 'INDEPENDENT' }}</td>
                    <td class="text-center">{{ number_format($votes) }}</td>
                    <td class="text-center">{{ $percentage }}%</td>
                    <td class="text-center">
                        @if($isWinner)
                        <span class="winner">WINNER</span>
                        @endif
                        @if($candidate->is_tie_breaker_winner)
                        <span class="tie-break">(TIE BREAK)</span>
                        @endif
                        @if($isTied)
                        <span class="tie">(TIE)</span>
                        @endif
                    </td>
                </tr>
                @endforeach

                {{-- Abstentions --}}
                @if($type !== 'winners')
                <?php
                $abstentions = $stats['actual_voters'] - ($position->votes_cast_count ?? 0);
                $abstentionPercent = $stats['actual_voters'] > 0
                    ? number_format(($abstentions / $stats['actual_voters']) * 100, 2)
                    : "0.00";
                ?>
                <tr style="background-color: #f9fafb; font-weight: bold; font-size: 10px;">
                    <td colspan="2" class="text-right uppercase">Abstentions / Undervotes</td>
                    <td class="text-center">{{ $abstentions }}</td>
                    <td class="text-center">{{ $abstentionPercent }}%</td>
                    <td></td>
                </tr>
                @endif

                @if($position->candidates->isEmpty())
                <tr>
                    <td colspan="5" class="text-center italic" style="padding: 10px;">No candidates for this position.</td>
                </tr>
                @endif
            </tbody>
        </table>
    </div>
    @endforeach

    {{-- Signatories --}}
    <div class="mt-4" style="page-break-inside: avoid;">
        <div class="font-bold uppercase mb-4" style="font-size: 10px;">Certified Correct:</div>

        <table class="signatories-table">
            <tr>
                @forelse($signatories as $signatory)
                <td>
                    <div class="signatory-line"></div>
                    <div class="font-bold uppercase">{{ $signatory->name }}</div>
                    <div class="font-bold uppercase" style="font-size: 10px; color: #4b5563;">{{ $signatory->position }}</div>
                    @if($signatory->description)
                    <div style="font-size: 10px; color: #6b7280; font-style: italic;">{{ $signatory->description }}</div>
                    @endif
                </td>
                @if(($loop->index + 1) % 3 == 0 && !$loop->last)
            </tr>
            <tr>
                <td colspan="3" style="height: 20px;"></td>
            </tr>
            <tr>
                @endif
                @empty
                <td>
                    <div class="signatory-line"></div>
                    <div class="font-bold uppercase">Election Committee Head</div>
                </td>
                <td>
                    <div class="signatory-line"></div>
                    <div class="font-bold uppercase">School Administrator</div>
                </td>
                <td></td>
                @endforelse
            </tr>
        </table>
    </div>

    <div class="footer">
        <table style="width: 100%;">
            <tr>
                <td class="text-left">Generated by {{ $system_settings->name ?? 'System' }}</td>
                <td class="text-right">Date Printed: {{ now()->toDateTimeString() }}</td>
            </tr>
        </table>
    </div>
</body>

</html>