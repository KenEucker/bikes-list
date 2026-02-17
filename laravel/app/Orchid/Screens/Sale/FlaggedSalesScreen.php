<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Sale;

use App\Jobs\SendModerationNotification;
use App\Models\Flag;
use App\Models\ModerationAction;
use App\Models\Sale;
use App\Orchid\Layouts\Sale\FlaggedSaleListLayout;
use Illuminate\Http\Request;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Toast;

class FlaggedSalesScreen extends Screen
{
    public function query(): iterable
    {
        $saleIds = Flag::query()
            ->where('flaggable_type', Sale::class)
            ->select('flaggable_id')
            ->distinct()
            ->pluck('flaggable_id');

        $query = Sale::query()
            ->with(['city', 'user'])
            ->withCount('flags')
            ->whereIn('id', $saleIds);

        $user = auth()->user();
        if ($user && ! $user->isGlobalModerator()) {
            $cityIds = $user->moderatedCities()->pluck('id');
            if ($cityIds->isNotEmpty()) {
                $query->whereIn('city_id', $cityIds);
            }
        }
        // Global moderators and admins (no city scope) see all flagged sales

        return [
            'sales' => $query->orderByDesc('updated_at')->paginate(),
        ];
    }

    public function name(): ?string
    {
        return __('Flagged sales');
    }

    public function description(): ?string
    {
        return __('Sales that have been flagged by users. Revert to draft or remove.');
    }

    public function permission(): ?iterable
    {
        return ['platform.moderation.flagged'];
    }

    public function layout(): iterable
    {
        return [
            FlaggedSaleListLayout::class,
        ];
    }

    public function revertToDraft(Request $request): \Illuminate\Http\RedirectResponse
    {
        $codes = array_keys(ModerationAction::reasonCodes());
        $request->validate([
            'sale' => ['required', 'exists:sales,id'],
            'reason_code' => ['nullable', 'string', 'in:' . implode(',', $codes ?: ['OTHER'])],
            'moderation_note' => ['nullable', 'string', 'max:2000'],
        ]);
        $sale = Sale::findOrFail($request->input('sale'));
        $previous = $sale->state;
        $sale->update(['state' => Sale::STATE_DRAFT]);
        $sale->unsearchable();
        $reasonCode = $request->input('reason_code') ?: 'OTHER';
        $moderationNote = $request->input('moderation_note') ?? '';
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'actor_role' => ModerationAction::actorRoleForUser($request->user()),
            'action' => 'reverted_to_draft',
            'subject_type' => Sale::class,
            'subject_id' => $sale->id,
            'reason_code' => $reasonCode,
            'moderation_note' => $moderationNote,
            'previous_state' => $previous,
            'new_state' => Sale::STATE_DRAFT,
        ]);
        $codes = ModerationAction::reasonCodes();
        $reasonLabel = $codes[$reasonCode] ?? $reasonCode;
        if ($sale->user?->email) {
            SendModerationNotification::dispatch($sale->user->email, 'Reverted to draft', 'For Sale listing', $reasonLabel, null);
        }
        Toast::info(__('Sale reverted to draft.'));
        return back();
    }

    public function remove(Request $request): \Illuminate\Http\RedirectResponse
    {
        $codes = array_keys(ModerationAction::reasonCodes());
        $request->validate([
            'sale' => ['required', 'exists:sales,id'],
            'reason_code' => ['nullable', 'string', 'in:' . implode(',', $codes ?: ['OTHER'])],
        ]);
        $sale = Sale::findOrFail($request->input('sale'));
        $previous = $sale->state;
        $sale->update(['state' => Sale::STATE_REMOVED]);
        $sale->unsearchable();
        $reasonCode = $request->input('reason_code') ?: 'OTHER';
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'actor_role' => ModerationAction::actorRoleForUser($request->user()),
            'action' => 'removed',
            'subject_type' => Sale::class,
            'subject_id' => $sale->id,
            'reason_code' => $reasonCode,
            'previous_state' => $previous,
            'new_state' => Sale::STATE_REMOVED,
        ]);
        $codes = ModerationAction::reasonCodes();
        $reasonLabel = $codes[$reasonCode] ?? $reasonCode;
        if ($sale->user?->email) {
            SendModerationNotification::dispatch($sale->user->email, 'Removed', 'For Sale listing', $reasonLabel, null);
        }
        Toast::info(__('Sale removed.'));
        return back();
    }
}
