<?php

namespace App\Http\Controllers;

use App\Models\City;
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

        return Inertia::render('City/Show', [
            'city' => $cityModel,
            'homeUrl' => config('app.url'),
        ]);
    }
}
