<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Settings;

use App\Services\SettingsValueCaster;
use Orchid\Screen\Field;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Layouts\Rows;

class SettingsEditLayout extends Rows
{
    /**
     * @return Field[]
     */
    public function fields(): array
    {
        $types = [
            SettingsValueCaster::TYPE_STRING => __('String'),
            SettingsValueCaster::TYPE_BOOLEAN => __('Boolean'),
            SettingsValueCaster::TYPE_INTEGER => __('Integer'),
            SettingsValueCaster::TYPE_FLOAT => __('Float'),
            SettingsValueCaster::TYPE_JSON => __('JSON'),
        ];

        return [
            Input::make('setting_key')
                ->type('hidden'),

            Input::make('setting_key_display')
                ->title(__('ENV var'))
                ->value($this->query->get('setting_key', ''))
                ->disabled(),

            Input::make('setting_mapped_config')
                ->title(__('Mapped config key(s)'))
                ->disabled()
                ->placeholder('—'),

            Select::make('setting_type')
                ->title(__('Type'))
                ->options($types)
                ->value($this->query->get('setting_type', 'string')),

            Input::make('setting_value')
                ->title(__('Value'))
                ->placeholder(__('Enter override value'))
                ->value($this->query->get('setting_value', '')),
        ];
    }
}
