<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Event $event): bool
    {
        if (in_array($event->state, [Event::STATE_PUBLISHED, Event::STATE_PENDING_REVIEW])) {
            return true;
        }
        return $user && $user->id === $event->user_id;
    }

    public function create(User $user): bool
    {
        return $user->hasAccess('content.create.event');
    }

    public function update(User $user, Event $event): bool
    {
        return $user->id === $event->user_id;
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->id === $event->user_id;
    }
}
