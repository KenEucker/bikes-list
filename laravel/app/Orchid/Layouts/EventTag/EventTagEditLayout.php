<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\EventTag;

use App\Models\City;
use Orchid\Screen\Field;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Layouts\Rows;

class EventTagEditLayout extends Rows
{
    /**
     * @return Field[]
     */
    public function fields(): array
    {
        return [
            Input::make('tag.slug')
                ->type('text')
                ->max(100)
                ->required()
                ->title(__('Slug'))
                ->placeholder('e.g. no_drop'),
            Input::make('tag.label')
                ->type('text')
                ->max(255)
                ->required()
                ->title(__('Label'))
                ->placeholder('e.g. No-drop'),
            Select::make('tag.city_id')
                ->fromQuery(City::query()->orderBy('name'), 'name', 'id')
                ->empty(__('Global'))
                ->title(__('City (empty = global)')),
        ];
    }
}
