<?php

namespace App\Policies;

use App\Models\Ride;
use App\Models\User;

class RidePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Ride $ride): bool
    {
        if ($ride->state === Ride::STATE_PUBLISHED) {
            return true;
        }
        if (! $user) {
            return false;
        }
        if ($user->id === $ride->user_id) {
            return true;
        }
        if ($ride->community_page_id && $user->managedCommunityPages()->where('community_pages.id', $ride->community_page_id)->exists()) {
            return true;
        }
        return $user->moderatedCities()->where('cities.id', $ride->city_id)->exists();
    }

    public function create(?User $user): bool
    {
        return true;
    }

    public function update(User $user, Ride $ride): bool
    {
        if ($user->id === $ride->user_id) {
            return true;
        }
        return $ride->community_page_id && $user->managedCommunityPages()->where('community_pages.id', $ride->community_page_id)->exists();
    }

    public function delete(User $user, Ride $ride): bool
    {
        return $user->id === $ride->user_id;
    }
}
