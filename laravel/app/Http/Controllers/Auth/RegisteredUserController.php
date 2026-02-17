<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Orchid\Platform\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $base = request()->getSchemeAndHttpHost();
        return Inertia::render('Auth/Register', [
            'submitUrl' => $base . (request()->is('account/*') ? '/account/sign-up' : '/register'),
            'signInUrl' => $base . (request()->is('account/*') ? '/account/sign-in' : '/login'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $userRole = Role::query()->where('slug', 'user')->first();
        if ($userRole) {
            $user->roles()->syncWithoutDetaching([$userRole->id]);
        }

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();
        $base = $request->getSchemeAndHttpHost();
        $host = $request->getHost();
        if (str_contains($host, '.') && $host !== 'localhost') {
            return redirect()->to($base . '/dashboard');
        }
        return redirect()->to($base . '/');
    }
}
