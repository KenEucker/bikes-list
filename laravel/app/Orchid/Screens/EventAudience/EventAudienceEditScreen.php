<?php

declare(strict_types=1);

namespace App\Orchid\Screens\EventAudience;

use App\Models\EventAudience;
use App\Orchid\Layouts\EventAudience\EventAudienceEditLayout;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class EventAudienceEditScreen extends Screen
{
    public ?EventAudience $audience = null;

    public function query(?EventAudience $audience = null): iterable
    {
        $this->audience = $audience ?? new EventAudience(['sort_order' => 0]);
        return [
            'audience' => $this->audience,
        ];
    }

    public function name(): ?string
    {
        return $this->audience->exists ? __('Edit audience') : __('New audience');
    }

    public function description(): ?string
    {
        return __('Audiences appear in the event form dropdown. Use Global for all cities.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.event-audiences'];
    }

    public function commandBar(): iterable
    {
        return [
            Button::make(__('Save'))
                ->icon('bs.check-circle')
                ->method('save'),
            Button::make(__('Remove'))
                ->icon('bs.trash3')
                ->method('remove')
                ->confirm(__('Remove this audience?'))
                ->canSee($this->audience->exists),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::block(EventAudienceEditLayout::class)
                ->title(__('Audience'))
                ->description(__('Name and optional city for city-specific audiences.')),
        ];
    }

    public function save(Request $request)
    {
        $request->validate([
            'audience.name' => ['required', 'string', 'max:255'],
            'audience.sort_order' => ['nullable', 'integer', 'min:0'],
            'audience.city_id' => ['nullable', 'exists:cities,id'],
        ]);
        $data = $request->get('audience');
        $data['city_id'] = $data['city_id'] ?? null;
        $this->audience->fill($data)->save();
        Toast::info(__('Audience was saved.'));
        return redirect()->route('platform.systems.event-audiences');
    }

    public function remove(EventAudience $audience)
    {
        $audience->delete();
        Toast::info(__('Audience was removed.'));
        return redirect()->route('platform.systems.event-audiences');
    }
}
