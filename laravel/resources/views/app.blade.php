<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <script>
            (function() {
                var cookie = document.cookie.match(/\bbikeslist_theme=(\w+)/);
                var stored = typeof localStorage !== 'undefined' && localStorage.getItem('bikeslist_theme');
                var theme = (cookie && cookie[1]) || stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                theme = theme === 'dark' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', theme);
                if (typeof document.cookie !== 'undefined') document.cookie = 'bikeslist_theme=' + theme + ';path=/;max-age=31536000;samesite=lax';
                if (typeof localStorage !== 'undefined') try { localStorage.setItem('bikeslist_theme', theme); } catch (e) {}
            })();
        </script>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" type="image/png" href="{{ asset('bikeslist.png') }}">
        <link rel="shortcut icon" type="image/png" href="{{ asset('bikeslist.png') }}">

        <title inertia>{{ config('app.name', 'BikesList') }}</title>

        <meta name="description" content="BikesList – local bike listings, events, and community by city.">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ config('app.name', 'BikesList') }}">
        <meta property="og:image" content="{{ asset('bikeslist.png') }}">

        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="js-enabled govuk-frontend-supported font-sans antialiased bg-page text-fg">
        @inertia
    </body>
</html>
