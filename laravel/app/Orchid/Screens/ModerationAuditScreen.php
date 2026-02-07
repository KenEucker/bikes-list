<?php

declare(strict_types=1);

namespace App\Orchid\Screens;

use App\Models\ModerationAction;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class ModerationAuditScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'actions' => ModerationAction::query()
                ->with('user:id,name')
                ->orderByDesc('created_at')
                ->paginate(50),
        ];
    }

    public function name(): ?string
    {
        return __('Moderation audit log');
    }

    public function description(): ?string
    {
        return __('Immutable log of all moderation actions. Restricted to authorized roles.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.roles'];
    }

    public function layout(): iterable
    {
        return [
            Layout::table('actions', [
                TD::make('id', __('ID'))->width('60px'),
                TD::make('created_at', __('Date'))->render(fn (ModerationAction $a) => $a->created_at->toDateTimeString()),
                TD::make('actor_role', __('Actor role')),
                TD::make('user', __('User'))->render(fn (ModerationAction $a) => $a->user?->name ?? '—'),
                TD::make('action', __('Action')),
                TD::make('subject_type', __('Content type'))->render(fn (ModerationAction $a) => class_basename($a->subject_type)),
                TD::make('subject_id', __('Content ID'))->width('80px'),
                TD::make('reason_code', __('Reason')),
                TD::make('previous_state', __('From'))->width('100px'),
                TD::make('new_state', __('To'))->width('100px'),
            ])->title(__('Moderation audit log')),
        ];
    }
}
