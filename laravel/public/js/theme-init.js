(function() {
    var cookie = document.cookie.match(/\bbikeslist_theme=(\w+)/);
    var stored = typeof localStorage !== 'undefined' && localStorage.getItem('bikeslist_theme');
    var theme = (cookie && cookie[1]) || stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
})();
