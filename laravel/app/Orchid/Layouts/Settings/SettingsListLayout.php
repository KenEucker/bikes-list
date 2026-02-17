<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Settings;

use App\Services\SettingsResolver;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class SettingsListLayout extends Table
{
    protected $target = 'settings';

    protected $template = 'orchid.layouts.settings-table';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('name', __('ENV Var'))
                ->render(fn (array $row) => $row['name']),

            TD::make('mapped_config', __('Mapped Config'))
                ->render(fn (array $row) => implode(', ', $row['mapped_config_keys']) ?: __('(unmapped)')),

            TD::make('effective_value_display', __('Effective Value'))
                ->render(fn (array $row) => $row['effective_value_display'] !== '' ? $row['effective_value_display'] : '—'),

            TD::make('source', __('Source'))
                ->render(fn (array $row) => $this->sourceLabel($row['source'])),

            TD::make('db_override', __('DB Override'))
                ->render(fn (array $row) => ($row['db_override_value'] ?? null) !== null && ($row['db_override_value'] ?? '') !== ''
                    ? __('Yes')
                    : '—'),

            TD::make(__('Actions'))
                ->align(TD::ALIGN_CENTER)
                ->width('120px')
                ->render(function (array $row) {
                    $canOverride = ! empty($row['mapped_config_keys']);
                    if (! $canOverride) {
                        return '—';
                    }
                    $list = [
                        ModalToggle::make(__('Edit override'))
                            ->modal('editSettingModal')
                            ->modalTitle(__('Edit override: ') . $row['name'])
                            ->method('saveOverride')
                            ->asyncParameters(['key' => $row['name']])
                            ->icon('bs.pencil'),
                    ];
                    if (($row['db_override_value'] ?? null) !== null && ($row['db_override_value'] ?? '') !== '') {
                        $list[] = Button::make(__('Clear override'))
                            ->icon('bs.trash3')
                            ->confirm(__('Clear database override for this setting? Effective value will revert to ENV or example.'))
                            ->method('clearOverride', ['key' => $row['name']]);
                    }
                    return DropDown::make()->icon('bs.three-dots-vertical')->list($list);
                }),
        ];
    }

    private function sourceLabel(string $source): string
    {
        return match ($source) {
            SettingsResolver::SOURCE_DATABASE => __('Database'),
            SettingsResolver::SOURCE_ENV => __('ENV'),
            SettingsResolver::SOURCE_EXAMPLE => __('Example'),
            SettingsResolver::SOURCE_UNKNOWN => __('Unknown'),
            default => $source,
        };
    }
}
