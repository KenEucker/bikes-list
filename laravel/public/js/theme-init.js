(function() {
    function getTheme() {
        var cookie = document.cookie.match(/\bbikeslist_theme=(\w+)/);
        var stored = typeof localStorage !== 'undefined' && localStorage.getItem('bikeslist_theme');
        return (cookie && cookie[1]) || stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    function setTheme(value) {
        var next = value === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        if (typeof document.cookie !== 'undefined') document.cookie = 'bikeslist_theme=' + next + ';path=/;max-age=31536000;samesite=lax';
        if (typeof localStorage !== 'undefined') try { localStorage.setItem('bikeslist_theme', next); } catch (e) {}
        updateAllIcons();
    }
    function updateAllIcons() {
        var theme = document.documentElement.getAttribute('data-theme') || 'light';
        var sunSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm7.071 2.929a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zm-14.142 0a1 1 0 0 1 1.414 0l.707.707A1 1 0 0 1 5.636 7.05l-.707-.707a1 1 0 0 1 0-1.414zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-6 4a6 6 0 1 1 12 0 6 6 0 0 1-12 0zm-4 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm17 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1zM5.636 16.95a1 1 0 0 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707zm11.314 1.414a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707zM12 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1z" fill="#0D0D0D"/></svg>';
        var moonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>';
        document.querySelectorAll('.admin-theme-toggle').forEach(function(btn) {
            var labelDark = btn.getAttribute('data-label-dark') || 'Switch to light mode';
            var labelLight = btn.getAttribute('data-label-light') || 'Switch to dark mode';
            btn.setAttribute('aria-label', theme === 'dark' ? labelDark : labelLight);
            btn.setAttribute('title', theme === 'dark' ? labelDark : labelLight);
        });
        document.querySelectorAll('.admin-theme-icon').forEach(function(span) {
            span.innerHTML = theme === 'light' ? sunSvg : moonSvg;
        });
    }
    var theme = getTheme();
    theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (typeof document.cookie !== 'undefined') document.cookie = 'bikeslist_theme=' + theme + ';path=/;max-age=31536000;samesite=lax';
    if (typeof localStorage !== 'undefined') try { localStorage.setItem('bikeslist_theme', theme); } catch (e) {}
    document.addEventListener('DOMContentLoaded', function() {
        updateAllIcons();
        document.addEventListener('click', function(e) {
            if (e.target.closest('.admin-theme-toggle')) {
                var t = document.documentElement.getAttribute('data-theme') || 'light';
                setTheme(t === 'dark' ? 'light' : 'dark');
            }
        });
    });
})();
