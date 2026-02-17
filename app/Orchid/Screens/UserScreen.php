<?php

namespace App\Orchid\Screens;

use App\Domain\Auth\User;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Alert;

class UserScreen extends Screen
{
    /**
     * Query data.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'users' => User::orderBy('created_at', 'desc')->paginate(),
        ];
    }

    /**
     * Display header name.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Users';
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): array
    {
        return [];
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): array
    {
        return [
            Layout::table('users', [
                \Orchid\Screen\TD::make('id', 'ID'),
                \Orchid\Screen\TD::make('email', 'Email'),
                \Orchid\Screen\TD::make('display_name', 'Display Name'),
                \Orchid\Screen\TD::make('status', 'Status'),
                \Orchid\Screen\TD::make('actions', 'Actions')
                    ->render(fn ($user) => Button::make($user->status === 'active' ? 'Suspend' : 'Activate')
                        ->method('toggleStatus', ['user' => $user->id])),
            ]),
        ];
    }

    public function toggleStatus($user)
    {
        $user = User::findOrFail($user);
        $user->status = $user->status === 'active' ? 'suspended' : 'active';
        $user->save();

        Alert::success('User status updated.');

        return redirect()->route('platform.users');
    }
}
