<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\CommunityPage;

use App\Models\City;
use Orchid\Screen\Field;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Layouts\Rows;

class CommunityPageEditLayout extends Rows
{
    /**
     * @return Field[]
     */
    public function fields(): array
    {
        return [
            Select::make('communityPage.city_id')
                ->fromQuery(City::query()->orderBy('name'), 'name', 'id')
                ->required()
                ->title(__('City')),
            Select::make('communityPage.type')
                ->options([
                    'bike_shop' => __('Bike shop'),
                    'club' => __('Club'),
                    'team' => __('Team'),
                    'advocacy_org' => __('Advocacy org'),
                    'co_op' => __('Co-op'),
                    'informal_group' => __('Informal group'),
                    'recurring_event' => __('Recurring event'),
                ])
                ->required()
                ->title(__('Type')),
            Input::make('communityPage.name')->required()->title(__('Name')),
            TextArea::make('communityPage.about')->title(__('About'))->rows(4),
            TextArea::make('communityPage.event_info')->title(__('Event info'))->rows(2),
            TextArea::make('communityPage.sales_info')->title(__('Sales info'))->rows(2),
            Input::make('communityPage.contact_address')->title(__('Contact address')),
            Input::make('communityPage.contact_email')->type('email')->title(__('Contact email')),
            Input::make('communityPage.contact_phone')->title(__('Contact phone')),
        ];
    }
}
