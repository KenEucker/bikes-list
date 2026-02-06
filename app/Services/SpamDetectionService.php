<?php

namespace App\Services;

use App\Domain\Sales\Sale;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SpamDetectionService
{
    /**
     * Check a sale for spam signals.
     */
    public function checkSale(Sale $sale): array
    {
        $signals = [
            'ip_velocity' => $this->checkIPVelocity($sale),
            'repeated_content' => $this->checkRepeatedContent($sale),
            'suspicious_links' => $this->checkSuspiciousLinks($sale),
            'email_domain' => $this->checkEmailDomain($sale),
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
     * Check IP velocity (sales created from same IP).
     */
    protected function checkIPVelocity(Sale $sale): int
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
    protected function checkRepeatedContent(Sale $sale): bool
    {
        $similarCount = DB::table('sales')
            ->where('id', '!=', $sale->id)
            ->where('title', $sale->title)
            ->where('user_id', '!=', $sale->user_id)
            ->count();

        return $similarCount > 0;
    }

    /**
     * Check for suspicious links in description.
     */
    protected function checkSuspiciousLinks(Sale $sale): bool
    {
        $suspiciousPatterns = [
            '/bit\.ly/',
            '/tinyurl\.com/',
            '/t\.co/',
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $sale->description)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check email domain heuristics.
     */
    protected function checkEmailDomain(Sale $sale): bool
    {
        $email = $sale->user->email;
        $domain = substr(strrchr($email, '@'), 1);

        $suspiciousDomains = [
            'tempmail.com',
            '10minutemail.com',
            'guerrillamail.com',
        ];

        return in_array($domain, $suspiciousDomains);
    }
}
