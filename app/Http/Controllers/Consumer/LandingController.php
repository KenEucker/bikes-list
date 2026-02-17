<?php

namespace App\Http\Controllers\Consumer;

use App\Domain\Regions\Region;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LandingController extends Controller
{
    public function index()
    {
        $regions = Region::isActive()->orderBy('name')->get();
        
        return inertia('Landing', [
            'regions' => $regions,
        ]);
    }

    public function regions()
    {
        $regions = Region::isActive()->orderBy('name')->get();
        
        return response()->json($regions);
    }
}
