<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Sale;

use App\Models\Sale;
use App\Models\SaleRelayAddress;
use App\Models\ModerationAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class SaleEditScreen extends Screen
{
    public ?Sale $sale = null;

    public function query(Sale $sale): iterable
    {
        $this->sale = $sale;
        $sale->load(['city', 'user', 'communityPage', 'relayAddress', 'uploads']);
        return [
            'sale' => $sale,
        ];
    }

    public function name(): ?string
    {
        return __('Sale');
    }

    public function description(): ?string
    {
        return $this->sale?->title ?? __('View sale');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.sales'];
    }

    public function commandBar(): iterable
    {
        return [
            Button::make(__('Approve / Publish'))
                ->icon('bs.check-circle')
                ->method('approve')
                ->canSee(in_array($this->sale->state, [Sale::STATE_DRAFT, Sale::STATE_PENDING_REVIEW])),
            Button::make(__('Revert to draft'))
                ->icon('bs.arrow-counterclockwise')
                ->method('revertToDraft')
                ->canSee($this->sale->state === Sale::STATE_PUBLISHED),
            Button::make(__('Remove'))
                ->icon('bs.trash3')
                ->confirm(__('Remove this sale from public view?'))
                ->method('remove'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::view('orchid.sale-view', ['sale' => $this->sale]),
        ];
    }

    public function approve(Request $request, Sale $sale)
    {
        $sale->update([
            'state' => Sale::STATE_PUBLISHED,
            'published_at' => now(),
        ]);
        $sale->searchable();
        if (! $sale->relayAddress) {
            SaleRelayAddress::create([
                'sale_id' => $sale->id,
                'token' => SaleRelayAddress::generateToken(),
            ]);
        }
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'action' => 'approved',
            'subject_type' => Sale::class,
            'subject_id' => $sale->id,
        ]);
        Toast::success(__('Sale approved and published.'));
        return back();
    }

    public function revertToDraft(Request $request, Sale $sale)
    {
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

    public function remove(Request $request, Sale $sale)
    {
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
        return redirect()->route('platform.systems.sales');
    }
}
