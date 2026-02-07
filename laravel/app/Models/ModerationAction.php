<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ModerationAction extends Model
{
    public const ACTOR_ROLE_MODERATOR = 'moderator';
    public const ACTOR_ROLE_GLOBAL_MODERATOR = 'global_moderator';
    public const ACTOR_ROLE_ADMIN = 'admin';

    protected $fillable = [
        'user_id',
        'actor_role',
        'action',
        'subject_type',
        'subject_id',
        'reason_code',
        'moderation_note',
        'reason',
        'metadata',
        'previous_state',
        'new_state',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public static function actorRoleForUser(?User $user): string
    {
        if (! $user) {
            return self::ACTOR_ROLE_MODERATOR;
        }
        if (method_exists($user, 'hasAccess') && $user->hasAccess('platform.systems.roles')) {
            return self::ACTOR_ROLE_ADMIN;
        }
        if ($user->isGlobalModerator()) {
            return self::ACTOR_ROLE_GLOBAL_MODERATOR;
        }
        return self::ACTOR_ROLE_MODERATOR;
    }

    public static function reasonCodes(): array
    {
        return config('moderation.reason_codes', []);
    }
}
