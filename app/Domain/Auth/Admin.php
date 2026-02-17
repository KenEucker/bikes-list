<?php

namespace App\Domain\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'email',
        'name',
        'role',
        '2fa_enabled',
        '2fa_secret',
        'recovery_codes',
    ];

    protected $hidden = [
        '2fa_secret',
        'recovery_codes',
        'remember_token',
    ];

    protected $casts = [
        '2fa_enabled' => 'boolean',
        'recovery_codes' => 'array',
    ];

    /**
     * Check if 2FA is enabled.
     */
    public function has2FAEnabled(): bool
    {
        return $this->{'2fa_enabled'} === true;
    }

    /**
     * Verify a recovery code.
     */
    public function verifyRecoveryCode(string $code): bool
    {
        $codes = $this->recovery_codes ?? [];
        $index = array_search($code, $codes);

        if ($index !== false) {
            unset($codes[$index]);
            $this->recovery_codes = array_values($codes);
            $this->save();
            return true;
        }

        return false;
    }
}
