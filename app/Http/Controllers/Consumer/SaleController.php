<?php

namespace App\Http\Controllers\Consumer;

use App\Domain\Sales\Sale;
use App\Domain\Regions\CurrentRegion;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function show(Sale $sale, CurrentRegion $currentRegion)
    {
        $region = $currentRegion->require();
        $sale->load(['images', 'user']);
        if ($sale->region_id !== $region->id) {
            abort(404);
        }

        return inertia('SaleDetail', [
            'sale' => $sale,
        ]);
    }

    public function create(CurrentRegion $currentRegion)
    {
        $region = $currentRegion->require();

        return inertia('CreateSale', [
            'region' => $region,
        ]);
    }

    public function store(Request $request, CurrentRegion $currentRegion)
    {
        $region = $currentRegion->require();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price_cents' => 'required|integer|min:0',
            'currency' => 'required|string|size:3',
            'category' => 'nullable|string',
            'condition' => 'nullable|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'frame_size' => 'nullable|string',
        ]);

        $sale = Sale::create([
            'region_id' => $region->id,
            'user_id' => auth()->id(),
            'status' => 'draft',
            ...$validated,
        ]);

        return redirect()->route('for-sale.show', $sale->id);
    }

    public function mySales(CurrentRegion $currentRegion)
    {
        $region = $currentRegion->require();

        $sales = Sale::where('user_id', auth()->id())
            ->forRegion($region->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return inertia('MySales', [
            'region' => $region,
            'sales' => $sales,
        ]);
    }
}
