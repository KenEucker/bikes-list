<?php

namespace App\Http\Controllers\Consumer;

use App\Domain\Sales\Sale;
use App\Domain\Regions\CurrentRegion;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RegionHomeController extends Controller
{
    public function index(Request $request, CurrentRegion $currentRegion)
    {
        $region = $currentRegion->require();

        $sales = Sale::forRegion($region->id)
            ->published()
            ->with(['images' => function ($query) {
                $query->where('variant', 'thumb');
            }])
            ->orderBy('published_at', 'desc')
            ->paginate(20);

        return inertia('RegionHome', [
            'region' => $region,
            'sales' => $sales,
        ]);
    }
}
