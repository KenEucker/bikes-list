<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CityController extends Controller
{
    public function index(): Response
    {
        $cities = City::query()->orderBy('name')->get();

        return Inertia::render('Home', [
            'cities' => $cities,
        ]);
    }

    public function show(Request $request, string $city): Response
    {
        $cityModel = City::query()->where('slug', $city)->firstOrFail();
        $upcomingEvents = Event::query()
            ->where('city_id', $cityModel->id)
            ->where('state', Event::STATE_PUBLISHED)
            ->where('ends_at', '>=', now())
            ->orderBy('starts_at')
            ->limit(5)
            ->get();
        $cityBaseUrl = $request->getScheme() . '://' . $city . '.' . $request->getHost() . ($request->getPort() && !in_array($request->getPort(), [80, 443]) ? ':' . $request->getPort() : '');

        return Inertia::render('City/Show', [
            'city' => $cityModel,
            'homeUrl' => config('app.url'),
            'upcomingEvents' => $upcomingEvents,
            'cityBaseUrl' => $cityBaseUrl,
        ]);
    }
}
