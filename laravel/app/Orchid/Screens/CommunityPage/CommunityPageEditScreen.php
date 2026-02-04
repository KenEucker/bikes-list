<?php

declare(strict_types=1);

namespace App\Orchid\Screens\CommunityPage;

use App\Models\CommunityPage;
use App\Models\User;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class CommunityPageEditScreen extends Screen
{
    public ?CommunityPage $communityPage = null;

    public function query(CommunityPage $communityPage): iterable
    {
        $this->communityPage = $communityPage;
        $communityPage->load(['city', 'managers']);
        $managerIds = $communityPage->managers->pluck('id')->all();
        $usersForManager = User::query()
            ->orderBy('name')
            ->when(!empty($managerIds), fn ($q) => $q->whereNotIn('id', $managerIds))
            ->limit(500)
            ->get();
        return [
            'communityPage' => $communityPage,
            'usersForManager' => $usersForManager,
        ];
    }

    public function name(): ?string
    {
        return __('Community page');
    }

    public function description(): ?string
    {
        return $this->communityPage?->name ?? __('View page');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.community-pages'];
    }

    public function commandBar(): iterable
    {
        return [
            Button::make(__('Approve'))
                ->icon('bs.check-circle')
                ->method('approve')
                ->canSee($this->communityPage->state === CommunityPage::STATE_PENDING),
            Button::make(__('Remove'))
                ->icon('bs.trash3')
                ->confirm(__('Remove this page?'))
                ->method('remove'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::view('orchid.community-page-view', [
                'communityPage' => $this->communityPage,
                'usersForManager' => $this->usersForManager ?? collect(),
            ]),
        ];
    }

    public function approve(CommunityPage $communityPage)
    {
        $communityPage->update(['state' => CommunityPage::STATE_APPROVED]);
        if (!$communityPage->managers()->where('user_id', $communityPage->created_by_user_id)->exists()) {
            $communityPage->managers()->attach($communityPage->created_by_user_id, ['role' => 'owner']);
        }
        Toast::info(__('Page approved.'));
        return back();
    }

    public function remove(CommunityPage $communityPage)
    {
        $communityPage->update(['state' => CommunityPage::STATE_REMOVED]);
        Toast::info(__('Page removed.'));
        return redirect()->route('platform.systems.community-pages');
    }

    public function addManager(Request $request)
    {
        $page = CommunityPage::findOrFail($request->input('community_page_id'));
        $userId = $request->input('user_id');
        if (!User::find($userId)) {
            Toast::error(__('User not found.'));
            return back();
        }
        $page->managers()->syncWithoutDetaching([$userId => ['role' => 'manager']]);
        Toast::info(__('User added to page.'));
        return back();
    }

    public function removeManager(Request $request)
    {
        $page = CommunityPage::findOrFail($request->input('community_page_id'));
        $page->managers()->detach($request->input('user_id'));
        Toast::info(__('User removed from page.'));
        return back();
    }
}
