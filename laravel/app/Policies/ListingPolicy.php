<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Listing $listing): bool
    {
        if ($listing->state === Listing::STATE_PUBLISHED || $listing->state === Listing::STATE_SOLD) {
            return true;
        }
        return $user && ($user->id === $listing->user_id || $user->managedCommunityPages()->where('community_pages.id', $listing->community_page_id)->exists());
    }

    public function create(User $user): bool
    {
        return $user->hasAccess('content.create.listing');
    }

    public function update(User $user, Listing $listing): bool
    {
        if ($user->id === $listing->user_id) {
            return true;
        }
        return $listing->community_page_id && $user->managedCommunityPages()->where('community_pages.id', $listing->community_page_id)->exists();
    }

    public function delete(User $user, Listing $listing): bool
    {
        return $this->update($user, $listing);
    }

    public function publish(User $user, Listing $listing): bool
    {
        return $this->update($user, $listing);
    }

    public function markSold(User $user, Listing $listing): bool
    {
        return $this->update($user, $listing);
    }
}
