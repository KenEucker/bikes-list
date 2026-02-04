<?php

declare(strict_types=1);

namespace App\Orchid\Screens\CommunityPage;

use App\Models\CommunityPage;
use App\Orchid\Layouts\CommunityPage\CommunityPageEditLayout;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class CommunityPageCreateScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'communityPage' => new CommunityPage(['state' => CommunityPage::STATE_APPROVED]),
        ];
    }

    public function name(): ?string
    {
        return __('New community page');
    }

    public function description(): ?string
    {
        return __('Create a page as moderator (approved by default).');
    }

    public function permission(): ?iterable
    {
        return ['platform.systems.community-pages'];
    }

    public function commandBar(): iterable
    {
        return [
            Button::make(__('Create'))
                ->icon('bs.check-circle')
                ->method('save'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::block(CommunityPageEditLayout::class)->title(__('Page')),
        ];
    }

    public function save(Request $request)
    {
        $request->validate([
            'communityPage.city_id' => ['required', 'exists:cities,id'],
            'communityPage.type' => ['required', 'in:bike_shop,club,recurring_event'],
            'communityPage.name' => ['required', 'string', 'max:255'],
            'communityPage.about' => ['nullable', 'string'],
            'communityPage.event_info' => ['nullable', 'string'],
            'communityPage.sales_info' => ['nullable', 'string'],
            'communityPage.contact_address' => ['nullable', 'string', 'max:255'],
            'communityPage.contact_email' => ['nullable', 'email'],
            'communityPage.contact_phone' => ['nullable', 'string', 'max:50'],
        ]);
        $data = $request->get('communityPage');
        $data['state'] = CommunityPage::STATE_APPROVED;
        $data['created_by_user_id'] = $request->user()->id;
        CommunityPage::create($data);
        Toast::info(__('Community page created.'));
        return redirect()->route('platform.systems.community-pages');
    }
}
