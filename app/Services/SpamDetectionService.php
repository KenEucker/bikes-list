<?php

namespace App\Services;

use App\Domain\Listings\Listing;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SpamDetectionService
{
    /**
     * Check a listing for spam signals.
     */
    public function checkListing(Listing $listing): array
    {
        $signals = [
            'ip_velocity' => $this->checkIPVelocity($listing),
            'repeated_content' => $this->checkRepeatedContent($listing),
            'suspicious_links' => $this->checkSuspiciousLinks($listing),
            'email_domain' => $this->checkEmailDomain($listing),
        ];

        $flagged = false;
        $suspendUser = false;

        // High risk signals
        if ($signals['ip_velocity'] > 10) {
            $flagged = true;
            $suspendUser = true;
        }

        if ($signals['repeated_content']) {
            $flagged = true;
        }

        if ($signals['suspicious_links']) {
            $flagged = true;
        }

        return [
            'flagged' => $flagged,
            'suspend_user' => $suspendUser,
            'signals' => $signals,
        ];
    }

    /**
     * Check IP velocity (listings created from same IP).
     */
    protected function checkIPVelocity(Listing $listing): int
    {
        // This would need request IP stored, simplified for now
        $key = 'spam_check:ip_velocity:' . request()->ip();
        $count = Cache::get($key, 0);
        Cache::put($key, $count + 1, now()->addHours(1));
        return $count + 1;
    }

    /**
     * Check for repeated content.
     */
    protected function checkRepeatedContent(Listing $listing): bool
    {
        $similarCount = DB::table('listings')
            ->where('id', '!=', $listing->id)
            ->where('title', $listing->title)
            ->where('user_id', '!=', $listing->user_id)
            ->count();

        return $similarCount > 0;
    }

    /**
     * Check for suspicious links in description.
     */
    protected function checkSuspiciousLinks(Listing $listing): bool
    {
        $suspiciousPatterns = [
            '/bit\.ly/',
            '/tinyurl\.com/',
            '/t\.co/',
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $listing->description)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check email domain heuristics.
     */
    protected function checkEmailDomain(Listing $listing): bool
    {
        $email = $listing->user->email;
        $domain = substr(strrchr($email, '@'), 1);

        $suspiciousDomains = [
            'tempmail.com',
            '10minutemail.com',
            'guerrillamail.com',
        ];

        return in_array($domain, $suspiciousDomains);
    }
}
