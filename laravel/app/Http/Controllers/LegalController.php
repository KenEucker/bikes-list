<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function terms(): Response
    {
        return Inertia::render('Legal/StaticPage', [
            'title' => 'Terms of Service',
            'content' => 'Placeholder. Replace with your terms of service content.',
        ]);
    }

    public function privacy(): Response
    {
        return Inertia::render('Legal/StaticPage', [
            'title' => 'Privacy Policy',
            'content' => 'Placeholder. Replace with your privacy policy content.',
        ]);
    }
}
