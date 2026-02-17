<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\City;

use Orchid\Screen\Field;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Layouts\Rows;

class CityEditLayout extends Rows
{
    /**
     * @return Field[]
     */
    public function fields(): array
    {
        return [
            Input::make('city.name')
                ->type('text')
                ->max(255)
                ->required()
                ->title(__('Name'))
                ->placeholder(__('e.g. Austin')),

            Input::make('city.slug')
                ->type('text')
                ->max(255)
                ->required()
                ->title(__('Slug'))
                ->placeholder(__('e.g. austin'))
                ->help(__('Used in the URL: slug.localhost. Lowercase letters, numbers and hyphens only.')),

            TextArea::make('city.description')
                ->title(__('Description'))
                ->placeholder(__('Short description for the city directory.'))
                ->rows(3),
        ];
    }
}
