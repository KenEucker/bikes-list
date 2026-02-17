<?php

namespace Tests\Feature;

use App\Domain\Sales\Sale;
use App\Domain\Regions\Region;
use App\Domain\Auth\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SignedUploadUrlTest extends TestCase
{
    use RefreshDatabase;

    public function test_signed_upload_url_returns_correct_bucket_key_prefix(): void
    {
        $user = User::create([
            'email' => 'user@example.com',
            'status' => 'active',
        ]);

        $region = Region::create([
            'slug' => 'sf',
            'name' => 'San Francisco',
            'is_active' => true,
        ]);

        $sale = Sale::create([
            'region_id' => $region->id,
            'user_id' => $user->id,
            'title' => 'Test Sale',
            'description' => 'Test',
            'price_cents' => 10000,
            'currency' => 'USD',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->post("/api/v1/for-sale/{$sale->id}/images/upload-url");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'upload_url',
            'key',
            'expires_at',
        ]);

        $data = $response->json();
        $this->assertStringContainsString("sales/{$sale->id}/", $data['key']);
    }
}
