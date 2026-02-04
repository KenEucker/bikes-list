<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Guideline;

use App\Models\City;
use Orchid\Screen\Field;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Layouts\Rows;

class GuidelineEditLayout extends Rows
{
    /**
     * @return Field[]
     */
    public function fields(): array
    {
        return [
            Input::make('guideline.name')
                ->type('text')
                ->max(255)
                ->required()
                ->title(__('Name')),
            TextArea::make('guideline.body')
                ->required()
                ->title(__('Body'))
                ->rows(10),
            Select::make('guideline.scope')
                ->options([
                    'sitewide' => __('Sitewide'),
                    'city' => __('City'),
                ])
                ->required()
                ->title(__('Scope')),
            Select::make('guideline.city_id')
                ->fromQuery(City::query()->orderBy('name'), 'name', 'id')
                ->empty(__('—'))
                ->title(__('City (for city scope only)'))
                ->canSee(fn ($request) => $request->get('guideline.scope') === 'city'),
        ];
    }
}
