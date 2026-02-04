<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Guideline;

use App\Models\Guideline;
use App\Orchid\Layouts\Guideline\GuidelineEditLayout;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class GuidelineEditScreen extends Screen
{
    public ?Guideline $guideline = null;

    public function query(?Guideline $guideline = null): iterable
    {
        if ($guideline) {
            $this->guideline = $guideline;
        } elseif (request()->has('copy_from')) {
            $source = Guideline::find(request('copy_from'));
            $this->guideline = $source ? new Guideline(array_merge($source->only(['name', 'body', 'scope', 'city_id']), ['published_at' => now()])) : new Guideline(['scope' => Guideline::SCOPE_SITEWIDE, 'published_at' => now()]);
        } else {
            $this->guideline = new Guideline([
                'scope' => Guideline::SCOPE_SITEWIDE,
                'published_at' => now(),
            ]);
        }
        return [
            'guideline' => $this->guideline,
        ];
    }

    public function name(): ?string
    {
        return $this->guideline->exists ? __('Edit guideline') : __('New guideline');
    }

    public function description(): ?string
    {
        return __('Guidelines are versioned. To update, create a new version and archive the old one.');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.guidelines'];
    }

    public function commandBar(): iterable
    {
        return [
            Button::make(__('Save'))
                ->icon('bs.check-circle')
                ->method('save')
                ->canSee(!$this->guideline->exists),
            \Orchid\Screen\Actions\Link::make(__('Create new version'))
                ->icon('bs.plus-circle')
                ->href(route('platform.systems.guidelines.create') . '?copy_from=' . $this->guideline->id)
                ->canSee($this->guideline->exists),
            Button::make(__('Archive'))
                ->icon('bs.archive')
                ->confirm(__('Archive this guideline? It will no longer be shown as active.'))
                ->method('archive')
                ->canSee($this->guideline->exists && !$this->guideline->archived_at),
        ];
    }

    public function layout(): iterable
    {
        if ($this->guideline->exists) {
            return [
                Layout::view('orchid.guideline-view', ['guideline' => $this->guideline]),
            ];
        }
        return [
            Layout::block(GuidelineEditLayout::class)
                ->title(__('Guideline'))
                ->description(__('City is required when scope is city.')),
        ];
    }

    public function save(Request $request)
    {
        $request->validate([
            'guideline.name' => ['required', 'string', 'max:255'],
            'guideline.body' => ['required', 'string'],
            'guideline.scope' => ['required', 'in:sitewide,city'],
            'guideline.city_id' => ['nullable', 'required_if:guideline.scope,city', 'exists:cities,id'],
            'guideline.published_at' => ['required', 'date'],
        ]);
        $data = $request->get('guideline');
        if (($data['scope'] ?? '') === 'sitewide') {
            $data['city_id'] = null;
        }
        $data['published_at'] = $data['published_at'] ?? now();
        Guideline::create($data);
        Toast::info(__('Guideline was saved.'));
        return redirect()->route('platform.systems.guidelines');
    }

    public function archive(Guideline $guideline)
    {
        $guideline->update(['archived_at' => now()]);
        Toast::info(__('Guideline archived.'));
        return redirect()->route('platform.systems.guidelines');
    }
}
