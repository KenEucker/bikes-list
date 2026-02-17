<?php

namespace App\Policies;

use App\Domain\Auth\User;
use App\Domain\Sales\Sale;

class SalePolicy
{
    /**
     * Determine if the user can update the sale.
     */
    public function update(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id;
    }

    /**
     * Determine if the user can delete the sale.
     */
    public function delete(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id;
    }
}
