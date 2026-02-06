<?php

declare(strict_types=1);

namespace App\Orchid\Screens\EventTag;

use App\Models\EventTag;
use App\Orchid\Layouts\EventTag\EventTagEditLayout;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class EventTagEditScreen extends Screen
{
    public ?EventTag $tag = null;

    public function query(?EventTag $tag = null): iterable
    {
        $this->tag = $tag ?? new EventTag();
        return [
            'tag' => $this->tag,
        ];
    }

    public function name(): ?string
    {
        return $this->tag->exists ? __('Edit tag') : __('New tag');
    }

    public function description(): ?string
    {
        return __('Tags appear in the event form. Use Global for all cities.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.event-tags'];
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
                ->confirm(__('Remove this tag?'))
                ->canSee($this->tag->exists),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::block(EventTagEditLayout::class)
                ->title(__('Tag'))
                ->description(__('Slug is stored on events; label is shown to users. City optional for city-specific tags.')),
        ];
    }

    public function save(Request $request)
    {
        $request->validate([
            'tag.slug' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique('event_tags', 'slug')->where('city_id', $request->input('tag.city_id'))->ignore($this->tag->id),
            ],
            'tag.label' => ['required', 'string', 'max:255'],
            'tag.city_id' => ['nullable', 'exists:cities,id'],
        ]);
        $data = $request->get('tag');
        $data['city_id'] = $data['city_id'] ?? null;
        $this->tag->fill($data)->save();
        Toast::info(__('Tag was saved.'));
        return redirect()->route('platform.systems.event-tags');
    }

    public function remove(EventTag $tag)
    {
        $tag->delete();
        Toast::info(__('Tag was removed.'));
        return redirect()->route('platform.systems.event-tags');
    }
}
