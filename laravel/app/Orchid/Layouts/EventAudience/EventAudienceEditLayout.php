<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\EventAudience;

use App\Models\City;
use Orchid\Screen\Field;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Layouts\Rows;

class EventAudienceEditLayout extends Rows
{
    /**
     * @return Field[]
     */
    public function fields(): array
    {
        return [
            Input::make('audience.name')
                ->type('text')
                ->max(255)
                ->required()
                ->title(__('Name')),
            Input::make('audience.sort_order')
                ->type('number')
                ->value(0)
                ->title(__('Sort order')),
            Select::make('audience.city_id')
                ->fromQuery(City::query()->orderBy('name'), 'name', 'id')
                ->empty(__('Global'))
                ->title(__('City (empty = global)')),
        ];
    }
}
