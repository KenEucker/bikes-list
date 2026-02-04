<?php

namespace App\Policies;

use App\Models\CommunityPage;
use App\Models\User;

class CommunityPagePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, CommunityPage $page): bool
    {
        if ($page->state === CommunityPage::STATE_APPROVED) {
            return true;
        }
        return $user && ($user->id === $page->created_by_user_id || $user->managedCommunityPages()->where('community_pages.id', $page->id)->exists());
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, CommunityPage $page): bool
    {
        return $user->managedCommunityPages()->where('community_pages.id', $page->id)->exists();
    }

    public function delete(User $user, CommunityPage $page): bool
    {
        return $this->update($user, $page);
    }
}
