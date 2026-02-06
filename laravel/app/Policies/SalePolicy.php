<?php

namespace App\Policies;

use App\Models\Sale;
use App\Models\User;

class SalePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Sale $sale): bool
    {
        if ($sale->state === Sale::STATE_PUBLISHED || $sale->state === Sale::STATE_SOLD) {
            return true;
        }
        if (! $user) {
            return false;
        }
        if ($user->id === $sale->user_id) {
            return true;
        }
        if ($sale->community_page_id && $user->managedCommunityPages()->where('community_pages.id', $sale->community_page_id)->exists()) {
            return true;
        }
        return $user->moderatedCities()->where('cities.id', $sale->city_id)->exists();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Sale $sale): bool
    {
        if ($user->id === $sale->user_id) {
            return true;
        }
        return $sale->community_page_id && $user->managedCommunityPages()->where('community_pages.id', $sale->community_page_id)->exists();
    }

    public function delete(User $user, Sale $sale): bool
    {
        return $this->update($user, $sale);
    }

    public function publish(User $user, Sale $sale): bool
    {
        return $this->update($user, $sale);
    }

    public function markSold(User $user, Sale $sale): bool
    {
        return $this->update($user, $sale);
    }
}
