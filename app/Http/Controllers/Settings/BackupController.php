<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class BackupController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/Backup');
    }

    public function download()
    {
        $filename = 'backup-' . Carbon::now()->format('Y-m-d-H-i-s') . '.sql';
        $path = storage_path('app/' . $filename);

        // Database configuration
        $dbName = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $host = env('DB_HOST');

        // Common paths for mysqldump in XAMPP/Windows
        $dumpBinaryPath = 'mysqldump'; // Default if in PATH
        if (file_exists('C:\xampp\mysql\bin\mysqldump.exe')) {
            $dumpBinaryPath = 'C:\xampp\mysql\bin\mysqldump.exe';
        }

        // Build command
        // --column-statistics=0 is often needed for newer mysqldump versions connecting to older mariadb/mysql
        $command = "\"{$dumpBinaryPath}\" --user=\"{$username}\" --password=\"{$password}\" --host=\"{$host}\" --column-statistics=0 {$dbName} > \"{$path}\"";

        // If password is empty, don't include the flag (or it prompts)
        if (empty($password)) {
            $command = "\"{$dumpBinaryPath}\" --user=\"{$username}\" --host=\"{$host}\" --column-statistics=0 {$dbName} > \"{$path}\"";
        }

        try {
            // Using exec for simplicity in Windows environment where Process might have path issues
            exec($command, $output, $returnVar);

            // Fallback without column-statistics if it fails (older mysqldump)
            if ($returnVar !== 0) {
                $command = str_replace('--column-statistics=0 ', '', $command);
                exec($command, $output, $returnVar);
            }

            if ($returnVar !== 0) {
                Log::error("Backup failed with code $returnVar", ['output' => $output]);
                return back()->withErrors(['error' => 'Backup generation failed. Please check server logs or ensure mysqldump is accessible.']);
            }

            return response()->download($path)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Backup failed: ' . $e->getMessage()]);
        }
    }

    public function reset(Request $request)
    {
        $request->validate([
            'action' => 'required|string|in:clear_votes,reset_voters_status,delete_voters'
        ]);

        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            if ($request->action === 'clear_votes') {
                DB::table('votes')->truncate();
                if (Schema::hasTable('vote_activity_logs')) {
                    DB::table('vote_activity_logs')->truncate();
                }
                $message = 'All votes and activity logs have been cleared.';
            } elseif ($request->action === 'reset_voters_status') {
                \App\Models\Voter::query()->update(['is_active' => false]);
                $message = 'All voters have been deactivated.';
            } elseif ($request->action === 'delete_voters') {
                // Also need to clear votes first usually, but with FK checks off truncate works, 
                // but we should probably clear votes too to avoid orphans if we care about integrity later
                DB::table('votes')->truncate();
                DB::table('voters')->truncate();
                $message = 'All voters and their votes have been deleted.';
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            return back()->with('success', $message);
        } catch (\Exception $e) {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            return back()->withErrors(['error' => 'Reset failed: ' . $e->getMessage()]);
        }
    }
}
