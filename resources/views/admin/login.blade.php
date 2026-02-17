<!DOCTYPE html>
<html>
<head>
    <title>Admin Login - Bikeslist</title>
</head>
<body>
    <h1>Admin Login</h1>
    <form method="POST" action="{{ route('admin.magic-link.request') }}">
        @csrf
        <div>
            <label>Email:</label>
            <input type="email" name="email" required>
        </div>
        <button type="submit">Send Magic Link</button>
    </form>
</body>
</html>
