<?php

declare(strict_types=1);

namespace App\Orchid\Screens\CommunityPage;

use App\Models\CommunityPage;
use App\Orchid\Layouts\CommunityPage\CommunityPageEditLayout;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
        $input = $request->validate([
            'communityPage.city_id' => ['required', 'exists:cities,id'],
            'communityPage.type' => ['required', 'in:bike_shop,club,team,advocacy_org,co_op,informal_group,recurring_event'],
            'communityPage.name' => ['required', 'string', 'max:255'],
            'communityPage.about' => ['nullable', 'string'],
            'communityPage.event_info' => ['nullable', 'string'],
            'communityPage.sales_info' => ['nullable', 'string'],
            'communityPage.contact_address' => ['nullable', 'string', 'max:255'],
            'communityPage.contact_email' => ['nullable', 'email'],
            'communityPage.contact_phone' => ['nullable', 'string', 'max:50'],
        ]);
        $data = $input['communityPage'];
        $name = $data['name'];
        $slug = Str::slug($name ?: 'page') . '-' . uniqid();
        $page = CommunityPage::create([
            'city_id' => (int) $data['city_id'],
            'type' => $data['type'],
            'name' => $name,
            'slug' => $slug,
            'about' => $data['about'] ?? null,
            'event_info' => $data['event_info'] ?? null,
            'sales_info' => $data['sales_info'] ?? null,
            'contact_address' => $data['contact_address'] ?? null,
            'contact_email' => $data['contact_email'] ?? null,
            'contact_phone' => $data['contact_phone'] ?? null,
            'state' => CommunityPage::STATE_APPROVED,
            'created_by_user_id' => $request->user()->id,
        ]);
        $page->update(['slug' => Str::slug($name) . '-' . $page->id]);
        Toast::info(__('Community page created.'));
        return redirect()->route('platform.systems.community-pages');
    }
}
