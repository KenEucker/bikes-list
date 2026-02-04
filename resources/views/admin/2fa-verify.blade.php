<!DOCTYPE html>
<html>
<head>
    <title>2FA Verification - Bikeslist</title>
</head>
<body>
    <h1>Two-Factor Authentication</h1>
    <form method="POST" action="{{ route('admin.2fa.verify.post') }}">
        @csrf
        <div>
            <label>Verification Code:</label>
            <input type="text" name="code" required maxlength="6">
        </div>
        <button type="submit">Verify</button>
    </form>
</body>
</html>
