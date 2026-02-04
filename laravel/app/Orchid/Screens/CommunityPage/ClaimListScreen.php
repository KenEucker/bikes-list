<?php

declare(strict_types=1);

namespace App\Orchid\Screens\CommunityPage;

use App\Models\CommunityPageClaim;
use App\Models\ModerationAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Toast;

class ClaimListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'claims' => CommunityPageClaim::query()
                ->with(['communityPage.city', 'user'])
                ->where('status', CommunityPageClaim::STATUS_PENDING)
                ->orderByDesc('created_at')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Page claim requests');
    }

    public function description(): ?string
    {
        return __('Approve or reject requests to manage community pages.');
    }

    public function permission(): ?iterable
    {
        return ['platform.moderation.claims'];
    }

    public function layout(): iterable
    {
        return [
            \Orchid\Support\Facades\Layout::table('claims', [
                TD::make('id')->width('80px'),
                TD::make('communityPage', __('Page'))->render(fn (CommunityPageClaim $c) => $c->communityPage?->name),
                TD::make('city', __('City'))->render(fn (CommunityPageClaim $c) => $c->communityPage?->city?->name),
                TD::make('user', __('User'))->render(fn (CommunityPageClaim $c) => $c->user?->name),
                TD::make('message')->render(fn (CommunityPageClaim $c) => \Illuminate\Support\Str::limit($c->message, 80)),
                TD::make(__('Actions'))->render(fn (CommunityPageClaim $c) => \Orchid\Screen\Actions\DropDown::make()
                    ->icon('bs.three-dots-vertical')
                    ->list([
                        Button::make(__('Approve'))->icon('bs.check')->method('approve', ['claim' => $c->id]),
                        Button::make(__('Reject'))->icon('bs.x')->method('reject', ['claim' => $c->id]),
                    ])),
            ]),
        ];
    }

    public function approve(Request $request)
    {
        $claim = CommunityPageClaim::findOrFail($request->input('claim'));
        $claim->update([
            'status' => CommunityPageClaim::STATUS_APPROVED,
            'reviewed_by_user_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);
        $claim->communityPage->managers()->syncWithoutDetaching([$claim->user_id => ['role' => 'manager']]);
        $claim->communityPage->update(['claimed_by_user_id' => $claim->user_id]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'claim_approved',
            'subject_type' => CommunityPageClaim::class,
            'subject_id' => $claim->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'claim_approved',
            'subject_type' => CommunityPageClaim::class,
            'subject_id' => $claim->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Claim approved.'));
        return back();
    }

    public function reject(Request $request)
    {
        $claim = CommunityPageClaim::findOrFail($request->input('claim'));
        $claim->update([
            'status' => CommunityPageClaim::STATUS_REJECTED,
            'reviewed_by_user_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'claim_rejected',
            'subject_type' => CommunityPageClaim::class,
            'subject_id' => $claim->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'claim_rejected',
            'subject_type' => CommunityPageClaim::class,
            'subject_id' => $claim->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Claim rejected.'));
        return back();
    }
}
