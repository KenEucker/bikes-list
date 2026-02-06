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
        if ($event->state === Event::STATE_PUBLISHED) {
            return true;
        }
        if (! $user) {
            return false;
        }
        if ($user->id === $event->user_id) {
            return true;
        }
        if ($event->community_page_id && $user->managedCommunityPages()->where('community_pages.id', $event->community_page_id)->exists()) {
            return true;
        }
        return $user->moderatedCities()->where('cities.id', $event->city_id)->exists();
    }

    public function create(?User $user): bool
    {
        return true;
    }

    public function update(User $user, Event $event): bool
    {
        if ($user->id === $event->user_id) {
            return true;
        }
        return $event->community_page_id && $user->managedCommunityPages()->where('community_pages.id', $event->community_page_id)->exists();
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->id === $event->user_id;
    }
}
