<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Sale;

use App\Models\Flag;
use App\Models\Sale;
use App\Models\ModerationAction;
use App\Orchid\Layouts\Sale\FlaggedSaleListLayout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        if ($user && $user->moderatedCities()->exists()) {
            $cityIds = $user->moderatedCities()->pluck('id');
            $query->whereIn('city_id', $cityIds);
        }

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
        $sale = Sale::findOrFail($request->input('sale'));
        $sale->update(['state' => Sale::STATE_DRAFT]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'reverted_to_draft',
            'subject_type' => Sale::class,
            'subject_id' => $sale->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'reverted_to_draft',
            'subject_type' => Sale::class,
            'subject_id' => $sale->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Sale reverted to draft.'));
        return back();
    }

    public function remove(Request $request): \Illuminate\Http\RedirectResponse
    {
        $sale = Sale::findOrFail($request->input('sale'));
        $sale->update(['state' => Sale::STATE_REMOVED]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'removed',
            'subject_type' => Sale::class,
            'subject_id' => $sale->id,
        ]);
        Log::info('Moderation action', [
            'action' => 'removed',
            'subject_type' => Sale::class,
            'subject_id' => $sale->id,
            'user_id' => $request->user()->id,
        ]);
        Toast::info(__('Sale removed.'));
        return back();
    }
}
