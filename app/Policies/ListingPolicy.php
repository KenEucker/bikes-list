<?php

namespace App\Policies;

use App\Domain\Auth\User;
use App\Domain\Listings\Listing;

class ListingPolicy
{
    /**
     * Determine if the user can update the listing.
     */
    public function update(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }

    /**
     * Determine if the user can delete the listing.
     */
    public function delete(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }
}
