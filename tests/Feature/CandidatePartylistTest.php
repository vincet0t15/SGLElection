<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Event;
use App\Models\Position;
use App\Models\YearLevel;
use App\Models\YearSection;
use App\Models\Partylist;
use App\Models\Candidate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CandidatePartylistTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_can_be_created_with_partylist()
    {
        $user = User::create([
            'name' => 'Test Admin',
            'username' => 'admin',
            'email_verified_at' => now(),
            'password' => 'password',
            'role' => 'admin',
            'is_active' => true,
        ]);
        $this->actingAs($user);

        $event = Event::create([
            'name' => 'Test Event',
            'description' => 'Test Description',
            'dateTime_start' => now(),
            'dateTime_end' => now()->addDays(1),
            'is_active' => true,
        ]);

        $yearLevel = YearLevel::create(['name' => 'Grade 11']);
        $section = YearSection::create(['name' => 'Section A', 'year_level_id' => $yearLevel->id]);

        $position = Position::create([
            'name' => 'President',
            'max_votes' => 1,
            'event_id' => $event->id,
        ]);

        $partylist = Partylist::create([
            'name' => 'Test Partylist',
            'description' => 'Test Description',
            'event_id' => $event->id,
        ]);

        $response = $this->post(route('candidate.store'), [
            'name' => 'John Doe',
            'year_level_id' => $yearLevel->id,
            'year_section_id' => $section->id,
            'event_id' => $event->id,
            'position_id' => $position->id,
            'partylist_id' => $partylist->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('candidates', [
            'name' => 'John Doe',
            'partylist_id' => $partylist->id,
        ]);
    }

    public function test_candidate_can_be_updated_with_partylist()
    {
        $user = User::create([
            'name' => 'Test Admin 2',
            'username' => 'admin2',
            'email_verified_at' => now(),
            'password' => 'password',
            'role' => 'admin',
            'is_active' => true,
        ]);
        $this->actingAs($user);

        $event = Event::create([
            'name' => 'Test Event',
            'description' => 'Test Description',
            'dateTime_start' => now(),
            'dateTime_end' => now()->addDays(1),
            'is_active' => true,
        ]);

        $yearLevel = YearLevel::create(['name' => 'Grade 11']);
        $section = YearSection::create(['name' => 'Section A', 'year_level_id' => $yearLevel->id]);

        $position = Position::create([
            'name' => 'President',
            'max_votes' => 1,
            'event_id' => $event->id,
        ]);

        $partylist1 = Partylist::create([
            'name' => 'Partylist 1',
            'description' => 'Desc 1',
            'event_id' => $event->id,
        ]);

        $partylist2 = Partylist::create([
            'name' => 'Partylist 2',
            'description' => 'Desc 2',
            'event_id' => $event->id,
        ]);

        $candidate = Candidate::create([
            'name' => 'Jane Doe',
            'year_level_id' => $yearLevel->id,
            'year_section_id' => $section->id,
            'event_id' => $event->id,
            'position_id' => $position->id,
            'partylist_id' => $partylist1->id,
        ]);

        // Use POST because the route is defined as Route::post
        $response = $this->post(route('candidate.update', $candidate->id), [
            'name' => 'Jane Doe Updated',
            'year_level_id' => $yearLevel->id,
            'year_section_id' => $section->id,
            'event_id' => $event->id,
            'position_id' => $position->id,
            'partylist_id' => $partylist2->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('candidates', [
            'id' => $candidate->id,
            'name' => 'Jane Doe Updated',
            'partylist_id' => $partylist2->id,
        ]);
    }
}
