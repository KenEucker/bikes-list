<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Event;
use App\Models\EventAudience;
use App\Models\EventGuidelineAcceptance;
use App\Models\EventTag;
use App\Models\Guideline;
use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        $events = Event::query()
            ->where('city_id', $city->id)
            ->where('state', Event::STATE_PUBLISHED)
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            })
            ->with('user:id,name')
            ->orderBy('starts_at')
            ->paginate(15);

        return Inertia::render('Events/Index', [
            'city' => $city,
            'events' => $events,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => self::cityBaseUrl($request, $citySlug),
        ]);
    }

    public function show(string $citySlug, Event $event): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($event->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('view', $event);
        $event->load(['user', 'city', 'communityPage', 'associatedCommunityPages', 'uploads', 'audience']);

        $relayAddress = $event->organizer_email_hidden ? null : $event->organizer_email;
        $cityBaseUrl = self::cityBaseUrl(request(), $citySlug);
        $reportRelayDomain = parse_url($cityBaseUrl, PHP_URL_HOST) ?? parse_url(config('app.url'), PHP_URL_HOST);
        $moderatorRelayEmail = 'report-event-' . $event->id . '@' . $reportRelayDomain;

        $eventTags = EventTag::forCity($city->id)->get()->mapWithKeys(fn ($t) => [$t->slug => $t->label])->all();

        return Inertia::render('Events/Show', [
            'city' => $city,
            'event' => $event,
            'eventTags' => $eventTags,
            'organizerRelayEmail' => $relayAddress,
            'moderatorRelayEmail' => $moderatorRelayEmail,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }

    public function create(Request $request, string $citySlug): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        Gate::authorize('create', Event::class);
        $guidelines = Guideline::query()->active()->forCity($city->id)->orderByRaw("scope = 'sitewide' DESC")->orderBy('published_at')->get();
        $user = $request->user();
        $managedPages = $user ? $user->managedCommunityPages()->where('community_pages.city_id', $city->id)->where('community_pages.state', 'approved')->get() : collect();
        $audiences = EventAudience::forCity($city->id)->get()->mapWithKeys(fn ($a) => [$a->id => $a->name])->all();
        $eventTags = EventTag::forCity($city->id)->get()->mapWithKeys(fn ($t) => [$t->slug => $t->label])->all();
        $defaultAudienceId = EventAudience::whereNull('city_id')->where('name', 'All Welcome')->value('id');

        $errors = $request->session()->get('errors');
        $errorBag = $errors && $errors->hasBag('default') ? $errors->getBag('default')->toArray() : [];

        return Inertia::render('Events/Create', [
            'city' => $city,
            'guidelines' => $guidelines,
            'managedCommunityPages' => $managedPages,
            'audiences' => $audiences,
            'defaultAudienceId' => $defaultAudienceId,
            'eventTags' => $eventTags,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => self::cityBaseUrl($request, $citySlug),
            'errors' => $errorBag,
            'old' => $request->old(),
        ]);
    }

    public function store(Request $request, string $citySlug): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        Gate::authorize('create', Event::class);
        $user = $request->user();
        $allowedTagSlugs = EventTag::forCity($city->id)->pluck('slug')->all();
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'organizer_name' => ['required', 'string', 'max:255'],
            'organizer_email' => [($user ? 'nullable' : 'required'), 'string', 'email', 'max:255'],
            'organizer_email_hidden' => ['boolean'],
            'location_name' => ['required', 'string', 'max:255'],
            'location_address' => ['required', 'string', 'max:500'],
            'location_details' => ['nullable', 'string'],
            'route_description' => ['nullable', 'string'],
            'route_link' => ['nullable', 'string', 'url', 'max:500'],
            'route_length' => ['nullable', 'string', 'max:100'],
            'is_loop' => ['boolean'],
            'external_link' => ['nullable', 'string', 'url', 'max:500'],
            'audience_id' => ['nullable', 'exists:event_audiences,id'],
            'community_page_id' => ['nullable', 'exists:community_pages,id'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'duration_hours' => ['nullable', 'numeric', 'min:0', 'max:168'],
            'timezone' => ['nullable', 'string', 'max:50'],
            'time_details' => ['nullable', 'string', 'max:500'],
            'is_recurring' => ['boolean'],
            'recurrence_ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'in:' . implode(',', $allowedTagSlugs)],
            'guidelines_accepted' => ['required', 'accepted'],
            'guideline_ids' => ['required', 'array'],
            'guideline_ids.*' => ['exists:guidelines,id'],
            'upload_ids' => ['nullable', 'array', 'max:1'],
            'upload_ids.*' => ['uuid', 'exists:uploads,id'],
        ];
        $request->validate($rules);
        $data = $request->only([
            'name', 'description', 'organizer_name', 'organizer_email_hidden',
            'location_name', 'location_address', 'location_details',
            'route_description', 'route_link', 'route_length', 'is_loop', 'external_link',
            'audience_id', 'starts_at', 'ends_at', 'timezone', 'time_details',
            'is_recurring', 'recurrence_ends_at', 'tags',
        ]);
        if (empty($data['ends_at']) && $request->filled('duration_hours') && $request->input('duration_hours') > 0) {
            $start = \Carbon\Carbon::parse($data['starts_at']);
            $data['ends_at'] = $start->addHours((float) $request->input('duration_hours'))->toDateTimeString();
        }
        if (empty($data['ends_at'])) {
            $data['ends_at'] = null;
        }
        $data['city_id'] = $city->id;
        $data['user_id'] = $user?->id;
        $data['organizer_email'] = $user ? $user->email : $request->input('organizer_email');
        $data['community_page_id'] = $request->input('community_page_id') ?: null;
        $data['guidelines_accepted_at'] = now();
        $data['state'] = Event::STATE_PENDING_REVIEW;
        $data['submitted_at'] = now();
        $event = Event::create($data);
        foreach ($request->input('guideline_ids', []) as $guidelineId) {
            EventGuidelineAcceptance::create([
                'event_id' => $event->id,
                'guideline_id' => $guidelineId,
                'accepted_at' => now(),
            ]);
        }
        if ($user) {
            $uploadIds = $request->input('upload_ids', []);
            $this->syncEventUploads($event, is_array($uploadIds) ? array_slice($uploadIds, 0, 1) : [], $user->id);
        }
        $cityBaseUrl = self::cityBaseUrl($request, $citySlug);
        return redirect()->to($cityBaseUrl . '/events/' . $event->id)
            ->with('status', 'Event submitted for review. It will be published automatically if not reviewed by a moderator.')
            ->setStatusCode(303);
    }

    public function edit(Request $request, string $citySlug, Event $event): Response
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($event->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('update', $event);
        $event->load(['uploads', 'audience']);
        $guidelines = Guideline::query()->active()->forCity($city->id)->orderByRaw("scope = 'sitewide' DESC")->orderBy('published_at')->get();
        $user = $request->user();
        $managedPages = $user ? $user->managedCommunityPages()->where('community_pages.city_id', $city->id)->where('community_pages.state', 'approved')->get() : collect();
        $audiences = EventAudience::forCity($city->id)->get()->mapWithKeys(fn ($a) => [$a->id => $a->name])->all();
        $eventTags = EventTag::forCity($city->id)->get()->mapWithKeys(fn ($t) => [$t->slug => $t->label])->all();
        $defaultAudienceId = EventAudience::whereNull('city_id')->where('name', 'All Welcome')->value('id');
        $errors = $request->session()->get('errors');
        $errorBag = $errors && $errors->hasBag('default') ? $errors->getBag('default')->toArray() : [];

        return Inertia::render('Events/Edit', [
            'city' => $city,
            'event' => $event,
            'guidelines' => $guidelines,
            'managedCommunityPages' => $managedPages,
            'audiences' => $audiences,
            'defaultAudienceId' => $defaultAudienceId,
            'eventTags' => $eventTags,
            'errors' => $errorBag,
            'homeUrl' => config('app.url'),
            'cityBaseUrl' => self::cityBaseUrl(request(), $citySlug),
        ]);
    }

    public function update(Request $request, string $citySlug, Event $event): \Illuminate\Http\RedirectResponse
    {
        $city = City::query()->where('slug', $citySlug)->firstOrFail();
        if ($event->city_id !== $city->id) {
            abort(404);
        }
        Gate::authorize('update', $event);
        $allowedTagSlugs = EventTag::forCity($city->id)->pluck('slug')->all();
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'organizer_name' => ['required', 'string', 'max:255'],
            'organizer_email_hidden' => ['boolean'],
            'location_name' => ['required', 'string', 'max:255'],
            'location_address' => ['required', 'string', 'max:500'],
            'location_details' => ['nullable', 'string'],
            'route_description' => ['nullable', 'string'],
            'route_link' => ['nullable', 'string', 'url', 'max:500'],
            'route_length' => ['nullable', 'string', 'max:100'],
            'is_loop' => ['boolean'],
            'external_link' => ['nullable', 'string', 'url', 'max:500'],
            'audience_id' => ['nullable', 'exists:event_audiences,id'],
            'community_page_id' => ['nullable', 'exists:community_pages,id'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'duration_hours' => ['nullable', 'numeric', 'min:0', 'max:168'],
            'timezone' => ['nullable', 'string', 'max:50'],
            'time_details' => ['nullable', 'string', 'max:500'],
            'is_recurring' => ['boolean'],
            'recurrence_ends_at' => ['nullable', 'date'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'in:' . implode(',', $allowedTagSlugs)],
            'upload_ids' => ['nullable', 'array', 'max:1'],
            'upload_ids.*' => ['uuid', 'exists:uploads,id'],
        ]);
        $data = $request->only([
            'name', 'description', 'organizer_name', 'organizer_email_hidden',
            'location_name', 'location_address', 'location_details',
            'route_description', 'route_link', 'route_length', 'is_loop', 'external_link',
            'audience_id', 'starts_at', 'ends_at', 'timezone', 'time_details',
            'is_recurring', 'recurrence_ends_at', 'tags',
        ]);
        if (empty($data['ends_at']) && $request->filled('duration_hours') && $request->input('duration_hours') > 0) {
            $start = \Carbon\Carbon::parse($data['starts_at']);
            $data['ends_at'] = $start->addHours((float) $request->input('duration_hours'))->toDateTimeString();
        }
        if (empty($data['ends_at'])) {
            $data['ends_at'] = null;
        }
        $data['community_page_id'] = $request->input('community_page_id') ?: null;
        $event->update($data);
        $uploadIds = $request->input('upload_ids', []);
        $this->syncEventUploads($event, is_array($uploadIds) ? array_slice($uploadIds, 0, 1) : [], $request->user()->id);
        return redirect()->route('city.events.show', [$citySlug, $event])->with('status', 'Event updated.');
    }

    private function syncEventUploads(Event $event, array $uploadIds, int $userId): void
    {
        $ids = collect($uploadIds)->filter()->unique()->values()->take(1)->all();
        $allowed = Upload::query()
            ->where('status', Upload::STATUS_READY)
            ->where('created_by', $userId)
            ->whereIn('id', $ids)
            ->pluck('id')
            ->all();
        $pivot = [];
        foreach (array_values($allowed) as $i => $id) {
            $pivot[$id] = ['position' => $i];
        }
        $event->uploads()->sync($pivot);
        Upload::query()
            ->whereIn('id', $allowed)
            ->update(['resource_type' => 'events', 'resource_id' => (string) $event->id]);
    }
}
